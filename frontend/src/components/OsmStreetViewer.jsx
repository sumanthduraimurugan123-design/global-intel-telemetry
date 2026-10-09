import React, { useEffect, useRef, useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  MapPin, 
  Navigation, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { CATEGORY_DEFINITIONS } from '../services/explorerService';

/**
 * Interactive OpenStreetMap Street Viewer
 * Renders real OpenStreetMap tile slippy map with dynamic markers,
 * panning, zooming, and interactive selection.
 */
export default function OsmStreetViewer({
  centerLat = 12.9759,
  centerLng = 80.2212,
  zoom = 15,
  places = [],
  selectedPlace = null,
  onSelectPlace,
  className = ''
}) {
  const containerRef = useRef(null);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [center, setCenter] = useState({ lat: centerLat, lng: centerLng });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, centerLat: 0, centerLng: 0 });

  // Sync center when props change
  useEffect(() => {
    if (centerLat != null && centerLng != null) {
      setCenter({ lat: centerLat, lng: centerLng });
    }
  }, [centerLat, centerLng]);

  // Sync selected place
  useEffect(() => {
    if (selectedPlace && selectedPlace.lat && selectedPlace.lng) {
      setCenter({ lat: selectedPlace.lat, lng: selectedPlace.lng });
      setCurrentZoom(16);
    }
  }, [selectedPlace]);

  // Convert lat/lng to tile numbers
  function lon2tile(lon, z) {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, z));
  }
  function lat2tile(lat, z) {
    return Math.floor(
      ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) /
          Math.PI) /
        2) *
        Math.pow(2, z)
    );
  }

  // Convert pixel offsets to lat/lng
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      centerLat: center.lat,
      centerLng: center.lng
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;

    const metersPerPixel = (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, currentZoom);
    const dLng = -(dx * metersPerPixel) / 111320;
    const dLat = (dy * metersPerPixel) / 110574;

    setCenter({
      lat: dragStart.current.centerLat + dLat,
      lng: dragStart.current.centerLng + dLng
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Build grid of visible OSM tiles
  const z = Math.min(19, Math.max(3, Math.round(currentZoom)));
  const centerTileX = lon2tile(center.lng, z);
  const centerTileY = lat2tile(center.lat, z);

  // Render 3x3 or 4x4 tile grid around center
  const tiles = [];
  const range = 2;
  for (let dx = -range; dx <= range; dx++) {
    for (let dy = -range; dy <= range; dy++) {
      const tileX = centerTileX + dx;
      const tileY = centerTileY + dy;
      if (tileX >= 0 && tileY >= 0 && tileX < Math.pow(2, z) && tileY < Math.pow(2, z)) {
        tiles.push({
          x: tileX,
          y: tileY,
          z,
          dx,
          dy,
          url: `https://tile.openstreetmap.org/${z}/${tileX}/${tileY}.png`
        });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full min-h-[460px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      } ${className}`}
    >
      {/* OSM Slippy Tile Grid */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="relative w-[1280px] h-[1280px]">
          {tiles.map((tile) => (
            <img
              key={`${tile.z}-${tile.x}-${tile.y}`}
              src={tile.url}
              alt="OpenStreetMap Tile"
              loading="lazy"
              className="absolute w-[256px] h-[256px] transition-opacity duration-200"
              style={{
                left: `calc(50% + ${tile.dx * 256}px - 128px)`,
                top: `calc(50% + ${tile.dy * 256}px - 128px)`,
                filter: 'brightness(0.92) contrast(1.05)'
              }}
            />
          ))}
        </div>
      </div>

      {/* Markers Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {places.map((place) => {
          if (!place.lat || !place.lng) return null;
          // Calculate pixel offset from current center
          const metersPerPixel =
            (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, currentZoom);
          const px = ((place.lng - center.lng) * 111320) / metersPerPixel;
          const py = -((place.lat - center.lat) * 110574) / metersPerPixel;

          // Don't render if outside viewport
          if (Math.abs(px) > 700 || Math.abs(py) > 500) return null;

          const isSelected = selectedPlace && selectedPlace.id === place.id;
          const catDef = CATEGORY_DEFINITIONS[place.category] || CATEGORY_DEFINITIONS.education;

          return (
            <div
              key={place.id}
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectPlace) onSelectPlace(place);
              }}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-full cursor-pointer transition-transform duration-200 hover:scale-125 z-10"
              style={{
                left: `calc(50% + ${px}px)`,
                top: `calc(50% + ${py}px)`
              }}
            >
              <div
                className={`relative flex items-center justify-center w-7 h-7 rounded-full shadow-lg border-2 ${
                  isSelected
                    ? 'border-white scale-125 ring-4 ring-cyan-400/50'
                    : 'border-slate-900 shadow-black/80'
                }`}
                style={{ backgroundColor: catDef.color }}
              >
                <MapPin className="w-4 h-4 text-white" />
                {isSelected && (
                  <span className="absolute -inset-1 rounded-full border-2 border-white animate-ping opacity-75" />
                )}
              </div>

              {/* Marker Mini Label */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-1.5 py-0.5 rounded bg-slate-950/90 text-[10px] font-bold text-white whitespace-nowrap shadow-md border border-slate-700/60 pointer-events-none line-clamp-1 max-w-[120px]">
                {place.name}
              </div>
            </div>
          );
        })}
      </div>

      {/* Crosshair Center Reticle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-5 h-5 rounded-full border border-cyan-400/40 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
        </div>
      </div>

      {/* Floating Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={() => setCurrentZoom((z) => Math.min(19, z + 1))}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 transition-all shadow-lg active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setCurrentZoom((z) => Math.max(3, z - 1))}
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 transition-all shadow-lg active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <a
          href={`https://www.openstreetmap.org/#map=${currentZoom}/${center.lat.toFixed(5)}/${center.lng.toFixed(5)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-400 transition-all shadow-lg active:scale-95"
          title="Open in OpenStreetMap"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Bottom OSM Attribution & Coordinate Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-400 shadow-xl">
        <span className="text-cyan-300 font-bold">
          {center.lat.toFixed(4)}°, {center.lng.toFixed(4)}°
        </span>
        <span className="text-slate-600">|</span>
        <span>Zoom {currentZoom}x</span>
        <span className="text-slate-600">|</span>
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-cyan-300 underline"
        >
          © OpenStreetMap contributors
        </a>
      </div>
    </div>
  );
}
