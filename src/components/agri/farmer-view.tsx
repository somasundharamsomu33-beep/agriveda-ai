"use client";

import React, { useState } from "react";
import {
  MapPin,
  Building2,
  Navigation,
  Calculator,
  Percent,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Send,
  IndianRupee,
  Layers,
  Sprout,
  Compass,
  CheckCircle2,
  Award,
  Activity,
  FileCheck,
  BadgeCheck,
} from "lucide-react";
import {
  LOAN_OFFICES,
  FARMERS_DATA,
  findOfficesWithinRadius,
  type LoanOffice,
  type FarmerProfile,
} from "@/data/agri-data";

interface FarmerViewProps {
  selectedFarmer: FarmerProfile;
  onSelectFarmer: (farmer: FarmerProfile) => void;
  onNavigateToOffice: (office: LoanOffice) => void;
  onOpenCalculator: () => void;
  onOpenApply: (officeId?: string) => void;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
}

export function FarmerView({
  selectedFarmer,
  onSelectFarmer,
  onNavigateToOffice,
  onOpenCalculator,
  onOpenApply,
  radiusKm,
  onRadiusChange,
}: FarmerViewProps) {
  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const nearbyOffices = findOfficesWithinRadius(selectedFarmer.coords, radiusKm);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Farmer Profile Card with Real Photo & Verification */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-3 shadow-md">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0">
            <img
              src={selectedFarmer.photoUrl}
              alt={selectedFarmer.name}
              className="size-14 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5" title="Aadhaar e-KYC Verified">
              <BadgeCheck className="size-3.5" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="text-xs font-bold text-foreground truncate">
                {selectedFarmer.name}
              </h3>
              <button
                onClick={() => setDetailsExpanded((prev) => !prev)}
                className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-colors cursor-pointer shrink-0"
                title={detailsExpanded ? "Minimize Card Details" : "Expand Card Details"}
              >
                {detailsExpanded ? "— Minimize" : "+ Expand"}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              {selectedFarmer.relationType || (selectedFarmer.gender === "female" ? "d/o" : "s/o")} {selectedFarmer.fatherName}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1">
              <Phone className="size-3 text-emerald-500" />
              {selectedFarmer.phone}
            </p>
          </div>
        </div>

        {/* Farmer Switcher dropdown */}
        <div>
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Select Active Farmer:
          </label>
          <select
            value={selectedFarmer.id}
            onChange={(e) => {
              const found = FARMERS_DATA.find((f) => f.id === e.target.value);
              if (found) onSelectFarmer(found);
            }}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background font-medium focus:ring-2 focus:ring-primary text-foreground"
          >
            {FARMERS_DATA.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.district}, {f.state}) - {f.cultivableAcres} ac cultivable
              </option>
            ))}
          </select>
        </div>

        {/* Collapsible Details Section (Land Telemetry, Crop Yields & Health) */}
        {detailsExpanded && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-1">
            {/* Land Breakdown Telemetry */}
            <div className="p-2.5 rounded-xl bg-muted/40 border border-border space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Total Land Owned:</span>
                <strong className="text-foreground font-mono">{selectedFarmer.totalAcresOwned} Acres</strong>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Cultivable Land:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedFarmer.cultivableAcres} Acres ({( (selectedFarmer.cultivableAcres / selectedFarmer.totalAcresOwned) * 100).toFixed(0)}%)
                </strong>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border/60">
                <span className="text-muted-foreground">Title / 7/12 Record:</span>
                <span className="text-foreground font-mono truncate max-w-[170px]" title={selectedFarmer.landTitleNumber}>
                  {selectedFarmer.landTitleNumber.split("(")[0]}
                </span>
              </div>
            </div>

            {/* Seasonal Yield Breakdown */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Seasonal Crop Yields & Revenue:
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 block truncate">
                    Kharif: {selectedFarmer.kharifCropDetails.crop.split(" ")[0]}
                  </span>
                  <span className="text-muted-foreground block font-mono">
                    {selectedFarmer.kharifCropDetails.yieldPerAcreQtl} Qtl/Acre ({selectedFarmer.kharifCropDetails.totalYieldQtl} Qtl)
                  </span>
                  <strong className="text-foreground block font-mono mt-0.5">
                    ₹{selectedFarmer.kharifCropDetails.estimatedRevenue.toLocaleString()}
                  </strong>
                </div>

                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="font-bold text-primary block truncate">
                    Rabi: {selectedFarmer.rabiCropDetails.crop.split(" ")[0]}
                  </span>
                  <span className="text-muted-foreground block font-mono">
                    {selectedFarmer.rabiCropDetails.yieldPerAcreQtl} Qtl/Acre ({selectedFarmer.rabiCropDetails.totalYieldQtl} Qtl)
                  </span>
                  <strong className="text-foreground block font-mono mt-0.5">
                    ₹{selectedFarmer.rabiCropDetails.estimatedRevenue.toLocaleString()}
                  </strong>
                </div>
              </div>
            </div>

            {/* Telemetry Chips */}
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-center font-mono">
              <div className="p-1.5 rounded-md bg-background border border-border">
                <span className="text-muted-foreground block text-[9px]">Satellite NDVI</span>
                <strong className="text-emerald-500">{(selectedFarmer.satelliteNdvi * 100).toFixed(0)}% Vigor</strong>
              </div>
              <div className="p-1.5 rounded-md bg-background border border-border">
                <span className="text-muted-foreground block text-[9px]">Soil Health</span>
                <strong className="text-primary">{selectedFarmer.soilHealthScore}/100</strong>
              </div>
              <div className="p-1.5 rounded-md bg-background border border-border">
                <span className="text-muted-foreground block text-[9px]">CIBIL Score</span>
                <strong className="text-emerald-500">{selectedFarmer.creditScore}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Hub */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenCalculator}
          className="p-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
        >
          <Calculator className="size-4" />
          <span>KCC Calculator</span>
          <span className="text-[9px] font-normal text-muted-foreground">4% Subsidized Rate</span>
        </button>

        <button
          onClick={() => onOpenApply()}
          className="p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shadow-xs"
        >
          <Send className="size-4" />
          <span>Apply for Loan</span>
          <span className="text-[9px] font-normal text-muted-foreground">Instant Fast-Track</span>
        </button>
      </div>

      {/* Radius Buffer Filter */}
      <div className="p-3 rounded-xl bg-card border border-border space-y-2 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
            <Compass className="size-3.5 text-primary" /> Loan Office Search Radius:
          </span>
          <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
            {radiusKm} km ({nearbyOffices.length} found)
          </span>
        </div>

        <input
          type="range"
          min="5"
          max="30"
          step="1"
          value={radiusKm}
          onChange={(e) => onRadiusChange(parseInt(e.target.value))}
          className="w-full accent-primary h-1.5 bg-muted rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
          <span>5 km</span>
          <span>10 km</span>
          <span>20 km</span>
          <span>30 km (Max)</span>
        </div>
      </div>

      {/* Nearest Loan Offices List */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>Nearby Loan Offices & Banks</span>
          <span className="text-primary">{nearbyOffices.length} in range</span>
        </div>

        {nearbyOffices.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-muted/20 border border-border text-xs text-muted-foreground space-y-2">
            <Building2 className="size-8 mx-auto opacity-40 text-muted-foreground" />
            <p>No agricultural loan branches found within {radiusKm} km.</p>
            <button
              onClick={() => onRadiusChange(100)}
              className="text-primary font-semibold hover:underline"
            >
              Expand radius to 100 km
            </button>
          </div>
        ) : (
          nearbyOffices.map((office) => (
            <div
              key={office.id}
              className="p-3.5 rounded-xl border border-border bg-card hover:border-primary/50 transition-all space-y-2.5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-primary/15 text-primary">
                      {office.type}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      ★ {office.rating}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold leading-tight mt-1 text-foreground">
                    {office.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {office.address}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-extrabold text-primary block">
                    {office.distanceKm} km
                  </span>
                  <span className="text-[9px] text-muted-foreground">away</span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 text-[9px]">
                <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  ⏱ {office.avgApprovalDays}d sanction
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                  4.0% p.a. KCC
                </span>
                <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                  IFSC: {office.ifscCode}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
                <button
                  onClick={() => onNavigateToOffice(office)}
                  className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center justify-center gap-1 transition-colors cursor-pointer"
                >
                  <Navigation className="size-3 text-primary" />
                  Show Route
                </button>
                <button
                  onClick={() => onOpenApply(office.id)}
                  className="px-2.5 py-1.5 text-[11px] font-bold rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  Apply Here
                  <ChevronRight className="size-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
