import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import siteConfig from '../site.config.mjs'

const target = resolve(import.meta.dirname, '..', 'dist', 'index.html')

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="refresh" content="0; url=${siteConfig.basePath}" />
    <title>Redirecionando para acesso restrito</title>
  </head>
  <body style="font-family: system-ui, sans-serif; display: flex; min-height: 100vh; align-items: center; justify-content: center; margin: 0; padding: 24px; text-align: center; color: #334155;">
    <div>
      <p>Este link é restrito.</p>
      <p>
        <a href="${siteConfig.basePath}">Clique aqui se não for redirecionado automaticamente</a>
      </p>
    </div>
    <script>
      window.location.replace('${siteConfig.basePath}')
    </script>
  </body>
</html>
`

writeFileSync(target, html)

console.log(`Página de redirecionamento gerada para dist/index.html (-> ${siteConfig.basePath})`)
