import { useState } from 'react'
import { playHoverSound, playClickSound, playOverdriveSound, playSuccessSound } from '../utils/audio'

const GAME_PROFILES = [
  { id: 'val', name: 'Valorant', icon: '🎯', desc: 'Priorité CPU Haute + Zéro Buffer Audio + Latence Réseau Ultra-basse', exe: 'VALORANT-Win64-Shipping.exe' },
  { id: 'cs2', name: 'Counter-Strike 2', icon: '💣', desc: 'Affinité P-Cores + Réponse Clavier Instant + Mode Plein Écran Exclusif', exe: 'cs2.exe' },
  { id: 'lol', name: 'League of Legends', icon: '⚔️', desc: 'TCP Low-Jitter + Sync GPU Maximale + Ram Standby Flush', exe: 'League of Legends.exe' },
  { id: 'fn', name: 'Fortnite', icon: '🪓', desc: 'DirectX 12 Shader Unpack + Bypass Télémétrie + Quanta CPU Longs', exe: 'FortniteClient-Win64-Shipping.exe' },
  { id: 'apex', name: 'Apex Legends', icon: '🛡️', desc: 'Désactivation Dynamic Tick + Nettoyage Cache Mémoire VRAM', exe: 'r5apex.exe' },
  { id: 'wz', name: 'Warzone / COD', icon: '🔫', desc: 'Optimisation Mémoire Standby + Déblocage Coeurs Physiques', exe: 'cod.exe' }
]

export default function GamingMode({ gamingMode, setGamingMode, sysInfo, addToast, refreshHistory }) {
  const [loading, setLoading] = useState(false)
  const [autoBoost, setAutoBoost] = useState(false)
  const [activeProfile, setActiveProfile] = useState(null)

  const toggleGamingMode = async () => {
    setLoading(true)
    playClickSound()
    try {
      if (window.electronAPI) {
        if (gamingMode) {
          const res = await window.electronAPI.gamingModeOff()
          if (!res.success) throw new Error(res.message)
        } else {
          playOverdriveSound()
          const res = await window.electronAPI.gamingModeOn()
          if (!res.success) throw new Error(res.message)
        }
      } else {
        if (!gamingMode) playOverdriveSound()
      }
      const newState = !gamingMode
      setGamingMode(newState)
      addToast('success', 'Mode Gaming', newState ? 'Mode Gaming Overdrive activé ! 🎮' : 'Mode Gaming désactivé')
      if (refreshHistory) refreshHistory()
    } catch (e) {
      addToast('error', 'Erreur', 'Impossible de modifier le mode gaming : ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAutoBoost = async () => {
    playClickSound()
    try {
      if (window.electronAPI) {
        if (autoBoost) {
          await window.electronAPI.stopAutoBoost()
        } else {
          playSuccessSound()
          await window.electronAPI.startAutoBoost()
        }
      } else {
        if (!autoBoost) playSuccessSound()
      }
      const newState = !autoBoost
      setAutoBoost(newState)
      addToast('success', 'Auto-Boost', newState ? 'Scanner Live Actif (Priorité dynamique)' : 'Scanner Live Arrêté')
    } catch (e) {
      addToast('error', 'Auto-Boost', e.message)
    }
  }

  const applyGameProfile = async (profile) => {
    playOverdriveSound()
    setActiveProfile(profile.id)
    try {
      if (window.electronAPI) {
        await window.electronAPI.enableIfeo()
        await window.electronAPI.enablePrioritySep()
      }
      addToast('success', `Profil ${profile.name}`, `Arme calibrée pour ${profile.name} (Priorité Kernel injectée)`)
    } catch (e) {
      addToast('error', 'Erreur Profil', e.message)
    }
  }

  return (
    <>
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="cyber-title">Armurerie eSport & Mode Gaming</h2>
          <p className="cyber-subtitle">Optimisation de pointe calibrée pour la compétition</p>
        </div>
        {gamingMode && (
          <div className="gaming-active-badge">
            <span className="dot"></span>
            OVERDRIVE ACTIF
          </div>
        )}
      </div>

      <div className="content-body">
        {/* Main Dual Heroes */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Hero Toggle */}
          <div className={`gaming-hero ${gamingMode ? 'active' : ''}`} style={{ margin: 0 }}>
            <span className="big-icon">{gamingMode ? '⚡' : '🎮'}</span>
            <h3 style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>{gamingMode ? 'OVERDRIVE ENGAGÉ' : 'MODE GAMING'}</h3>
            <p style={{ fontSize: '0.85rem' }}>
              {gamingMode
                ? 'Noyau Windows en fréquence maximale. Interrupts et priorité verrouillés.'
                : 'Alloue l’intégralité des cycles CPU et désactive les services de fond.'}
            </p>
            {gamingMode ? (
              <button className="btn btn-danger" onClick={toggleGamingMode} disabled={loading} onMouseEnter={playHoverSound}>
                {loading ? <div className="spinner"></div> : '⏹️ DÉSENGAGER OVERDRIVE'}
              </button>
            ) : (
              <button className="btn btn-purple btn-glow" onClick={toggleGamingMode} disabled={loading} onMouseEnter={playHoverSound}>
                {loading ? <div className="spinner"></div> : '🚀 ENGAGER OVERDRIVE'}
              </button>
            )}
          </div>

          {/* Auto-Boost Hero */}
          <div className={`gaming-hero ${autoBoost ? 'active' : ''}`} style={{ margin: 0, borderColor: autoBoost ? 'var(--neon-cyan)' : 'var(--stroke-base)' }}>
            <span className="big-icon" style={{ animation: autoBoost ? 'pulse 1.2s infinite' : 'none' }}>🎯</span>
            <h3 style={{ fontSize: '1.5rem', letterSpacing: '1px' }}>RADAR AUTO-BOOST</h3>
            <p style={{ fontSize: '0.85rem' }}>
              {autoBoost
                ? 'Radar actif en mémoire vive. Priorité High immédiate dès le lancement d’un jeu.'
                : 'Surveille vos processus et injecte la priorité haute à la volée.'}
            </p>
            <button className={`btn ${autoBoost ? 'btn-danger' : 'btn-cyan'}`} onClick={toggleAutoBoost} onMouseEnter={playHoverSound}>
              {autoBoost ? '⏹️ ARRÊTER LE RADAR' : '⚡ ACTIVER LE RADAR'}
            </button>
          </div>
        </div>

        {/* eSport Profiles Grid */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.25rem' }}>🏆</span>
            <h3 style={{ fontSize: '1.1rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
              Profils Pré-Calibrés eSport (1-Clic)
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {GAME_PROFILES.map((game) => (
              <div 
                key={game.id}
                className={`action-panel cyber-card ${activeProfile === game.id ? 'active' : ''}`}
                style={{ 
                  margin: 0, 
                  padding: '1.25rem',
                  border: activeProfile === game.id ? '1px solid var(--neon-cyan)' : '1px solid var(--stroke-base)',
                  boxShadow: activeProfile === game.id ? '0 0 15px var(--neon-cyan-glow)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => applyGameProfile(game)}
                onMouseEnter={playHoverSound}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>{game.icon}</span>
                    <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>{game.name}</strong>
                  </div>
                  {activeProfile === game.id && (
                    <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px', background: 'var(--neon-cyan-glow)', color: 'var(--neon-cyan)', fontWeight: 'bold' }}>
                      INJECTÉ
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3', marginBottom: '1rem' }}>
                  {game.desc}
                </p>
                <button 
                  className={`btn ${activeProfile === game.id ? 'btn-cyan' : 'btn-outline'} btn-sm`} 
                  style={{ width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    applyGameProfile(game)
                  }}
                >
                  {activeProfile === game.id ? '⚡ Profil Actif' : 'Appliquer Profil'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live System Diagnostics */}
        <div className="panels-grid">
          <div className="action-panel">
            <div className="panel-header">
              <div className="panel-icon purple">⚡</div>
              <span className="panel-title">Mécanique du Noyau Active</span>
            </div>
            <ul className="panel-details">
              <li>Planificateur CPU → Quanta variables longs (Win32PrioritySeparation Hex 28)</li>
              <li>Profil d'Alimentation → Ultimate Performance (100% Unparked Cores)</li>
              <li>Network Throttling Index → Désactivé (0xFFFFFFFF)</li>
              <li>Télémétrie Windows (DiagTrack) → Neutralisée</li>
              <li>Isolation Mémoire → Purge Standby List automatisée</li>
            </ul>
          </div>

          <div className="action-panel">
            <div className="panel-header">
              <div className="panel-icon cyan">📊</div>
              <span className="panel-title">Télémétrie Cockpit</span>
            </div>
            <div className="gaming-status-grid">
              <div className="gaming-status-item">
                <span className="status-icon">🔧</span>
                <div>
                  <div className="status-label">Planificateur</div>
                  <div className="status-value">{gamingMode ? 'eSport Overdrive' : 'Équilibré'}</div>
                </div>
              </div>
              <div className="gaming-status-item">
                <span className="status-icon">⚡</span>
                <div>
                  <div className="status-label">Priorité Jeux</div>
                  <div className="status-value">{autoBoost ? 'High Dynamic' : 'Standard'}</div>
                </div>
              </div>
              <div className="gaming-status-item">
                <span className="status-icon">🌡️</span>
                <div>
                  <div className="status-label">Température CPU</div>
                  <div className="status-value">{sysInfo?.cpuTemp ? `${sysInfo.cpuTemp}°C` : 'Normal'}</div>
                </div>
              </div>
              <div className="gaming-status-item">
                <span className="status-icon">📈</span>
                <div>
                  <div className="status-label">Charge CPU</div>
                  <div className="status-value">{sysInfo?.cpuPercent ?? 0}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
