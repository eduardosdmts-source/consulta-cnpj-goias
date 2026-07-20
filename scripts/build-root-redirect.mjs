import { cpSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const source = resolve(root, 'redirect-root', 'index.html')
const target = resolve(root, 'dist', 'index.html')

cpSync(source, target)

console.log('Página de redirecionamento copiada para dist/index.html')
