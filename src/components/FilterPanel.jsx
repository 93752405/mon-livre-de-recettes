import { X } from 'lucide-react'
import { CATEGORIES, PROTEINS, SEASONS, DIFFICULTIES, STATUSES } from '../utils/recipeHelpers'

export default function FilterPanel({ filters, setFilters, allTags, allRegions, onClose }) {
  function set(key, value) {
    setFilters(f => ({ ...f, [key]: f[key] === value ? '' : value }))
  }

  function toggleTag(tag) {
    setFilters(f => {
      const tags = f.tags || []
      return { ...f, tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag] }
    })
  }

  function clearAll() {
    setFilters({ search: filters.search || '' })
  }

  const activeCount = Object.entries(filters).filter(([k, v]) =>
    k !== 'search' && v && (Array.isArray(v) ? v.length > 0 : true)
  ).length

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid var(--color-warm)',
      borderRadius: '0.5rem',
      padding: '1.25rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-bark)' }}>
          Filtres {activeCount > 0 && `(${activeCount})`}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {activeCount > 0 && (
            <button onClick={clearAll} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--color-stone)',
              textDecoration: 'underline', padding: 0
            }}>Réinitialiser</button>
          )}
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)', padding: '2px' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <FilterGroup label="Catégorie" items={CATEGORIES} active={filters.category} onSelect={v => set('category', v)} />
      <FilterGroup label="Protéine" items={PROTEINS} active={filters.protein} onSelect={v => set('protein', v)} />
      <FilterGroup label="Saison" items={SEASONS} active={filters.season} onSelect={v => set('season', v)} />
      <FilterGroup label="Temps" items={DIFFICULTIES} active={filters.difficulty} onSelect={v => set('difficulty', v)} />
      <FilterGroup label="Statut" items={STATUSES} active={filters.status} onSelect={v => set('status', v)} />

      {allRegions?.length > 0 && (
        <FilterGroup label="Région" items={allRegions} active={filters.region} onSelect={v => set('region', v)} />
      )}

      <div style={{ marginBottom: '0.5rem' }}>
        <label className="label">Étoiles minimum</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" onClick={() => setFilters(f => ({ ...f, rating: f.rating === n ? null : n }))}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                fontSize: '1.1rem', color: n <= (filters.rating || 0) ? 'var(--color-bark)' : 'var(--color-stone)',
                transition: 'color 0.15s'
              }}>★</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={!!filters.favorites}
            onChange={e => setFilters(f => ({ ...f, favorites: e.target.checked }))}
            style={{ accentColor: 'var(--color-earth)' }} />
          Favoris seulement
        </label>
      </div>

      {allTags?.length > 0 && (
        <div>
          <label className="label" style={{ marginBottom: '0.5rem' }}>Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
            {allTags.map(tag => (
              <button key={tag} type="button" className={`tag ${(filters.tags || []).includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}>
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FilterGroup({ label, items, active, onSelect }) {
  return (
    <div style={{ marginBottom: '0.875rem' }}>
      <label className="label">{label}</label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {items.map(item => (
          <button key={item} type="button" className={`tag ${active === item ? 'active' : ''}`}
            onClick={() => onSelect(item)}>
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}
