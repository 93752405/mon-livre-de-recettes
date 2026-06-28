import { Link, useLocation } from 'react-router-dom'
import { BookOpen, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Layout({ children }) {
  const { isAdmin, logout } = useApp()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Recettes' },
    ...(isAdmin ? [{ to: '/ajouter', label: 'Ajouter' }] : []),
  ]

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        borderBottom: '1px solid var(--color-stone)',
        backgroundColor: 'white',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
              <BookOpen size={20} style={{ color: 'var(--color-bark)' }} />
              <span style={{
                fontFamily: 'Georgia, serif',
                fontSize: '1.125rem',
                color: 'var(--color-ink)',
                letterSpacing: '-0.02em'
              }}>
                Mon livre de recettes
              </span>
            </Link>

            <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
              {navLinks.map(l => (
                <Link key={l.to} to={l.to} style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.875rem',
                  color: location.pathname === l.to ? 'var(--color-earth)' : 'var(--color-bark)',
                  textDecoration: 'none',
                  borderBottom: location.pathname === l.to ? '1px solid var(--color-bark)' : '1px solid transparent',
                  paddingBottom: '1px',
                  transition: 'color 0.2s'
                }}>
                  {l.label}
                </Link>
              ))}
              {isAdmin && (
                <span style={{
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.7rem',
                  color: 'var(--color-sage)',
                  border: '1px solid var(--color-sage)',
                  borderRadius: '999px',
                  padding: '0.1rem 0.5rem',
                  letterSpacing: '0.05em'
                }}>admin</span>
              )}
              <button onClick={logout} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--color-stone)', display: 'flex', alignItems: 'center', gap: '0.25rem',
                fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', padding: '0.25rem'
              }}>
                <LogOut size={14} />
              </button>
            </nav>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-nav-btn"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', padding: '0.25rem' }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div style={{
            borderTop: '1px solid var(--color-warm)',
            backgroundColor: 'white',
            padding: '1rem 1.5rem'
          }} className="mobile-nav">
            {navLinks.map(l => (
              <Link key={l.to} to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block',
                  padding: '0.625rem 0',
                  fontFamily: 'system-ui, sans-serif',
                  fontSize: '0.9rem',
                  color: 'var(--color-ink)',
                  textDecoration: 'none',
                  borderBottom: '1px solid var(--color-warm)'
                }}>
                {l.label}
              </Link>
            ))}
            <button onClick={() => { logout(); setMenuOpen(false) }} style={{
              marginTop: '0.75rem',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--color-stone)', fontFamily: 'system-ui, sans-serif',
              fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0
            }}>
              <LogOut size={14} /> Déconnexion
            </button>
          </div>
        )}
      </header>

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '2rem 1.5rem' }}>
        {children}
      </main>

      <footer style={{
        borderTop: '1px solid var(--color-warm)',
        padding: '1.5rem',
        textAlign: 'center',
        fontFamily: 'system-ui, sans-serif',
        fontSize: '0.75rem',
        color: 'var(--color-stone)'
      }}>
        Mon livre de recettes · {new Date().getFullYear()}
      </footer>

      <style>{`
        @media (min-width: 640px) {
          .desktop-nav { display: flex !important; }
          .mobile-nav-btn { display: none !important; }
          .mobile-nav { display: none !important; }
        }
        @media (max-width: 639px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: block !important; }
        }
      `}</style>
    </div>
  )
}
