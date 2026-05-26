import { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'
import CellMembrane from './components/CellMembrane'
import Organelles from './components/Organelles'
import InfoPanel from './components/InfoPanel'
import UIControls from './components/UIControls'
import CameraAnimation from './components/CameraAnimation'
import CameraFocus from './components/CameraFocus'
import LoadingProgress from './components/LoadingProgress'
import useCellStore from './store/useCellStore'

const isMobile = /Android|iPhone|iPad|iPod|webOS/i.test(
  typeof navigator !== 'undefined' ? navigator.userAgent : ''
)

function SceneReadySignal() {
  const fired = useRef(false)

  useFrame(() => {
    if (fired.current) return
    fired.current = true
    useCellStore.getState().setSceneReady()
  })

  return null
}

function Scene({ controlsRef }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#aaccff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#88ccff" />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#ff88cc" />
      <fog attach="fog" args={['#0a0a1a', 12, 20]} />

      <CellMembrane />

      <Selection>
        <Organelles />
        <EffectComposer multisampling={4} autoClear={false}>
          <Outline
            visibleEdgeColor={0x00ffff}
            hiddenEdgeColor={0x004444}
            blur
            edgeStrength={6}
            pulseSpeed={0.5}
            xRay={false}
          />
        </EffectComposer>
      </Selection>

      <CameraAnimation />
      <CameraFocus controlsRef={controlsRef} />
      <SceneReadySignal />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={isMobile ? 0.08 : 0.05}
        minDistance={4}
        maxDistance={15}
        makeDefault
        rotateSpeed={isMobile ? 0.5 : 0.8}
        panSpeed={isMobile ? 0.5 : 0.8}
        zoomSpeed={isMobile ? 0.6 : 1}
        enablePan={!isMobile}
        touchAction="none"
      />
      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  )
}

export default function App() {
  const clearSelection = useCellStore((s) => s.clearSelection)
  const controlsRef = useRef()
  const [dismissed, setDismissed] = useState(false)

  const handleResetCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }, [])

  const handleLoadDismiss = useCallback(() => {
    setDismissed(true)
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1a', position: 'relative', touchAction: 'none' }}>
      {!dismissed && <LoadingProgress onDismiss={handleLoadDismiss} />}
      <Canvas
        camera={{ position: [0, 0, 20], fov: 50 }}
        onPointerMissed={clearSelection}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, isMobile ? 1.5 : 2]}
        style={{ touchAction: 'none' }}
      >
        <Scene controlsRef={controlsRef} />
      </Canvas>
      {dismissed && <UIControls onResetCamera={handleResetCamera} />}
      {dismissed && <InfoPanel />}
    </div>
  )
}
