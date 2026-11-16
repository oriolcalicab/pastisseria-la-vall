import L from 'leaflet'

const PIN_SVG =
  '<svg viewBox="0 0 32 44" width="32" height="44" aria-hidden="true"><path d="M16 1C7.7 1 1 7.6 1 15.8 1 27 16 43 16 43s15-16 15-27.2C31 7.6 24.3 1 16 1z"/><circle cx="16" cy="16" r="6"/></svg>'

export const createPickupPin = (isSelected: boolean) =>
  L.divIcon({
    html: PIN_SVG,
    className: isSelected ? 'pickup-pin pickup-pin-selected' : 'pickup-pin',
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -40],
  })
