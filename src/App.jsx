import { useEffect, useState } from 'react'
import CnaeSelector from './components/CnaeSelector'
import CitySelector from './components/CitySelector'
import EmptyState from './components/EmptyState'
import ErrorMessage from './components/ErrorMessage'
import SkeletonTable from './components/SkeletonTable'
import ResultsTable from './components/ResultsTable'
import UfSelector from './components/UfSelector'
import { loadCnae, loadUfIndex, NotPublishedError } from './lib/dataset'
import { UFS } from './lib/ufs'
import siteConfig from '../site.config.mjs'

const ufNome = (sigla) => UFS.find((uf) => uf.sigla === sigla)?.nome || sigla

function App() {
  const [uf, setUf] = useState(null)
  const [cnaeList, setCnaeList] = useState([])
  const [cnaeListError, setCnaeListError] = useState(null)
  const [cityList, setCityList] = useState([])
  const [selected, setSelected] = useState([])
  const [cityFilter, setCityFilter] = useState(null)
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCnaeList([])
    setCityList([])
    setCityFilter(null)
    setCnaeListError(null)
    setResults(null)
    setError(null)
    if (!uf) return

    let ignore = false
    loadUfIndex(uf)
      .then(({ cnaes, municipios }) => {
        if (ignore) return
        setCnaeList(cnaes)
        setCityList(municipios)
      })
      .catch((loadError) => {
        if (ignore) return
        setCnaeListError(
          loadError instanceof NotPublishedError
            ? `Os dados de ${ufNome(uf)} ainda não foram publicados.`
            : 'Não foi possível carregar a lista de CNAEs. Atualize a página.'
        )
      })
    return () => {
      ignore = true
    }
  }, [uf])

  async function handleSearch() {
    if (!uf) {
      setError('Escolha o estado (UF) para buscar.')
      return
    }
    if (selected.length === 0) {
      setError('Escolha ao menos um CNAE para buscar.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const responses = await Promise.all(selected.map((item) => loadCnae(uf, item.codigo, cityList)))

      const merged = new Map()
      for (const list of responses) {
        for (const empresa of list) {
          merged.set(empresa.c, empresa)
        }
      }

      let combined = [...merged.values()]
      if (cityFilter) {
        combined = combined.filter((empresa) => empresa.m === cityFilter)
      }
      combined.sort((a, b) => a.r.localeCompare(b.r, 'pt-BR'))

      setResults(combined)
    } catch {
      setResults(null)
      setError('Não foi possível buscar os dados desses CNAEs. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900">{siteConfig.siteName}</h1>
          <p className="mt-2 text-slate-500">{siteConfig.subtitle}</p>
        </header>

        <div className="flex flex-col gap-3">
          <UfSelector selected={uf} onChange={setUf} />
          <CnaeSelector cnaeList={cnaeList} selected={selected} onChange={setSelected} />
          <CitySelector
            cityList={cityList}
            selected={cityFilter}
            onChange={setCityFilter}
            ufNome={uf ? ufNome(uf) : null}
          />

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-slate-900 text-white font-medium shadow-sm hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Buscando...' : 'Buscar empresas'}
            </button>
          </div>

          {cnaeListError && <ErrorMessage message={cnaeListError} />}
          {error && <ErrorMessage message={error} />}
        </div>

        {loading && <SkeletonTable />}

        {!loading && results === null && <EmptyState />}

        {!loading && results !== null && <ResultsTable results={results} uf={uf} />}
      </div>
    </div>
  )
}

export default App
