import { useState } from 'react'

export default function Network({ addToast, refreshHistory }) {
  const [loading, setLoading] = useState(false)
  const [pinging, setPinging] = useState(false)
  const [pingResult, setPingResult] = useState(null)

  const handlePing = async () => {
    setPinging(true)
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.testPing()
        if (res.success) {
          setPingResult(res.data)
        } else {
          throw new Error(res.message)
        }
      }
    } catch {
      addToast('error', 'Ping', 'Impossible de joindre le serveur.')
      setPingResult('Err')
    } finally {
      setPinging(false)
    }
  }

  const enableBbr = async () => {
    setLoading(true)
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.enableBbr()
        if (!res.success) throw new Error(res.message)
      }
      addToast('success', 'Réseau', 'Optimisation TCP BBR activée')
      if (refreshHistory) refreshHistory()
    } catch (e) {
      addToast('error', 'Erreur', 'Échec de l\'optimisation réseau : ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: '📡',
      title: 'Désactiver Heuristics',
      desc: "Empêche Windows de restreindre le trafic réseau automatiquement (Window Scaling).",
    },
    {
      icon: '⚖️',
      title: 'TCP AutoTuning',
      desc: 'Règle le AutoTuning sur "Normal" pour maximiser la bande passante sur la fibre.',
    },
    {
      icon: '⚡',
      title: 'Désactiver Nagle',
      desc: 'Réduit le ping (latence) en envoyant les paquets sans attendre qu\'ils soient pleins.',
    },
    {
      icon: '📦',
      title: 'Network Throttling',
      desc: "Désactive la limitation réseau de Windows pour prioriser vos jeux à 100%.",
    },
    {
      icon: '🔄',
      title: 'Reset Winsock',
      desc: "Réinitialise l'adaptateur réseau pour corriger les bugs de connexion persistants.",
    },
  ]

  return (
    <>
      <div className="content-header">
        <h2>Optimisation Réseau Windows</h2>
        <p>Améliorez votre latence et vos débits pour le gaming en ligne</p>
      </div>
      <div className="content-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Hero action */}
          <div className="network-hero" style={{ margin: 0 }}>
            <span className="big-icon">🌐</span>
            <h3>Optimisations TCP / Réseau</h3>
            <p>
              Désactive le Network Throttling, l'algorithme de Nagle, 
              et règle finement le TCP AutoTuning.
            </p>
            <button className="btn btn-cyan" onClick={enableBbr} disabled={loading}>
              {loading ? <div className="spinner"></div> : '🚀 Appliquer l\'optimisation'}
            </button>
          </div>

          {/* Ping Monitor */}
          <div className="network-hero ping-tester" style={{ margin: 0, borderColor: pingResult ? 'var(--success)' : 'var(--border-default)' }}>
            <span className="big-icon" style={{ animation: pinging ? 'pulse-border 1s infinite' : 'none' }}>📡</span>
            <h3>Ping Live (8.8.8.8)</h3>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-emerald)', margin: '1rem 0' }}>
              {pingResult ? `${pingResult} ms` : '-- ms'}
            </div>
            <button className="btn btn-outline" onClick={handlePing} disabled={pinging}>
              {pinging ? <div className="spinner"></div> : '⚡ Tester la latence'}
            </button>
          </div>
        </div>

        {/* Features grid */}
        <div className="features-grid">
          {features.map(f => (
            <div className="feature-card animate-in" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
