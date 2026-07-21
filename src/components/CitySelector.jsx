import { useMemo, useState } from 'react'
import { MapPinIcon, XIcon } from './icons'

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export default function CitySelector({ cityList, selected, onChange }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const matches = useMemo(() => {
    const term = normalize(query)
    if (term.length < 1) return cityList.slice(0, 30)
    return cityList.filter((city) => normalize(city).includes(term)).slice(0, 30)
  }, [cityList, query])

  function handlePick(city) {
    onChange(city)
    setQuery('')
    setOpen(false)
  }

  if (selected) {
    return (
      <div className="w-full max-w-2xl mx-auto flex justify-center">
        <span className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-slate-900 text-white text-xs">
          <MapPinIcon className="w-3.5 h-3.5" />
          {selected}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="hover:bg-white/20 rounded-full p-0.5 transition"
            aria-label={`Remover filtro de cidade ${selected}`}
          >
            <XIcon className="w-3 h-3" />
          </button>
        </span>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Filtrar por cidade em Goiás (opcional)"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
        />

        {open && matches.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg py-2">
            {matches.map((city) => (
              <li key={city}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handlePick(city)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 transition text-sm text-slate-700"
                >
                  {city}
                </button>
              </li>
            ))}
          </ul>
        )}

        {open && query.trim().length >= 1 && matches.length === 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg px-4 py-3 text-sm text-slate-400">
            Nenhuma cidade encontrada para "{query}".
          </div>
        )}
      </div>
    </div>
  )
}
