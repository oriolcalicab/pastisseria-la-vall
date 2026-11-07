import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePickupPoints } from '../hooks/usePickupPoints'
import type { PickupPoint } from '../types/pickupPoint'
import PickupPoints from './PickupPoints'

vi.mock('../hooks/usePickupPoints', () => ({ usePickupPoints: vi.fn() }))
vi.mock('./PickupMap', () => ({
  default: ({ points, selectedId }: { points: PickupPoint[]; selectedId: number | null }) => (
    <p>
      Mapa amb {points.length} punts, triat: {selectedId ?? 'cap'}
    </p>
  ),
}))

const retry = vi.fn()

const points: PickupPoint[] = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  name: `Punt ${index + 1}`,
  address: 'Carrer',
  city: 'Barcelona',
  latitude: 41.4,
  longitude: 2.16,
  openingHours: 'De 10 a 19 h',
}))

const renderSection = (selectedId: number | null = null) => {
  const onSelect = vi.fn()
  render(<PickupPoints selectedId={selectedId} onSelect={onSelect} />)

  return { onSelect }
}

describe('PickupPoints', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('shows a message while the points are loading', () => {
    // Given the points are loading
    vi.mocked(usePickupPoints).mockReturnValue({ status: 'loading', retry })

    // When the section is shown
    renderSection()

    // Then the loading message is shown
    expect(screen.getByText('Carregant els punts de recollida...')).toBeInTheDocument()
  })

  it('shows an error and lets the user retry', async () => {
    // Given the points could not be loaded
    vi.mocked(usePickupPoints).mockReturnValue({ status: 'error', retry })
    renderSection()

    // When the user clicks retry
    await userEvent.setup().click(screen.getByRole('button', { name: 'Torna-ho a provar' }))

    // Then the points are requested again
    expect(retry).toHaveBeenCalledOnce()
  })

  it('shows the map and the list with the same selection', () => {
    // Given four points and the third one selected
    vi.mocked(usePickupPoints).mockReturnValue({ status: 'success', points, retry })

    // When the section is shown
    renderSection(3)

    // Then the map and the list show the same point
    expect(screen.getByText('Mapa amb 4 punts, triat: 3')).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /Punt 3/ })).toBeChecked()
  })

  it('tells which point was chosen in the list', async () => {
    // Given the four points
    vi.mocked(usePickupPoints).mockReturnValue({ status: 'success', points, retry })
    const { onSelect } = renderSection()

    // When the customer chooses a point in the list
    await userEvent.setup().click(screen.getByRole('radio', { name: /Punt 2/ }))

    // Then the page is told
    expect(onSelect).toHaveBeenCalledWith(points[1])
  })
})
