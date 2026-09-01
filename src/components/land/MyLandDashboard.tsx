import React, { useState } from 'react';
import { 
  Landmark, 
  Plus, 
  MapPin, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  X, 
  Upload, 
  Sparkles, 
  Droplets, 
  Sprout, 
  Info,
  Map as MapIcon
} from 'lucide-react';
import { LandParcel, UserProfile } from '../../types';
import { INITIAL_LAND_PARCELS } from '../../data/marketplaceFullData';
import { Map, MapMarker, MapGeoJSON, MarkerContent } from '../ui/map';

interface MyLandDashboardProps {
  profile: UserProfile;
}

export const MyLandDashboard: React.FC<MyLandDashboardProps> = ({ profile }) => {
  const [parcels, setParcels] = useState<LandParcel[]>(INITIAL_LAND_PARCELS);
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(INITIAL_LAND_PARCELS[0]);
  
  // Add Parcel Drawer Modal State
  const [showAddParcelModal, setShowAddParcelModal] = useState<boolean>(false);
  const [newParcelName, setNewParcelName] = useState<string>('');
  const [newSurveyNumber, setNewSurveyNumber] = useState<string>('');
  const [newSubdivision, setNewSubdivision] = useState<string>('');
  const [newVillage, setNewVillage] = useState<string>('Kovilpatti');
  const [newTaluk, setNewTaluk] = useState<string>('Kovilpatti');
  const [newDistrict, setNewDistrict] = useState<string>('Thoothukudi');
  const [newPattaNumber, setNewPattaNumber] = useState<string>('');
  const [newAreaAcres, setNewAreaAcres] = useState<number>(2.0);
  const [newCurrentCrop, setNewCurrentCrop] = useState<string>('Paddy / Rice');

  // Interactive Boundary Drawing Points State
  const [drawnBoundaryPoints, setDrawnBoundaryPoints] = useState<[number, number][]>([
    [77.8650, 9.1710],
    [77.8685, 9.1712],
    [77.8682, 9.1685],
    [77.8648, 9.1683]
  ]);

  const totalAcres = parcels.reduce((sum, p) => sum + p.areaAcres, 0);

  const handleMapClickForBoundary = (e: any) => {
    if (e && e.lngLat) {
      setDrawnBoundaryPoints(prev => [...prev, [e.lngLat.lng, e.lngLat.lat]]);
    }
  };

  const handleSaveParcel = (e: React.FormEvent) => {
    e.preventDefault();
    const created: LandParcel = {
      id: `land-${Date.now()}`,
      parcelName: newParcelName || `Farm Parcel ${parcels.length + 1}`,
      surveyNumber: newSurveyNumber || '101 / 1B',
      subdivisionNumber: newSubdivision || '1B',
      village: newVillage,
      taluk: newTaluk,
      district: newDistrict,
      state: 'Tamil Nadu',
      pattaNumber: newPattaNumber || `PATTA-${Math.floor(10000 + Math.random() * 90000)}`,
      areaAcres: newAreaAcres,
      ownershipType: 'Self-Owned',
      currentCrop: newCurrentCrop,
      soilType: 'Red Soil',
      irrigationSource: 'Borewell',
      boundaryCoords: drawnBoundaryPoints,
      createdAt: new Date().toISOString()
    };

    setParcels(prev => [...prev, created]);
    setSelectedParcel(created);
    setShowAddParcelModal(false);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/60 rounded-full border border-emerald-400/30 text-xs font-bold text-emerald-200">
            <Landmark className="w-3.5 h-3.5 text-amber-300" />
            <span>Digital Land Parcel Manager & Patta/Chitta Hub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            My Land Digital Holdings
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 font-medium">
            Digitally map farm boundaries, manage Survey/Patta numbers, soil profiles & irrigation records.
          </p>
        </div>

        <button
          onClick={() => setShowAddParcelModal(true)}
          className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add & Map New Land Parcel</span>
        </button>
      </div>

      {/* Official Government Records Disclaimer Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-amber-950">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-black text-amber-900 text-sm">Official Government Land Records Access</h4>
            <p className="text-amber-800">
              AgriVeda Digital Land Profile helps you manage farm boundaries and crop plans. For official state legal Patta / Chitta extracts, visit the state land portal.
            </p>
          </div>
        </div>

        <a
          href="https://eservices.tn.gov.in/eservicesweb/land/patta.html?lan=en"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors"
        >
          <span>Official TN Patta / Chitta Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Land Holding</span>
          <p className="text-2xl font-black text-slate-900">{totalAcres.toFixed(1)} Acres</p>
          <span className="text-[11px] font-bold text-emerald-600 block">{parcels.length} Digital Parcels</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Cultivation</span>
          <p className="text-2xl font-black text-emerald-600">Paddy & Tomato</p>
          <span className="text-[11px] font-bold text-slate-500 block">Samba 2026 Season</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Patta Status</span>
          <p className="text-2xl font-black text-blue-700">VERIFIED ✓</p>
          <span className="text-[11px] font-bold text-slate-500 block">Tamil Nadu Revenue Record</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Irrigation Source</span>
          <p className="text-2xl font-black text-slate-900">Borewell & Drip</p>
          <span className="text-[11px] font-bold text-slate-500 block">100% Water Coverage</span>
        </div>
      </div>

      {/* Land Parcels List & Detail Split Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left List of Parcels */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider px-1">Your Land Parcels ({parcels.length})</h3>

          {parcels.map(p => {
            const isSelected = selectedParcel?.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedParcel(p)}
                className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-white text-slate-900 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm">{p.parcelName}</h4>
                  <span className={`px-2 py-0.5 text-[10px] font-black rounded-md ${
                    isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {p.areaAcres} Acres
                  </span>
                </div>

                <p className={`text-xs font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  Survey No: <span className="font-bold">{p.surveyNumber}</span> • Patta: <span className="font-bold">{p.pattaNumber}</span>
                </p>

                <div className="flex items-center justify-between text-[11px] font-bold pt-1 border-t border-slate-700/40">
                  <span className="text-emerald-400">Crop: {p.currentCrop}</span>
                  <span className={isSelected ? 'text-slate-400' : 'text-slate-500'}>{p.village}, {p.district}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Selected Parcel Inspector & Map Canvas */}
        <div className="lg:col-span-2 space-y-6">
          {selectedParcel && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md border border-emerald-200">
                    {selectedParcel.ownershipType} • {selectedParcel.areaAcres} Acres
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{selectedParcel.parcelName}</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Village: {selectedParcel.village} • Taluk: {selectedParcel.taluk} • District: {selectedParcel.district}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-50 text-blue-800 font-black text-xs rounded-xl border border-blue-200">
                    Patta: {selectedParcel.pattaNumber}
                  </span>
                </div>
              </div>

              {/* GeoJSON Map Canvas Boundary Overlay */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <MapIcon className="w-4 h-4 text-emerald-600" />
                    <span>Mapped Farm Boundary Canvas</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedParcel.boundaryCoords.length} Boundary Vertices Recorded
                  </span>
                </div>

                <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-950">
                  <Map
                    viewport={{
                      center: selectedParcel.boundaryCoords[0] || [77.865, 9.171],
                      zoom: 15.5,
                      bearing: 0,
                      pitch: 30
                    }}
                    onViewportChange={() => {}}
                    className="w-full h-full"
                  >
                    <MapGeoJSON
                      id="selected-parcel-boundary"
                      data={{
                        type: 'Feature',
                        geometry: {
                          type: 'Polygon',
                          coordinates: [[...selectedParcel.boundaryCoords, selectedParcel.boundaryCoords[0]]]
                        },
                        properties: {}
                      }}
                      fillPaint={{ 'fill-color': '#10b981', 'fill-opacity': 0.25 }}
                      linePaint={{ 'line-color': '#059669', 'line-width': 3 }}
                    />
                  </Map>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Survey Number</span>
                  <span className="font-black text-slate-900">{selectedParcel.surveyNumber}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Subdivision Number</span>
                  <span className="font-black text-slate-900">{selectedParcel.subdivisionNumber}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Soil Type</span>
                  <span className="font-black text-slate-900">{selectedParcel.soilType}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Crop</span>
                  <span className="font-black text-emerald-700">{selectedParcel.currentCrop}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Irrigation Source</span>
                  <span className="font-black text-blue-700">{selectedParcel.irrigationSource}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Registered Date</span>
                  <span className="font-bold text-slate-700">{new Date(selectedParcel.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {selectedParcel.chittaNotes && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Chitta Extract Notes</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{selectedParcel.chittaNotes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add & Map Land Parcel Drawer Modal */}
      {showAddParcelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-8 relative p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-emerald-600" />
                <span>Add & Map New Land Parcel</span>
              </h3>
              <button onClick={() => setShowAddParcelModal(false)} className="p-1 rounded-full hover:bg-slate-100 cursor-pointer">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveParcel} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Parcel Name (e.g. Farm 1 / East Paddy Field)</label>
                <input
                  type="text"
                  required
                  value={newParcelName}
                  onChange={(e) => setNewParcelName(e.target.value)}
                  placeholder="Enter parcel title..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Survey Number</label>
                  <input
                    type="text"
                    required
                    value={newSurveyNumber}
                    onChange={(e) => setNewSurveyNumber(e.target.value)}
                    placeholder="e.g. 142 / 2A"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Subdivision Number</label>
                  <input
                    type="text"
                    value={newSubdivision}
                    onChange={(e) => setNewSubdivision(e.target.value)}
                    placeholder="e.g. 2A1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Patta Number</label>
                  <input
                    type="text"
                    value={newPattaNumber}
                    onChange={(e) => setNewPattaNumber(e.target.value)}
                    placeholder="PATTA-98421"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Land Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newAreaAcres}
                    onChange={(e) => setNewAreaAcres(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              {/* Interactive Boundary Drawing Canvas */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Interactive Farm Boundary Canvas (Click map to drop points)</label>
                <div className="h-44 w-full rounded-2xl overflow-hidden border border-slate-200 relative bg-slate-950">
                  <Map
                    viewport={{ center: [77.865, 9.171], zoom: 15 }}
                    onViewportChange={() => {}}
                    onMapClick={handleMapClickForBoundary}
                    className="w-full h-full"
                  >
                    {drawnBoundaryPoints.length >= 3 && (
                      <MapGeoJSON
                        id="new-boundary-preview"
                        data={{
                          type: 'Feature',
                          geometry: {
                            type: 'Polygon',
                            coordinates: [[...drawnBoundaryPoints, drawnBoundaryPoints[0]]]
                          },
                          properties: {}
                        }}
                        fillPaint={{ 'fill-color': '#10b981', 'fill-opacity': 0.3 }}
                        linePaint={{ 'line-color': '#059669', 'line-width': 2.5 }}
                      />
                    )}
                  </Map>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">{drawnBoundaryPoints.length} Boundary points recorded.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md cursor-pointer"
              >
                Save Digital Land Parcel
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
