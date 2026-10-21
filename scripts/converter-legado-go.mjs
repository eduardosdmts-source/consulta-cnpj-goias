// Converte os dados de Goiás no formato antigo (data/cnae/<codigo>.json com
// objetos { c, r, n, m, d }) para o formato por UF, para o site continuar
// funcionando em Goiás antes de rodar o gerador nacional.
//
// Uso:
//   git worktree add ../gh-pages gh-pages
//   node scripts/converter-legado-go.mjs --origem ../gh-pages/restrito/data [--saida public/data]
import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'
import { printSizeReport, writeUfDataset } from './lib/dataset.mjs'

const { values: args } = parseArgs({
  options: {
    origem: { type: 'string' },
    saida: { type: 'string', default: 'public/data' },
  },
})

if (!args.origem) {
  console.error('Informe a pasta com cnaes-go.json, municipios-go.json e cnae/: --origem DIR')
  process.exit(1)
}

const origem = resolve(args.origem)
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'))

const cnaeDescricoes = new Map(readJson(join(origem, 'cnaes-go.json')).map((item) => [item.codigo, item.descricao]))
const municipios = readJson(join(origem, 'municipios-go.json'))
const municipioIndex = new Map(municipios.map((nome, i) => [nome, i]))

// Município que não estiver na lista antiga entra no fim dela.
function municipioIdx(nome) {
  if (!municipioIndex.has(nome)) municipioIndex.set(nome, municipios.push(nome) - 1)
  return municipioIndex.get(nome)
}

const buckets = new Map()
for (const file of readdirSync(join(origem, 'cnae'))) {
  if (!file.endsWith('.json')) continue
  const rows = readJson(join(origem, 'cnae', file)).map((e) => [e.c, e.r, e.n || '', municipioIdx(e.m || ''), e.d || ''])
  buckets.set(file.replace(/\.json$/, ''), rows)
}

const outDir = resolve(args.saida)
const total = writeUfDataset(outDir, 'GO', { buckets, cnaeDescricoes, municipios })
console.log(`GO: ${total} CNAEs convertidos`)
printSizeReport(outDir)
