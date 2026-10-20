import siteConfig from '../../site.config.mjs'

// Formato gerado por scripts/lib/dataset.mjs. Cada UF pode vir de outro site
// (siteConfig.dataSources), para dividir o volume entre repositórios do Pages.
function ufBase(uf) {
  const base = siteConfig.dataSources?.[uf] || `${import.meta.env.BASE_URL}data/`
  return `${base.replace(/\/?$/, '/')}${uf}`
}

export class NotPublishedError extends Error {}

async function fetchOk(url) {
  const response = await fetch(url)
  // O servidor de dev do Vite responde index.html (200) para arquivo inexistente.
  const isHtml = response.headers.get('content-type')?.startsWith('text/html')
  if (response.status === 404 || (response.ok && isHtml)) throw new NotPublishedError(url)
  if (!response.ok) throw new Error('status ' + response.status)
  return response
}

export async function loadUfIndex(uf) {
  const [cnaes, municipios] = await Promise.all([
    fetchOk(`${ufBase(uf)}/cnaes.json`).then((response) => response.json()),
    fetchOk(`${ufBase(uf)}/municipios.json`).then((response) => response.json()),
  ])
  return { cnaes, municipios }
}

async function gunzipJson(response) {
  const bytes = new Uint8Array(await response.arrayBuffer())
  // Alguns servidores já entregam o .gz descompactado (Content-Encoding).
  if (bytes[0] !== 0x1f || bytes[1] !== 0x8b) return JSON.parse(new TextDecoder().decode(bytes))
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
  return JSON.parse(await new Response(stream).text())
}

// Empresas de um CNAE na UF, como { c, r, n, m, d }. CNAE sem empresas na UF
// não tem arquivo, então 404 vira lista vazia.
export async function loadCnae(uf, codigo, municipios) {
  let rows
  try {
    rows = await gunzipJson(await fetchOk(`${ufBase(uf)}/cnae/${codigo}.json.gz`))
  } catch (error) {
    if (error instanceof NotPublishedError) return []
    throw error
  }
  return rows.map(([c, r, n, m, d]) => ({ c, r, n, m: municipios[m], d }))
}
