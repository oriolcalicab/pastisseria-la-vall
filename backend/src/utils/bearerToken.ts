export const getBearerToken = (header: string | undefined): string | null => {
  if (!header) return null

  const [scheme, token] = header.split(' ')

  if (scheme !== 'Bearer' || !token) return null

  return token
}
