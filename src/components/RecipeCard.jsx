import { Link } from 'react-router-dom'
import { Clock, Users } from 'lucide-react'
import StarRating from './StarRating'
import { formatTime, STATUS_COLORS } from '../utils/recipeHelpers'

export default function RecipeCard({ recipe }) {
  const { id, title, description, image, meta, tags } = recipe
  const totalTime = meta?.time?.total_minutes
  const status = meta?.status

  return (
    <Link to={`/recette/${id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image */}
        <div style={{
          height: '200px',
          backgroundColor: 'var(--color-warm)',
          overflow: 'hidden',
          flexShrink: 0,
          position: 'relative'
        }}>
          {image?.cover ? (
            <img src={image.cover} alt={title} style={{
              width: '100%', height: '100%', objectFit: 'cover'
            }} />
          ) : (
            <div style={{
              width: '100%', height: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '2.5rem',
              color: 'var(--color-stone)'
            }}>
              🍽
            </div>
          )}
          {status && (
            <span style={{
              position: 'absolute', top: '0.5rem', right: '0.5rem',
              fontSize: '0.65rem', fontFamily: 'system-ui, sans-serif',
              padding: '0.15rem 0.5rem', borderRadius: '999px',
              border: '1px solid',
            }} className={STATUS_COLORS[status] || ''}>
              {status}
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div>
            <h3 style={{
              fontFamily: 'Georgia, serif',
              fontSize: '1rem',
              color: 'var(--color-ink)',
              marginBottom: '0.25rem',
              lineHeight: 1.3
            }}>{title}</h3>
            {description && (
              <p style={{
                fontFamily: 'system-ui, sans-serif',
                fontSize: '0.8rem',
                color: 'var(--color-bark)',
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>{description}</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: 'auto' }}>
            {totalTime > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--color-stone)'
              }}>
                <Clock size={12} /> {formatTime(totalTime)}
              </span>
            )}
            {meta?.servings > 0 && (
              <span style={{
                display: 'flex', alignItems: 'center', gap: '0.25rem',
                fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--color-stone)'
              }}>
                <Users size={12} /> {meta.servings}
              </span>
            )}
            {meta?.rating && <StarRating rating={meta.rating} size={12} />}
          </div>

          {tags && tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
              {tags.slice(0, 4).map(t => (
                <span key={t} className="tag" style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', cursor: 'default' }}>
                  {t}
                </span>
              ))}
              {tags.length > 4 && (
                <span style={{
                  fontSize: '0.65rem', fontFamily: 'system-ui, sans-serif', color: 'var(--color-stone)'
                }}>+{tags.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
