import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CameraAnimation() {
  const { camera } = useThree()
  const progress = useRef(0)
  const done = useRef(false)
  const startPos = useRef(new THREE.Vector3(0, 0, 20))

  useFrame((_, delta) => {
    if (done.current) return
    progress.current = Math.min(1, progress.current + delta * 0.6)
    const t = 1 - Math.pow(1 - progress.current, 4)
    camera.position.lerpVectors(startPos.current, new THREE.Vector3(0, 0, 8), t)
    camera.lookAt(0, 0, 0)
    if (progress.current >= 1) done.current = true
  })

  return null
}
