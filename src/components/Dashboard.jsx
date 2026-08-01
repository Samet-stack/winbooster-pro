import { useState, useEffect } from 'react'
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'
import { playHoverSound, playClickSound, playOverdriveSound, playSuccessSound } from '../utils/audio'

const formatUptime = (seconds) => {
  if (!seconds) return '0h 0m'
  const d = Math.floor(seconds / (3600 * 24))
  const h = Math.floor((seconds % (3600 * 24)) / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (d > 0) return `${d}j ${h}h ${m}m`
  return `${h}h ${m}m`
}

// Circular SVG Telemetry Dial Component
function CircularGauge({ value, max = 100, label, unit = '%', color = '#00f0ff', sublabel }) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (Math.min(value, max) / max) * circumference

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        {/* Background Track */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="8"
          fill="transparent"
        />
        {/* Glowing Progress Arc */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            filter: `drop-shadow(0 0 6px ${color})`
          }}
        />
      </svg>

      {/* Center Values */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -55%)', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: '800', color: '#fff' }}>
          {value}<span style={{ fontSize: '0.75rem', color: color }}>{unit}</span>
        </div>
        {sublabel && <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{sublabel}</div>}
      </div>

      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginTop: '0.25rem', letterSpacing: '0.5px' }}>
        {label}
      </span>
    </div>
  )
}

export default function Dashboard({ sysInfo, addToast, refreshHistory, gamingMode, setGamingMode }) {
  const [cleaning, setCleaning] = useState(false)
  const [boosting, setBoosting] = useState(false)
  const [historyData, setHistoryData] = useState([])

  // Keep history for live charts
  useEffect(() => {
    if (sysInfo) {
      setHistoryData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          cpu: sysInfo.cpuPercent || 0,
          ram: sysInfo.memPercentage || 0,
        }]
        if (newData.length > 25) newData.shift()
        return newData
      })
    }
  }, [sysInfo])

  if (!sysInfo) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <span>Initialisation du Cockpit...</span>
      </div>
    )
  }

  const handleClean = async () => {
    playClickSound()
    setCleaning(true)
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.cleanAll()
        if (!res.success) throw new Error(res.message)
      }
      playSuccessSound()
      addToast('success', 'Nettoyage Rapide', 'Cache système et mémoire purgés avec succès !')
      if (refreshHistory) refreshHistory()
    } catch (e) {
      addToast('error', 'Erreur système', e.message)
    } finally {
      setCleaning(false)
    }
  }

  const handleGaming = async () => {
    playClickSound()
    setBoosting(true)
    try {
      if (window.electronAPI) {
        if (gamingMode) {
          await window.electronAPI.gamingModeOff()
          setGamingMode(false)
          addToast('success', 'Mode Gaming', 'Overdrive désactivé')
        } else {
          playOverdriveSound()
          await window.electronAPI.gamingModeOn()
          setGamingMode(true)
          addToast('success', 'Overdrive Activé', 'Ressources maximales allouées.')
        }
      }
      if (refreshHistory) refreshHistory()
    } catch (e) {
      addToast('error', 'Échec Overdrive', e.message)
    } finally {
      setBoosting(false)
    }
  }

  return (
    <div className="dashboard-container">
      {/* Cockpit Top Bar */}
      <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 className="cyber-title">Cockpit Télémétrique</h2>
          <p className="cyber-subtitle">Surveillance matérielle en temps réel et contrôle des ressources</p>
        </div>

        {/* Global Performance Readiness Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--stroke-base)',
          padding: '0.4rem 1rem',
          borderRadius: '8px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: gamingMode ? 'var(--neon-purple)' : 'var(--neon-emerald)', boxShadow: `0 0 8px ${gamingMode ? 'var(--neon-purple)' : 'var(--neon-emerald)'}` }} />
          <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.5px', color: '#fff' }}>
            {gamingMode ? 'MODE OVERDRIVE ENGAGÉ' : 'SYSTÈME STABLE & FLUIDE'}
          </span>
        </div>
      </div>

      <div className="content-body">
        {/* Dials HUD Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
          background: 'var(--bg-card)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid var(--stroke-base)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
        }}>
          <CircularGauge value={sysInfo.cpuPercent ?? 0} label="CHARGE CPU" color="var(--neon-purple)" sublabel={`${sysInfo.cpuTemp ? sysInfo.cpuTemp + '°C' : 'Normal'}`} />
          <CircularGauge value={sysInfo.memPercentage ?? 0} label="ALLOCATION RAM" color="var(--neon-cyan)" sublabel={`${sysInfo.usedMem} Go / ${sysInfo.totalMem} Go`} />
          <CircularGauge value={parseInt(sysInfo.disk?.percentage?.replace('%', '') || 40)} label="DISQUE SYSTÈME" color="var(--neon-emerald)" sublabel={`${sysInfo.disk?.used} / ${sysInfo.disk?.total}`} />
          <CircularGauge value={gamingMode ? 100 : 75} label="INDICE ESPORT" color="var(--neon-gold)" sublabel={gamingMode ? '0.5ms Timer' : '1.0ms Timer'} />
        </div>

        {/* Live Real-time Chart Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {/* CPU Waveform */}
          <div className="action-panel cyber-card" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--neon-purple)' }}>⚡</span>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Onde d'Activité CPU</strong>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--neon-purple)' }}>{sysInfo.cpuPercent}%</span>
            </div>
            <div style={{ height: '110px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <YAxis domain={[0, 100]} hide />
                  <Area type="monotone" dataKey="cpu" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#cpuGrad)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RAM Waveform */}
          <div className="action-panel cyber-card" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--neon-cyan)' }}>🧠</span>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Flux Mémoire Vive (RAM)</strong>
              </div>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--neon-cyan)' }}>{sysInfo.usedMem} Go</span>
            </div>
            <div style={{ height: '110px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData}>
                  <defs>
                    <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <YAxis domain={[0, 100]} hide />
                  <Area type="monotone" dataKey="ram" stroke="#00f0ff" strokeWidth={2.5} fill="url(#ramGrad)" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tactical 1-Click Quick Controls & System Identity */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1.25rem' }}>
          {/* Identity Rig */}
          <div className="action-panel cyber-card" style={{ margin: 0, padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🖥️</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{sysInfo.hostname}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{sysInfo.kernel}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Processeur :</span>
                <strong style={{ color: '#fff' }}>{sysInfo.cpuModel ? sysInfo.cpuModel.split(' ')[0] + ' ' + (sysInfo.cpuModel.split(' ')[1] || '') : 'AMD/Intel'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Temps Allumé (Uptime) :</span>
                <strong style={{ color: '#fff' }}>{formatUptime(sysInfo.uptime)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Mémoire Pagefile :</span>
                <strong style={{ color: '#fff' }}>{sysInfo.swap?.used || '0'} / {sysInfo.swap?.total || '0'} Go</strong>
              </div>
            </div>
          </div>

          {/* Clean Quick CTA */}
          <div className="action-panel cyber-card" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🧹</span>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Purge Rapide</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                Nettoie instantanément la mémoire standby et les fichiers temporaires.
              </p>
            </div>
            <button className="btn btn-cyan btn-glow btn-sm" onClick={handleClean} disabled={cleaning} onMouseEnter={playHoverSound} style={{ width: '100%', marginTop: '0.75rem' }}>
              {cleaning ? 'PURGE EN COURS...' : '⚡ PURGER LA RAM'}
            </button>
          </div>

          {/* Overdrive Quick CTA */}
          <div className="action-panel cyber-card" style={{ margin: 0, padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>Bascule Overdrive</strong>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                Active la priorité maximale eSport et le planificateur d'énergie.
              </p>
            </div>
            <button className={`btn ${gamingMode ? 'btn-danger' : 'btn-purple'} btn-glow btn-sm`} onClick={handleGaming} disabled={boosting} onMouseEnter={playHoverSound} style={{ width: '100%', marginTop: '0.75rem' }}>
              {boosting ? 'APPLICATION...' : gamingMode ? '⏹️ COUPER OVERDRIVE' : '🚀 LANCER OVERDRIVE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
