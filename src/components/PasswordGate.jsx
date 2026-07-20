import { useState } from 'react'

const PASSWORD_HASH = 'b606615351502ed496863d987340e31fab70b0813d982162dcd8c997d7a83b65'
const STORAGE_KEY = 'consulta-cnpj-goias-restrito-auth'

async function sha256(text) {
  const bytes = new TextEncoder().encode(text)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => localStorage.getItem(STORAGE_KEY) === 'true'
  )
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [checking, setChecking] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setChecking(true)
    setError(null)

    const hash = await sha256(password)
    if (hash === PASSWORD_HASH) {
      localStorage.setItem(STORAGE_KEY, 'true')
      setAuthenticated(true)
    } else {
      setError('Senha incorreta. Confira com quem compartilhou o acesso com você.')
    }
    setChecking(false)
  }

  function handleLogout() {
    localStorage.removeItem(STORAGE_KEY)
    setAuthenticated(false)
    setPassword('')
  }

  if (authenticated) {
    return (
      <div>
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-slate-600 transition"
          >
            Sair da área restrita
          </button>
        </div>
        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white shadow-sm p-8"
      >
        <h1 className="text-lg font-semibold text-slate-900 text-center">Acesso restrito</h1>
        <p className="mt-1 text-sm text-slate-500 text-center">
          Digite a senha compartilhada com a equipe para continuar.
        </p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Senha"
          className="mt-6 w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300 transition"
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={checking || password.length === 0}
          className="mt-4 w-full px-6 py-3 rounded-2xl bg-slate-900 text-white font-medium shadow-sm hover:bg-slate-800 active:bg-slate-950 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {checking ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
