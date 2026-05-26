import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useCellStore from '../store/useCellStore'

const _targetVec = new THREE.Vector3()
const _camOffset = new THREE.Vector3()

export default function CameraFocus({ controlsRef }) {
  const { camera } = useThree()
  const focusTarget = useCellStore((s) => s.focusTarget)
  const clearFocusTarget = useCellStore((s) => s.clearFocusTarget)
  const animating = useRef(false)
  const progress = useRef(0)
  const startTarget = useRef(new THREE.Vector3())
  const startCamPos = useRef(new THREE.Vector3())
  const endTarget = useRef(new THREE.Vector3())
  const endCamPos = useRef(new THREE.Vector3())
  const prevFocus = useRef(null)

  useFrame((_, delta) => {
    if (!focusTarget) {
      animating.current = false
      prevFocus.current = null
      return
    }

    if (prevFocus.current !== focusTarget) {
      prevFocus.current = focusTarget
      animating.current = true
      progress.current = 0

      const target = new THREE.Vector3(...focusTarget)
      endTarget.current.copy(target)

      const dir = new THREE.Vector3()
        .subVectors(camera.position, controlsRef.current?.target || new THREE.Vector3())
        .normalize()
      endCamPos.current.copy(target).addScaledVector(dir, 4.5)

      startTarget.current.copy(controlsRef.current?.target || new THREE.Vector3())
      startCamPos.current.copy(camera.position)
    }

    if (!animating.current) return

    progress.current = Math.min(1, progress.current + delta * 2.2)
    const t = 1 - Math.pow(1 - progress.current, 3)

    _targetVec.lerpVectors(startTarget.current, endTarget.current, t)
    _camOffset.lerpVectors(startCamPos.current, endCamPos.current, t)

    if (controlsRef.current) {
      controlsRef.current.target.copy(_targetVec)
      camera.position.copy(_camOffset)
      controlsRef.current.update()
    }

    if (progress.current >= 1) {
      animating.current = false
      clearFocusTarget()
    }
  })

  return null
}
