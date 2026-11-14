import type L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { BARCELONA_CENTER, INITIAL_ZOOM, mapTiles } from '../data/mapStyle'
import type { PickupPoint } from '../types/pickupPoint'
import { createPickupPin } from '../utils/pickupPin'

type PickupMapProps = {
  points: PickupPoint[]
  selectedId: number | null
  onSelect: (id: number) => void
}

const PickupMap = ({ points, selectedId, onSelect }: PickupMapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef(new Map<number, L.Marker>())

  useEffect(() => {
    if (selectedId === null) return

    const marker = markersRef.current.get(selectedId)

    if (!marker) return

    mapRef.current?.panTo(marker.getLatLng())
    marker.openPopup()
  }, [selectedId])

  return (
    <MapContainer
      ref={mapRef}
      center={BARCELONA_CENTER}
      zoom={INITIAL_ZOOM}
      scrollWheelZoom={false}
      className="h-80 w-full rounded-2xl border border-line md:h-112"
    >
      <TileLayer attribution={mapTiles.attribution} url={mapTiles.url} />
      {points.map((point) => (
        <Marker
          key={point.id}
          ref={(marker) => {
            if (marker) markersRef.current.set(point.id, marker)
            else markersRef.current.delete(point.id)
          }}
          position={[point.latitude, point.longitude]}
          icon={createPickupPin(point.id === selectedId)}
          title={point.name}
          alt={point.name}
          eventHandlers={{ click: () => onSelect(point.id) }}
        >
          <Popup>
            <strong>{point.name}</strong>
            <br />
            {point.address}, {point.city}
            <br />
            {point.openingHours}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default PickupMap
