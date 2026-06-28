import { useState } from 'react'
import { BookOpen, Lock } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function LoginPage() {
  const { login } = useApp()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = login(password)
    if (!result) {
      setError('Mot de passe incorrect.')
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-sand)',
      padding: '1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ marginBottom: '2rem' }}>
          <BookOpen size={36} style={{ color: 'var(--color-bark)', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
            Mon livre de recettes
          </h1>
          <p style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: '0.875rem',
            color: 'var(--color-stone)'
          }}>
            Espace privé de famille
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '2rem',
          border: '1px solid var(--color-warm)',
          boxShadow: '0 4px 24px rgba(44, 36, 22, 0.06)'
        }}>
          <div style={{ marginBottom: '1.25rem', textAlign: 'left' }}>
            <label className="label" htmlFor="password">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <Lock size={11} /> Mot de passe
              </span>
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Entrer le mot de passe"
              autoFocus
            />
          </div>

          {error && (
            <p style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: '0.8rem',
              color: '#b91c1c',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>{error}</p>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
            {loading ? 'Vérification…' : 'Entrer'}
          </button>
        </form>

        <p style={{
          marginTop: '1.5rem',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '0.75rem',
          color: 'var(--color-stone)',
          fontStyle: 'italic'
        }}>
          Pour obtenir l'accès, contactez la famille 🍽
        </p>
      </div>
    </div>
  )
}
