"use client";
/// <reference types="@types/google.maps" />

import { useCallback, useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import { Navigation2, Loader2 } from "lucide-react";
import Link from "next/link";
import type { Property } from "@/types";

// ── Kenya county approximate centres ────────────────────────────────────────
const COUNTY_COORDS: Record<string, google.maps.LatLngLiteral> = {
  Nairobi:   { lat: -1.2864, lng: 36.8172 },
  Mombasa:   { lat: -4.0435, lng: 39.6682 },
  Kisumu:    { lat: -0.0917, lng: 34.7680 },
  Nakuru:    { lat: -0.3031, lng: 36.0800 },
  Eldoret:   { lat:  0.5204, lng: 35.2698 },
  Thika:     { lat: -1.0332, lng: 37.0695 },
  Nyeri:     { lat: -0.4167, lng: 36.9500 },
  Machakos:  { lat: -1.5167, lng: 37.2667 },
  Garissa:   { lat: -0.4533, lng: 39.6461 },
  Kakamega:  { lat:  0.2833, lng: 34.7500 },
  Malindi:   { lat: -3.2185, lng: 40.1168 },
  Kisii:     { lat: -0.6809, lng: 34.7660 },
  Meru:      { lat:  0.0472, lng: 37.6490 },
  Kitale:    { lat:  1.0156, lng: 35.0060 },
  Naivasha:  { lat: -0.7167, lng: 36.4333 },
  Embu:      { lat: -0.5300, lng: 37.4500 },
  Lamu:      { lat: -2.2686, lng: 40.9020 },
  Nyahururu: { lat:  0.0267, lng: 36.3619 },
};

const KENYA_CENTER: google.maps.LatLngLiteral = { lat: -1.286, lng: 36.817 };

// ── Green-themed map styles ─────────────────────────────────────────────────
const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "poi",     stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water",     elementType: "geometry",       stylers: [{ color: "#b3d4e8" }] },
  { featureType: "landscape", elementType: "geometry",       stylers: [{ color: "#f2f8ee" }] },
  { featureType: "road.highway",  elementType: "geometry.fill",   stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway",  elementType: "geometry.stroke",  stylers: [{ color: "#ddeedd" }] },
  { featureType: "road.arterial", elementType: "geometry",        stylers: [{ color: "#f4faf4" }] },
  { featureType: "road.local",    elementType: "geometry",        stylers: [{ color: "#ffffff" }] },
  { featureType: "poi.park", stylers: [{ visibility: "on" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8e6c9" }] },
  { featureType: "administrative.locality",    elementType: "labels.text.fill", stylers: [{ color: "#15803d" }] },
  { featureType: "administrative.neighborhood",elementType: "labels.text.fill", stylers: [{ color: "#4a8e5c" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#777777" }] },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
function getCoords(p: Property): google.maps.LatLngLiteral | null {
  if (p.latitude && p.longitude) return { lat: p.latitude, lng: p.longitude };
  const base = COUNTY_COORDS[p.county?.name ?? ""] ?? COUNTY_COORDS[p.town?.name ?? ""];
  if (!base) return null;
  // Scatter slightly so markers don't stack
  return {
    lat: base.lat + (Math.random() - 0.5) * 0.06,
    lng: base.lng + (Math.random() - 0.5) * 0.06,
  };
}

function distanceKm(a: google.maps.LatLngLiteral, b: google.maps.LatLngLiteral) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function priceLabel(rent: number, boosted: boolean): string {
  const k = rent >= 1000 ? `${Math.round(rent / 1000)}K` : `${rent}`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg width="82" height="30" viewBox="0 0 82 30" xmlns="http://www.w3.org/2000/svg">
      <rect width="82" height="30" rx="15" fill="${boosted ? "#15803d" : "#166534"}"/>
      <text x="41" y="19" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="white" text-anchor="middle">KES ${k}</text>
    </svg>`
  )}`;
}

function userPin(): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="13" r="11" fill="#1d4ed8" stroke="white" stroke-width="3"/>
      <circle cx="13" cy="13" r="4" fill="white"/>
    </svg>`
  )}`;
}

// ── Component ────────────────────────────────────────────────────────────────
interface Props {
  properties: Property[];
  county?: string;
  userLocation: google.maps.LatLngLiteral | null;
  onNearMe: () => void;
  nearMeLoading: boolean;
}

type Selected = { property: Property; pos: google.maps.LatLngLiteral };

export default function GoogleMapPanel({ properties, county, userLocation, onNearMe, nearMeLoading }: Props) {
  const [selected, setSelected] = useState<Selected | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => { mapRef.current = map; }, []);

  const center =
    userLocation ??
    (county ? (COUNTY_COORDS[county] ?? KENYA_CENTER) : KENYA_CENTER);

  const zoom = userLocation ? 13 : county ? 12 : 7;

  const markers = properties
    .map((p) => ({ property: p, pos: getCoords(p) }))
    .filter((m): m is { property: Property; pos: google.maps.LatLngLiteral } => m.pos !== null);

  const primaryImage = (p: Property) => p.images?.find((i) => i.isPrimary) ?? p.images?.[0];

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          options={{
            styles: MAP_STYLES,
            disableDefaultUI: true,
            zoomControl: true,
            zoomControlOptions: { position: 9 /* RIGHT_TOP */ },
            fullscreenControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            clickableIcons: false,
          }}
        >
          {/* Property markers */}
          {markers.map(({ property, pos }) => (
            <Marker
              key={property.id}
              position={pos}
              onClick={() => setSelected({ property, pos })}
              icon={{
                url: priceLabel(property.rent, property.isBoosted),
                scaledSize: new window.google.maps.Size(82, 30),
                anchor: new window.google.maps.Point(41, 15),
              }}
            />
          ))}

          {/* User location */}
          {userLocation && (
            <>
              <Marker
                position={userLocation}
                zIndex={999}
                icon={{
                  url: userPin(),
                  scaledSize: new window.google.maps.Size(26, 26),
                  anchor: new window.google.maps.Point(13, 13),
                }}
              />
              <Circle
                center={userLocation}
                radius={1200}
                options={{
                  fillColor: "#1d4ed8",
                  fillOpacity: 0.07,
                  strokeColor: "#1d4ed8",
                  strokeOpacity: 0.25,
                  strokeWeight: 1,
                }}
              />
            </>
          )}

          {/* Info window */}
          {selected && (
            <InfoWindow
              position={selected.pos}
              onCloseClick={() => setSelected(null)}
              options={{ pixelOffset: new window.google.maps.Size(0, -18) }}
            >
              <div style={{ fontFamily: "Inter, sans-serif", width: 220 }}>
                {primaryImage(selected.property) && (
                  <img
                    src={primaryImage(selected.property)!.url}
                    alt={selected.property.title}
                    style={{ width: "calc(100% + 24px)", height: 110, objectFit: "cover", marginTop: -12, marginLeft: -12, borderRadius: "8px 8px 0 0" }}
                  />
                )}
                <div style={{ paddingTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d" }}>For Rent</span>
                    {selected.property.isVerified && (
                      <span style={{ marginLeft: "auto", background: "#f0fdf4", color: "#15803d", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 99, border: "1px solid #bbf7d0" }}>✓ Verified</span>
                    )}
                  </div>
                  <p style={{ fontWeight: 800, fontSize: 15, color: "#111827", margin: "2px 0" }}>
                    KES {selected.property.rent.toLocaleString()}
                    <span style={{ fontWeight: 400, fontSize: 12, color: "#9ca3af" }}>/mo</span>
                  </p>
                  <p style={{ fontSize: 12, color: "#374151", marginBottom: 2, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{selected.property.title}</p>
                  <p style={{ fontSize: 11, color: "#6b7280" }}>{selected.property.town?.name}, {selected.property.county?.name}</p>
                  {userLocation && (() => {
                    const d = distanceKm(userLocation, selected.pos);
                    return <p style={{ fontSize: 11, color: "#2563eb", marginTop: 2 }}>{d.toFixed(1)} km from you</p>;
                  })()}
                  <a
                    href={`/property/${selected.property.id}`}
                    style={{
                      display: "block", marginTop: 8, background: "#16a34a", color: "white",
                      textAlign: "center", padding: "6px 0", borderRadius: 8,
                      fontSize: 12, fontWeight: 700, textDecoration: "none",
                    }}
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Overlays */}
      <div className="absolute top-3 left-3 z-10">
        {userLocation ? (
          <div className="bg-blue-600 text-white rounded-lg shadow px-3 py-2 text-xs font-semibold flex items-center gap-1.5">
            <Navigation2 className="w-3 h-3" /> Your location
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow px-3 py-2 text-xs font-medium text-gray-700">
            {county ?? "Kenya"} · Google Maps
          </div>
        )}
      </div>

      {/* Near Me button */}
      <button
        onClick={onNearMe}
        disabled={nearMeLoading}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white hover:bg-gray-50 border border-gray-200 shadow-xl text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-60 z-10 whitespace-nowrap"
      >
        {nearMeLoading
          ? <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
          : <Navigation2 className="w-4 h-4 text-brand-500" />
        }
        {userLocation ? "Near Me ✓" : "Find Houses Near Me"}
      </button>
    </div>
  );
}
