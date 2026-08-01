import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('WinBooster ErrorBoundary caught error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#06080d',
          color: '#ffffff',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>⚡</div>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #00f0ff, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 1rem 0'
          }}>
            WinBooster Pro Auto-Recovery
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '500px', fontSize: '0.95rem', lineHeight: '1.5', margin: '0 0 1.5rem 0' }}>
            Un composant a rencontré une anomalie d'affichage. Le système a sécurisé l'interface pour éviter tout crash système.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 1.75rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #00f0ff, #0077ff)',
              color: '#000',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              transition: 'transform 0.2s'
            }}
          >
            🔄 Relancer l'interface
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
