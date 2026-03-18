"use client";

import { useMemo, useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES, MAP_STYLES } from "@/lib/googleMaps";

const NAIROBI = { lat: -1.2921, lng: 36.8219 };

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
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [selected, setSelected] = useState<Listing | null>(null);

  const markers = useMemo(
    () => listings.filter((l) => l.latitude != null && l.longitude != null),
    [listings],
  );

  const center = useMemo(() => {
    if (markers.length > 0) return { lat: markers[0].latitude!, lng: markers[0].longitude! };
    return NAIROBI;
  }, [markers]);

  const onMapClick = useCallback(() => setSelected(null), []);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface-muted rounded-2xl text-xs text-ink-muted">
        Map unavailable
      </div>
    );
  }

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
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: "#0057ff",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 10,
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
            <p className="text-ink-muted mt-0.5">KES {selected.rent.toLocaleString()}/mo</p>
            {selected.town && <p className="text-ink-muted">{selected.town.name}</p>}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
