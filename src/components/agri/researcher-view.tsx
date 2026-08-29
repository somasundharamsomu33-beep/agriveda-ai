"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Download,
  Database,
  BarChart3,
  Layers,
  FileSpreadsheet,
  Globe,
  MapPin,
  TrendingUp,
  Percent,
  CheckCircle2,
  Sparkles,
  Building2,
  ExternalLink,
  BookOpen,
  FlaskConical,
} from "lucide-react";
import {
  LOAN_OFFICES,
  FARMERS_DATA,
  RESEARCH_INSTITUTES,
  AGRO_CLIMATIC_ZONES_GEOJSON,
  exportToCsv,
  exportToGeoJson,
  type LoanOffice,
  type FarmerProfile,
  type ResearchInstitute,
} from "@/data/agri-data";

interface ResearcherViewProps {
  onHighlightZone: (zoneId: string) => void;
  showAgroZones: boolean;
  onToggleAgroZones: (show: boolean) => void;
  onSelectInstitute?: (institute: ResearchInstitute) => void;
}

export function ResearcherView({
  onHighlightZone,
  showAgroZones,
  onToggleAgroZones,
  onSelectInstitute,
}: ResearcherViewProps) {
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"analytics" | "institutes">("analytics");

  // Compute aggregate academic research metrics
  const totalFarmers = FARMERS_DATA.length;
  const avgLandHolding = (
    FARMERS_DATA.reduce((acc, f) => acc + f.cultivableAcres, 0) / totalFarmers
  ).toFixed(1);
  const kccHolderCount = FARMERS_DATA.filter((f) => f.kccCardHolder).length;
  const kccPenetrationPct = ((kccHolderCount / totalFarmers) * 100).toFixed(0);
  const totalCreditDemandLakhs = (
    FARMERS_DATA.reduce((acc, f) => acc + f.requestedLoanAmount, 0) / 100000
  ).toFixed(1);
  const avgSoilScore = (
    FARMERS_DATA.reduce((acc, f) => acc + f.soilHealthScore, 0) / totalFarmers
  ).toFixed(0);

  const handleExportFarmersCsv = () => {
    const flatFarmers = FARMERS_DATA.map((f) => ({
      Farmer_ID: f.id,
      Name: f.name,
      Village: f.village,
      District: f.district,
      State: f.state,
      Longitude: f.coords[0],
      Latitude: f.coords[1],
      Total_Acres_Owned: f.totalAcresOwned,
      Cultivable_Acres: f.cultivableAcres,
      Kharif_Yield_Qtl: f.kharifCropDetails.totalYieldQtl,
      Rabi_Yield_Qtl: f.rabiCropDetails.totalYieldQtl,
      Gross_Revenue_INR: f.annualGrossFarmIncome,
      Primary_Crop: f.primaryCrop,
      Season: f.cropSeason,
      Soil_Health_Score: f.soilHealthScore,
      Satellite_NDVI: f.satelliteNdvi,
      KCC_Holder: f.kccCardHolder ? "YES" : "NO",
      Loan_Requested_INR: f.requestedLoanAmount,
      Credit_Score: f.creditScore,
      Application_Status: f.applicationStatus,
    }));
    exportToCsv(flatFarmers, "sih_farmers_geodataset_2026");
    triggerFeedback("Farmer dataset exported as CSV");
  };

  const handleExportInstitutesCsv = () => {
    const flatInst = RESEARCH_INSTITUTES.map((inst) => ({
      Institute_ID: inst.id,
      Name: inst.name,
      Type: inst.type,
      Director: inst.directorName,
      State: inst.state,
      District: inst.district,
      Longitude: inst.coords[0],
      Latitude: inst.coords[1],
      Established: inst.establishedYear,
      Research_Focus: inst.researchFocus,
      Open_Datasets_Count: inst.openDatasetsCount,
      Student_Projects: inst.activeStudentProjects,
      Contact_Phone: inst.contactPhone,
      Email: inst.email,
    }));
    exportToCsv(flatInst, "sih_research_institutes_2026");
    triggerFeedback("Research Institutes dataset exported as CSV");
  };

  const handleExportOfficesCsv = () => {
    const flatOffices = LOAN_OFFICES.map((o) => ({
      Branch_ID: o.id,
      Name: o.name,
      Type: o.type,
      Category: o.categoryName,
      District: o.district,
      State: o.state,
      Longitude: o.coords[0],
      Latitude: o.coords[1],
      IFSC: o.ifscCode,
      Min_Interest_Rate_Pct: o.minInterestRate,
      Avg_Approval_Days: o.avgApprovalDays,
      Available_Funds_Cr: o.availableCreditFundsCr,
      Sanctioned_Qtr_Cr: o.sanctionedThisQuarterCr,
      Rating: o.rating,
    }));
    exportToCsv(flatOffices, "sih_agricultural_banks_branches_2026");
    triggerFeedback("Loan Offices dataset exported as CSV");
  };

  const handleExportGeoJson = () => {
    const features: GeoJSON.Feature[] = [
      ...FARMERS_DATA.map((f) => ({
        type: "Feature" as const,
        properties: {
          id: f.id,
          name: f.name,
          crop: f.primaryCrop,
          cultivableAcres: f.cultivableAcres,
          totalAcres: f.totalAcresOwned,
          ndvi: f.satelliteNdvi,
          status: f.applicationStatus,
        },
        geometry: {
          type: "Point" as const,
          coordinates: f.coords,
        },
      })),
      ...RESEARCH_INSTITUTES.map((inst) => ({
        type: "Feature" as const,
        properties: {
          id: inst.id,
          name: inst.name,
          type: inst.type,
          focus: inst.researchFocus,
          director: inst.directorName,
        },
        geometry: {
          type: "Point" as const,
          coordinates: inst.coords,
        },
      })),
      ...LOAN_OFFICES.map((o) => ({
        type: "Feature" as const,
        properties: {
          id: o.id,
          name: o.name,
          type: o.type,
          fundsCr: o.availableCreditFundsCr,
        },
        geometry: {
          type: "Point" as const,
          coordinates: o.coords,
        },
      })),
    ];

    exportToGeoJson(features, "sih_national_agri_geodataset_2026");
    triggerFeedback("National Agri GeoJSON exported");
  };

  const triggerFeedback = (msg: string) => {
    setExportFeedback(msg);
    setTimeout(() => setExportFeedback(null), 4000);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header Metric Bar */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-purple-500/15 text-purple-600 dark:text-purple-400">
              <FlaskConical className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                Spatial Econometrics & R&D Hub
              </h3>
              <p className="text-[10px] text-muted-foreground">
                National Agri Data & ICAR Institutes
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400">
            Open Access
          </span>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 bg-muted/50 rounded-xl border border-border text-[11px] font-bold">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
              activeTab === "analytics"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Regional Analytics
          </button>
          <button
            onClick={() => setActiveTab("institutes")}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center cursor-pointer ${
              activeTab === "institutes"
                ? "bg-purple-600 text-white shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Research Institutes ({RESEARCH_INSTITUTES.length})
          </button>
        </div>

        {/* Agro-climatic Layer Switcher */}
        <div className="flex items-center justify-between pt-1 border-t border-border/60">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Layers className="size-3.5 text-purple-500" /> Agro-Climatic Zones Layer
          </span>
          <button
            onClick={() => onToggleAgroZones(!showAgroZones)}
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-colors cursor-pointer ${
              showAgroZones
                ? "bg-purple-500/15 border-purple-500/40 text-purple-600 dark:text-purple-400"
                : "bg-muted border-border text-muted-foreground"
            }`}
          >
            {showAgroZones ? "Enabled" : "Disabled"}
          </button>
        </div>
      </div>

      {activeTab === "institutes" ? (
        /* Research Institutes Directory */
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Apex ICAR & State Universities</span>
            <button
              onClick={handleExportInstitutesCsv}
              className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 font-bold lowercase"
            >
              <Download className="size-3" /> csv
            </button>
          </div>

          {RESEARCH_INSTITUTES.map((inst) => (
            <div
              key={inst.id}
              className="p-3.5 rounded-2xl border border-border bg-card hover:border-purple-500/50 transition-all space-y-2.5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <img
                  src={inst.directorPhotoUrl}
                  alt={inst.directorName}
                  className="size-12 rounded-xl object-cover border-2 border-purple-500 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400">
                    {inst.type}
                  </span>
                  <h4 className="text-xs font-bold leading-tight mt-1 text-foreground">
                    {inst.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {inst.directorName}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-muted/40 border border-border text-[10px] space-y-1">
                <div>
                  <span className="text-muted-foreground block text-[9px]">Key Research Focus:</span>
                  <strong className="text-foreground">{inst.researchFocus}</strong>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <span className="text-muted-foreground">Open Datasets:</span>
                  <strong className="text-purple-600 dark:text-purple-400 font-mono">
                    {inst.openDatasetsCount} Datasets Available
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Active Projects:</span>
                  <strong className="text-foreground font-mono">
                    {inst.activeStudentProjects} Research Fellowships
                  </strong>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-border/60 text-[10px]">
                <button
                  onClick={() => onSelectInstitute?.(inst)}
                  className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                >
                  <MapPin className="size-3" /> Focus Campus on Map
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Regional Analytics & Econometrics */
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {/* Micro-Stats 2x2 */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5 shadow-xs">
              <span className="text-[10px] text-muted-foreground font-medium">Avg Land Holding</span>
              <strong className="text-sm font-mono text-foreground block">{avgLandHolding} Acres</strong>
              <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">
                National Sample
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5 shadow-xs">
              <span className="text-[10px] text-muted-foreground font-medium">KCC Penetration</span>
              <strong className="text-sm font-mono text-purple-600 dark:text-purple-400 block">{kccPenetrationPct}%</strong>
              <span className="text-[9px] text-muted-foreground">
                {kccHolderCount} of {totalFarmers} Sampled
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5 shadow-xs">
              <span className="text-[10px] text-muted-foreground font-medium">Total Credit Demand</span>
              <strong className="text-sm font-mono text-foreground block">₹{totalCreditDemandLakhs} L</strong>
              <span className="text-[9px] text-muted-foreground">Active Loan Requests</span>
            </div>

            <div className="p-2.5 rounded-xl bg-card border border-border space-y-0.5 shadow-xs">
              <span className="text-[10px] text-muted-foreground font-medium">Mean Soil Score</span>
              <strong className="text-sm font-mono text-emerald-600 dark:text-emerald-400 block">{avgSoilScore}/100</strong>
              <span className="text-[9px] text-muted-foreground">High Organic Matter</span>
            </div>
          </div>

          {/* Agro Climatic Zones Explorer */}
          <div className="p-3 rounded-2xl bg-card border border-border space-y-2 shadow-sm">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Agro-Climatic Agro Zones</span>
              <Globe className="size-3.5 text-purple-500" />
            </div>

            <div className="space-y-1.5 text-xs">
              {AGRO_CLIMATIC_ZONES_GEOJSON.features.map((feature) => {
                const props = feature.properties;
                if (!props) return null;
                return (
                  <button
                    key={props.zoneId}
                    onClick={() => onHighlightZone(props.zoneId)}
                    className="w-full text-left p-2 rounded-xl bg-muted/40 hover:bg-muted/80 border border-border transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <strong className="text-[11px] block group-hover:text-purple-600 dark:group-hover:text-purple-400 text-foreground">
                        {props.name.split("(")[0]}
                      </strong>
                      <span className="text-[10px] text-muted-foreground">
                        KCC Saturation: {props.kccPenetrationRate} • {props.soilQuality.split("(")[0]}
                      </span>
                    </div>
                    <span className="text-purple-600 text-xs font-bold shrink-0 ml-1">➔</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Action Hub for Students & Researchers */}
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/30 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                <Download className="size-3.5" /> 1-Click Open Data Export
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400">
                CC-BY 4.0
              </span>
            </div>

            {exportFeedback && (
              <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 shrink-0" />
                <span>{exportFeedback}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleExportFarmersCsv}
                className="p-2 text-[11px] font-bold rounded-xl border border-purple-500/30 bg-card hover:bg-purple-500/15 text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="size-3.5 text-emerald-500" />
                <span>Farmers CSV</span>
              </button>

              <button
                onClick={handleExportOfficesCsv}
                className="p-2 text-[11px] font-bold rounded-xl border border-purple-500/30 bg-card hover:bg-purple-500/15 text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="size-3.5 text-blue-500" />
                <span>Loan Banks CSV</span>
              </button>
            </div>

            <button
              onClick={handleExportGeoJson}
              className="w-full py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Globe className="size-3.5" />
              <span>Export Master Spatial GeoJSON (Map + Points)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
