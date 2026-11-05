import { render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { PickupPoint } from '../types/pickupPoint'
import PickupMap from './PickupMap'

type MockProps = { children?: ReactNode; title?: string; attribution?: string }

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: MockProps) => <div>{children}</div>,
  TileLayer: ({ attribution }: MockProps) => <p>{attribution}</p>,
  Marker: ({ children, title }: MockProps) => (
    <div role="group" aria-label={title}>
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

describe('PickupMap', () => {
  it('shows a marker for each pickup point with its name, address and opening hours', () => {
    // Given two pickup points
    // When the map is shown
    render(<PickupMap points={points} />)

    // Then each marker has its popup with the information of the point
    const marker = within(screen.getByRole('group', { name: 'La Vall · Eixample' }))
    expect(marker.getByText('La Vall · Eixample')).toBeInTheDocument()
    expect(marker.getByText(/Carrer de Girona, 84, Barcelona/)).toBeInTheDocument()
    expect(marker.getByText(/De dt. a ds., de 9 a 19 h/)).toBeInTheDocument()
    expect(screen.getAllByRole('group')).toHaveLength(2)
  })

  it('shows the credits of OpenStreetMap', () => {
    // Given the map
    // When it is shown
    render(<PickupMap points={points} />)

    // Then the credits of the map are shown
    expect(screen.getByText(/OpenStreetMap/)).toBeInTheDocument()
  })
})