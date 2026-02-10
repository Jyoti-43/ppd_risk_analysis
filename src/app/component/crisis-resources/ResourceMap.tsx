"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Resource {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  type: string;
}

interface ResourceMapProps {
  resources: Resource[];
  center?: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
}

// User location icon
const userIcon =
  typeof window !== "undefined"
    ? L.icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })
    : null;

const MapContent = ({
  resources,
  center,
  zoom,
  userLocation,
}: {
  resources: Resource[];
  center: [number, number];
  zoom: number;
  userLocation: { lat: number; lng: number } | null;
}) => {
  const map = useMap();

  useEffect(() => {
    if (map && typeof center[0] === "number" && typeof center[1] === "number") {
      map.invalidateSize();
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && userIcon && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>
            <div className="p-1 font-bold text-red-600">You are here</div>
          </Popup>
        </Marker>
      )}

      {resources.map(
        (resource) =>
          resource.lat &&
          resource.lng && (
            <Marker key={resource.id} position={[resource.lat, resource.lng]}>
              <Popup className="custom-popup">
                <div className="p-1 min-w-[150px]">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">
                    {resource.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {resource.address}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                      {resource.type}
                    </span>
                    <a
                      href={`tel:${resource.phone}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 underline flex items-center gap-1"
                    >
                      Call Now
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ),
      )}
    </>
  );
};

const ResourceMap = React.memo(
  ({
    resources,
    center = [27.7172, 85.324],
    zoom = 7,
    userLocation = null,
  }: ResourceMapProps) => {
    if (typeof window === "undefined") return null;

    return (
      <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 relative z-0">
        <MapContainer
          key="crisis-resource-map-instance"
          center={center}
          zoom={zoom}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <MapContent
            resources={resources}
            center={center}
            zoom={zoom}
            userLocation={userLocation}
          />
        </MapContainer>
      </div>
    );
  },
);

export default ResourceMap;
