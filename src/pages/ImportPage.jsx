import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Upload, FileJson, CheckCircle, AlertCircle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import Layout from '../components/Layout'
import { generateId } from '../utils/recipeHelpers'

export default function ImportPage() {
  const navigate = useNavigate()
  const { saveRecipe } = useApp()
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef()
  const [dragOver, setDragOver] = useState(false)

  function parseFile(file) {
    if (!file || !file.name.endsWith('.json')) {
      setError('Veuillez sélectionner un fichier .json valide.')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        validateAndSetPreview(data)
      } catch {
        setError('Fichier JSON invalide.')
      }
    }
    reader.readAsText(file)
  }

  function validateAndSetPreview(data) {
    setError('')
    if (!data.title) { setError('Le champ "title" est obligatoire.'); return }
    const now = new Date().toISOString()
    const normalized = {
      id: data.id || generateId(data.title),
      title: data.title,
      description: data.description || '',
      image: data.image || { cover: '' },
      meta: {
        category: data.meta?.category || '',
        protein: data.meta?.protein || '',
        season: data.meta?.season || '',
        region: data.meta?.region || '',
        status: data.meta?.status || 'à essayer',
        rating: data.meta?.rating ?? null,
        time: {
          prep_minutes: data.meta?.time?.prep_minutes || 0,
          cook_minutes: data.meta?.time?.cook_minutes || 0,
          total_minutes: data.meta?.time?.total_minutes || 0,
          difficulty: data.meta?.time?.difficulty || 'standard'
        },
        servings: data.meta?.servings || 0,
        source: data.meta?.source || { type: '', name: '', url: '' }
      },
      tags: Array.isArray(data.tags) ? data.tags.slice(0, 10) : [],
      ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
      instructions: Array.isArray(data.instructions) ? data.instructions : [],
      notes: Array.isArray(data.notes) ? data.notes : [],
      created_at: data.created_at || now,
      updated_at: now
    }
    setPreview(normalized)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    parseFile(file)
  }

  async function handleImport() {
    if (!preview) return
    setSaving(true)
    try {
      await saveRecipe(preview)
      setSaved(true)
      setTimeout(() => navigate(`/recette/${preview.id}`), 1200)
    } catch (e) {
      setError('Erreur lors de l\'import : ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Layout>
      <div className="fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--color-stone)', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'system-ui, sans-serif' }}>← Retour</Link>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--color-ink)' }}>Importer une recette JSON</h1>
        </div>

        {!saved ? (
          <>
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? 'var(--color-earth)' : 'var(--color-stone)'}`,
                borderRadius: '0.5rem',
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: dragOver ? 'var(--color-warm)' : 'white',
                transition: 'all 0.2s',
                marginBottom: '1.5rem'
              }}
            >
              <FileJson size={36} style={{ color: 'var(--color-stone)', marginBottom: '1rem' }} />
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.95rem', color: 'var(--color-ink)', marginBottom: '0.5rem' }}>
                Glisser-déposer un fichier JSON ici
              </p>
              <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--color-stone)' }}>
                ou cliquer pour parcourir
              </p>
              <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }}
                onChange={e => parseFile(e.target.files?.[0])} />
            </div>

            {/* JSON direct paste */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="label">Ou coller le JSON directement</label>
              <textarea className="input-field" rows={6} style={{ fontFamily: 'monospace', fontSize: '0.8rem', resize: 'vertical' }}
                placeholder='{ "title": "Ma recette", … }'
                onChange={e => {
                  try {
                    if (e.target.value.trim()) validateAndSetPreview(JSON.parse(e.target.value))
                  } catch {}
                }} />
            </div>

            {error && (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', padding: '0.875rem', backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '0.375rem', marginBottom: '1.5rem' }}>
                <AlertCircle size={16} style={{ color: '#b91c1c', flexShrink: 0 }} />
                <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: '#b91c1c', margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', border: '1px solid var(--color-warm)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--color-ink)', marginBottom: '0.75rem' }}>Aperçu</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1.5rem' }}>
                  {[
                    ['Titre', preview.title],
                    ['Catégorie', preview.meta.category],
                    ['Protéine', preview.meta.protein],
                    ['Saison', preview.meta.season],
                    ['Statut', preview.meta.status],
                    ['Portions', preview.meta.servings],
                    ['Ingrédients', `${preview.ingredients.length} éléments`],
                    ['Étapes', `${preview.instructions.length} étapes`],
                  ].map(([k, v]) => v ? (
                    <div key={k}>
                      <span style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.7rem', color: 'var(--color-stone)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{k}</span>
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-ink)', margin: 0 }}>{String(v)}</p>
                    </div>
                  ) : null)}
                </div>
                {preview.tags.length > 0 && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                    {preview.tags.map(t => <span key={t} className="tag" style={{ cursor: 'default' }}>{t}</span>)}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <Link to="/" className="btn-secondary">Annuler</Link>
              <button onClick={handleImport} className="btn-primary" disabled={!preview || saving}>
                <Upload size={15} />
                {saving ? 'Import en cours…' : 'Importer la recette'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <CheckCircle size={48} style={{ color: 'var(--color-sage)', marginBottom: '1rem' }} />
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '1rem', color: 'var(--color-ink)' }}>
              Recette importée avec succès !
            </p>
            <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.875rem', color: 'var(--color-stone)' }}>
              Redirection…
            </p>
          </div>
        )}

        {/* Format JSON reference */}
        <details style={{ marginTop: '2rem' }}>
          <summary style={{ fontFamily: 'system-ui, sans-serif', fontSize: '0.8rem', color: 'var(--color-bark)', cursor: 'pointer', marginBottom: '0.75rem' }}>
            Voir le format JSON attendu
          </summary>
          <pre style={{
            backgroundColor: 'var(--color-warm)', borderRadius: '0.375rem',
            padding: '1rem', fontSize: '0.75rem', fontFamily: 'monospace',
            color: 'var(--color-ink)', overflow: 'auto', border: '1px solid var(--color-stone)'
          }}>{JSON.stringify({
            id: "slug-recette",
            title: "Nom de la recette",
            description: "",
            image: { cover: "" },
            meta: {
              category: "", protein: "", season: "", status: "à essayer", rating: null,
              time: { prep_minutes: 0, cook_minutes: 0, total_minutes: 0, difficulty: "standard" },
              servings: 4,
              source: { type: "", name: "", url: "" }
            },
            tags: ["protéine", "catégorie", "saison"],
            ingredients: ["2 tasses de farine", "1 oeuf"],
            instructions: ["Mélanger les ingrédients", "Cuire 30 min"],
            notes: [],
            created_at: "", updated_at: ""
          }, null, 2)}</pre>
        </details>
      </div>
    </Layout>
  )
}
