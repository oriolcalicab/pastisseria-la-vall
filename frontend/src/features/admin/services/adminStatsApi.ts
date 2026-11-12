import { apiUrl } from '../../../lib/api'
import type { AdminStats, StatsRange } from '../types/stats'

export const fetchAdminStats = async (token: string, range: StatsRange): Promise<AdminStats> => {
  const params = new URLSearchParams({ from: range.from, to: range.to })

  const response = await fetch(apiUrl(`/api/admin/stats?${params}`), {
    headers: { Authorization: `Bearer ${token}` },
  }).catch(() => {
    throw new Error("No s'han pogut carregar les estadístiques")
  })

  if (!response.ok) {
    throw new Error(`Admin stats request failed with status ${response.status}`)
  }

  return response.json() as Promise<AdminStats>
}
