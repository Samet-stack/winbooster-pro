import { useState, useMemo } from 'react'
import { playHoverSound, playClickSound, playSuccessSound, playOverdriveSound } from '../utils/audio'

const ALL_TWEAKS = [
  {
    id: 'esport_hags',
    category: 'esport',
    name: 'HAGS (GPU Scheduling Matériel)',
    desc: 'Délègue la gestion de la mémoire à la carte graphique. Réduit drastiquement l\'input lag.',
    badge: 'REBOOT REQUIS',
    badgeType: 'blue',
    action: () => window.electronAPI.enableHags(),
    msg: 'HAGS Activé (Redémarrez le PC pour finaliser)',
    btnLabel: 'Activer HAGS',
    safe: true,
  },
  {
    id: 'esport_timer',
    category: 'esport',
    name: 'Forcer Global Timer Resolution (0.5ms)',
    desc: 'Verrouille la fréquence de rafraîchissement d\'horloge à 0.5ms pour une réactivité maximale.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.enableTimerResolution(),
    msg: 'Timer Global forcé à 0.5ms',
    btnLabel: 'Forcer 0.5ms',
    safe: true,
  },
  {
    id: 'esport_unpark',
    category: 'cpu',
    name: 'Unparking Cœurs CPU (Anti-Sommeil)',
    desc: 'Empêche Windows d\'endormir les cœurs du processeur. Élimine les micro-saccades en jeu.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.unparkCpu(),
    msg: 'Cœurs CPU débloqués et éveillés à 100%',
    btnLabel: 'Débloquer Cœurs',
    safe: true,
  },
  {
    id: 'sys_responsiveness',
    category: 'cpu',
    name: 'System Responsiveness 0% (Réserve CPU)',
    desc: 'Supprime la bride de 20% de Windows réservée aux tâches de fond pour allouer 100% au jeu.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.enableSystemResponsiveness(),
    msg: 'Réserve CPU neutralisée (100% alloué)',
    btnLabel: 'Appliquer 0%',
    safe: true,
  },
  {
    id: 'enable_ifeo',
    category: 'esport',
    name: 'Priorité Kernel IFEO (Anti-Cheat Bypass)',
    desc: 'Inscrit les jeux eSport en dur dans le noyau Windows pour forcer la priorité absolue sans bloquer Vanguard/FaceIt.',
    badge: 'eSPORT ONLY',
    badgeType: 'purple',
    action: () => window.electronAPI.enableIfeo(),
    msg: 'Priorité IFEO injectée dans le noyau',
    btnLabel: 'Injecter IFEO',
    safe: true,
  },
  {
    id: 'enable_priority_sep',
    category: 'cpu',
    name: 'Win32PrioritySeparation (Hex 28)',
    desc: 'Alloue des cycles CPU ("Quanta") plus longs aux jeux exécutés en premier plan.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.enablePrioritySep(),
    msg: 'Séparation de priorité optimisée (Hex 28)',
    btnLabel: 'Appliquer Quanta',
    safe: true,
  },
  {
    id: 'input_buffers',
    category: 'esport',
    name: 'Fast USB Polling Buffers (DataQueueSize)',
    desc: 'Réduit les files d\'attente matérielles DataQueueSize pour une transmission instantanée des clics et mouvements.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.enableInputBuffers(),
    msg: 'Buffers USB réduits (Zéro filtre)',
    btnLabel: 'Réduire Latence',
    safe: true,
  },
  {
    id: 'enable_tcp_profile',
    category: 'network',
    name: 'Profil Réseau TCP Optimizer (Window Scaling)',
    desc: 'Active le Window Scaling et SackOpts. Empêche la perte de paquets et stabilise le jitter.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.enableTcpProfile(),
    msg: 'Profil TCP Optimizer injecté',
    btnLabel: 'Optimiser TCP',
    safe: true,
  },
  {
    id: 'net_bbr',
    category: 'network',
    name: 'Désactiver Network Throttling Index',
    desc: 'Supprime le bridage réseau Windows imposé aux cartes Ethernet/Wi-Fi lors des sessions de jeu.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.enableBbr(),
    msg: 'Bridage réseau neutralisé',
    btnLabel: 'Débrider Réseau',
    safe: true,
  },
  {
    id: 'disable_tcp',
    category: 'network',
    name: 'TCP Chimney Offload (Désactivation)',
    desc: 'Évite les bugs de déconnexion réseau liés à l\'offload matériel de certaines box internet.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.disableTcpChimney(),
    msg: 'TCP Chimney Offload désactivé',
    btnLabel: 'Désactiver Offload',
    safe: true,
  },
  {
    id: 'esport_ping',
    category: 'network',
    name: 'Désactiver Modération Interrupt Réseau',
    desc: 'Force la carte réseau à traiter immédiatement chaque paquet entrant sans temporisation.',
    badge: 'eSPORT ONLY',
    badgeType: 'purple',
    action: () => window.electronAPI.disableInterruptModeration(),
    msg: 'Interrupt Moderation désactivé',
    btnLabel: 'Zéro Temporisation',
    safe: true,
  },
  {
    id: 'disable_ndu',
    category: 'system',
    name: 'Désactiver NDU (Network Data Usage)',
    desc: 'Coupe le driver de surveillance réseau Windows responsable des fuites de mémoire RAM en jeu.',
    badge: 'REBOOT REQUIS',
    badgeType: 'blue',
    action: () => window.electronAPI.disableNdu(),
    msg: 'NDU désactivé (Anti-Memory Leak)',
    btnLabel: 'Couper NDU',
    safe: true,
  },
  {
    id: 'optimize_hpet',
    category: 'cpu',
    name: 'Optimisation Timers HPET / Dynamic Tick',
    desc: 'Désactive Dynamic Tick dans le bootloader pour un frametime parfaitement linéaire.',
    badge: 'REBOOT REQUIS',
    badgeType: 'blue',
    action: () => window.electronAPI.disableTimers(),
    msg: 'Timers HPET & Dynamic Tick optimisés',
    btnLabel: 'Optimiser HPET',
    safe: true,
  },
  {
    id: 'gov_perf',
    category: 'cpu',
    name: 'Mode Alimentation Performances Maximales',
    desc: 'Active le schéma d\'énergie Ultimate Performance sans mise en veille des bus PCIe.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.setGovernor('performance'),
    msg: 'Plan Ultimate Performance activé',
    btnLabel: 'Engager Puissance',
    safe: true,
  },
  {
    id: 'esport_dvr',
    category: 'system',
    name: 'Neutralisation Game DVR & Game Bar',
    desc: 'Désactive les hooks d\'enregistrement et overlays Xbox qui provoquent des pertes de FPS.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.killDvr(),
    msg: 'Game DVR complètement neutralisé',
    btnLabel: 'Désactiver DVR',
    safe: true,
  },
  {
    id: 'disable_telemetry',
    category: 'system',
    name: 'Neutraliser Télémétrie Périphériques (DiagTrack)',
    desc: 'Coupe le logging d\'événements en arrière-plan pour libérer le thread système.',
    badge: '100% SÛR',
    badgeType: 'emerald',
    action: () => window.electronAPI.disableTelemetry(),
    msg: 'Télémétrie neutralisée',
    btnLabel: 'Désactiver DiagTrack',
    safe: true,
  },
  {
    id: 'disable_spectre',
    category: 'cpu',
    name: 'Désactiver Spectre & Meltdown (Extrême)',
    desc: 'Coupe les mitigations CPU de sécurité. Recommandé uniquement pour le benchmarking et eSport.',
    badge: '⚠️ EXPERT ONLY',
    badgeType: 'crimson',
    action: () => window.electronAPI.disableSpectre(),
    msg: 'Mitigations CPU désactivées (Redémarrage requis)',
    btnLabel: 'Désactiver (Péril)',
    safe: false,
  }
]

const CATEGORIES = [
  { id: 'all', label: '⚡ TOUS', icon: '' },
  { id: 'esport', label: '🏆 eSport & Latence', icon: '' },
  { id: 'network', label: '🌐 Réseau & Ping', icon: '' },
  { id: 'cpu', label: '⚡ CPU & Énergie', icon: '' },
  { id: 'system', label: '💾 Système & Cache', icon: '' },
]

export default function Tweaks({ addToast }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTweaks, setActiveTweaks] = useState({})
  const [loadingMap, setLoadingMap] = useState({})
  const [godModeLoading, setGodModeLoading] = useState(false)

  const handleAction = async (tweak) => {
    playClickSound()
    setLoadingMap(prev => ({ ...prev, [tweak.id]: true }))
    try {
      if (window.electronAPI && tweak.action) {
        const res = await tweak.action()
        if (res && !res.success && res.message) throw new Error(res.message)
      }
      playSuccessSound()
      setActiveTweaks(prev => ({ ...prev, [tweak.id]: true }))
      addToast('success', tweak.name, tweak.msg || 'Optimisation appliquée avec succès !')
    } catch (e) {
      addToast('error', 'Erreur', 'Action échouée : ' + e.message)
    } finally {
      setLoadingMap(prev => ({ ...prev, [tweak.id]: false }))
    }
  }

  const handleApplyGodMode = async () => {
    playOverdriveSound()
    setGodModeLoading(true)
    const safeTweaks = ALL_TWEAKS.filter(t => t.safe)
    let appliedCount = 0

    for (const tweak of safeTweaks) {
      try {
        if (window.electronAPI && tweak.action) {
          await tweak.action()
        }
        setActiveTweaks(prev => ({ ...prev, [tweak.id]: true }))
        appliedCount++
      } catch (e) {}
    }

    setGodModeLoading(false)
    playSuccessSound()
    addToast('success', 'PACK GOD MODE APPLIQUÉ !', `${appliedCount} optimisations critiques injectées en simultané.`)
  }

  const filteredTweaks = useMemo(() => {
    return ALL_TWEAKS.filter(tweak => {
      const matchesCat = activeCategory === 'all' || tweak.category === activeCategory
      const matchesSearch = tweak.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tweak.desc.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [activeCategory, searchQuery])

  const appliedCount = Object.keys(activeTweaks).length
  const totalCount = ALL_TWEAKS.length
  const progressPercent = Math.round((appliedCount / totalCount) * 100)

  return (
    <>
      {/* Sticky Cockpit Header & Master Controls */}
      <div className="content-header" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="cyber-title">Matrice d'Optimisations eSport</h2>
            <p className="cyber-subtitle">Injecteur de paramètres de bas niveau pour latence zéro et FPS constants</p>
          </div>

          {/* Quick Stats Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '1px solid var(--stroke-base)', 
              borderRadius: '8px', 
              padding: '0.4rem 0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>STATUT SCORE :</span>
              <strong style={{ fontFamily: 'var(--font-mono)', color: progressPercent > 50 ? 'var(--neon-emerald)' : 'var(--neon-cyan)' }}>
                {progressPercent}% BOOSTÉ ({appliedCount}/{totalCount})
              </strong>
            </div>

            <button 
              className="btn btn-purple btn-glow"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.85rem', letterSpacing: '0.5px' }}
              onClick={handleApplyGodMode}
              disabled={godModeLoading}
              onMouseEnter={playHoverSound}
            >
              {godModeLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div className="spinner" style={{ width: '14px', height: '14px' }}></div>
                  <span>INJECTION EN COURS...</span>
                </div>
              ) : (
                '⚡ TOUT ACTIVER (PACK SAFE)'
              )}
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', marginTop: '1rem', overflow: 'hidden' }}>
          <div style={{ 
            width: `${progressPercent}%`, 
            height: '100%', 
            background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 8px var(--neon-cyan-glow)'
          }} />
        </div>
      </div>

      <div className="content-body">
        {/* Filter Navigation Bar & Instant Search */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '1rem', 
          marginBottom: '1.5rem',
          background: 'var(--bg-card)',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          border: '1px solid var(--stroke-base)'
        }}>
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`btn ${activeCategory === cat.id ? 'btn-cyan' : 'btn-outline'} btn-sm`}
                style={{ borderRadius: '6px', fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                onClick={() => {
                  playClickSound()
                  setActiveCategory(cat.id)
                }}
                onMouseEnter={playHoverSound}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px', flex: '1', maxWidth: '320px' }}>
            <input
              type="text"
              placeholder="🔍 Filtrer un tweak (ex: TCP, HPET)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.4rem 0.8rem',
                fontSize: '0.8rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--stroke-base)',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
            {searchQuery && (
              <span 
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-tertiary)', fontSize: '0.8rem' }}
              >
                ✖
              </span>
            )}
          </div>
        </div>

        {/* Tweaks Modular Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredTweaks.map(tweak => {
            const isApplied = !!activeTweaks[tweak.id]
            const isLoading = !!loadingMap[tweak.id]

            return (
              <div
                key={tweak.id}
                className={`action-panel cyber-card ${isApplied ? 'active' : ''}`}
                style={{
                  margin: 0,
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isApplied ? '1px solid var(--neon-emerald)' : '1px solid var(--stroke-base)',
                  boxShadow: isApplied ? '0 0 12px var(--neon-emerald-glow)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={playHoverSound}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: tweak.badgeType === 'emerald' ? 'rgba(16,185,129,0.15)' :
                                  tweak.badgeType === 'purple' ? 'rgba(139,92,246,0.15)' :
                                  tweak.badgeType === 'crimson' ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
                      color: tweak.badgeType === 'emerald' ? 'var(--neon-emerald)' :
                             tweak.badgeType === 'purple' ? 'var(--neon-purple)' :
                             tweak.badgeType === 'crimson' ? 'var(--neon-crimson)' : 'var(--neon-cyan)',
                      border: `1px solid ${tweak.badgeType === 'emerald' ? 'rgba(16,185,129,0.3)' :
                                          tweak.badgeType === 'purple' ? 'rgba(139,92,246,0.3)' :
                                          tweak.badgeType === 'crimson' ? 'rgba(239,68,68,0.3)' : 'rgba(59,130,246,0.3)'}`
                    }}>
                      {tweak.badge}
                    </span>

                    {isApplied && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--neon-emerald)', fontWeight: 'bold' }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--neon-emerald)', display: 'inline-block', boxShadow: '0 0 6px var(--neon-emerald)' }} />
                        ENGAGÉ
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <h4 style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                    {tweak.name}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                    {tweak.desc}
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <button
                  className={`btn ${isApplied ? 'btn-emerald' : tweak.safe ? 'btn-outline' : 'btn-danger'} btn-sm`}
                  style={{ width: '100%', padding: '0.45rem 0.8rem', fontSize: '0.8rem', fontWeight: '600' }}
                  onClick={() => handleAction(tweak)}
                  disabled={isLoading}
                  onMouseEnter={playHoverSound}
                >
                  {isLoading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <div className="spinner" style={{ width: '12px', height: '12px' }}></div>
                      <span>APPLICATION...</span>
                    </div>
                  ) : isApplied ? (
                    '✓ RÉ-APPLIQUER'
                  ) : (
                    tweak.btnLabel
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
