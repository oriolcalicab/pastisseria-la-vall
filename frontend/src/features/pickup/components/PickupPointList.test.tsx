import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { PickupPoint } from '../types/pickupPoint'
import PickupPointList from './PickupPointList'

const points: PickupPoint[] = [
  {
    id: 1,
    name: 'La Vall · Gràcia',
    address: 'Carrer de Torrijos, 24',
    city: 'Barcelona',
    latitude: 41.4005,
    longitude: 2.1589,
    openingHours: 'De dt. a ds., de 10 a 19 h',
  },
  {
    id: 2,
    name: 'La Vall · Eixample',
    address: 'Carrer de Girona, 84',
    city: 'Barcelona',
    latitude: 41.3965,
    longitude: 2.1675,
    openingHours: 'De dt. a ds., de 9 a 19 h',
  },
]

describe('PickupPointList', () => {
  it('shows each point with its address and opening hours', () => {
    // Given two pickup points
    // When the list is shown
    render(<PickupPointList points={points} selectedId={null} onSelect={vi.fn()} />)

    // Then each point can be chosen
    expect(screen.getAllByRole('radio')).toHaveLength(2)
    expect(screen.getByText('Carrer de Torrijos, 24, Barcelona')).toBeInTheDocument()
    expect(screen.getByText('De dt. a ds., de 9 a 19 h')).toBeInTheDocument()
  })

  it('marks the selected point', () => {
    // Given a selected point
    // When the list is shown
    render(<PickupPointList points={points} selectedId={2} onSelect={vi.fn()} />)

    // Then only that point is checked
    expect(screen.getByRole('radio', { name: /Eixample/ })).toBeChecked()
    expect(screen.getByRole('radio', { name: /Gràcia/ })).not.toBeChecked()
  })

  it('tells which point was chosen', async () => {
    // Given the list
    const onSelect = vi.fn()
    render(<PickupPointList points={points} selectedId={null} onSelect={onSelect} />)

    // When the customer chooses a point
    await userEvent.setup().click(screen.getByRole('radio', { name: /Gràcia/ }))

    // Then the page is told
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
