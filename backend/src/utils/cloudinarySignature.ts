import { createHash } from 'node:crypto'

export const signCloudinaryParams = (
  params: Record<string, string | number>,
  apiSecret: string,
): string => {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&')

  return createHash('sha1').update(`${toSign}${apiSecret}`).digest('hex')
}
