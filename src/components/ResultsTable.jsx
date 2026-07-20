import { useMemo, useState } from 'react'
import { DownloadIcon } from './icons'
import { formatCNPJDigits, formatDateBR } from '../lib/format'

const PAGE_SIZE = 25

function toCsv(rows) {
  const header = ['CNPJ', 'Razão Social', 'Nome Fantasia', 'Município', 'Data de Abertura']
  const lines = rows.map((row) =>
    [formatCNPJDigits(row.c), row.r, row.n || '', row.m || '', formatDateBR(row.d)]
      .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
      .join(';')
  )
  return [header.join(';'), ...lines].join('\n')
}

function downloadCsv(rows) {
  const csv = '﻿' + toCsv(rows)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `empresas-goias-${Date.now()}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function ResultsTable({ results }) {
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems = useMemo(
    () => results.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [results, page]
  )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-100">
        <p className="text-sm text-slate-500">
          <span className="font-medium text-slate-800">{results.length}</span> empresa
          {results.length === 1 ? '' : 's'} ativa{results.length === 1 ? '' : 's'} encontrada
          {results.length === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={() => downloadCsv(results)}
          disabled={results.length === 0}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <DownloadIcon className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="px-6 py-3 font-medium">CNPJ</th>
              <th className="px-6 py-3 font-medium">Razão social</th>
              <th className="px-6 py-3 font-medium">Município</th>
              <th className="px-6 py-3 font-medium">Abertura</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((row) => (
              <tr key={row.c} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                <td className="px-6 py-3 font-mono text-slate-600 whitespace-nowrap">
                  {formatCNPJDigits(row.c)}
                </td>
                <td className="px-6 py-3">
                  <p className="text-slate-800">{row.r}</p>
                  {row.n && <p className="text-xs text-slate-400">{row.n}</p>}
                </td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{row.m || '—'}</td>
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{formatDateBR(row.d)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {results.length > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
