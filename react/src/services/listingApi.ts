import { SITE } from '../data/site'

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') || ''

export type ListingRequestPayload = {
  brand: string
  contact: string
  email: string
  website?: string
  address: string
  /** Honeypot — must stay empty */
  company_website?: string
}

export type ListingRequestResult =
  | { ok: true; id: number | null; message: string }
  | { ok: false; error: string; fields?: Record<string, string> }

export async function submitListingRequest(
  payload: ListingRequestPayload,
): Promise<ListingRequestResult> {
  const response = await fetch(`${API_BASE}/api/leads/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  })

  let data: ListingRequestResult
  try {
    data = (await response.json()) as ListingRequestResult
  } catch {
    return {
      ok: false,
      error: `Impossible de joindre l’API (${SITE.name}). Vérifiez que le backend tourne.`,
    }
  }

  if (!response.ok && data && typeof data === 'object' && 'ok' in data) {
    return data
  }

  if (!response.ok) {
    return { ok: false, error: `Erreur serveur (${response.status}).` }
  }

  return data
}
