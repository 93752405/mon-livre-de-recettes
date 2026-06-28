export default function StarRating({ rating, onChange, size = 18 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange && onChange(rating === n ? null : n)}
          style={{
            background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default',
            padding: '1px', fontSize: `${size}px`, lineHeight: 1,
            color: n <= (rating || 0) ? 'var(--color-bark)' : 'var(--color-stone)',
            transition: 'color 0.15s'
          }}
        >
          ★
        </button>
      ))}
    </div>
  )
}
