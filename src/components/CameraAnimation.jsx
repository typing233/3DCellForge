import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useCellStore from '../store/useCellStore'

export default function CameraAnimation() {
  const { camera } = useThree()
  const progress = useRef(0)
  const done = useRef(false)
  const startPos = useRef(new THREE.Vector3(0, 0, 20))
  const endPos = new THREE.Vector3(0, 0, 8)

  useFrame((_, delta) => {
    if (done.current) return

    const focusTarget = useCellStore.getState().focusTarget
    if (focusTarget) {
      done.current = true
      return
    }

    progress.current = Math.min(1, progress.current + delta * 0.6)
    const t = 1 - Math.pow(1 - progress.current, 4)
    camera.position.lerpVectors(startPos.current, endPos, t)
    camera.lookAt(0, 0, 0)
    if (progress.current >= 1) done.current = true
  })

  return null
}
