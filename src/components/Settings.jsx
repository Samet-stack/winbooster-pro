import { useState, useEffect } from 'react'

export default function Settings({ addToast, platformInfo, history }) {
  const [autoLaunch, setAutoLaunch] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAutoLaunch = async () => {
      try {
        if (window.electronAPI?.getAutoLaunch) {
          const res = await window.electronAPI.getAutoLaunch()
          if (res.success) setAutoLaunch(res.data)
        }
      } catch { /* ignore */ }
    }
    fetchAutoLaunch()
  }, [])

  const toggleAutoLaunch = async () => {
    setLoading(true)
    try {
      const newState = !autoLaunch
      if (window.electronAPI?.setAutoLaunch) {
        const res = await window.electronAPI.setAutoLaunch(newState)
        if (!res.success) throw new Error(res.message)
      }
      setAutoLaunch(newState)
      addToast('success', 'Paramètres', newState ? 'Démarrage automatique activé' : 'Démarrage automatique désactivé')
    } catch (e) {
      addToast('error', 'Erreur', 'Impossible de modifier le paramètre : ' + e)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Jamais'
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch { return 'Inconnu' }
  }

  return (
    <>
      <div className="content-header">
        <h2>Paramètres</h2>
        <p>Configuration de l'application et historique</p>
      </div>
      <div className="content-body">
        {/* Platform Info */}
        <div className="opt-section">
          <div className="opt-section-header">
            <span className="opt-section-icon">🖥️</span>
            <span className="opt-section-title">Informations Système</span>
          </div>
          <div className="opt-list">
            <div className="opt-item">
              <div className="opt-item-info">
                <div className="opt-item-name">Plateforme détectée</div>
                <div className="opt-item-desc">
                  {platformInfo?.isNativeLinux && 'Windows Natif — Toutes les optimisations sont disponibles ✅'}
                  {platformInfo?.isWSL && 'Mode Développement (WSL) — Optimisations simulées ⚠️'}
                  {!platformInfo?.isNativeLinux && !platformInfo?.isWSL && 'Plateforme inconnue'}
                </div>
              </div>
              <span className={`governor-badge ${platformInfo?.isNativeLinux ? 'performance' : 'schedutil'}`}>
                {platformInfo?.isNativeLinux ? 'WINDOWS' : platformInfo?.isWSL ? 'DEV' : '?'}
              </span>
            </div>
          </div>
        </div>

        {/* Auto Launch */}
        <div className="opt-section">
          <div className="opt-section-header">
            <span className="opt-section-icon">🚀</span>
            <span className="opt-section-title">Démarrage</span>
          </div>
          <div className="opt-list">
            <div className="opt-item">
              <div className="opt-item-info">
                <div className="opt-item-name">Lancer au démarrage du système</div>
                <div className="opt-item-desc">
                  L'application se lancera automatiquement minimisée au démarrage de votre ordinateur.
                </div>
              </div>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={autoLaunch}
                  onChange={toggleAutoLaunch}
                  disabled={loading}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Optimization History */}
        <div className="opt-section">
          <div className="opt-section-header">
            <span className="opt-section-icon">📈</span>
            <span className="opt-section-title">Historique d'Optimisation</span>
          </div>
          {history ? (
            <>
              <div className="history-stats">
                <div className="history-stat">
                  <div className="history-stat-value">{history.totalCleanups || 0}</div>
                  <div className="history-stat-label">Nettoyages</div>
                </div>
                <div className="history-stat">
                  <div className="history-stat-value">{history.totalGamingActivations || 0}</div>
                  <div className="history-stat-label">Activations Gaming</div>
                </div>
                <div className="history-stat">
                  <div className="history-stat-value">{history.totalTweaks || 0}</div>
                  <div className="history-stat-label">Tweaks Appliqués</div>
                </div>
                <div className="history-stat">
                  <div className="history-stat-value">{history.estimatedSpaceSaved || '0 Mo'}</div>
                  <div className="history-stat-label">Espace Libéré</div>
                </div>
              </div>
              <div className="opt-list" style={{ marginTop: '1rem' }}>
                <div className="opt-item">
                  <div className="opt-item-info">
                    <div className="opt-item-name">Dernier nettoyage</div>
                    <div className="opt-item-desc">{formatDate(history.lastCleanup)}</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="loading-state">
              <div className="spinner"></div>
              <span>Chargement de l'historique...</span>
            </div>
          )}
        </div>

        {/* About */}
        <div className="opt-section">
          <div className="opt-section-header">
            <span className="opt-section-icon">ℹ️</span>
            <span className="opt-section-title">À propos</span>
          </div>
          <div className="opt-list">
            <div className="opt-item">
              <div className="opt-item-icon">⚙️</div>
              <div className="opt-item-info">
                <div className="opt-item-name">WinBooster & Optimizer</div>
                <div className="opt-item-desc">
                  Version 3.0 · Electron + React + Vite · Conçu pour maximiser les performances de votre système Windows.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
