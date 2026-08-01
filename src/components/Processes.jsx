import { useState, useEffect } from 'react'

export default function Processes({ addToast }) {
  const [processes, setProcesses] = useState([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('mem')
  const [refreshing, setRefreshing] = useState(false)

  const fetchProcesses = async () => {
    setRefreshing(true)
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.getProcesses()
        if (res.success) {
          setProcesses(res.data || [])
        }
      } else {
        setProcesses([
          { pid: '4', name: 'System', cpu: 0.1, mem: 1.2 },
          { pid: '1234', name: 'explorer.exe', cpu: 2.4, mem: 8.5 },
          { pid: '5678', name: 'msedge.exe', cpu: 5.1, mem: 18.4 },
          { pid: '9012', name: 'Discord.exe', cpu: 1.8, mem: 5.2 },
          { pid: '3456', name: 'svchost.exe', cpu: 0.3, mem: 3.0 },
          { pid: '7890', name: 'steam.exe', cpu: 3.2, mem: 6.7 },
          { pid: '4321', name: 'Code.exe', cpu: 4.1, mem: 9.8 },
        ])
      }
    } catch (e) {
      addToast('error', 'Erreur', 'Impossible de récupérer les processus')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchProcesses()
    const interval = setInterval(fetchProcesses, 5000)
    return () => clearInterval(interval)
  }, [])

  const killProcess = async (pid) => {
    try {
      if (window.electronAPI) {
        const result = await window.electronAPI.killProcess(pid)
        if (result.success) {
          addToast('success', 'Processus', result.message)
        } else {
          addToast('error', 'Erreur', result.message)
        }
      } else {
        addToast('success', 'Processus', `Processus ${pid} terminé`)
      }
      fetchProcesses()
    } catch (e) {
      addToast('error', 'Erreur', `Impossible de terminer le processus ${pid}`)
    }
  }

  const filtered = processes
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b[sortBy] - a[sortBy])

  return (
    <>
      <div className="content-header">
        <h2>Gestionnaire de Processus</h2>
        <p>Surveillez et gérez les processus en cours d'exécution</p>
      </div>
      <div className="content-body">
        <div className="process-table-wrapper">
          <div className="process-toolbar">
            <div className="search-box">
              <span>🔍</span>
              <input
                type="text"
                placeholder="Rechercher un processus..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-outline btn-sm" onClick={fetchProcesses} disabled={refreshing}>
              {refreshing ? <div className="spinner"></div> : '🔄 Rafraîchir'}
            </button>
            <button className="btn btn-outline btn-sm" onClick={() => setSortBy(sortBy === 'mem' ? 'cpu' : 'mem')}>
              Trier: {sortBy === 'mem' ? 'RAM ↓' : 'CPU ↓'}
            </button>
          </div>
          <table className="process-table">
            <thead>
              <tr>
                <th>PID</th>
                <th>Nom</th>
                <th onClick={() => setSortBy('cpu')} style={{ cursor: 'pointer' }}>
                  CPU % {sortBy === 'cpu' && '↓'}
                </th>
                <th onClick={() => setSortBy('mem')} style={{ cursor: 'pointer' }}>
                  RAM % {sortBy === 'mem' && '↓'}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.pid}>
                  <td className="pid">{p.pid}</td>
                  <td className="name">{p.name.split('/').pop()}</td>
                  <td>{p.cpu.toFixed(1)}%</td>
                  <td>{p.mem.toFixed(1)}%</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => killProcess(p.pid)}>
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    Aucun processus trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
