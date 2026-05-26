import { useRef, useEffect } from 'react'
import useCellStore from '../store/useCellStore'

export default function LoadingProgress({ onDismiss }) {
  const overlayRef = useRef(null)
  const barRef = useRef(null)
  const percentRef = useRef(null)
  const subtitleRef = useRef(null)

  useEffect(() => {
    let raf
    let progress = 0
    let dismissed = false

    const animate = () => {
      if (dismissed) return

      const sceneReady = useCellStore.getState().sceneReady

      if (!sceneReady) {
        progress += (70 - progress) * 0.02
      } else {
        progress += (100 - progress) * 0.12
      }

      const p = Math.min(100, progress)
      if (barRef.current) barRef.current.style.width = `${p}%`
      if (percentRef.current) percentRef.current.textContent = `${Math.round(p)}%`

      if (sceneReady && p >= 99.5) {
        if (barRef.current) barRef.current.style.width = '100%'
        if (percentRef.current) percentRef.current.textContent = '100%'
        if (subtitleRef.current) subtitleRef.current.textContent = '准备就绪'

        dismissed = true
        if (overlayRef.current) overlayRef.current.style.opacity = '0'
        setTimeout(() => { if (onDismiss) onDismiss() }, 400)
        return
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [onDismiss])

  return (
    <div ref={overlayRef} style={styles.overlay}>
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
        <div ref={subtitleRef} style={styles.subtitle}>初始化场景...</div>
        <div style={styles.barContainer}>
          <div ref={barRef} style={styles.bar} />
        </div>
        <div ref={percentRef} style={styles.percent}>0%</div>
      </div>
    </div>
  )
}

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
    willChange: 'opacity',
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
    width: '0%',
    background: 'linear-gradient(90deg, #00dcff, #0088ff)',
    borderRadius: '2px',
    willChange: 'width',
  },
  percent: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
}
