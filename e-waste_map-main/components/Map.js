"use client";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default Leaflet icon paths in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const [centers, setCenters] = useState([]);
  const davaoCoords = [7.091225859059716, 125.60905969569896];
   

  useEffect(() => {
    // Fetching the Data Engine
    fetch("/centers.json")
      .then((res) => res.json())
      .then((data) => setCenters(data))
      .catch((err) => console.error("Error loading centers:", err));
  }, []);

  return (
    <div className="h-[500px] w-full border-2 border-cyan-400 rounded-lg overflow-hidden glass-morphism">
      <MapContainer center={davaoCoords} zoom={12} scrollWheelZoom={false} className="h-full w-full">
        {/* Dark Mode Tiles to match "Industrial Futurism" */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {centers.map((center) => (
          <Marker key={center.id} position={[center.lat, center.lng]} icon={customIcon}>
            <Popup className="y2k-popup">
              <div className="p-2 font-mono">
                <h3 className="text-lime-400 font-bold uppercase">{center.name}</h3>
                <p className="text-xs text-slate-300">{center.address}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {center.types.map((type) => (
                    <span key={type} className="text-[10px] bg-cyan-900 text-cyan-300 px-1 border border-cyan-500">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}