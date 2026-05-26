import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Select } from '@react-three/postprocessing'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useCellStore, { ORGANELLE_DATA } from '../store/useCellStore'
import { getOrganelleType } from '../utils/organelleUtils'

function OrganelleLabel({ name, visible, color }) {
  if (!visible) return null
  return (
    <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div style={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        border: `1px solid ${color || 'rgba(255,255,255,0.3)'}`,
        borderRadius: '4px',
        padding: '2px 8px',
        color: '#fff',
        fontSize: '11px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        {name}
      </div>
    </Html>
  )
}

function useEntrance(delay = 0) {
  const ref = useRef()
  const progress = useRef(0)
  const started = useRef(false)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (elapsed.current < delay) return
    if (!started.current) started.current = true
    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 2.5)
      const t = 1 - Math.pow(1 - progress.current, 3)
      if (ref.current) {
        ref.current.scale.setScalar(t)
        ref.current.material && (ref.current.material.opacity = t)
      }
    }
  })

  return ref
}

function useEntranceGroup(delay = 0) {
  const ref = useRef()
  const progress = useRef(0)
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta
    if (elapsed.current < delay) return
    if (progress.current < 1) {
      progress.current = Math.min(1, progress.current + delta * 2.5)
      const t = 1 - Math.pow(1 - progress.current, 3)
      if (ref.current) {
        ref.current.scale.setScalar(t)
      }
    }
  })

  return ref
}

function Nucleus({ onClick, isSelected, isHovered, onHover, onUnhover, showLabel }) {
  const groupRef = useRef()
  const entranceRef = useEntranceGroup(0.2)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  const emissive = isSelected ? 0.5 : isHovered ? 0.3 : 0

  return (
    <Select enabled={isSelected}>
      <group ref={entranceRef} scale={0}>
        <group
          ref={groupRef}
          position={[0, 0, 0]}
          onClick={onClick}
          onPointerOver={onHover}
          onPointerOut={onUnhover}
        >
          <OrganelleLabel name="细胞核" visible={showLabel} color="#c62860" />
          <mesh>
            <sphereGeometry args={[0.9, 48, 48]} />
            <meshPhysicalMaterial
              color="#c62860"
              emissive="#ff6b9d"
              emissiveIntensity={emissive}
              roughness={0.3}
              metalness={0.1}
              transparent
              opacity={0.85}
              clearcoat={0.4}
            />
          </mesh>
          <mesh position={[0.2, 0.1, 0.2]}>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial
              color="#8b1a4a"
              emissive="#ff6b9d"
              emissiveIntensity={emissive * 0.8}
              roughness={0.5}
            />
          </mesh>
          <mesh position={[-0.3, -0.2, 0.1]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#a0204e" roughness={0.6} />
          </mesh>
          <mesh position={[0.1, -0.3, -0.2]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#a0204e" roughness={0.6} />
          </mesh>
        </group>
      </group>
    </Select>
  )
}

function Mitochondrion({ position, rotation, scale, onClick, isSelected, isHovered, onHover, onUnhover, showLabel, entranceDelay }) {
  const groupRef = useRef()
  const entranceRef = useEntranceGroup(entranceDelay)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.15
      groupRef.current.rotation.z += delta * 0.1
    }
  })

  const emissive = isSelected ? 0.5 : isHovered ? 0.3 : 0
  const s = scale || 1

  return (
    <Select enabled={isSelected}>
      <group ref={entranceRef} scale={0}>
        <group
          ref={groupRef}
          position={position}
          rotation={rotation || [0, 0, 0]}
          scale={[s, s, s]}
          onClick={onClick}
          onPointerOver={onHover}
          onPointerOut={onUnhover}
        >
          <OrganelleLabel name="线粒体" visible={showLabel} color="#e67e22" />
          <mesh>
            <capsuleGeometry args={[0.25, 0.6, 12, 24]} />
            <meshPhysicalMaterial
              color="#e67e22"
              emissive="#ffa726"
              emissiveIntensity={emissive}
              roughness={0.35}
              metalness={0.1}
              clearcoat={0.3}
            />
          </mesh>
          {[-0.2, 0, 0.2].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.18, 0.03, 8, 16]} />
              <meshStandardMaterial
                color="#d35400"
                emissive="#ffa726"
                emissiveIntensity={emissive * 0.6}
                roughness={0.5}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Select>
  )
}

function EndoplasmicReticulum({ onClick, isSelected, isHovered, onHover, onUnhover, showLabel }) {
  const groupRef = useRef()
  const entranceRef = useEntranceGroup(0.5)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  const emissive = isSelected ? 0.5 : isHovered ? 0.3 : 0

  const tubes = [
    { pos: [0.5, 0.1, 0.3], rot: [0.8, 0, 0.2], scaleX: 1.1 },
    { pos: [-0.2, -0.3, 0.5], rot: [1.5, 1.05, 0.4], scaleX: 0.9 },
    { pos: [-0.5, 0.2, -0.1], rot: [2.4, 2.1, 0.1], scaleX: 1.0 },
    { pos: [0.3, -0.1, -0.4], rot: [0.3, 3.14, 0.3], scaleX: 0.85 },
    { pos: [-0.1, 0.35, 0.4], rot: [1.9, 4.19, 0.15], scaleX: 1.15 },
    { pos: [0.4, -0.25, 0.2], rot: [2.8, 5.24, 0.45], scaleX: 0.95 },
  ]

  return (
    <Select enabled={isSelected}>
      <group ref={entranceRef} scale={0}>
        <group
          ref={groupRef}
          position={[1.4, 0.3, 0.5]}
          onClick={onClick}
          onPointerOver={onHover}
          onPointerOut={onUnhover}
        >
          <OrganelleLabel name="内质网" visible={showLabel} color="#5c6bc0" />
          {tubes.map((t, i) => (
            <mesh key={i} position={t.pos} rotation={t.rot} scale={[t.scaleX, 1, 1]}>
              <torusGeometry args={[0.2, 0.05, 8, 16]} />
              <meshPhysicalMaterial
                color="#5c6bc0"
                emissive="#7986cb"
                emissiveIntensity={emissive}
                roughness={0.4}
                metalness={0.05}
                transparent
                opacity={0.9}
              />
            </mesh>
          ))}
          {tubes.slice(0, 3).map((t, i) => (
            <mesh key={`conn-${i}`} position={t.pos} rotation={[t.rot[0] + 0.5, t.rot[1], t.rot[2]]}>
              <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
              <meshStandardMaterial
                color="#3f51b5"
                emissive="#7986cb"
                emissiveIntensity={emissive * 0.5}
              />
            </mesh>
          ))}
        </group>
      </group>
    </Select>
  )
}

function GolgiApparatus({ onClick, isSelected, isHovered, onHover, onUnhover, showLabel }) {
  const groupRef = useRef()
  const entranceRef = useEntranceGroup(0.6)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.06
    }
  })

  const emissive = isSelected ? 0.5 : isHovered ? 0.3 : 0

  return (
    <Select enabled={isSelected}>
      <group ref={entranceRef} scale={0}>
        <group
          ref={groupRef}
          position={[-1.5, -0.5, 0.8]}
          rotation={[0.3, 0.5, 0]}
          onClick={onClick}
          onPointerOver={onHover}
          onPointerOut={onUnhover}
        >
          <OrganelleLabel name="高尔基体" visible={showLabel} color="#26a69a" />
          {[0.24, 0.12, 0, -0.12, -0.24].map((y, i) => (
            <mesh key={i} position={[0, y, i * 0.04]} scale={[1 - i * 0.08, 1, 1 - i * 0.05]}>
              <boxGeometry args={[0.7, 0.06, 0.35]} />
              <meshPhysicalMaterial
                color={i < 2 ? '#26a69a' : i < 4 ? '#00897b' : '#00695c'}
                emissive="#4db6ac"
                emissiveIntensity={emissive}
                roughness={0.3}
                metalness={0.1}
                clearcoat={0.2}
              />
            </mesh>
          ))}
          <mesh position={[0.45, 0.1, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#80cbc4" emissive="#4db6ac" emissiveIntensity={emissive * 0.6} />
          </mesh>
          <mesh position={[0.5, -0.1, 0.1]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#80cbc4" emissive="#4db6ac" emissiveIntensity={emissive * 0.6} />
          </mesh>
          <mesh position={[-0.4, -0.15, -0.05]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#80cbc4" emissive="#4db6ac" emissiveIntensity={emissive * 0.6} />
          </mesh>
        </group>
      </group>
    </Select>
  )
}

function Ribosome({ position, onClick, isSelected, isHovered, onHover, onUnhover, showLabel, entranceDelay }) {
  const groupRef = useRef()
  const entranceRef = useEntranceGroup(entranceDelay)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.4
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  const emissive = isSelected ? 0.6 : isHovered ? 0.35 : 0

  return (
    <Select enabled={isSelected}>
      <group ref={entranceRef} scale={0}>
        <group
          ref={groupRef}
          position={position}
          onClick={onClick}
          onPointerOver={onHover}
          onPointerOut={onUnhover}
        >
          <OrganelleLabel name="核糖体" visible={showLabel} color="#66bb6a" />
          <mesh position={[0, 0.04, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial
              color="#66bb6a"
              emissive="#a5d6a7"
              emissiveIntensity={emissive}
              roughness={0.5}
            />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial
              color="#388e3c"
              emissive="#81c784"
              emissiveIntensity={emissive}
              roughness={0.5}
            />
          </mesh>
        </group>
      </group>
    </Select>
  )
}

function Lysosome({ position, onClick, isSelected, isHovered, onHover, onUnhover, showLabel, entranceDelay }) {
  const meshRef = useRef()
  const entranceRef = useEntranceGroup(entranceDelay)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
      meshRef.current.rotation.x += delta * 0.15
    }
  })

  const emissive = isSelected ? 0.5 : isHovered ? 0.3 : 0

  return (
    <Select enabled={isSelected}>
      <group ref={entranceRef} scale={0}>
        <group
          position={position}
          onClick={onClick}
          onPointerOver={onHover}
          onPointerOut={onUnhover}
        >
          <OrganelleLabel name="溶酶体" visible={showLabel} color="#ab47bc" />
          <mesh ref={meshRef}>
            <sphereGeometry args={[0.22, 24, 24]} />
            <meshPhysicalMaterial
              color="#ab47bc"
              emissive="#ce93d8"
              emissiveIntensity={emissive}
              roughness={0.3}
              metalness={0.15}
              clearcoat={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0.05, 0.05, 0.08]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#7b1fa2" opacity={0.7} transparent />
          </mesh>
          <mesh position={[-0.06, -0.04, 0.06]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial color="#7b1fa2" opacity={0.7} transparent />
          </mesh>
        </group>
      </group>
    </Select>
  )
}

function Centrosome({ onClick, isSelected, isHovered, onHover, onUnhover, showLabel }) {
  const groupRef = useRef()
  const entranceRef = useEntranceGroup(0.8)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  const emissive = isSelected ? 0.5 : isHovered ? 0.3 : 0

  return (
    <Select enabled={isSelected}>
      <group ref={entranceRef} scale={0}>
        <group
          ref={groupRef}
          position={[0.3, 1.2, -0.3]}
          onClick={onClick}
          onPointerOver={onHover}
          onPointerOut={onUnhover}
        >
          <OrganelleLabel name="中心体" visible={showLabel} color="#78909c" />
          <mesh rotation={[0, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 9]} />
            <meshStandardMaterial
              color="#78909c"
              emissive="#b0bec5"
              emissiveIntensity={emissive}
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.3, 9]} />
            <meshStandardMaterial
              color="#607d8b"
              emissive="#90a4ae"
              emissiveIntensity={emissive}
              roughness={0.4}
              metalness={0.3}
            />
          </mesh>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i / 6) * Math.PI * 2
            return (
              <mesh
                key={i}
                position={[Math.cos(angle) * 0.2, 0, Math.sin(angle) * 0.2]}
                rotation={[0, 0, Math.PI / 2 + angle]}
              >
                <cylinderGeometry args={[0.01, 0.01, 0.25, 4]} />
                <meshStandardMaterial color="#b0bec5" transparent opacity={0.5} />
              </mesh>
            )
          })}
        </group>
      </group>
    </Select>
  )
}

export const ORGANELLE_CONFIGS = [
  { id: 'nucleus', type: 'nucleus' },
  { id: 'mitochondria-1', type: 'mitochondria', position: [1.8, 0.8, -0.5], rotation: [0.5, 0, 0.3], scale: 1 },
  { id: 'mitochondria-2', type: 'mitochondria', position: [-1.0, 1.2, 1.0], rotation: [0, 0.8, -0.4], scale: 0.85 },
  { id: 'mitochondria-3', type: 'mitochondria', position: [-0.5, -1.5, -1.2], rotation: [1.2, 0, 0.6], scale: 0.9 },
  { id: 'mitochondria-4', type: 'mitochondria', position: [1.2, -1.0, 1.0], rotation: [-0.3, 1.0, 0], scale: 0.75 },
  { id: 'er', type: 'er' },
  { id: 'golgi', type: 'golgi' },
  { id: 'ribosome-1', type: 'ribosome', position: [0.8, 0.5, 1.5] },
  { id: 'ribosome-2', type: 'ribosome', position: [-0.6, 1.0, -1.4] },
  { id: 'ribosome-3', type: 'ribosome', position: [1.5, -0.3, -1.0] },
  { id: 'ribosome-4', type: 'ribosome', position: [-1.8, -0.8, 0.3] },
  { id: 'ribosome-5', type: 'ribosome', position: [0.2, -1.8, 0.8] },
  { id: 'lysosome-1', type: 'lysosome', position: [-1.6, 0.6, -0.8] },
  { id: 'lysosome-2', type: 'lysosome', position: [0.8, -1.3, -0.6] },
  { id: 'centrosome', type: 'centrosome' },
]

export default function Organelles() {
  const selectedId = useCellStore((s) => s.selectedOrganelleId)
  const selectOrganelle = useCellStore((s) => s.selectOrganelle)
  const labelsVisible = useCellStore((s) => s.labelsVisible)
  const [hoveredId, setHoveredId] = useState(null)

  const makeHandlers = (id, showLabel) => ({
    onClick: (e) => {
      e.stopPropagation()
      selectOrganelle(id)
    },
    onHover: (e) => {
      e.stopPropagation()
      setHoveredId(id)
      document.body.style.cursor = 'pointer'
    },
    onUnhover: () => {
      setHoveredId(null)
      document.body.style.cursor = 'auto'
    },
    isSelected: selectedId === id,
    isHovered: hoveredId === id,
    showLabel,
  })

  return (
    <group>
      {ORGANELLE_CONFIGS.map((config, index) => {
        const handlers = makeHandlers(config.id, labelsVisible)
        const entranceDelay = 0.3 + index * 0.08

        switch (config.type) {
          case 'nucleus':
            return <Nucleus key={config.id} {...handlers} />
          case 'mitochondria':
            return (
              <Mitochondrion
                key={config.id}
                position={config.position}
                rotation={config.rotation}
                scale={config.scale}
                entranceDelay={entranceDelay}
                {...handlers}
              />
            )
          case 'er':
            return <EndoplasmicReticulum key={config.id} {...handlers} />
          case 'golgi':
            return <GolgiApparatus key={config.id} {...handlers} />
          case 'ribosome':
            return <Ribosome key={config.id} position={config.position} entranceDelay={entranceDelay} {...handlers} />
          case 'lysosome':
            return <Lysosome key={config.id} position={config.position} entranceDelay={entranceDelay} {...handlers} />
          case 'centrosome':
            return <Centrosome key={config.id} {...handlers} />
          default:
            return null
        }
      })}
    </group>
  )
}
