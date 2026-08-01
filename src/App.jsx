import { useState, useEffect, useCallback, useMemo } from 'react'
import './App.css'
import CyberCanvas from './components/CyberCanvas'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Processes from './components/Processes'
import GamingMode from './components/GamingMode'
import Tweaks from './components/Tweaks'
import Network from './components/Network'
import Cleanup from './components/Cleanup'
import Services from './components/Services'
import Debloat from './components/Debloat'
import Security from './components/Security'
import Settings from './components/Settings'
import Toast from './components/Toast'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sysInfo, setSysInfo] = useState(null)
  const [gamingMode, setGamingMode] = useState(false)
  const [toasts, setToasts] = useState([])
  const [history, setHistory] = useState(null)
  const [platformInfo, setPlatformInfo] = useState(null)

  // Toast system
  const addToast = useCallback((type, title, message) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, title, message }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // Fetch platform info once
  useEffect(() => {
    const fetchPlatform = async () => {
      try {
        if (window.electronAPI?.getPlatformInfo) {
          const res = await window.electronAPI.getPlatformInfo()
          if (res.success && res.data) {
            setPlatformInfo(res.data)
            if (res.data.isWindows && !res.data.isAdmin) {
              addToast('error', 'Droits Administrateur', 'Relancez WinBooster en mode Administrateur pour appliquer les optimisations.')
            }
          } else {
            setPlatformInfo({ isWSL: true, isNativeLinux: false, platform: 'wsl-dev' })
          }
        } else {
          setPlatformInfo({ isWSL: true, isNativeLinux: false, platform: 'wsl-dev' })
        }
      } catch { setPlatformInfo({ isWSL: false, isNativeLinux: false, platform: 'unknown' }) }
    }
    fetchPlatform()
  }, [addToast])

  // Fetch history
  const refreshHistory = useCallback(async () => {
    try {
      if (window.electronAPI?.getHistory) {
        const res = await window.electronAPI.getHistory()
        if (res.success && res.data) {
          setHistory(res.data)
        }
      } else {
        setHistory({
          totalCleanups: 0,
          totalGamingActivations: 0,
          totalTweaks: 0,
          lastCleanup: null,
          estimatedSpaceSaved: '0 Mo',
        })
      }
    } catch {}
  }, [])

  useEffect(() => { refreshHistory() }, [refreshHistory])

  // System info polling with stable interval
  useEffect(() => {
    let mounted = true
    const fetchSysInfo = async () => {
      try {
        if (window.electronAPI) {
          const res = await window.electronAPI.getSysInfo()
          if (res.success && mounted) setSysInfo(res.data)
        } else {
          // Mock data for dev
          if (mounted) setSysInfo({
            cpuModel: 'AMD Ryzen 9 7950X3D 16-Core Processor',
            cores: 32,
            cpuPercent: Math.floor(Math.random() * 25 + 8),
            cpuTemp: Math.floor(Math.random() * 8 + 42),
            governor: gamingMode ? 'performance' : 'schedutil',
            totalMem: '32.0',
            usedMem: (9.4 + Math.random() * 2).toFixed(1),
            freeMem: '22.6',
            memPercentage: Math.floor(Math.random() * 10 + 30),
            disk: { total: '2.0 TB', used: '720 GB', free: '1.28 TB', percentage: '36%' },
            swap: { total: '16.0', used: '0.1', percentage: 1 },
            swappiness: gamingMode ? 10 : 60,
            uptime: 345600 + Math.floor(Date.now() / 1000) % 86400,
            kernel: 'Windows 11 23H2 (Kernel 10.0.22631)',
            hostname: 'TITAN-RIG-ESPORT',
            platform: 'win32',
            arch: 'x64',
          })
        }
      } catch (err) {
        console.error('Failed to fetch sys info:', err)
      }
    }

    fetchSysInfo()
    const interval = setInterval(fetchSysInfo, 2000)
    return () => { mounted = false; clearInterval(interval) }
  }, [gamingMode])

  // Memoize page rendering
  const pageContent = useMemo(() => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard sysInfo={sysInfo} addToast={addToast} history={history} refreshHistory={refreshHistory} gamingMode={gamingMode} setGamingMode={setGamingMode} />
      case 'processes':
        return <Processes addToast={addToast} />
      case 'gaming':
        return <GamingMode gamingMode={gamingMode} setGamingMode={setGamingMode} sysInfo={sysInfo} addToast={addToast} refreshHistory={refreshHistory} />
      case 'tweaks':
        return <Tweaks addToast={addToast} refreshHistory={refreshHistory} />
      case 'network':
        return <Network addToast={addToast} refreshHistory={refreshHistory} />
      case 'cleanup':
        return <Cleanup addToast={addToast} refreshHistory={refreshHistory} />
      case 'services':
        return <Services addToast={addToast} />
      case 'debloat':
        return <Debloat addToast={addToast} refreshHistory={refreshHistory} />
      case 'security':
        return <Security addToast={addToast} />
      case 'settings':
        return <Settings addToast={addToast} platformInfo={platformInfo} history={history} />
      default:
        return <Dashboard sysInfo={sysInfo} addToast={addToast} history={history} refreshHistory={refreshHistory} gamingMode={gamingMode} setGamingMode={setGamingMode} />
    }
  }, [currentPage, sysInfo, gamingMode, addToast, history, refreshHistory, platformInfo])

  return (
    <div className="app-layout">
      {/* 60FPS Ambient Cyber Canvas Background */}
      <CyberCanvas />

      {/* Cyberpunk Cockpit Custom Titlebar */}
      <div 
        className="titlebar" 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '36px', 
          WebkitAppRegion: 'drag', 
          zIndex: 999, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 1rem 0 1.25rem', 
          background: 'rgba(3, 5, 10, 0.75)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--neon-cyan)', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px', textShadow: '0 0 10px var(--neon-cyan)' }}>
            ⚡ WINBOOSTER // PRO HUD
          </span>
          <span style={{ fontSize: '0.65rem', padding: '1px 6px', borderRadius: '3px', background: 'rgba(16,185,129,0.15)', color: 'var(--neon-emerald)', border: '1px solid rgba(16,185,129,0.3)', fontFamily: 'var(--font-mono)' }}>
            KERNEL ENGINE READY
          </span>
        </div>

        <div className="window-controls" style={{ WebkitAppRegion: 'no-drag', display: 'flex', gap: '6px' }}>
          <button className="win-btn minimize" onClick={() => window.electronAPI?.windowMinimize()}>-</button>
          <button className="win-btn maximize" onClick={() => window.electronAPI?.windowMaximize()}>□</button>
          <button className="win-btn close" onClick={() => window.electronAPI?.windowClose()}>✕</button>
        </div>
      </div>

      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} gamingMode={gamingMode} />
      <main className="main-content" style={{ position: 'relative', zIndex: 1, marginTop: '36px' }}>
        {pageContent}
      </main>
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  )
}

export default App
