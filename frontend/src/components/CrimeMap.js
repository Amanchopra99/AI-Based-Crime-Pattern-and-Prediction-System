import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const DARK_TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

const CrimeMap = ({ hotspots = [], center = [28.6139, 77.2090], zoom = 11, height = '100%', onMapClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    
    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
      attributionControl: false,
    });

    L.tileLayer(DARK_TILE, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    if (onMapClick) {
      map.on('click', (e) => {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || hotspots.length === 0) return;

    // Clear existing
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // Create heatmap data
    const heatData = hotspots.map(h => [
      h.latitude,
      h.longitude,
      h.risk_level === 'High' ? 1.0 : h.risk_level === 'Medium' ? 0.6 : 0.3
    ]);

    if (heatData.length > 0) {
      heatLayerRef.current = L.heatLayer(heatData, {
        radius: 25,
        blur: 20,
        maxZoom: 15,
        gradient: {
          0.2: '#34C759',
          0.4: '#00F0FF',
          0.6: '#FFB000',
          0.8: '#FF6B00',
          1.0: '#FF3B30'
        }
      }).addTo(map);
    }

    // Add markers for high risk only
    hotspots.filter(h => h.risk_level === 'High').slice(0, 30).forEach(h => {
      const color = '#FF3B30';
      const marker = L.circleMarker([h.latitude, h.longitude], {
        radius: 5,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.6
      }).addTo(map);
      
      marker.bindPopup(`
        <div style="background:#0A0A0A;color:#fff;padding:8px;border-radius:6px;font-family:Manrope,sans-serif;min-width:150px">
          <div style="font-size:11px;color:#A1A1AA;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:4px">${h.crime_type || 'Crime'}</div>
          <div style="font-size:14px;font-weight:bold;color:${color}">${h.risk_level} Risk</div>
          <div style="font-size:12px;color:#A1A1AA;margin-top:4px">${h.location || ''}</div>
        </div>
      `, { className: 'dark-popup' });
      
      markersRef.current.push(marker);
    });
  }, [hotspots]);

  return (
    <div ref={mapRef} style={{ height, width: '100%', borderRadius: '8px' }} data-testid="crime-map-container" />
  );
};

export default CrimeMap;
