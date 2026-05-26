import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CellMembrane() {
  const outerRef = useRef()
  const innerRef = useRef()
  const fogRef = useRef()

  useFrame((_, delta) => {
    if (outerRef.current) outerRef.current.rotation.y += delta * 0.03
    if (innerRef.current) innerRef.current.rotation.y -= delta * 0.02
    if (fogRef.current) fogRef.current.rotation.x += delta * 0.015
  })

  const fresnelShader = useMemo(() => ({
    uniforms: {
      color: { value: new THREE.Color('#88ccff') },
      fresnelPower: { value: 3.0 },
      opacity: { value: 0.25 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float fresnelPower;
      uniform float opacity;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), fresnelPower);
        gl_FragColor = vec4(color, fresnel * opacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  }), [])

  return (
    <group>
      {/* Outer membrane with fresnel effect */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <shaderMaterial args={[fresnelShader]} />
      </mesh>

      {/* Inner membrane layer */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[2.9, 48, 48]} />
        <meshPhysicalMaterial
          color="#88ccff"
          transparent
          opacity={0.05}
          roughness={0.1}
          metalness={0.0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Internal fog/volumetric sphere */}
      <mesh ref={fogRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <meshBasicMaterial
          color="#1a2a4a"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}
