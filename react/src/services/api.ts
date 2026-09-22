/** Base URL for Django API. Empty = same-origin / Vite proxy. */
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, '') ?? ''

export type ListingRequestPayload = {
  brand: string
  contact: string
  email: string
  website?: string
  address: string
  /** Honeypot — leave empty */
  company_website?: string
}

export type ListingRequestResponse = {
  ok: boolean
  id?: number | null
  message?: string
  error?: string
  fields?: Record<string, string>
}

export async function submitListingRequest(
  payload: ListingRequestPayload,
): Promise<ListingRequestResponse> {
  const response = await fetch(`${API_BASE}/api/leads/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  let data: ListingRequestResponse
  try {
    data = (await response.json()) as ListingRequestResponse
  } catch {
    throw new Error('Réponse serveur invalide.')
  }

  if (!response.ok || !data.ok) {
    const err = new Error(data.error || 'Envoi impossible.') as Error & {
      fields?: Record<string, string>
      status?: number
    }
    err.fields = data.fields
    err.status = response.status
    throw err
  }

  return data
}
