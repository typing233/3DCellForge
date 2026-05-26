import { useRef, useState, useEffect, useCallback, memo } from 'react'

const LoadingProgress = memo(function LoadingProgress({ sceneReady, onDismiss }) {
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)
  const rafRef = useRef()
  const startRef = useRef(null)
  const phaseRef = useRef('simulating')

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp
      const elapsed = timestamp - startRef.current

      if (phaseRef.current === 'simulating') {
        const target = sceneReady ? 100 : Math.min(85, (elapsed / 2000) * 85)
        setProgress((prev) => {
          const next = prev + (target - prev) * 0.08
          return Math.min(100, next)
        })

        if (sceneReady) {
          phaseRef.current = 'completing'
          startRef.current = timestamp
        }
      } else if (phaseRef.current === 'completing') {
        setProgress((prev) => {
          const next = prev + (100 - prev) * 0.15
          if (next >= 99.5) {
            phaseRef.current = 'done'
            return 100
          }
          return next
        })
      } else {
        setFading(true)
        setTimeout(() => { if (onDismiss) onDismiss() }, 400)
        return
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [sceneReady, onDismiss])

  return (
    <div style={{ ...styles.overlay, opacity: fading ? 0 : 1 }}>
      <div style={styles.content}>
        <div style={styles.icon}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" opacity="0.3" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
        <div style={styles.title}>3D CellForge</div>
        <div style={styles.subtitle}>
          {progress < 100 ? '初始化场景...' : '准备就绪'}
        </div>
        <div style={styles.barContainer}>
          <div style={{ ...styles.bar, width: `${progress}%` }} />
        </div>
        <div style={styles.percent}>{Math.round(progress)}%</div>
      </div>
    </div>
  )
})

export default LoadingProgress

const styles = {
  overlay: {
    position: 'absolute',
    inset: 0,
    background: '#0a0a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    transition: 'opacity 0.4s ease-out',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  icon: {
    color: '#00dcff',
    marginBottom: '8px',
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
    letterSpacing: '1px',
  },
  subtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
  },
  barContainer: {
    width: '200px',
    height: '3px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  bar: {
    height: '100%',
    background: 'linear-gradient(90deg, #00dcff, #0088ff)',
    borderRadius: '2px',
    transition: 'width 0.05s linear',
  },
  percent: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
}
