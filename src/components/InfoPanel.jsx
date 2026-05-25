import useCellStore, { ORGANELLE_DATA } from '../store/useCellStore'
import { getOrganelleType } from '../utils/organelleUtils'

export default function InfoPanel() {
  const selectedId = useCellStore((s) => s.selectedOrganelleId)
  const panelOpen = useCellStore((s) => s.panelOpen)
  const closePanel = useCellStore((s) => s.closePanel)
  const togglePanel = useCellStore((s) => s.togglePanel)

  const organelleType = selectedId ? getOrganelleType(selectedId) : null
  const data = organelleType ? ORGANELLE_DATA[organelleType] : null

  if (!selectedId || !data) {
    return (
      <div style={styles.hint}>
        <span style={styles.hintIcon}>⬡</span>
        <span>点击细胞器查看详情</span>
      </div>
    )
  }

  if (!panelOpen) {
    return (
      <button style={styles.openBtn} onClick={togglePanel}>
        <span style={styles.openIcon}>◀</span>
        <span>{data.name}</span>
      </button>
    )
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{data.name}</h2>
          <span style={styles.subtitle}>{data.nameEn}</span>
        </div>
        <button style={styles.closeBtn} onClick={closePanel}>✕</button>
      </div>

      <div style={styles.body}>
        <p style={styles.description}>{data.description}</p>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>主要功能</h3>
          <p style={styles.functionText}>{data.function}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>关键数据</h3>
          <div style={styles.dataGrid}>
            {data.keyData.map((item, i) => (
              <div key={i} style={styles.dataItem}>
                <span style={styles.dataLabel}>{item.label}</span>
                <span style={styles.dataValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  hint: {
    position: 'absolute',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    background: 'rgba(15, 15, 30, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
    pointerEvents: 'none',
    userSelect: 'none',
  },
  hintIcon: {
    fontSize: '16px',
    opacity: 0.6,
  },
  openBtn: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(15, 15, 30, 0.85)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  openIcon: {
    fontSize: '10px',
    opacity: 0.6,
  },
  panel: {
    position: 'absolute',
    top: '24px',
    right: '24px',
    width: '320px',
    maxHeight: 'calc(100vh - 48px)',
    overflowY: 'auto',
    background: 'rgba(12, 12, 28, 0.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    color: '#fff',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(0, 200, 255, 0.05)',
    animation: 'slideIn 0.25s ease-out',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px 20px 0 20px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  subtitle: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '2px',
    display: 'block',
  },
  closeBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: 'rgba(255, 255, 255, 0.6)',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  body: {
    padding: '16px 20px 20px',
  },
  description: {
    margin: '0 0 16px',
    fontSize: '13px',
    lineHeight: 1.7,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  section: {
    marginBottom: '16px',
  },
  sectionTitle: {
    margin: '0 0 8px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(0, 220, 255, 0.7)',
  },
  functionText: {
    margin: 0,
    fontSize: '13px',
    lineHeight: 1.6,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  dataGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  dataItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  dataLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  dataValue: {
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'right',
  },
}
