import { describe, expect, it } from 'vitest'
import { isBarcelonaCity } from './barcelonaCity'

describe('isBarcelonaCity', () => {
  it.each(['Barcelona', ' barcelona ', 'BARCELONA', 'Bàrcelona'])('accepts %s', (city) => {
    expect(isBarcelonaCity(city)).toBe(true)
  })

  it.each(['Madrid', 'Badalona', "L'Hospitalet de Llobregat", 'Barcelonès'])(
    'rejects %s',
    (city) => {
      expect(isBarcelonaCity(city)).toBe(false)
    },
  )
})
