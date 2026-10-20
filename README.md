# Busca CNPJ por CNAE

App React + Vite + Tailwind que lista empresas ativas (exceto MEI) por estado,
uma ou mais atividades (CNAE) e, opcionalmente, cidade. Atende 20 UFs (todas
menos ES, MG, PR, RJ, RS, SC e SP, deixadas de fora pelo limite de 1 GB do
GitHub Pages); a lista fica em `src/lib/ufs.js`. Os dados vêm dos
[Dados Abertos do CNPJ](https://arquivos.receitafederal.gov.br/dados/cnpj/dados_abertos_cnpj/)
da Receita Federal e são publicados como arquivos estáticos no GitHub Pages.

## Formato dos dados

Gerados em `public/data/` (fora do git, publicados só no branch `gh-pages`):

```
<UF>/cnaes.json               [{ codigo, descricao, total }]
<UF>/municipios.json          ["ABADIA DE GOIAS", ...]
<UF>/cnae/<codigo>.json.gz    gzip de [[cnpj, razao, fantasia, idxMunicipio, data], ...]
```

Cada estabelecimento aparece no arquivo de cada CNAE que tem (principal e
secundárias); o app junta os CNAEs escolhidos, remove repetidos pelo CNPJ e
ordena pela razão social. Os arquivos ficam gravados já em gzip porque o limite
de 1 GB de um site do GitHub Pages conta o tamanho armazenado. Com isso Goiás
caiu de 285 MB para 59 MB.

## Gerar os dados

1. Baixe para uma pasta (ex: `receita/`) os arquivos do mês mais recente:
   `Empresas*.zip`, `Estabelecimentos*.zip`, `Simples.zip`, `Municipios.zip` e
   `Cnaes.zip` (cerca de 6 GB).
2. Rode:

   ```sh
   npm run dados -- --entrada receita            # todas as UFs atendidas
   npm run dados -- --entrada receita --ufs GO,DF # só algumas
   ```

   Opções: `--saida DIR` (padrão `public/data`), `--atividades principal` para
   indexar só o CNAE principal, `--temp DIR` para os arquivos intermediários
   (~0,5 GB com todas as UFs).

   O script usa até ~4 GB de memória com todas as UFs. Com menos memória,
   rode em lotes de UFs (`--ufs BA,CE`, depois `--ufs GO,DF`...); cada UF é
   gravada na própria pasta, então um lote não apaga o outro.

No fim ele mostra o tamanho de cada UF e avisa se passar de 1 GB.

### Dividir os dados entre sites do Pages

Com as atividades secundárias, as 20 UFs atendidas ficam perto de 0,5 GB
(estimativa a partir de Goiás) e cabem no site atual. Se um dia entrar uma UF
grande (ex: SP, ~0,55 GB sozinha), gere-a em outra pasta e publique em outro
repositório com Pages ativo:

```sh
npm run dados -- --entrada receita --ufs SP --saida ../dados-sp
npx gh-pages -d ../dados-sp -r https://github.com/eduardosdmts-source/consulta-cnpj-dados-sp.git
```

e aponte a UF para ele em `site.config.mjs`:

```js
dataSources: {
  SP: 'https://eduardosdmts-source.github.io/consulta-cnpj-dados-sp/',
},
```

O GitHub Pages responde com `Access-Control-Allow-Origin: *`, então o app lê
de outro domínio sem configuração extra.

### Converter os dados antigos de Goiás

Para manter Goiás no ar antes de rodar o gerador, converta os arquivos que já
estão no `gh-pages`:

```sh
git worktree add ../gh-pages gh-pages
npm run dados:converter-go -- --origem ../gh-pages/restrito/data
```

## Desenvolvimento

```sh
npm install
npm run dev
npm run deploy   # build + publica no gh-pages
```
