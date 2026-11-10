import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { PickupPoint } from '../types/pickupPoint'

const BARCELONA_CENTER: [number, number] = [41.3926, 2.1701]
const INITIAL_ZOOM = 13

const iconOptions = {
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41] as [number, number],
  iconAnchor: [12, 41] as [number, number],
  popupAnchor: [1, -34] as [number, number],
  shadowSize: [41, 41] as [number, number],
}

const markerIcon = L.icon(iconOptions)
const selectedMarkerIcon = L.icon({ ...iconOptions, className: 'pickup-marker-selected' })

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
      className="h-64 w-full rounded-sm md:h-96"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((point) => (
        <Marker
          key={point.id}
          ref={(marker) => {
            if (marker) markersRef.current.set(point.id, marker)
            else markersRef.current.delete(point.id)
          }}
          position={[point.latitude, point.longitude]}
          icon={point.id === selectedId ? selectedMarkerIcon : markerIcon}
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
