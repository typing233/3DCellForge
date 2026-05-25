import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import useCellStore from '../store/useCellStore'

const MEMBRANE_RADIUS = 3

const TEMPLATES = [
  { geometry: 'sphere', color: '#ff6b9d', scale: 0.7, args: [0.8, 32, 32], name: 'nucleus' },
  { geometry: 'capsule', color: '#ffa726', scale: 0.4, args: [0.5, 0.5, 8, 16], name: 'mitochondria' },
  { geometry: 'capsule', color: '#ff8f00', scale: 0.35, args: [0.5, 0.5, 8, 16], name: 'mitochondria' },
  { geometry: 'dodecahedron', color: '#66bb6a', scale: 0.3, args: [1, 0], name: 'ribosome' },
  { geometry: 'torus', color: '#ab47bc', scale: 0.3, args: [1, 0.4, 16, 32], name: 'vesicle' },
]

function randomPointInSphere(maxRadius) {
  const u = Math.random()
  const r = maxRadius * Math.cbrt(u)
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi),
  ]
}

function generateOrganelles() {
  const count = 3 + Math.floor(Math.random() * 3) // 3 to 5
  const selected = TEMPLATES.slice(0, count)
  return selected.map((template, i) => {
    const safeRadius = MEMBRANE_RADIUS - template.scale * 1.5
    const position = i === 0 ? [0, 0, 0] : randomPointInSphere(safeRadius)
    return {
      id: `${template.name}-${i}`,
      geometry: template.geometry,
      position,
      scale: [template.scale, template.scale, template.scale],
      color: template.color,
      args: template.args,
    }
  })
}

function Organelle({ data }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const selectedId = useCellStore((s) => s.selectedOrganelleId)
  const selectOrganelle = useCellStore((s) => s.selectOrganelle)
  const isSelected = selectedId === data.id

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.3
      meshRef.current.rotation.z += delta * 0.2
    }
  })

  const handleClick = (e) => {
    e.stopPropagation()
    console.log(`[CellForge] Selected organelle: ${data.id}`)
    selectOrganelle(data.id)
  }

  const emissiveIntensity = isSelected ? 0.5 : hovered ? 0.3 : 0

  const renderGeometry = () => {
    switch (data.geometry) {
      case 'sphere':
        return <sphereGeometry args={data.args} />
      case 'capsule':
        return <capsuleGeometry args={data.args} />
      case 'dodecahedron':
        return <dodecahedronGeometry args={data.args} />
      case 'torus':
        return <torusGeometry args={data.args} />
      default:
        return <sphereGeometry args={[0.5, 16, 16]} />
    }
  }

  return (
    <Select enabled={isSelected}>
      <mesh
        ref={meshRef}
        position={data.position}
        scale={data.scale}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        {renderGeometry()}
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={emissiveIntensity}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
    </Select>
  )
}

export default function Organelles() {
  const organelles = useMemo(() => generateOrganelles(), [])

  return (
    <group>
      {organelles.map((organelle) => (
        <Organelle key={organelle.id} data={organelle} />
      ))}
    </group>
  )
}
