"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { Navigation, Car, Footprints, Bus, X, Loader2 } from "lucide-react";
import { GOOGLE_MAPS_LIBRARIES, MAP_STYLES } from "@/lib/googleMaps";

type TravelMode = "DRIVING" | "WALKING" | "TRANSIT";

const MODES: { mode: TravelMode; label: string; Icon: React.ElementType }[] = [
  { mode: "DRIVING",  label: "Drive",   Icon: Car        },
  { mode: "WALKING",  label: "Walk",    Icon: Footprints },
  { mode: "TRANSIT",  label: "Transit", Icon: Bus        },
];

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export default function PropertyMap({ lat, lng, title }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const destination = { lat, lng };

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [travelMode, setTravelMode] = useState<TravelMode>("DRIVING");
  const [routeInfo, setRouteInfo]   = useState<{ distance: string; duration: string } | null>(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const fetchDirections = useCallback(
    (mode: TravelMode) => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported on your device.");
        return;
      }
      setLoading(true);
      setError(null);
      setDirections(null);
      setRouteInfo(null);

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          new window.google.maps.DirectionsService().route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode[mode],
            },
            (result, status) => {
              setLoading(false);
              if (status === "OK" && result) {
                setDirections(result);
                const leg = result.routes[0]?.legs[0];
                if (leg) {
                  setRouteInfo({ distance: leg.distance?.text ?? "", duration: leg.duration?.text ?? "" });
                }
              } else {
                setError("Could not find a route. Try a different travel mode.");
              }
            },
          );
        },
        () => {
          setLoading(false);
          setError("Location access denied — please enable location permissions.");
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    },
    [destination],
  );

  const handleGetDirections = () => fetchDirections(travelMode);

  const handleModeChange = (mode: TravelMode) => {
    setTravelMode(mode);
    if (directions) fetchDirections(mode);
  };

  if (loadError) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-surface-muted rounded-2xl text-sm text-ink-muted">
        Map could not be loaded
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-72 flex items-center justify-center bg-surface-muted rounded-2xl">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ── Controls ─────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 bg-surface rounded-xl border border-surface-border p-1">
          {MODES.map(({ mode, label, Icon }) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                travelMode === mode
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-ink-muted hover:text-ink hover:bg-surface-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={handleGetDirections}
          disabled={loading}
          className="flex items-center gap-2 btn-primary text-sm py-2 disabled:opacity-60"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
          {loading ? "Getting route…" : "Get Directions"}
        </button>

        {directions && (
          <button
            onClick={() => { setDirections(null); setRouteInfo(null); setError(null); }}
            className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* ── Route summary ────────────────────────── */}
      {routeInfo && (
        <div className="flex items-center gap-4 bg-brand-50 border border-brand-200 rounded-xl px-4 py-3 text-sm">
          <span className="flex items-center gap-1.5 text-brand-700 font-semibold">
            <Navigation className="w-4 h-4" /> {routeInfo.duration}
          </span>
          <span className="text-brand-400">·</span>
          <span className="text-brand-600">{routeInfo.distance}</span>
          <span className="text-brand-400 text-xs ml-auto">
            {MODES.find((m) => m.mode === travelMode)?.label} to {title}
          </span>
        </div>
      )}

      {/* ── Error ────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          <X className="w-4 h-4 flex-shrink-0" /> {error}
        </div>
      )}

      {/* ── Map ──────────────────────────────────── */}
      <GoogleMap
        mapContainerClassName="w-full h-72 sm:h-80 rounded-2xl"
        center={destination}
        zoom={15}
        options={{
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          clickableIcons: false,
          gestureHandling: "cooperative",
        }}
      >
        {!directions && (
          <Marker
            position={destination}
            title={title}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: "#0057ff",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 10,
            }}
          />
        )}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: { strokeColor: "#0057ff", strokeWeight: 5, strokeOpacity: 0.85 },
            }}
          />
        )}
      </GoogleMap>

      {/* ── Open in Google Maps ───────────────────── */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=${travelMode.toLowerCase()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-ink-faint hover:text-brand-500 transition-colors w-fit"
      >
        <Navigation className="w-3.5 h-3.5" /> Open in Google Maps
      </a>
    </div>
  );
}
