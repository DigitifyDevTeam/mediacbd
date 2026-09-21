const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T12:00:00`))
}

export function formatRating(rating: number): string {
  return rating.toFixed(1).replace('.', ',')
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
