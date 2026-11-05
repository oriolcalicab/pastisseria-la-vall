import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIconUrl from 'leaflet/dist/images/marker-icon.png'
import markerIconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import type { PickupPoint } from '../types/pickupPoint'

const BARCELONA_CENTER: [number, number] = [41.3926, 2.1701]
const INITIAL_ZOOM = 13

const markerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type PickupMapProps = {
  points: PickupPoint[]
}

const PickupMap = ({ points }: PickupMapProps) => (
  <MapContainer
    center={BARCELONA_CENTER}
    zoom={INITIAL_ZOOM}
    scrollWheelZoom={false}
    className="h-72 w-full rounded-sm md:h-96"
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {points.map((point) => (
      <Marker
        key={point.id}
        position={[point.latitude, point.longitude]}
        icon={markerIcon}
        title={point.name}
        alt={point.name}
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

export default PickupMap