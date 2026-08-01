import { useState, useEffect } from 'react'

export default function Services({ addToast }) {
  const [services, setServices] = useState([])
  const [bootInfo, setBootInfo] = useState({ time: '', blame: '' })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (window.electronAPI) {
          const [srvRes, bootRes] = await Promise.all([
            window.electronAPI.getServices(),
            window.electronAPI.getBootTime(),
          ])
          setServices(srvRes?.success ? srvRes.data : [])
          setBootInfo(bootRes?.success ? bootRes.data : { time: '', blame: '' })
        } else {
          setServices([
            'SysMain',
            'DiagTrack',
            'WSearch',
            'XboxGipSvc',
            'XblAuthManager',
            'BthAvctpSvc',
            'Spooler',
          ])
          setBootInfo({
            time: 'Temps de démarrage du BIOS : 14.3s',
            blame: 'Dernier démarrage :\n4.2s SysMain\n1.8s WSearch\n 923ms DiagTrack\n 612ms Spooler\n 445ms XboxGipSvc'
          })
        }
      } catch {
        addToast?.('error', 'Erreur', 'Impossible de charger les services')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [addToast])

  const handleToggleService = async (service, enable) => {
    setActionLoading(prev => ({ ...prev, [service]: true }))
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.toggleService({ service, enable })
        if (!res.success) throw new Error(res.message)
      }
      addToast('success', 'Service', `${service} ${enable ? 'activé' : 'désactivé'}`)
      // Remove from list if disabled
      if (!enable) {
        setServices(prev => prev.filter(s => s !== service))
      }
    } catch (e) {
      addToast('error', 'Erreur', `Impossible de modifier ${service} : ` + e.message)
    } finally {
      setActionLoading(prev => ({ ...prev, [service]: false }))
    }
  }

  if (loading) {
    return (
      <>
        <div className="content-header">
          <h2>Services & Démarrage</h2>
          <p>Analyse en cours...</p>
        </div>
        <div className="content-body">
          <div className="loading-state">
            <div className="spinner"></div>
            <span>Analyse des services au démarrage...</span>
          </div>
        </div>
      </>
    )
  }

  const blameLines = bootInfo.blame ? bootInfo.blame.split('\n').filter(Boolean) : []

  return (
    <>
      <div className="content-header">
        <h2>Services & Démarrage</h2>
        <p>Optimisez le temps de démarrage en désactivant les services inutiles</p>
      </div>
      <div className="content-body">
        {/* Boot analysis */}
        <div className="boot-panel">
          <h3>⏱️ Analyse du Démarrage</h3>
          {bootInfo.time && (
            <div className="boot-time-value">{bootInfo.time}</div>
          )}
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Services les plus lents au démarrage :
          </p>
          <ul className="blame-list">
            {blameLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
            {blameLines.length === 0 && (
              <li style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Aucune donnée disponible</li>
            )}
          </ul>
        </div>

        {/* Services list */}
        <div className="opt-section">
          <div className="opt-section-header">
            <span className="opt-section-icon">⚙️</span>
            <span className="opt-section-title">Services Actifs au Démarrage</span>
          </div>
          <div className="opt-list">
            {services.map(s => (
              <div className="opt-item" key={s}>
                <div className="opt-item-info">
                  <div className="opt-item-name" style={{ fontFamily: 'var(--font-mono)' }}>{s}</div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleToggleService(s, false)}
                  disabled={actionLoading[s]}
                >
                  {actionLoading[s] ? <div className="spinner"></div> : 'Désactiver'}
                </button>
              </div>
            ))}
            {services.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                Aucun service trouvé
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
