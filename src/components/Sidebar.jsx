import { playHoverSound, playClickSound } from '../utils/audio'

const navItems = [
  { section: 'MONITORING' },
  { id: 'dashboard', icon: '📊', label: 'Tableau de bord' },
  { id: 'processes', icon: '⚙️', label: 'Processus' },
  { section: 'OPTIMISATION' },
  { id: 'gaming', icon: '🎮', label: 'Mode Gaming & Profils', hasBadge: true },
  { id: 'tweaks', icon: '🔧', label: 'eSport Overdrive' },
  { id: 'network', icon: '🌐', label: 'Réseau' },
  { section: 'MAINTENANCE' },
  { id: 'cleanup', icon: '🧹', label: 'Nettoyage' },
  { id: 'services', icon: '🚀', label: 'Services' },
  { id: 'debloat', icon: '💥', label: 'Debloat Profond' },
  { section: 'SYSTÈME' },
  { id: 'security', icon: '🛡️', label: 'Sécurité & Backup' },
  { id: 'settings', icon: '⚙️', label: 'Paramètres' },
]

export default function Sidebar({ currentPage, setCurrentPage, gamingMode }) {
  const handleNavClick = (id) => {
    playClickSound()
    setCurrentPage(id)
  }

  return (
    <aside className="sidebar animate-in" style={{ animationDelay: '0.1s' }}>
      <div className="sidebar-brand">
        <div className="brand-icon">⚡</div>
        <div className="logo-text">
          <h1>Win</h1>
          <span>Booster</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, index) => {
          if (item.section) {
            return <div key={index} className="nav-section-title">{item.section}</div>
          }
          return (
            <div
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              onMouseEnter={playHoverSound}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.hasBadge && gamingMode && (
                <span className="nav-badge">OVERDRIVE</span>
              )}
            </div>
          )
        })}
      </nav>
      <div className="sidebar-footer">
        <p className="sys-version">WinBooster v3.5 · eSport Pro Edition</p>
      </div>
    </aside>
  )
}
