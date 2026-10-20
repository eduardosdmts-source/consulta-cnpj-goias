// Configuração central do site. Editar aqui em vez de espalhar valores
// pelo código — usado pelo vite.config.js, pelos scripts de deploy e
// pelos componentes React (PasswordGate, App).
export default {
  siteName: 'Busca CNPJ por CNAE',
  subtitle:
    'Encontre empresas ativas no Brasil (exceto MEI) filtrando por estado, por uma ou mais atividades econômicas (CNAE) e, se quiser, por cidade',

  // Caminho público do GitHub Pages (deve bater com o nome do repositório).
  basePath: '/consulta-cnpj-goias/restrito/',
  outDir: 'dist/restrito',

  // Gerada com: node -e "console.log(require('crypto').createHash('sha256').update('SENHA').digest('hex'))"
  passwordHash: 'b606615351502ed496863d987340e31fab70b0813d982162dcd8c997d7a83b65',
  storageKey: 'consulta-cnpj-goias-restrito-auth',

  // De onde vêm os dados de cada UF. UF fora desta lista é lida do próprio
  // site (<basePath>/data/<UF>/). Como um site do GitHub Pages aceita até
  // 1 GB, UFs grandes podem ser publicadas em outros repositórios, ex.:
  //   SP: 'https://eduardosdmts-source.github.io/consulta-cnpj-dados-sp/',
  dataSources: {},
}
