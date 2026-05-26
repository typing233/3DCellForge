import useCellStore, { ORGANELLE_DATA } from '../store/useCellStore'
import { ORGANELLE_CONFIGS } from './Organelles'

const UNIQUE_TYPES = [...new Set(ORGANELLE_CONFIGS.map(c => c.type))]

export default function UIControls({ onResetCamera }) {
  const labelsVisible = useCellStore((s) => s.labelsVisible)
  const toggleLabels = useCellStore((s) => s.toggleLabels)
  const selectOrganelle = useCellStore((s) => s.selectOrganelle)
  const setFocusTarget = useCellStore((s) => s.setFocusTarget)

  const handleJump = (type) => {
    const config = ORGANELLE_CONFIGS.find(c => c.type === type)
    if (config) {
      selectOrganelle(config.id)
      setFocusTarget(config.position || [0, 0, 0])
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.toolbar}>
        <button style={styles.btn} onClick={onResetCamera} title="重置视角">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
        </button>
        <button
          style={{ ...styles.btn, ...(labelsVisible ? styles.btnActive : {}) }}
          onClick={toggleLabels}
          title={labelsVisible ? '隐藏标签' : '显示标签'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7V4h16v3M9 20h6M12 4v16" />
          </svg>
        </button>
      </div>

      <div style={styles.listContainer}>
        <div style={styles.listTitle}>细胞器</div>
        {UNIQUE_TYPES.map((type) => {
          const data = ORGANELLE_DATA[type]
          if (!data) return null
          return (
            <button
              key={type}
              style={styles.listItem}
              onClick={() => handleJump(type)}
            >
              <span style={{ ...styles.dot, background: data.color }} />
              <span style={styles.itemName}>{data.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'absolute',
    top: '24px',
    left: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 10,
  },
  toolbar: {
    display: 'flex',
    gap: '6px',
  },
  btn: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(12, 12, 28, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  btnActive: {
    background: 'rgba(0,200,255,0.15)',
    borderColor: 'rgba(0,200,255,0.4)',
    color: '#00dcff',
  },
  listContainer: {
    background: 'rgba(12, 12, 28, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  listTitle: {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(0, 220, 255, 0.6)',
    marginBottom: '4px',
    paddingLeft: '4px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 8px',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    textAlign: 'left',
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  itemName: {
    whiteSpace: 'nowrap',
  },
}
