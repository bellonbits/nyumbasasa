// Shared Google Maps loader config — must be the same across ALL useJsApiLoader calls
// in the app to avoid "You have tried to load Google Maps API multiple times" errors.
export const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

export const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "poi",        elementType: "labels",           stylers: [{ visibility: "off" }] },
  { featureType: "transit",    elementType: "labels.icon",      stylers: [{ visibility: "off" }] },
  { featureType: "road",       elementType: "geometry",         stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road",       elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "water",      elementType: "geometry",         stylers: [{ color: "#e9e9e9" }] },
  { featureType: "landscape",  elementType: "geometry",         stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9c9c9" }] },
];
