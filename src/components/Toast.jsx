import { useEffect } from 'react'

export default function Toast({ toasts, removeToast }) {
  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map(toast =>
      setTimeout(() => removeToast(toast.id), 5000)
    )
    return () => timers.forEach(t => clearTimeout(t))
  }, [toasts, removeToast])

  const getIcon = (type) => {
    if (type === 'success') return '✅'
    if (type === 'error') return '❌'
    if (type === 'warning') return '⚠️'
    return 'ℹ️'
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <span className="toast-icon">{getIcon(toast.type)}</span>
          <div className="toast-body">
            <div className="toast-title">{toast.title}</div>
            <div className="toast-message">{toast.message}</div>
          </div>
          <button className="toast-close" onClick={() => removeToast(toast.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
