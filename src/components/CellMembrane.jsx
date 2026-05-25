import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function CellMembrane() {
  const meshRef = useRef()

  useFrame((_, delta) => {
    meshRef.current.rotation.y += delta * 0.05
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshPhysicalMaterial
        color="#88ccff"
        transparent
        opacity={0.15}
        roughness={0.2}
        metalness={0.1}
        side={2}
        depthWrite={false}
      />
    </mesh>
  )
}
