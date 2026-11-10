import { apiUrl } from '../../../lib/api'

export const registerInBackend = async (token: string, name: string): Promise<void> => {
  const response = await fetch(apiUrl('/api/auth/register'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  })

  if (!response.ok) {
    throw new Error(`Register request failed with status ${response.status}`)
  }
}

export type CurrentUser = {
  id: number
  name: string
  email: string
  role: 'customer' | 'admin'
}

export const fetchCurrentUser = async (token: string): Promise<CurrentUser> => {
  const response = await fetch(apiUrl('/api/auth/me'), {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Me request failed with status ${response.status}`)
  }

  return response.json() as Promise<CurrentUser>
}
