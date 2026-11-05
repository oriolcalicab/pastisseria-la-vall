import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { PickupPoint } from '../types/pickupPoint'
import PickupMap from './PickupMap'

type MockProps = {
  children?: ReactNode
  title?: string
  attribution?: string
  icon?: { options: { className?: string } }
  eventHandlers?: { click?: () => void }
}

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: MockProps) => <div>{children}</div>,
  TileLayer: ({ attribution }: MockProps) => <p>{attribution}</p>,
  Marker: ({ children, title, icon, eventHandlers }: MockProps) => (
    <div>
      <button
        type="button"
        data-icon={icon?.options.className ?? ''}
        onClick={eventHandlers?.click}
      >
        {title}
      </button>
      {children}
    </div>
  ),
  Popup: ({ children }: MockProps) => <div>{children}</div>,
}))

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

const renderMap = (selectedId: number | null = null) => {
  const onSelect = vi.fn()
  render(<PickupMap points={points} selectedId={selectedId} onSelect={onSelect} />)

  return { onSelect }
}

describe('PickupMap', () => {
  it('shows a marker for each pickup point with its name, address and opening hours', () => {
    // Given two pickup points
    // When the map is shown
    renderMap()

    // Then each point has its marker and its popup
    expect(screen.getByRole('button', { name: 'La Vall · Eixample' })).toBeInTheDocument()
    expect(screen.getByText(/Carrer de Girona, 84, Barcelona/)).toBeInTheDocument()
    expect(screen.getByText(/De dt. a ds., de 9 a 19 h/)).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(2)
  })

  it('shows the credits of OpenStreetMap', () => {
    // Given the map
    // When it is shown
    renderMap()

    // Then the credits of the map are shown
    expect(screen.getByText(/OpenStreetMap/)).toBeInTheDocument()
  })

  it('tells which point was clicked on the map', async () => {
    // Given the map
    const { onSelect } = renderMap()

    // When the customer clicks a marker
    await userEvent.setup().click(screen.getByRole('button', { name: 'La Vall · Eixample' }))

    // Then the page is told
    expect(onSelect).toHaveBeenCalledWith(2)
  })

  it('highlights the marker of the selected point', () => {
    // Given a selected point
    // When the map is shown
    renderMap(2)

    // Then only that marker has the highlighted icon
    expect(screen.getByRole('button', { name: 'La Vall · Eixample' })).toHaveAttribute(
      'data-icon',
      'pickup-marker-selected',
    )
    expect(screen.getByRole('button', { name: 'La Vall · Gràcia' })).toHaveAttribute(
      'data-icon',
      '',
    )
  })
})