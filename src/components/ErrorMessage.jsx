import { AlertTriangleIcon } from './icons'

export default function ErrorMessage({ message }) {
  return (
    <div className="max-w-2xl mx-auto flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
      <AlertTriangleIcon className="w-5 h-5 shrink-0 mt-0.5" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
