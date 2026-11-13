import type { ErrorRequestHandler } from 'express'

const isInvalidJson = (error: unknown) =>
  typeof error === 'object' &&
  error !== null &&
  'type' in error &&
  error.type === 'entity.parse.failed'

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error)
    return
  }

  if (isInvalidJson(error)) {
    res.status(400).json({ error: 'El cos de la petició no és un JSON vàlid' })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Hi ha hagut un error al servidor. Torna-ho a provar.' })
}
