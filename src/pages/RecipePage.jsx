import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Clock, Users, Edit, Trash2, ExternalLink, Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import StarRating from '../components/StarRating'
import Layout from '../components/Layout'
import { formatTime, STATUS_COLORS } from '../utils/recipeHelpers'

export default function RecipePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, isAdmin, deleteRecipe, saveRecipe } = useApp()
  const recipe = recipes.find(r => r.id === id)

  if (!recipe) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--color-stone)', marginBottom: '1rem' }}>
            Recette introuvable.
          </p>
          <Link to="/" className="btn-secondary">← Retour</Link>
        </div>
      </Layout>
    )
  }

  const { title, description, image, meta, tags, ingredients, instructions, notes } = recipe
  const isFav = meta?.status === 'favorite'

  async function handleDelete() {
    if (confirm(`Supprimer « ${title} » ?`)) {
      await deleteRecipe(id)
      navigate('/')
    }
  }

  async function toggleFavorite() {
    const updated = {
      ...recipe,
      meta: { ...recipe.meta, status: isFav ? 'approuvée' : 'favorite' },
      updated_at: new Date().toISOString()
    }
    await saveRecipe(updated)
  }

  return (
    <Layout>
      <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
          fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem',
          color: 'var(--color-stone)', textDecoration: 'none', marginBottom: '1.5rem'
        }}>
          <ArrowLeft size={14} /> Toutes les recettes
        </Link>

        {image?.cover && (
          <div style={{
            height: '320px', borderRadius: '0.5rem', overflow: 'hidden',
            marginBottom: '2rem', backgroundColor: 'var(--color-warm)'
          }}>
            <img src={image.cover} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-ink)', lineHeight: 1.2 }}>{title}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button onClick={toggleFavorite} title={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '0.375rem',
              color: isFav ? '#dc2626' : 'var(--color-stone)',
              fontSize: '1.1rem', transition: 'color 0.2s'
            }}>
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            {isAdmin && (
              <>
                <Link to={`/modifier/${id}`} className="btn-secondary" style={{ padding: '0.4rem 0.75rem' }}>
                  <Edit size={14} />
                </Link>
                <button onClick={handleDelete} className="btn-danger" style={{ padding: '0.4rem 0.75rem' }}>
                  <Trash2 size={14} />
                </button>
              </>
            )}
          </div>
        </div>

        {description && (
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1rem', color: 'var(--color-bark)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {description}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          {meta?.time?.total_minutes > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-bark)' }}>
              <Clock size={15} style={{ color: 'var(--color-stone)' }} />
              {formatTime(meta.time.total_minutes)}
            </span>
          )}
          {meta?.servings > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-bark)' }}>
              <Users size={15} style={{ color: 'var(--color-stone)' }} />
              {meta.servings} portions
            </span>
          )}
          {meta?.status && (
            <span className={STATUS_COLORS[meta.status] || ''} style={{
              fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem',
              padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid'
            }}>
              {meta.status}
            </span>
          )}
          {meta?.rating && <StarRating rating={meta.rating} />}
          {meta?.region && (
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--color-stone)', fontStyle: 'italic' }}>
              {meta.region}
            </span>
          )}
        </div>

        {(meta?.time?.prep_minutes > 0 || meta?.time?.cook_minutes > 0) && (
          <div style={{
            display: 'flex', gap: '1.5rem', padding: '1rem 1.25rem',
            backgroundColor: 'var(--color-warm)', borderRadius: '0.375rem',
            marginBottom: '1.5rem', flexWrap: 'wrap'
          }}>
            {meta.time.prep_minutes > 0 && (
              <div>
                <div className="label">Préparation</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'var(--color-ink)' }}>
                  {formatTime(meta.time.prep_minutes)}
                </div>
              </div>
            )}
            {meta.time.cook_minutes > 0 && (
              <div>
                <div className="label">Cuisson</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'var(--color-ink)' }}>
                  {formatTime(meta.time.cook_minutes)}
                </div>
              </div>
            )}
            {meta.time.total_minutes > 0 && (
              <div>
                <div className="label">Total</div>
                <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.1rem', color: 'var(--color-ink)' }}>
                  {formatTime(meta.time.total_minutes)}
                </div>
              </div>
            )}
          </div>
        )}

        {tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '2rem' }}>
            {tags.map(t => (
              <span key={t} className="tag" style={{ cursor: 'default' }}>{t}</span>
            ))}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.6fr)', gap: '2.5rem' }} className="recipe-grid">
          {ingredients?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-ink)' }}>Ingrédients</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {ingredients.map((ing, i) => {
                  const text = typeof ing === 'string' ? ing : `${ing.quantity || ''} ${ing.unit || ''} ${ing.name || ''}`.trim()
                  return (
                    <li key={i} style={{
                      fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem',
                      color: 'var(--color-ink)', padding: '0.5rem 0',
                      borderBottom: '1px solid var(--color-warm)',
                      display: 'flex', alignItems: 'baseline', gap: '0.5rem'
                    }}>
                      <span style={{ color: 'var(--color-stone)', fontSize: '0.7rem', flexShrink: 0 }}>◆</span>
                      {text}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {instructions?.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-ink)' }}>Préparation</h2>
              <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {instructions.map((step, i) => {
                  const text = typeof step === 'string' ? step : step.text || step.step || ''
                  return (
                    <li key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                      <span style={{
                        flexShrink: 0, width: '1.75rem', height: '1.75rem',
                        borderRadius: '50%', backgroundColor: 'var(--color-warm)',
                        border: '1px solid var(--color-stone)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem',
                        color: 'var(--color-earth)', fontWeight: 600, marginTop: '1px'
                      }}>{i + 1}</span>
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: 'var(--color-ink)', lineHeight: 1.6, margin: 0 }}>
                        {text}
                      </p>
                    </li>
                  )
                })}
              </ol>
            </div>
          )}
        </div>

        {notes?.length > 0 && (
          <div style={{
            marginTop: '2rem', padding: '1.25rem',
            backgroundColor: 'var(--color-warm)', borderRadius: '0.375rem',
            borderLeft: '3px solid var(--color-bark)'
          }}>
            <h3 style={{ fontSize: '0.875rem', marginBottom: '0.75rem', color: 'var(--color-bark)' }}>Notes</h3>
            {notes.map((note, i) => {
              const text = typeof note === 'string' ? note : note.text || ''
              return <p key={i} style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-ink)', lineHeight: 1.6, marginBottom: i < notes.length - 1 ? '0.5rem' : 0 }}>{text}</p>
            })}
          </div>
        )}

        {meta?.source?.name && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-warm)' }}>
            <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--color-stone)' }}>
              Source : {meta.source.type && `${meta.source.type} · `}{meta.source.name}
              {meta.source.url && (
                <a href={meta.source.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-bark)', marginLeft: '0.5rem' }}>
                  <ExternalLink size={12} style={{ display: 'inline' }} />
                </a>
              )}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .recipe-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </Layout>
  )
}
