import { ChevronDownIcon, MapPinIcon } from './icons'
import { UFS } from '../lib/ufs'

export default function UfSelector({ selected, onChange }) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <MapPinIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <select
          value={selected || ''}
          onChange={(event) => onChange(event.target.value || null)}
          aria-label="Estado"
          className="w-full appearance-none pl-11 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
        >
          <option value="">Escolha o estado (UF)</option>
          {UFS.map((uf) => (
            <option key={uf.sigla} value={uf.sigla}>
              {uf.nome} ({uf.sigla})
            </option>
          ))}
        </select>
        <ChevronDownIcon className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  )
}
