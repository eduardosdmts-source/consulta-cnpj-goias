export function formatCNPJDigits(digits) {
  if (!digits || digits.length !== 14) return digits || '—'
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function formatCnaeCode(digits) {
  if (!digits || digits.length !== 7) return digits || '—'
  return digits.replace(/^(\d{4})(\d{1})(\d{2})$/, '$1-$2/$3')
}

export function formatDateBR(dateStr) {
  if (!dateStr) return '—'
  const [year, month, day] = String(dateStr).split('-')
  if (!year || !month || !day) return dateStr
  return `${day}/${month}/${year}`
}
