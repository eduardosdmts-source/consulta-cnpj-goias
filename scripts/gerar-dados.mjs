// Gera o dataset de empresas ativas (exceto MEI) por UF e CNAE a partir dos
// Dados Abertos do CNPJ da Receita Federal.
//
// Uso:
//   node --max-old-space-size=8192 scripts/gerar-dados.mjs --entrada ./receita
//     [--saida public/data] [--ufs SP,RJ] [--atividades todas|principal] [--temp DIR]
//
// --entrada  pasta com os arquivos baixados de
//            https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/
//            (Empresas*.zip, Estabelecimentos*.zip, Simples.zip, Municipios.zip e
//            Cnaes.zip; também aceita os CSVs já extraídos)
// --ufs      UFs a gerar (padrão: todas). Rodar em lotes reduz o uso de memória;
//            cada UF é gravada na própria pasta, então lotes não se sobrescrevem.
// --atividades  "todas" (principal + secundárias, padrão) ou "principal".
import { createReadStream, mkdirSync, appendFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline'
import { parseArgs } from 'node:util'
import yauzl from 'yauzl'
import { UF_SIGLAS } from '../src/lib/ufs.js'
import { printSizeReport, writeUfDataset } from './lib/dataset.mjs'

const { values: args } = parseArgs({
  options: {
    entrada: { type: 'string' },
    saida: { type: 'string', default: 'public/data' },
    ufs: { type: 'string' },
    atividades: { type: 'string', default: 'todas' },
    temp: { type: 'string', default: join(tmpdir(), 'consulta-cnpj-dados') },
  },
})

if (!args.entrada) {
  console.error('Informe a pasta com os arquivos da Receita: --entrada ./receita')
  process.exit(1)
}
if (!['todas', 'principal'].includes(args.atividades)) {
  console.error('--atividades deve ser "todas" ou "principal"')
  process.exit(1)
}

const ufs = args.ufs ? args.ufs.toUpperCase().split(',').map((uf) => uf.trim()) : UF_SIGLAS
const invalid = ufs.filter((uf) => !UF_SIGLAS.includes(uf))
if (invalid.length > 0) {
  console.error('UF inválida:', invalid.join(', '))
  process.exit(1)
}
const ufSet = new Set(ufs)
const outDir = resolve(args.saida)
const tempDir = resolve(args.temp)

// ---------------------------------------------------------------- leitura

const inputFiles = readdirSync(resolve(args.entrada)).map((name) => join(resolve(args.entrada), name))

function filesOf(pattern) {
  const files = inputFiles.filter((file) => pattern.test(file.split(/[\\/]/).pop())).sort()
  if (files.length === 0) throw new Error(`Nenhum arquivo ${pattern} em ${args.entrada}`)
  return files
}

function openZipEntry(file) {
  return new Promise((resolvePromise, reject) => {
    yauzl.open(file, { lazyEntries: true }, (error, zip) => {
      if (error) return reject(error)
      zip.once('entry', (entry) =>
        zip.openReadStream(entry, (streamError, stream) =>
          streamError ? reject(streamError) : resolvePromise(stream)
        )
      )
      zip.once('error', reject)
      zip.readEntry()
    })
  })
}

// Os CSVs da Receita usam ";" como separador, todos os campos entre aspas e
// codificação ISO-8859-1.
function parseLine(line) {
  const fields = []
  let i = 0
  while (i <= line.length) {
    if (line[i] === '"') {
      let value = ''
      let start = i + 1
      for (;;) {
        const quote = line.indexOf('"', start)
        if (quote === -1) {
          value += line.slice(start)
          i = line.length
          break
        }
        value += line.slice(start, quote)
        if (line[quote + 1] === '"') {
          value += '"'
          start = quote + 2
        } else if (quote + 1 === line.length || line[quote + 1] === ';') {
          i = quote + 1
          break
        } else {
          // Aspas soltas no meio do texto aparecem em alguns nomes da base.
          value += '"'
          start = quote + 1
        }
      }
      fields.push(value)
      if (line[i] !== ';') break
      i++
    } else {
      const end = line.indexOf(';', i)
      fields.push(line.slice(i, end === -1 ? line.length : end))
      if (end === -1) break
      i = end + 1
    }
  }
  return fields
}

async function eachRow(pattern, onRow) {
  for (const file of filesOf(pattern)) {
    console.log('  lendo', file)
    const stream = /\.zip$/i.test(file) ? await openZipEntry(file) : createReadStream(file)
    stream.setEncoding('latin1')
    const lines = createInterface({ input: stream, crlfDelay: Infinity })
    for await (const line of lines) {
      if (line) onRow(parseLine(line))
    }
  }
}

// Conjunto de cnpj_basico (8 dígitos) como bitmap: 12,5 MB para 10^8 valores,
// em vez de milhões de strings num Set.
function createBitmap() {
  const bits = new Uint8Array(100_000_000 / 8)
  return {
    add: (n) => (bits[n >> 3] |= 1 << (n & 7)),
    has: (n) => (bits[n >> 3] & (1 << (n & 7))) !== 0,
  }
}

const clean = (text) => (text || '').replace(/[\t\r\n]+/g, ' ').trim()

// ---------------------------------------------------------------- etapas

console.log('1/5 Tabelas de CNAE e municípios')
const cnaeDescricoes = new Map()
await eachRow(/cnae/i, ([codigo, descricao]) => cnaeDescricoes.set(codigo, clean(descricao)))
const municipioNomes = new Map()
await eachRow(/munic/i, ([codigo, nome]) => municipioNomes.set(codigo, clean(nome)))

console.log('2/5 Optantes pelo MEI (Simples)')
const mei = createBitmap()
await eachRow(/simples/i, (fields) => {
  if (fields[4] === 'S') mei.add(Number(fields[0]))
})

console.log('3/5 Estabelecimentos ativos')
rmSync(tempDir, { recursive: true, force: true })
mkdirSync(tempDir, { recursive: true })
const needed = createBitmap()
const pending = new Map(ufs.map((uf) => [uf, []]))
const flush = (uf) => {
  appendFileSync(join(tempDir, uf + '.tsv'), pending.get(uf).join(''))
  pending.set(uf, [])
}
let kept = 0
await eachRow(/estabele/i, (f) => {
  // 5 = situação cadastral (02 = ativa), 19 = UF
  if (f[5] !== '02' && f[5] !== '2') return
  if (!ufSet.has(f[19])) return
  const basico = Number(f[0])
  if (mei.has(basico)) return

  const cnaes = args.atividades === 'todas' && f[12] ? [f[11], ...f[12].split(',')] : [f[11]]
  needed.add(basico)
  pending.get(f[19]).push(
    [f[0], f[0] + f[1] + f[2], clean(f[4]), f[20], f[10], cnaes.filter(Boolean).join(',')].join('\t') + '\n'
  )
  if (pending.get(f[19]).length >= 20_000) flush(f[19])
  kept++
})
for (const uf of ufs) flush(uf)
console.log(`  ${kept.toLocaleString('pt-BR')} estabelecimentos`)

console.log('4/5 Razão social das empresas')
const razoes = new Map()
await eachRow(/empre/i, ([basico, razao]) => {
  const n = Number(basico)
  if (needed.has(n)) razoes.set(n, clean(razao))
})

console.log('5/5 Gravando arquivos por UF e CNAE')
const formatDate = (d) => (/^\d{8}$/.test(d) ? `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}` : '')

for (const uf of ufs) {
  const buckets = new Map()
  const municipioIndex = new Map()
  const lines = createInterface({ input: createReadStream(join(tempDir, uf + '.tsv'), 'utf8'), crlfDelay: Infinity })
  for await (const line of lines) {
    if (!line) continue
    const [basico, cnpj, fantasia, municipio, data, cnaes] = line.split('\t')
    const nome = municipioNomes.get(municipio) || municipio
    if (!municipioIndex.has(nome)) municipioIndex.set(nome, municipioIndex.size)

    const row = [cnpj, razoes.get(Number(basico)) || '', fantasia, municipioIndex.get(nome), formatDate(data)]
    // Um estabelecimento pode repetir um CNAE entre principal e secundárias.
    for (const codigo of new Set(cnaes.split(','))) {
      if (!buckets.has(codigo)) buckets.set(codigo, [])
      buckets.get(codigo).push(row)
    }
  }

  // municipios.json fica em ordem alfabética; os índices das linhas são
  // reescritos para a nova ordem antes de gravar.
  const municipios = [...municipioIndex.keys()].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  const remap = new Map(municipios.map((nome, i) => [municipioIndex.get(nome), i]))
  const seen = new Set()
  for (const rows of buckets.values()) {
    for (const row of rows) {
      if (seen.has(row)) continue
      seen.add(row)
      row[3] = remap.get(row[3])
    }
  }

  const total = writeUfDataset(outDir, uf, { buckets, cnaeDescricoes, municipios })
  console.log(`  ${uf}: ${seen.size.toLocaleString('pt-BR')} empresas em ${total} CNAEs`)
}

rmSync(tempDir, { recursive: true, force: true })
printSizeReport(outDir)
