import { useState } from 'react'

export default function Debloat({ addToast, refreshHistory }) {
  const [loading, setLoading] = useState({})

  const handleDebloat = async (id, actionFn, successMsg) => {
    setLoading(prev => ({ ...prev, [id]: true }))
    try {
      if (window.electronAPI) {
        const res = await actionFn()
        if (!res.success) throw new Error(res.message)
      }
      addToast('success', 'Debloat Profond', successMsg)
      if (refreshHistory) refreshHistory()
    } catch (e) {
      addToast('error', 'Erreur', 'Échec de l\'opération : ' + e.message)
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }))
    }
  }

  return (
    <>
      <div className="content-header">
        <h2 style={{ color: 'var(--danger)' }}>Zone de Danger : Debloat Profond</h2>
        <p>Supprime les applications natives inutiles de Windows. Attention : Irréversible.</p>
      </div>
      <div className="content-body">
        
        <div className="panels-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {/* OneDrive */}
          <div className="action-panel animate-in" style={{ borderColor: 'var(--danger-border)' }}>
            <div className="panel-header">
              <div className="panel-icon danger">☁️</div>
              <span className="panel-title">Tuer OneDrive</span>
            </div>
            <p className="panel-desc">
              Arrête le processus et modifie le registre pour désactiver la synchronisation automatique de fichiers.
            </p>
            <button
              className="btn btn-danger"
              onClick={() => handleDebloat('onedrive', () => window.electronAPI.debloatOnedrive(), 'OneDrive désactivé et stoppé !')}
              disabled={loading.onedrive}
            >
              {loading.onedrive ? <div className="spinner"></div> : '💥 Désactiver OneDrive'}
            </button>
          </div>

          {/* Cortana */}
          <div className="action-panel animate-in" style={{ borderColor: 'var(--danger-border)' }}>
            <div className="panel-header">
              <div className="panel-icon danger">🎙️</div>
              <span className="panel-title">Tuer Cortana</span>
            </div>
            <p className="panel-desc">
              Désactive totalement l'assistant Cortana et la recherche Cloud depuis la racine du registre.
            </p>
            <button
              className="btn btn-danger"
              onClick={() => handleDebloat('cortana', () => window.electronAPI.debloatCortana(), 'Cortana désactivé !')}
              disabled={loading.cortana}
            >
              {loading.cortana ? <div className="spinner"></div> : '💥 Désactiver Cortana'}
            </button>
          </div>

          {/* UWP Bloat */}
          <div className="action-panel animate-in" style={{ borderColor: 'var(--danger-border)' }}>
            <div className="panel-header">
              <div className="panel-icon danger">🗑️</div>
              <span className="panel-title">Purger les UWP</span>
            </div>
            <p className="panel-desc">
              Supprime les applis pré-installées inutiles (Skype, Bing, Solitaire, ZuneVideo, 3DBuilder).
            </p>
            <button
              className="btn btn-danger"
              onClick={() => handleDebloat('uwp', () => window.electronAPI.debloatUwp(), 'UWP Bloatwares supprimés !')}
              disabled={loading.uwp}
            >
              {loading.uwp ? <div className="spinner"></div> : '💥 Purger le Bloatware'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
