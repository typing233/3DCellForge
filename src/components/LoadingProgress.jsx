import { useState, useEffect } from 'react'

export default function LoadingProgress({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let raf
    let start = null
    const duration = 1800

    const animate = (timestamp) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(eased * 100)

      if (p < 1) {
        raf = requestAnimationFrame(animate)
      } else {
        setTimeout(() => {
          setVisible(false)
          if (onComplete) onComplete()
        }, 300)
      }
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [onComplete])

  if (!visible) return null

  return (
    <div style={styles.overlay}>
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
        <div style={styles.subtitle}>加载细胞模型中...</div>
        <div style={styles.barContainer}>
          <div style={{ ...styles.bar, width: `${progress}%` }} />
        </div>
        <div style={styles.percent}>{Math.round(progress)}%</div>
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
    transition: 'opacity 0.4s',
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
    transition: 'width 0.1s',
  },
  percent: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
}
