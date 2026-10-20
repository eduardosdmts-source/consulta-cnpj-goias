// Formato dos dados publicados (lido por src/lib/dataset.js):
//
//   <saida>/<UF>/cnaes.json           [{ codigo, descricao, total }]
//   <saida>/<UF>/municipios.json      ["ABADIA DE GOIAS", ...]
//   <saida>/<UF>/cnae/<codigo>.json.gz  gzip de [[cnpj, razao, fantasia, idxMunicipio, data], ...]
//
// As linhas são arrays (sem repetir nomes de campo) e o município é o índice
// em municipios.json. Os arquivos ficam gravados já em gzip porque o limite
// de 1 GB do GitHub Pages conta o tamanho armazenado, não o transferido.
import { mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const collator = new Intl.Collator('pt-BR')

export function writeUfDataset(outDir, uf, { buckets, cnaeDescricoes, municipios }) {
  const ufDir = join(outDir, uf)
  rmSync(ufDir, { recursive: true, force: true })
  mkdirSync(join(ufDir, 'cnae'), { recursive: true })

  const cnaes = []
  for (const [codigo, rows] of buckets) {
    writeFileSync(join(ufDir, 'cnae', `${codigo}.json.gz`), gzipSync(JSON.stringify(rows), { level: 9 }))
    cnaes.push({ codigo, descricao: cnaeDescricoes.get(codigo) || codigo, total: rows.length })
  }
  cnaes.sort((a, b) => collator.compare(a.descricao, b.descricao))

  writeFileSync(join(ufDir, 'cnaes.json'), JSON.stringify(cnaes))
  writeFileSync(join(ufDir, 'municipios.json'), JSON.stringify(municipios))
  return cnaes.length
}

function dirSize(dir) {
  let total = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    total += entry.isDirectory() ? dirSize(path) : statSync(path).size
  }
  return total
}

// Limite de um site do GitHub Pages, com folga para o próprio app.
const PAGES_LIMIT = 950 * 1024 * 1024

export function printSizeReport(outDir) {
  const ufs = readdirSync(outDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^[A-Z]{2}$/.test(entry.name))
    .map((entry) => ({ uf: entry.name, size: dirSize(join(outDir, entry.name)) }))
    .sort((a, b) => b.size - a.size)

  const mb = (bytes) => (bytes / 1024 / 1024).toFixed(1).padStart(8) + ' MB'
  let total = 0
  console.log('\nTamanho por UF em', outDir)
  for (const { uf, size } of ufs) {
    total += size
    console.log(`  ${uf} ${mb(size)}`)
  }
  console.log(`  -- ${mb(total)} no total`)
  if (total > PAGES_LIMIT) {
    console.log(
      '\nATENÇÃO: passa do limite de 1 GB de um site do GitHub Pages. Divida as UFs entre' +
        ' repositórios de dados (veja "dataSources" em site.config.mjs e o README).'
    )
  }
}
