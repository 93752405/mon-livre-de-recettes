export function generateId(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

export function emptyRecipe() {
  const now = new Date().toISOString()
  return {
    id: '',
    title: '',
    description: '',
    image: { cover: '' },
    meta: {
      category: '',
      protein: '',
      season: '',
      region: '',
      status: 'à essayer',
      rating: null,
      time: { prep_minutes: 0, cook_minutes: 0, total_minutes: 0, difficulty: 'standard' },
      servings: 4,
      source: { type: '', name: '', url: '' }
    },
    tags: [],
    ingredients: [],
    instructions: [],
    notes: [],
    created_at: now,
    updated_at: now
  }
}

export const CATEGORIES = [
  'déjeuner', 'entrée', 'soupe', 'salade', 'souper',
  'collation', 'dessert', 'accompagnement', 'boisson'
]

export const PROTEINS = [
  'poulet', 'boeuf', 'porc', 'poisson', 'fruits de mer',
  'végétarien', 'végétalien', 'oeufs', 'tofu'
]

export const SEASONS = ['printemps', 'été', 'automne', 'hiver', 'toutes saisons']

export const DIFFICULTIES = ['rapide', 'standard', 'long', 'meal prep']

export const STATUSES = ['à essayer', 'testée', 'approuvée', 'favorite']

export const SOURCE_TYPES = ['site web', 'Instagram', 'livre', 'famille', 'autre']

export const STATUS_COLORS = {
  'à essayer': 'bg-blue-50 text-blue-700 border-blue-200',
  'testée': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'approuvée': 'bg-green-50 text-green-700 border-green-200',
  'favorite': 'bg-red-50 text-red-700 border-red-200',
}

export function filterRecipes(recipes, filters) {
  return recipes.filter(r => {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const inTitle = r.title.toLowerCase().includes(q)
      const inDesc = r.description?.toLowerCase().includes(q)
      const inIngredients = r.ingredients?.some(i =>
        (typeof i === 'string' ? i : i.name || '').toLowerCase().includes(q)
      )
      const inTags = r.tags?.some(t => t.toLowerCase().includes(q))
      if (!inTitle && !inDesc && !inIngredients && !inTags) return false
    }
    if (filters.category && r.meta?.category !== filters.category) return false
    if (filters.protein && r.meta?.protein !== filters.protein) return false
    if (filters.season && r.meta?.season !== filters.season) return false
    if (filters.region && !r.meta?.region?.toLowerCase().includes(filters.region.toLowerCase())) return false
    if (filters.status && r.meta?.status !== filters.status) return false
    if (filters.difficulty && r.meta?.time?.difficulty !== filters.difficulty) return false
    if (filters.rating && (r.meta?.rating || 0) < filters.rating) return false
    if (filters.favorites && r.meta?.status !== 'favorite') return false
    if (filters.tags && filters.tags.length > 0) {
      if (!filters.tags.every(t => r.tags?.includes(t))) return false
    }
    return true
  })
}

export function getAllTags(recipes) {
  const set = new Set()
  recipes.forEach(r => r.tags?.forEach(t => set.add(t)))
  return Array.from(set).sort()
}

export function getAllRegions(recipes) {
  const set = new Set()
  recipes.forEach(r => { if (r.meta?.region) set.add(r.meta.region) })
  return Array.from(set).sort()
}

export function formatTime(minutes) {
  if (!minutes) return '—'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m.toString().padStart(2, '0')}` : `${h}h`
}

export function Stars({ rating, onChange }) {
  return null
}
