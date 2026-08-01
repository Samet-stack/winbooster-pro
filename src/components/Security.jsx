import { useState } from 'react'
import { playHoverSound, playClickSound, playSuccessSound, playWarningSound } from '../utils/audio'

export default function Security({ addToast }) {
  const [loading, setLoading] = useState(false)
  const [panicArmed, setPanicArmed] = useState(false)

  const handleCreateRestorePoint = async () => {
    playClickSound()
    setLoading(true)
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.createRestorePoint()
        if (!res.success) throw new Error(res.message)
      }
      playSuccessSound()
      addToast('success', 'Bouclier Système', 'Point de restauration Windows créé avec succès !')
    } catch (e) {
      addToast('error', 'Erreur Bouclier', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePanicReset = async () => {
    if (!panicArmed) {
      playWarningSound()
      setPanicArmed(true)
      addToast('warning', 'Protocole Armé', 'Cliquez une deuxième fois pour confirmer le Factory Reset immédiat.')
      return
    }

    playWarningSound()
    setLoading(true)
    setPanicArmed(false)
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.factoryReset()
        if (!res.success) throw new Error(res.message)
      }
      playSuccessSound()
      addToast('success', 'Restauration Complète', 'Toutes les valeurs système ont été réinitialisées par défaut.')
    } catch (e) {
      addToast('error', 'Erreur Panic', e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDisableFilterKeys = async () => {
    playClickSound()
    setLoading(true)
    try {
      if (window.electronAPI) {
        const res = await window.electronAPI.disableFilterKeys()
        if (res && !res.success && res.message) throw new Error(res.message)
      }
      playSuccessSound()
      addToast('success', 'Touches Filtres Neutralisées', 'FilterKeys, StickyKeys et ToggleKeys sont 100% désactivés dans Windows !')
    } catch (e) {
      addToast('error', 'Erreur Clavier', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="content-header" style={{ marginBottom: '1.5rem' }}>
        <h2 className="cyber-title">Filet de Sécurité & Protocole d'Urgence</h2>
        <p className="cyber-subtitle">Gestion des points de restauration, neutralisation des filtres et réinitialisation usine</p>
      </div>

      <div className="content-body">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          
          {/* Left Card: Preventive Shield */}
          <div className="action-panel cyber-card" style={{ margin: 0, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="panel-icon cyan">🔒</div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Point de Restauration</h3>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(6,182,212,0.15)', color: 'var(--neon-cyan)', border: '1px solid rgba(6,182,212,0.3)' }}>
                  PRÉVENTION
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                Crée un instantané complet du registre et de la configuration Windows avant d'appliquer des réglages extrêmes.
              </p>

              <ul className="panel-details" style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                <li>Sauvegarde de la ruche du Registre (HKLM / HKCU)</li>
                <li>Protection native VSS (Volume Shadow Copy)</li>
                <li>Permet un retour en arrière garanti sans perte de données</li>
              </ul>
            </div>

            <button
              className="btn btn-cyan btn-glow"
              style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem', fontWeight: '600' }}
              onClick={handleCreateRestorePoint}
              disabled={loading}
              onMouseEnter={playHoverSound}
            >
              {loading ? 'CRÉATION EN COURS...' : '⚡ CRÉER UN POINT DE RESTAURATION'}
            </button>
          </div>

          {/* Right Card: Panic Room Factory Reset */}
          <div 
            className="action-panel cyber-card" 
            style={{ 
              margin: 0, 
              padding: '1.5rem', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              borderColor: panicArmed ? 'var(--neon-crimson)' : 'rgba(239,68,68,0.3)',
              boxShadow: panicArmed ? '0 0 20px var(--neon-crimson-glow)' : 'none'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="panel-icon crimson" style={{ borderColor: 'var(--neon-crimson)', color: 'var(--neon-crimson)' }}>🚨</div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--neon-crimson)' }}>Panic Room (Reset Usine)</h3>
                </div>
                <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: 'var(--neon-crimson)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  URGENCE
                </span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1.25rem' }}>
                Restaure instantanément tous les paramètres du noyau, réseau et CPU modifiés par WinBooster à leurs valeurs par défaut de Microsoft.
              </p>

              <ul className="panel-details" style={{ marginBottom: '1.5rem', fontSize: '0.8rem' }}>
                <li>Réseau : TCP Chimney, Window Scaling, Modération d'Interrupts</li>
                <li>Système : NDU, MMCSS, System Responsiveness 20%</li>
                <li>CPU : Rétablissement du schéma d'alimentation standard</li>
              </ul>
            </div>

            <button
              className={`btn ${panicArmed ? 'btn-danger' : 'btn-outline'} btn-glow`}
              style={{ 
                width: '100%', 
                padding: '0.6rem', 
                fontSize: '0.85rem', 
                fontWeight: '700',
                borderColor: panicArmed ? 'var(--neon-crimson)' : 'rgba(239,68,68,0.5)',
                color: panicArmed ? '#fff' : 'var(--neon-crimson)'
              }}
              onClick={handlePanicReset}
              disabled={loading}
              onMouseEnter={playHoverSound}
            >
              {loading ? 'RESTAURATION EN COURS...' : panicArmed ? '⚠️ CONFIRMER LE RESET USINE' : '🚨 ARMER LE FACTORY RESET'}
            </button>
          </div>
        </div>

        {/* Dedicated Accessibility Filter Keys Purge Card */}
        <div className="action-panel cyber-card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#fff' }}>Désactiver les Touches Filtres Windows (FilterKeys / StickyKeys)</strong>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Force la désactivation totale des filtres d'accessibilité de Windows (Keyboard Response Flags = 2) pour un comportement 100% natif.
                </p>
              </div>
            </div>
            <button 
              className="btn btn-emerald btn-glow btn-sm"
              onClick={handleDisableFilterKeys}
              disabled={loading}
              onMouseEnter={playHoverSound}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', fontWeight: '700' }}
            >
              ⚡ DÉSACTIVER LES TOUCHES FILTRES
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
