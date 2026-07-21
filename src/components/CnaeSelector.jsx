import { useMemo, useState } from 'react'
import { SearchIcon, XIcon } from './icons'
import { formatCnaeCode } from '../lib/format'

function normalize(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

export default function CnaeSelector({ cnaeList, selected, onChange }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const selectedCodes = useMemo(() => new Set(selected.map((item) => item.codigo)), [selected])

  const matches = useMemo(() => {
    const term = normalize(query)
    if (term.length < 2) return []
    return cnaeList
      .filter((item) => !selectedCodes.has(item.codigo))
      .filter((item) => normalize(item.descricao).includes(term) || item.codigo.includes(term))
      .slice(0, 30)
  }, [cnaeList, query, selectedCodes])

  function handlePick(item) {
    onChange([...selected, item])
    setQuery('')
    setOpen(false)
  }

  function handleRemove(codigo) {
    onChange(selected.filter((item) => item.codigo !== codigo))
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Busque e adicione um ou mais CNAEs (ex: farmácia)"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
        />

        {open && matches.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-lg py-2">
            {matches.map((item) => (
              <li key={item.codigo}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handlePick(item)}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 transition flex items-start gap-3"
                >
                  <span className="shrink-0 font-mono text-xs text-slate-400 mt-0.5">
                    {formatCnaeCode(item.codigo)}
                  </span>
                  <span className="text-sm text-slate-700">{item.descricao}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {open && query.trim().length >= 2 && matches.length === 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-2xl border border-slate-200 bg-white shadow-lg px-4 py-3 text-sm text-slate-400">
            Nenhum CNAE encontrado para "{query}".
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selected.map((item) => (
            <span
              key={item.codigo}
              className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full bg-slate-900 text-white text-xs"
            >
              <span className="font-mono text-slate-300">{formatCnaeCode(item.codigo)}</span>
              <span className="max-w-[220px] truncate">{item.descricao}</span>
              <button
                type="button"
                onClick={() => handleRemove(item.codigo)}
                className="hover:bg-white/20 rounded-full p-0.5 transition"
                aria-label={`Remover ${item.descricao}`}
              >
                <XIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
