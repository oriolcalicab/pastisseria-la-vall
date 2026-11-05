import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePickupPoints } from '../hooks/usePickupPoints'
import type { PickupPoint } from '../types/pickupPoint'
import PickupPoints from './PickupPoints'

vi.mock('../hooks/usePickupPoints', () => ({ usePickupPoints: vi.fn() }))
vi.mock('./PickupMap', () => ({
  default: ({ points }: { points: PickupPoint[] }) => (
    <p>Mapa amb {points.length} punts</p>
  ),
}))

const retry = vi.fn()

describe('PickupPoints', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows a message while the points are loading', () => {
    // Given the points are loading
    vi.mocked(usePickupPoints).mockReturnValue({ status: 'loading', retry })

    // When the section is shown
    render(<PickupPoints />)

    // Then the loading message is shown
    expect(screen.getByText('Carregant els punts de recollida...')).toBeInTheDocument()
  })

  it('shows an error and lets the user retry', async () => {
    // Given the points could not be loaded
    vi.mocked(usePickupPoints).mockReturnValue({ status: 'error', retry })
    render(<PickupPoints />)

    // When the user clicks retry
    await userEvent.setup().click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the points are requested again
    expect(retry).toHaveBeenCalledOnce()
  })

  it('shows the map with the points', () => {
    // Given four pickup points
    const points = Array.from({ length: 4 }, (_, index) => ({
      id: index + 1,
      name: `Punt ${index + 1}`,
      address: 'Carrer',
      city: 'Barcelona',
      latitude: 41.4,
      longitude: 2.16,
      openingHours: 'De 10 a 19 h',
    }))
    vi.mocked(usePickupPoints).mockReturnValue({ status: 'success', points, retry })

    // When the section is shown
    render(<PickupPoints />)

    // Then the map receives the four points
    expect(screen.getByText('Mapa amb 4 punts')).toBeInTheDocument()
  })
})