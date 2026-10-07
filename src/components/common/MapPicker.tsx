import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin, Navigation, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface MapPickerProps {
  selectedLat?: number;
  selectedLng?: number;
  onSelectLocation: (lat: number, lng: number, addressText?: string) => void;
}

// Point in polygon algorithm
const isPointInPolygon = (lat: number, lng: number, polygon: [number, number][]): boolean => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = yi > lng !== yj > lng && lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const MapPicker: React.FC<MapPickerProps> = ({
  selectedLat = 31.4328,
  selectedLng = 73.1295,
  onSelectLocation,
}) => {
  const { deliveryZones, siteConfig } = useData();
  const { t, formatPrice } = useLanguage();

  const [lat, setLat] = useState<number>(selectedLat);
  const [lng, setLng] = useState<number>(selectedLng);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Check matching zone
  const matchedZone = deliveryZones.find((z) => isPointInPolygon(lat, lng, z.polygon));

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setLat(userLat);
        setLng(userLng);
        onSelectLocation(userLat, userLng, 'My Current GPS Location');
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { timeout: 8000 }
    );
  };

  const presetLocations = [
    { name: 'Raza Town (West Canal Rd)', lat: 31.4328, lng: 73.1295 },
    { name: 'Green Avenue', lat: 31.4284, lng: 73.1251 },
    { name: 'Kohinoor City Sector', lat: 31.415, lng: 73.11 },
    { name: 'D-Ground Faisalabad', lat: 31.408, lng: 73.095 },
  ];

  return (
    <div className="space-y-3 rounded-2xl border border-[#2B1B12]/15 dark:border-white/10 p-4 bg-white/60 dark:bg-black/30">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0F3D2E] dark:text-[#E2B882] flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#C48A4A]" />
          Select Delivery Pin (Faisalabad)
        </label>
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F3D2E] dark:text-[#E2B882] hover:underline cursor-pointer"
        >
          <Navigation className="w-3 h-3" />
          {isLocating ? 'Locating...' : 'Use My Location'}
        </button>
      </div>

      {/* Preset Quick Locations */}
      <div className="flex flex-wrap gap-2">
        {presetLocations.map((loc) => (
          <button
            key={loc.name}
            type="button"
            onClick={() => {
              setLat(loc.lat);
              setLng(loc.lng);
              onSelectLocation(loc.lat, loc.lng, loc.name);
            }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
              Math.abs(lat - loc.lat) < 0.001 && Math.abs(lng - loc.lng) < 0.001
                ? 'bg-[#0F3D2E] text-white border-[#0F3D2E]'
                : 'bg-white dark:bg-[#0A2A20] text-[#2B1B12] dark:text-[#F6EFE3] border-[#2B1B12]/10 hover:border-[#0F3D2E]'
            }`}
          >
            {loc.name}
          </button>
        ))}
      </div>

      {/* Interactive OpenStreetMap preview frame centered on coordinates */}
      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#2B1B12]/10 shadow-inner">
        <iframe
          title="OpenStreetMap Location"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.02}%2C${lat - 0.015}%2C${lng + 0.02}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lng}`}
          className="w-full h-full pointer-events-none"
        />
        <div className="absolute inset-0 bg-transparent pointer-events-none" />
      </div>

      {/* Zone detection banner */}
      {matchedZone ? (
        <div className="p-3 rounded-xl bg-[#2E7D32]/10 border border-[#2E7D32]/20 text-[#2E7D32] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold">{matchedZone.name}</span>
              <p className="text-[11px] opacity-90">ETA: {matchedZone.etaMinutes} · Min order: {formatPrice(matchedZone.minOrder)}</p>
            </div>
          </div>
          <span className="font-bold text-sm">{formatPrice(matchedZone.fee)}</span>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-[#C0392B]/10 border border-[#C0392B]/20 text-[#C0392B] flex items-center gap-2 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Selected address is currently outside our immediate delivery zone. You can still order for Takeaway Pickup!</span>
        </div>
      )}
    </div>
  );
};
