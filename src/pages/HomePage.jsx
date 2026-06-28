import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Plus, Upload, RefreshCw, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import RecipeCard from '../components/RecipeCard'
import FilterPanel from '../components/FilterPanel'
import { filterRecipes, getAllTags, getAllRegions } from '../utils/recipeHelpers'
import Layout from '../components/Layout'

export default function HomePage() {
  const { recipes, loading, error, isAdmin, loadRecipes } = useApp()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({})
  const [showFilters, setShowFilters] = useState(false)

  const allTags = useMemo(() => getAllTags(recipes), [recipes])
  const allRegions = useMemo(() => getAllRegions(recipes), [recipes])

  const allFilters = { ...filters, search }
  const filtered = useMemo(() => filterRecipes(recipes, allFilters), [recipes, allFilters])

  const activeFilterCount = Object.entries(filters).filter(([k, v]) =>
    v && (Array.isArray(v) ? v.length > 0 : true)
  ).length

  return (
    <Layout>
      <div className="fade-in">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-ink)', marginBottom: '0.25rem' }}>
            Mes recettes
          </h1>
          <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-stone)' }}>
            {recipes.length} recette{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search + actions bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={15} style={{
              position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--color-stone)', pointerEvents: 'none'
            }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Rechercher une recette, ingrédient…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)', padding: 0
              }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters || activeFilterCount > 0 ? 'btn-primary' : 'btn-secondary'}
              type="button"
            >
              <SlidersHorizontal size={15} />
              Filtres
              {activeFilterCount > 0 && ` (${activeFilterCount})`}
            </button>

            <button onClick={loadRecipes} className="btn-secondary" type="button" title="Actualiser">
              <RefreshCw size={15} />
            </button>

            {isAdmin && (
              <>
                <Link to="/ajouter" className="btn-primary">
                  <Plus size={15} /> Ajouter
                </Link>
                <Link to="/importer" className="btn-secondary">
                  <Upload size={15} /> Importer JSON
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div style={{ marginBottom: '1.5rem' }}>
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              allTags={allTags}
              allRegions={allRegions}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-stone)', fontFamily: 'system-ui, sans-serif' }}>
            Chargement des recettes…
          </div>
        ) : error ? (
          <div style={{
            textAlign: 'center', padding: '3rem 1.5rem',
            backgroundColor: 'white', borderRadius: '0.5rem',
            border: '1px solid #fca5a5'
          }}>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.9rem', color: '#b91c1c', marginBottom: '1rem' }}>
              Erreur de chargement : {error}
            </p>
            <button onClick={loadRecipes} className="btn-secondary">Réessayer</button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🍽</div>
            <p style={{ fontFamily: 'system-ui, sans-serif', color: 'var(--color-stone)', marginBottom: '0.5rem' }}>
              {recipes.length === 0 ? 'Aucune recette pour l\'instant.' : 'Aucune recette ne correspond à ces filtres.'}
            </p>
            {isAdmin && recipes.length === 0 && (
              <Link to="/ajouter" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
                <Plus size={15} /> Ajouter ma première recette
              </Link>
            )}
            {(search || activeFilterCount > 0) && (
              <button onClick={() => { setSearch(''); setFilters({}) }} className="btn-secondary" style={{ marginTop: '1rem' }}>
                Effacer les filtres
              </button>
            )}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem'
          }}>
            {filtered.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
