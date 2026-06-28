import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Plus, Minus, Upload, Loader2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Layout from '../components/Layout'
import StarRating from '../components/StarRating'
import { githubService } from '../utils/github'
import {
  emptyRecipe, generateId,
  CATEGORIES, PROTEINS, SEASONS, DIFFICULTIES, STATUSES, SOURCE_TYPES
} from '../utils/recipeHelpers'

export default function RecipeFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, saveRecipe } = useApp()
  const isEdit = Boolean(id)

  const [recipe, setRecipe] = useState(emptyRecipe())
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [ingInput, setIngInput] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const [stepInput, setStepInput] = useState('')

  useEffect(() => {
    if (isEdit) {
      const found = recipes.find(r => r.id === id)
      if (found) {
        setRecipe(found)
        // Convert arrays to string inputs for display
      }
    }
  }, [id, recipes])

  function setMeta(key, value) {
    setRecipe(r => ({ ...r, meta: { ...r.meta, [key]: value } }))
  }

  function setTime(key, value) {
    setRecipe(r => ({
      ...r,
      meta: { ...r.meta, time: { ...r.meta.time, [key]: Number(value) } }
    }))
  }

  function setSource(key, value) {
    setRecipe(r => ({
      ...r,
      meta: { ...r.meta, source: { ...r.meta.source, [key]: value } }
    }))
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !recipe.tags.includes(t) && recipe.tags.length < 10) {
      setRecipe(r => ({ ...r, tags: [...r.tags, t] }))
      setTagInput('')
    }
  }

  function removeTag(tag) {
    setRecipe(r => ({ ...r, tags: r.tags.filter(t => t !== tag) }))
  }

  function addIngredient() {
    const t = ingInput.trim()
    if (t) {
      setRecipe(r => ({ ...r, ingredients: [...r.ingredients, t] }))
      setIngInput('')
    }
  }

  function removeIngredient(i) {
    setRecipe(r => ({ ...r, ingredients: r.ingredients.filter((_, idx) => idx !== i) }))
  }

  function addStep() {
    const t = stepInput.trim()
    if (t) {
      setRecipe(r => ({ ...r, instructions: [...r.instructions, t] }))
      setStepInput('')
    }
  }

  function removeStep(i) {
    setRecipe(r => ({ ...r, instructions: r.instructions.filter((_, idx) => idx !== i) }))
  }

  function addNote() {
    const t = noteInput.trim()
    if (t) {
      setRecipe(r => ({ ...r, notes: [...r.notes, t] }))
      setNoteInput('')
    }
  }

  function removeNote(i) {
    setRecipe(r => ({ ...r, notes: r.notes.filter((_, idx) => idx !== i) }))
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const recipeId = recipe.id || generateId(recipe.title || 'photo')
      const url = await githubService.uploadImage(file, recipeId)
      setRecipe(r => ({ ...r, image: { cover: url } }))
    } catch (e) {
      setError('Erreur lors du téléchargement de la photo : ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!recipe.title.trim()) { setError('Le titre est obligatoire.'); return }
    setSaving(true)
    setError('')
    try {
      const now = new Date().toISOString()
      const recipeId = recipe.id || generateId(recipe.title)
      const totalMinutes = (recipe.meta.time.prep_minutes || 0) + (recipe.meta.time.cook_minutes || 0)
      const toSave = {
        ...recipe,
        id: recipeId,
        meta: {
          ...recipe.meta,
          time: {
            ...recipe.meta.time,
            total_minutes: recipe.meta.time.total_minutes || totalMinutes
          }
        },
        updated_at: now,
        created_at: recipe.created_at || now
      }
      await saveRecipe(toSave)
      navigate(`/recette/${recipeId}`)
    } catch (e) {
      setError('Erreur lors de la sauvegarde : ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const Section = ({ title, children }) => (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1rem', color: 'var(--color-bark)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-warm)' }}>
        {title}
      </h2>
      {children}
    </div>
  )

  const Field = ({ label, required, children }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label className="label">{label}{required && ' *'}</label>
      {children}
    </div>
  )

  const Row = ({ children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
      {children}
    </div>
  )

  return (
    <Layout>
      <div className="fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to={isEdit ? `/recette/${id}` : '/'} style={{ color: 'var(--color-stone)', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif' }}>
            ← Retour
          </Link>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--color-ink)' }}>
            {isEdit ? 'Modifier la recette' : 'Nouvelle recette'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid var(--color-warm)', padding: '1.75rem' }}>

            <Section title="Informations générales">
              <Field label="Titre" required>
                <input className="input-field" value={recipe.title}
                  onChange={e => setRecipe(r => ({
                    ...r, title: e.target.value,
                    id: isEdit ? r.id : generateId(e.target.value)
                  }))}
                  placeholder="Nom de la recette" />
              </Field>

              <Field label="Description">
                <textarea className="input-field" rows={2} value={recipe.description}
                  onChange={e => setRecipe(r => ({ ...r, description: e.target.value }))}
                  placeholder="Brève description…" style={{ resize: 'vertical' }} />
              </Field>

              <Field label="Photo de couverture">
                {recipe.image?.cover && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <img src={recipe.image.cover} alt="" style={{
                      width: '100%', maxHeight: '200px', objectFit: 'cover',
                      borderRadius: '0.25rem', border: '1px solid var(--color-warm)'
                    }} />
                  </div>
                )}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                    <Upload size={15} />
                    {uploading ? 'Téléchargement…' : 'Choisir une photo'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageUpload} style={{ display: 'none' }} />
                  </label>
                  <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.75rem', color: 'var(--color-stone)' }}>ou</span>
                  <input className="input-field" style={{ flex: 1 }} value={recipe.image?.cover || ''}
                    onChange={e => setRecipe(r => ({ ...r, image: { cover: e.target.value } }))}
                    placeholder="URL de l'image…" />
                </div>
              </Field>
            </Section>

            <Section title="Classification">
              <Row>
                <div>
                  <label className="label">Catégorie *</label>
                  <select className="input-field" value={recipe.meta.category} onChange={e => setMeta('category', e.target.value)}>
                    <option value="">—</option>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Protéine *</label>
                  <select className="input-field" value={recipe.meta.protein} onChange={e => setMeta('protein', e.target.value)}>
                    <option value="">—</option>
                    {PROTEINS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Saison</label>
                  <select className="input-field" value={recipe.meta.season} onChange={e => setMeta('season', e.target.value)}>
                    <option value="">—</option>
                    {SEASONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Région du monde</label>
                  <input className="input-field" value={recipe.meta.region || ''} onChange={e => setMeta('region', e.target.value)} placeholder="ex: méditerranéen" />
                </div>
              </Row>

              <Row>
                <div>
                  <label className="label">Statut</label>
                  <select className="input-field" value={recipe.meta.status} onChange={e => setMeta('status', e.target.value)}>
                    {STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Portions</label>
                  <input className="input-field" type="number" min={1} value={recipe.meta.servings || ''} onChange={e => setMeta('servings', Number(e.target.value))} placeholder="4" />
                </div>
              </Row>

              <div style={{ marginBottom: '1rem' }}>
                <label className="label">Évaluation</label>
                <StarRating rating={recipe.meta.rating} onChange={v => setMeta('rating', v)} size={22} />
              </div>
            </Section>

            <Section title="Temps">
              <Row>
                <div>
                  <label className="label">Préparation (min)</label>
                  <input className="input-field" type="number" min={0} value={recipe.meta.time.prep_minutes || ''} onChange={e => setTime('prep_minutes', e.target.value)} placeholder="15" />
                </div>
                <div>
                  <label className="label">Cuisson (min)</label>
                  <input className="input-field" type="number" min={0} value={recipe.meta.time.cook_minutes || ''} onChange={e => setTime('cook_minutes', e.target.value)} placeholder="30" />
                </div>
                <div>
                  <label className="label">Difficulté</label>
                  <select className="input-field" value={recipe.meta.time.difficulty} onChange={e => setTime('difficulty', e.target.value)}>
                    {DIFFICULTIES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </Row>
            </Section>

            <Section title="Tags (max 10)">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.75rem' }}>
                {recipe.tags.map(t => (
                  <button key={t} type="button" onClick={() => removeTag(t)} className="tag active" style={{ gap: '0.375rem' }}>
                    {t} <span style={{ fontSize: '0.8rem' }}>×</span>
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="input-field" style={{ flex: 1 }} value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                  placeholder="Ajouter un tag…"
                  disabled={recipe.tags.length >= 10} />
                <button type="button" onClick={addTag} className="btn-secondary" style={{ padding: '0.625rem 0.875rem' }}>
                  <Plus size={15} />
                </button>
              </div>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: 'var(--color-stone)', marginTop: '0.375rem' }}>
                {recipe.tags.length}/10 tags
              </p>
            </Section>

            <Section title="Ingrédients">
              <div style={{ marginBottom: '0.75rem' }}>
                {recipe.ingredients.map((ing, i) => {
                  const text = typeof ing === 'string' ? ing : `${ing.quantity || ''} ${ing.unit || ''} ${ing.name || ''}`.trim()
                  return (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.4rem 0', borderBottom: '1px solid var(--color-warm)' }}>
                      <span style={{ flex: 1, fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-ink)' }}>{text}</span>
                      <button type="button" onClick={() => removeIngredient(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)', padding: '2px' }}>
                        <Minus size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="input-field" style={{ flex: 1 }} value={ingInput}
                  onChange={e => setIngInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addIngredient() } }}
                  placeholder="ex: 2 tasses de farine" />
                <button type="button" onClick={addIngredient} className="btn-secondary" style={{ padding: '0.625rem 0.875rem' }}>
                  <Plus size={15} />
                </button>
              </div>
            </Section>

            <Section title="Préparation">
              <div style={{ marginBottom: '0.75rem' }}>
                {recipe.instructions.map((step, i) => {
                  const text = typeof step === 'string' ? step : step.text || ''
                  return (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.5rem 0', borderBottom: '1px solid var(--color-warm)' }}>
                      <span style={{
                        flexShrink: 0, width: '1.5rem', height: '1.5rem', borderRadius: '50%',
                        backgroundColor: 'var(--color-warm)', border: '1px solid var(--color-stone)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', color: 'var(--color-earth)', fontWeight: 600, marginTop: '2px'
                      }}>{i + 1}</span>
                      <span style={{ flex: 1, fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-ink)', lineHeight: 1.5 }}>{text}</span>
                      <button type="button" onClick={() => removeStep(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)', padding: '2px', flexShrink: 0 }}>
                        <Minus size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <textarea className="input-field" style={{ flex: 1, resize: 'vertical' }} rows={2}
                  value={stepInput} onChange={e => setStepInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); addStep() } }}
                  placeholder="Décrivez l'étape… (Ctrl+Entrée pour ajouter)" />
                <button type="button" onClick={addStep} className="btn-secondary" style={{ padding: '0.625rem 0.875rem', alignSelf: 'flex-start' }}>
                  <Plus size={15} />
                </button>
              </div>
            </Section>

            <Section title="Notes personnelles">
              <div style={{ marginBottom: '0.75rem' }}>
                {recipe.notes.map((note, i) => {
                  const text = typeof note === 'string' ? note : note.text || ''
                  return (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', padding: '0.4rem 0', borderBottom: '1px solid var(--color-warm)' }}>
                      <span style={{ flex: 1, fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-ink)', lineHeight: 1.5 }}>{text}</span>
                      <button type="button" onClick={() => removeNote(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-stone)', padding: '2px', flexShrink: 0 }}>
                        <Minus size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input className="input-field" style={{ flex: 1 }} value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNote() } }}
                  placeholder="Ajouter une note…" />
                <button type="button" onClick={addNote} className="btn-secondary" style={{ padding: '0.625rem 0.875rem' }}>
                  <Plus size={15} />
                </button>
              </div>
            </Section>

            <Section title="Source">
              <Row>
                <div>
                  <label className="label">Type</label>
                  <select className="input-field" value={recipe.meta.source?.type || ''} onChange={e => setSource('type', e.target.value)}>
                    <option value="">—</option>
                    {SOURCE_TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Nom</label>
                  <input className="input-field" value={recipe.meta.source?.name || ''} onChange={e => setSource('name', e.target.value)} placeholder="ex: Cuisine et Santé" />
                </div>
              </Row>
              <Field label="URL">
                <input className="input-field" type="url" value={recipe.meta.source?.url || ''} onChange={e => setSource('url', e.target.value)} placeholder="https://…" />
              </Field>
            </Section>
          </div>

          {error && (
            <div style={{ padding: '0.875rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.375rem', marginTop: '1rem' }}>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <Link to={isEdit ? `/recette/${id}` : '/'} className="btn-secondary">Annuler</Link>
            <button type="submit" className="btn-primary" disabled={saving || uploading}>
              {saving ? <><Loader2 size={15} className="spin" /> Sauvegarde…</> : isEdit ? 'Enregistrer' : 'Créer la recette'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </Layout>
  )
}
