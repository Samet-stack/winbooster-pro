import { useState, useEffect } from 'react'
import { playHoverSound, playClickSound, playSuccessSound, playOverdriveSound } from '../utils/audio'

export default function Cleanup({ addToast, refreshHistory }) {
  const [loading, setLoading] = useState({})
  const [autoPurgeState, setAutoPurgeState] = useState({ running: false, interval: 10, count: 0, lastPurge: null })
  const [autoLoading, setAutoLoading] = useState(false)

  // Fetch initial auto-purge status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        if (window.electronAPI?.getAutoRamPurgeStatus) {
          const res = await window.electronAPI.getAutoRamPurgeStatus()
          if (res.success && res.data) {
            setAutoPurgeState(res.data)
          }
        }
      } catch {}
    }
    fetchStatus()
  }, [])

  const handleToggleAutoPurge = async () => {
    playClickSound()
    setAutoLoading(true)
    try {
      if (window.electronAPI) {
        if (autoPurgeState.running) {
          const res = await window.electronAPI.stopAutoRamPurge()
          if (res.success && res.data) setAutoPurgeState(res.data)
          addToast('success', 'Auto-Purge RAM', 'Nettoyage automatique désactivé')
        } else {
          playOverdriveSound()
          const res = await window.electronAPI.startAutoRamPurge(autoPurgeState.interval || 10)
          if (res.success && res.data) setAutoPurgeState(res.data)
          addToast('success', 'Auto-Purge RAM Activé', `Mémoire Standby purgée automatiquement toutes les ${autoPurgeState.interval || 10} min !`)
        }
      }
    } catch (e) {
      addToast('error', 'Erreur Auto-Purge', e.message)
    } finally {
      setAutoLoading(false)
    }
  }

  const handleChangeInterval = async (newInterval) => {
    playClickSound()
    setAutoPurgeState(prev => ({ ...prev, interval: newInterval }))
    if (autoPurgeState.running && window.electronAPI?.startAutoRamPurge) {
      const res = await window.electronAPI.startAutoRamPurge(newInterval)
      if (res.success && res.data) setAutoPurgeState(res.data)
      addToast('success', 'Intervalle Modifié', `Purge reprogrammée toutes les ${newInterval} min`)
    }
  }

  const handleClean = async (id, actionFn, successMsg) => {
    playClickSound()
    setLoading(prev => ({ ...prev, [id]: true }))
    try {
      if (window.electronAPI) {
        const res = await actionFn()
        if (!res.success) throw new Error(res.message)
      }
      playSuccessSound()
      addToast('success', 'Nettoyage', successMsg)
      if (refreshHistory) refreshHistory()
    } catch (e) {
      addToast('error', 'Erreur', 'Échec du nettoyage : ' + e.message)
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  const panels = [
    {
      id: 'ram', icon: '🧠', iconClass: 'purple',
      title: 'Vider RAM (Standby List)',
      desc: 'Force Windows à purger immédiatement la Standby List pour éliminer les micro-saccades en jeu.',
      action: () => window.electronAPI.cleanRam(), msg: 'RAM Standby List purgée',
      btnClass: 'btn-purple', btnLabel: '🧠 Purger la RAM Maintenant',
    },
    {
      id: 'thumbs', icon: '🎮', iconClass: 'cyan',
      title: 'DirectX Shader Cache', desc: 'Vide le cache DirectX pour corriger les saccades et shaders corrompus.',
      action: () => window.electronAPI.cleanThumbnails(), msg: 'Cache DirectX nettoyé',
      btnClass: 'btn-cyan', btnLabel: '🎮 Vider DirectX',
    },
    {
      id: 'snap', icon: '🌐', iconClass: 'blue',
      title: 'Cache DNS (Flush)', desc: 'Vide le résolveur DNS pour stabiliser le ping et réparer les adresses de serveurs.',
      action: () => window.electronAPI.cleanSnap(), msg: 'Cache DNS nettoyé',
      btnClass: 'btn-blue', btnLabel: '🌐 Flush DNS',
    },
    {
      id: 'logs', icon: '🗑️', iconClass: 'blue',
      title: 'Dossiers TEMP Windows', desc: 'Supprime tous les fichiers temporaires accumulés par Windows et vos applis.',
      action: () => window.electronAPI.cleanJournals(), msg: 'Fichiers TEMP nettoyés',
      btnClass: 'btn-blue', btnLabel: '🗑️ Vider TEMP',
    },
    {
      id: 'apt', icon: '📜', iconClass: 'purple',
      title: 'Logs Système (Event Viewer)', desc: 'Purge tous les journaux d\'événements Windows pour libérer de l\'espace disque.',
      action: () => window.electronAPI.cleanApt(), msg: 'Logs système nettoyés',
      btnClass: 'btn-purple', btnLabel: '📜 Vider Logs',
    },
    {
      id: 'flatpak', icon: '♻️', iconClass: 'emerald',
      title: 'Corbeille Windows', desc: 'Vide la corbeille système et libère l\'espace réservé.',
      action: () => window.electronAPI.cleanFlatpak(), msg: 'Corbeille vidée',
      btnClass: 'btn-emerald', btnLabel: '♻️ Vider Corbeille',
    },
  ]

  return (
    <>
      <div className="content-header" style={{ marginBottom: '1.5rem' }}>
        <h2 className="cyber-title">Nettoyage Système & Purge Mémoire</h2>
        <p className="cyber-subtitle">Libération de l'espace disque et optimisation du cache en temps réel</p>
      </div>

      <div className="content-body">
        {/* NEW FEATURE: Automatic Standby RAM Background Purger */}
        <div 
          className="action-panel cyber-card" 
          style={{ 
            marginBottom: '1.5rem', 
            padding: '1.5rem', 
            border: autoPurgeState.running ? '1px solid var(--neon-emerald)' : '1px solid var(--stroke-base)',
            boxShadow: autoPurgeState.running ? '0 0 16px var(--neon-emerald-glow)' : 'none',
            transition: 'all 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="panel-icon purple" style={{ fontSize: '1.4rem' }}>⏱️</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>Nettoyeur Automatique de RAM Standby (Anti-Stutters)</h3>
                  <span style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: autoPurgeState.running ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                    color: autoPurgeState.running ? 'var(--neon-emerald)' : 'var(--text-tertiary)',
                    border: `1px solid ${autoPurgeState.running ? 'rgba(16,185,129,0.4)' : 'var(--stroke-base)'}`
                  }}>
                    {autoPurgeState.running ? '● SERVICE EN COURS' : '○ EN VEILLE'}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                  Vide automatiquement la mémoire cache Standby List en arrière-plan pendant vos parties pour garantir un frametime ultra-stable.
                </p>
              </div>
            </div>

            {/* Master Toggle Button */}
            <button
              className={`btn ${autoPurgeState.running ? 'btn-danger' : 'btn-emerald'} btn-glow`}
              onClick={handleToggleAutoPurge}
              disabled={autoLoading}
              onMouseEnter={playHoverSound}
              style={{ padding: '0.6rem 1.5rem', fontWeight: '700', fontSize: '0.85rem' }}
            >
              {autoLoading ? 'CHARGEMENT...' : autoPurgeState.running ? '⏹️ ARRÊTER L\'AUTO-PURGE' : '⚡ ACTIVER L\'AUTO-PURGE'}
            </button>
          </div>

          {/* Interval Selector & Live Telemetry */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>FRÉQUENCE DE PURGE :</span>
              {[5, 10, 15].map(mins => (
                <button
                  key={mins}
                  className={`btn ${autoPurgeState.interval === mins ? 'btn-purple' : 'btn-outline'} btn-sm`}
                  onClick={() => handleChangeInterval(mins)}
                  onMouseEnter={playHoverSound}
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', borderRadius: '4px' }}
                >
                  {mins} min
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <span>Dernière purge : <strong style={{ color: '#fff' }}>{autoPurgeState.lastPurge || 'Aucune'}</strong></span>
              <span>Total purges : <strong style={{ color: 'var(--neon-cyan)' }}>{autoPurgeState.count}</strong></span>
            </div>
          </div>
        </div>

        {/* Granular Cleanup Panels Grid */}
        <div className="panels-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {panels.map(panel => (
            <div className="action-panel cyber-card" key={panel.id} style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div className="panel-header" style={{ marginBottom: '0.6rem' }}>
                  <div className={`panel-icon ${panel.iconClass}`}>{panel.icon}</div>
                  <span className="panel-title" style={{ fontSize: '0.95rem' }}>{panel.title}</span>
                </div>
                <p className="panel-desc" style={{ fontSize: '0.75rem', marginBottom: '1.25rem' }}>{panel.desc}</p>
              </div>
              <button
                className={`btn ${panel.btnClass} btn-sm`}
                style={{ width: '100%', padding: '0.45rem', fontSize: '0.8rem', fontWeight: '600' }}
                onClick={() => handleClean(panel.id, panel.action, panel.msg)}
                disabled={loading[panel.id]}
                onMouseEnter={playHoverSound}
              >
                {loading[panel.id] ? <div className="spinner" style={{ width: '12px', height: '12px' }}></div> : panel.btnLabel}
              </button>
            </div>
          ))}
        </div>

        {/* Master Full Clean Section */}
        <div className="cleanup-full-section cyber-card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>🧹 Nettoyage Global Express (Tout Purger)</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Exécute l'intégralité des opérations de nettoyage ci-dessus en un seul clic.
            </p>
          </div>
          <button
            className="btn btn-danger btn-glow"
            onClick={() => handleClean('all', () => window.electronAPI.cleanAll(), 'Nettoyage complet terminé avec succès !')}
            disabled={loading.all}
            onMouseEnter={playHoverSound}
            style={{ padding: '0.6rem 1.5rem', fontWeight: '700', fontSize: '0.85rem' }}
          >
            {loading.all ? 'NETTOYAGE EN COURS...' : '💣 LANCER LE NETTOYAGE COMPLET'}
          </button>
        </div>
      </div>
    </>
  )
}
