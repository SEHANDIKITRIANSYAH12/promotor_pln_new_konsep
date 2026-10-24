'use client';

import React, { useEffect, useRef } from 'react';
import { PoleData } from '@/types';
import 'leaflet/dist/leaflet.css';

interface GeotagMapProps {
  poles: PoleData[];
  onViewPhoto?: (photoUrl: string, title: string, caption: string) => void;
}

export const GeotagMap: React.FC<GeotagMapProps> = ({ poles, onViewPhoto }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const currentTileRef = useRef<any>(null);

  const [mapType, setMapType] = React.useState<'googleHybrid' | 'googleStreets' | 'esriSatellite' | 'osm'>('googleHybrid');

  const validPoles = poles.filter((p) => p.lat !== null && p.lng !== null);

  const getTileLayer = (L: any, type: string) => {
    if (type === 'googleStreets') {
      return L.tileLayer('https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 21,
        attribution: '© Google Maps',
      });
    } else if (type === 'esriSatellite') {
      return L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: '© Esri Satellite',
      });
    } else if (type === 'osm') {
      return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap',
      });
    } else {
      // Default: Google Satelit Hybrid (citra satelit asli + label jalan PLN)
      return L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 21,
        attribution: '© Google Maps Satellite',
      });
    }
  };

  useEffect(() => {
    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Initialize map if not yet done
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapContainerRef.current, {
          zoomControl: true,
        });

        currentTileRef.current = getTileLayer(L, mapType);
        currentTileRef.current.addTo(mapInstanceRef.current);
      } else {
        // Switch layer if changed
        if (currentTileRef.current) {
          mapInstanceRef.current.removeLayer(currentTileRef.current);
        }
        currentTileRef.current = getTileLayer(L, mapType);
        currentTileRef.current.addTo(mapInstanceRef.current);
      }

      // Clear existing markers & polyline
      markersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m));
      markersRef.current = [];

      if (polylineRef.current) {
        mapInstanceRef.current.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }

      mapInstanceRef.current.invalidateSize();

      if (validPoles.length > 0) {
        const latLngs: [number, number][] = [];
        const coordCountMap: Record<string, number> = {};

        validPoles.forEach((p) => {
          let lat = p.lat!;
          let lng = p.lng!;
          const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;

          // If another pole shares the exact same coordinate (e.g. clicked GPS from the same test desk),
          // offset it slightly (spiderfy offset) so both markers remain clearly visible
          if (coordCountMap[key]) {
            const count = coordCountMap[key];
            const angle = (count * Math.PI) / 3;
            const offsetDist = 0.00018 * count;
            lat = lat + Math.sin(angle) * offsetDist;
            lng = lng + Math.cos(angle) * offsetDist;
            coordCountMap[key] = count + 1;
          } else {
            coordCountMap[key] = 1;
          }

          const pos: [number, number] = [lat, lng];
          latLngs.push(pos);

          const isTM = (p.networkType === 'JTM' || p.networkType === 'SUTM' || !p.networkType || p.id.startsWith('TM'));
          const isTrafo = (p.tmConstruction || '').includes('GARDU') || (p.trConstruction || '').includes('GARDU');
          const isAwalAkhir = (p.tmConstruction || '').includes('7') || (p.trConstruction || '').includes('AWAL') || (p.trConstruction || '').includes('AKHIR');

          // Classic PLN GIS / CAD Styling:
          // JTM = Red square box with Cyan crossarm whiskers and bright yellow text
          // JTR = Emerald/Cyan square box with bright yellow/lime text
          // Trafo = Blue box with green/red transformer symbol
          const labelText = p.id;
          const specText = isTM ? (p.tmConstruction || 'TM1') : (p.trConstruction || 'TR1');

          let markerHtml = '';

          if (isTrafo) {
            // Rencana Trafo Symbol (Cyan box + Red & Green triangles)
            markerHtml = `
              <div style="position:relative;display:flex;align-items:center;cursor:pointer;">
                <div style="
                  width: 32px;
                  height: 18px;
                  background: #000;
                  border: 2px solid #00e5ff;
                  border-radius: 2px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  gap: 3px;
                  box-shadow: 0 0 8px rgba(0,229,255,0.7);
                ">
                  <span style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-bottom:8px solid #ef4444;"></span>
                  <span style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid #22c55e;"></span>
                </div>
                <!-- Classic PLN Green Neon Trafo Text -->
                <div style="
                  margin-left: 8px;
                  font-family: 'Consolas', 'Courier New', monospace;
                  font-size: 11px;
                  font-weight: 900;
                  color: #00ff66;
                  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 6px rgba(0,0,0,0.9);
                  white-space: nowrap;
                  letter-spacing: 0.5px;
                ">
                  ${labelText} (RENCANA TRAFO)
                </div>
              </div>
            `;
          } else {
            // Classic PLN Pole: Red Square with Cyan Border & Crossarms whiskers
            markerHtml = `
              <div style="position:relative;display:flex;align-items:center;cursor:pointer;">
                <!-- Crossarm Whisker lines (classic PLN single line diagram) -->
                <svg style="position:absolute;left:-8px;top:-8px;width:30px;height:30px;pointer-events:none;overflow:visible;">
                  <line x1="0" y1="3" x2="7" y2="7" stroke="#00e5ff" stroke-width="2" />
                  <line x1="2" y1="12" x2="7" y2="7" stroke="#00e5ff" stroke-width="2" />
                  <line x1="0" y1="1" x2="4" y2="7" stroke="#00e5ff" stroke-width="1.5" />
                  <line x1="7" y1="7" x2="7" y2="7" stroke="#00e5ff" stroke-width="2" />
                </svg>

                <!-- Center Pole Square / Dot -->
                <div style="
                  width: 14px;
                  height: 14px;
                  background: ${isTM ? '#e11d48' : '#0284c7'};
                  border: 2px solid ${isTM ? '#00e5ff' : '#a7f3d0'};
                  box-shadow: 0 0 6px ${isTM ? '#00e5ff' : '#0284c7'};
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                  z-index: 2;
                ">
                  <div style="width: 4px; height: 4px; background: #ffffff; border-radius: 1px;"></div>
                </div>

                <!-- Classic Neon Yellow / Cyan Label text -->
                <div style="
                  margin-left: 6px;
                  font-family: 'Consolas', 'Courier New', monospace;
                  font-size: 11px;
                  font-weight: 900;
                  color: ${isTM ? '#ffe600' : '#38bdf8'};
                  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 4px #000;
                  white-space: nowrap;
                  line-height: 1.1;
                ">
                  <div>${labelText}</div>
                  <div style="font-size: 9px; color: #ffffff; opacity: 0.9;">${specText}</div>
                </div>
              </div>
            `;
          }

          const poleIcon = L.divIcon({
            className: 'pln-classic-tag',
            html: markerHtml,
            iconSize: [20, 20],
            iconAnchor: [7, 7],
          });

          const marker = L.marker(pos, { icon: poleIcon }).addTo(mapInstanceRef.current);

          const specBadge = isTM
            ? `<span style="display:inline-block;padding:2px 6px;background:#eff6ff;color:#1d4ed8;font-weight:bold;font-size:10px;border-radius:4px;border:1px solid #bfdbfe">⚡ JTM • ${p.tmConstruction || '1B'} • ${p.a3cs || '3x150 mm²'}</span>`
            : `<span style="display:inline-block;padding:2px 6px;background:#ecfdf5;color:#047857;font-weight:bold;font-size:10px;border-radius:4px;border:1px solid #a7f3d0">🔌 JTR • ${p.trConstruction || '1B'} • ${p.lvTwisted || 'JTR 70'}</span>`;

          const noteHtml = p.note
            ? `<div style="margin-top:6px;padding:5px 8px;background:#f8fafc;border-left:3px solid #64748b;border-radius:4px;font-size:11px;color:#334155"><b>Keterangan:</b> ${p.note}</div>`
            : '';

          const photoHtml = p.photo
            ? `<div style="margin-top:8px;text-align:center">
                <img src="${p.photo}" style="width:100%;max-height:110px;object-fit:cover;border-radius:6px;border:1px solid #cbd5e1;cursor:pointer" alt="${p.name}" />
                <span style="display:block;margin-top:4px;color:#1a56db;font-size:11px;font-weight:600">Dokumentasi Foto Lapangan</span>
               </div>`
            : '<div style="margin-top:5px;font-size:10px;color:#94a3b8;font-style:italic">📷 Belum ada foto terlampir</div>';

          marker.bindPopup(`
            <div style="min-width:210px;max-width:250px;font-family:sans-serif">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:4px;margin-bottom:4px">
                <span style="font-size:13px;font-weight:bold;color:#0f172a">${p.id}</span>
                <span style="font-size:10px;font-weight:800;color:${isTM ? '#dc2626' : '#0284c7'}">${isTM ? 'JTM (TM)' : 'JTR (TR)'}</span>
              </div>
              <div style="margin-bottom:6px">${specBadge}</div>
              <div style="font-size:10px;color:#475569;font-family:monospace;background:#f1f5f9;padding:3px 6px;border-radius:4px;border:1px solid #cbd5e1;margin-bottom:4px">
                📍 GPS: ${p.lat!.toFixed(7)}, ${p.lng!.toFixed(7)}
              </div>
              ${noteHtml}
              ${photoHtml}
            </div>
          `);

          marker.bindTooltip(`<b>${p.id}</b> [${p.tmConstruction || p.trConstruction || p.poleType}]`, {
            direction: 'top',
            offset: [0, -10],
          });

          markersRef.current.push(marker);
        });

        if (latLngs.length > 1) {
          // Classic PLN GIS Line: Fluorescent Green / Neon dashed line (Jalur Rencana Jaringan)
          polylineRef.current = L.polyline(latLngs, {
            color: '#00ff66',
            weight: 3,
            dashArray: '8, 6',
            opacity: 1.0,
          }).addTo(mapInstanceRef.current);
        }

        const bounds = L.latLngBounds(latLngs);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
      } else {
        mapInstanceRef.current.setView([-6.12, 106.15], 13);
      }

      // Ensure leaflet recalculates container size immediately after mounting in modal tab
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 150);
    });

    return () => {
      isMounted = false;
    };
  }, [poles, mapType]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800">Visualisasi Peta Geotagging Tiang</span>
            <p className="text-[11px] text-slate-500">
              {validPoles.length} dari {poles.length} titik tiang terpetakan dengan koordinat GPS
            </p>
          </div>

          {/* Legend Badges for Classic PLN Map */}
          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-rose-700 border border-rose-200 shadow-2xs font-mono">
              <span className="w-3 h-3 bg-rose-600 border border-cyan-400 rounded-[2px] shadow-xs"></span>
              JTM (TM)
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-sky-700 border border-sky-200 shadow-2xs font-mono">
              <span className="w-3 h-3 bg-sky-600 border border-emerald-400 rounded-[2px] shadow-xs"></span>
              JTR (TR)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[11px] text-slate-500 font-medium">Layer Peta:</label>
          <select
            value={mapType}
            onChange={(e) => setMapType(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-blue-500"
          >
            <option value="googleHybrid">🛰️ Google Satelit (Hybrid)</option>
            <option value="googleStreets">🗺️ Google Maps (Jalan)</option>
            <option value="esriSatellite">🌍 Esri Satelit HD</option>
            <option value="osm">🌐 OpenStreetMap</option>
          </select>
        </div>
      </div>

      <div className="relative w-full h-[360px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
      </div>
    </div>
  );
};
