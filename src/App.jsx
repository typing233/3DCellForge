import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Selection, EffectComposer, Outline } from '@react-three/postprocessing'
import CellMembrane from './components/CellMembrane'
import Organelles from './components/Organelles'
import InfoPanel from './components/InfoPanel'
import useCellStore from './store/useCellStore'

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-3, 2, -4]} intensity={0.3} color="#aaccff" />
      <pointLight position={[-5, -3, -5]} intensity={0.5} color="#88ccff" />
      <pointLight position={[3, -2, 4]} intensity={0.3} color="#ff88cc" />

      <CellMembrane />

      <Selection>
        <Organelles />
        <EffectComposer multisampling={8} autoClear={false}>
          <Outline
            visibleEdgeColor={0x00ffff}
            hiddenEdgeColor={0x004444}
            blur
            edgeStrength={8}
            pulseSpeed={0.5}
            xRay={false}
          />
        </EffectComposer>
      </Selection>

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={4}
        maxDistance={15}
        makeDefault
      />
      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  )
}

export default function App() {
  const clearSelection = useCellStore((s) => s.clearSelection)

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1a', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        onPointerMissed={clearSelection}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
      <InfoPanel />
    </div>
  )
}
