"use client";

import { useMemo, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useState } from "react";

const NAIROBI = { lat: -1.2921, lng: 36.8219 };

const MAP_STYLES = [
  { featureType: "poi",        elementType: "labels",      stylers: [{ visibility: "off" }] },
  { featureType: "transit",    elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road",       elementType: "geometry",    stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road",       elementType: "labels.text.fill", stylers: [{ color: "#9e9e9e" }] },
  { featureType: "water",      elementType: "geometry",    stylers: [{ color: "#e9e9e9" }] },
  { featureType: "landscape",  elementType: "geometry",    stylers: [{ color: "#f5f5f5" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#c9c9c9" }] },
];

interface Listing {
  id: string;
  title: string;
  rent: number;
  latitude?: number | null;
  longitude?: number | null;
  town?: { name: string } | null;
}

interface Props {
  listings: Listing[];
}

export default function DashboardMap({ listings }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const [selected, setSelected] = useState<Listing | null>(null);

  const markers = useMemo(
    () => listings.filter((l) => l.latitude != null && l.longitude != null),
    [listings],
  );

  // Default to Nairobi; if listings have coords zoom to first one
  const center = useMemo(() => {
    if (markers.length > 0) {
      return { lat: markers[0].latitude!, lng: markers[0].longitude! };
    }
    return NAIROBI;
  }, [markers]);

  const onMapClick = useCallback(() => setSelected(null), []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-muted rounded-2xl">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-2xl"
      center={center}
      zoom={markers.length > 0 ? 13 : 11}
      options={{
        styles: MAP_STYLES,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: "cooperative",
      }}
      onClick={onMapClick}
    >
      {markers.map((l) => (
        <Marker
          key={l.id}
          position={{ lat: l.latitude!, lng: l.longitude! }}
          onClick={() => setSelected(l)}
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: "#0057ff",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 1.5,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 22),
          }}
        />
      ))}

      {selected && selected.latitude != null && selected.longitude != null && (
        <InfoWindow
          position={{ lat: selected.latitude, lng: selected.longitude }}
          onCloseClick={() => setSelected(null)}
        >
          <div className="text-xs text-ink min-w-[120px]">
            <p className="font-bold leading-snug">{selected.title}</p>
            <p className="text-ink-muted mt-0.5">
              KES {selected.rent.toLocaleString()}/mo
            </p>
            {selected.town && (
              <p className="text-ink-muted">{selected.town.name}</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
