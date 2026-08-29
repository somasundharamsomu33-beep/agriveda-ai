"use client";

import React, { useState } from "react";
import {
  Building,
  Landmark,
  TrendingUp,
  AlertOctagon,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  IndianRupee,
  Activity,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { LOAN_OFFICES, FARMERS_DATA, type LoanOffice } from "@/data/agri-data";

interface InstituteViewProps {
  onSelectStateDistrict: (district: string, state: string) => void;
}

export function InstituteView({ onSelectStateDistrict }: InstituteViewProps) {
  const [selectedState, setSelectedState] = useState<string>("All");

  // State-wise agricultural credit stats
  const stateSummary = [
    {
      state: "Punjab",
      district: "Ludhiana",
      totalSanctionedCr: 177.9,
      targetCr: 200.0,
      saturationRate: 88.9,
      npaRisk: "Low (1.8%)",
      activeKccHolders: "1,24,500",
      topCrop: "Wheat & Paddy",
    },
    {
      state: "Maharashtra",
      district: "Nashik / Vidarbha",
      totalSanctionedCr: 215.4,
      targetCr: 260.0,
      saturationRate: 82.8,
      npaRisk: "Moderate (3.4%)",
      activeKccHolders: "2,10,000",
      topCrop: "Grapes, Onion, Cotton",
    },
    {
      state: "Uttar Pradesh",
      district: "Varanasi / Ayodhya",
      totalSanctionedCr: 310.2,
      targetCr: 380.0,
      saturationRate: 81.6,
      npaRisk: "Low (2.1%)",
      activeKccHolders: "3,85,000",
      topCrop: "Sugarcane, Paddy, Wheat",
    },
    {
      state: "Karnataka",
      district: "Mandya / Dharwad",
      totalSanctionedCr: 165.8,
      targetCr: 190.0,
      saturationRate: 87.2,
      npaRisk: "Low (1.9%)",
      activeKccHolders: "1,45,000",
      topCrop: "Sugarcane, Chilli, Silk",
    },
    {
      state: "Tamil Nadu",
      district: "Thanjavur",
      totalSanctionedCr: 142.3,
      targetCr: 155.0,
      saturationRate: 91.8,
      npaRisk: "Low (1.2%)",
      activeKccHolders: "1,12,000",
      topCrop: "Kuruvai Paddy & Banana",
    },
    {
      state: "Gujarat",
      district: "Anand",
      totalSanctionedCr: 188.5,
      targetCr: 205.0,
      saturationRate: 91.9,
      npaRisk: "Very Low (0.9%)",
      activeKccHolders: "1,60,000",
      topCrop: "Dairy & Banana",
    },
  ];

  const filteredStates =
    selectedState === "All"
      ? stateSummary
      : stateSummary.filter((s) => s.state === selectedState);

  const totalDisbursedNationalCr = stateSummary
    .reduce((acc, s) => acc + s.totalSanctionedCr, 0)
    .toFixed(1);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Regulator Header Banner */}
      <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            <Landmark className="size-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              NABARD & Agri-Banking Directorate
            </h3>
            <p className="text-[10px] text-muted-foreground">
              National Priority Sector Lending & Agricultural Credit Oversight
            </p>
          </div>
        </div>
      </div>

      {/* National Overview KPI Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-card border border-border">
          <span className="text-[10px] text-muted-foreground block">
            National KCC Disbursed
          </span>
          <span className="text-base font-extrabold text-primary font-mono flex items-center">
            <IndianRupee className="size-3.5" />
            {totalDisbursedNationalCr} Cr
          </span>
          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="size-3" /> +14.2% YoY Growth
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border">
          <span className="text-[10px] text-muted-foreground block">
            Interest Subvention Released
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono flex items-center">
            <IndianRupee className="size-3.5" />
            36.2 Cr
          </span>
          <span className="text-[9px] text-muted-foreground block mt-0.5">
            3% Prompt Repayment Subsidy
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border">
          <span className="text-[10px] text-muted-foreground block">
            Active Banking Nodes
          </span>
          <span className="text-base font-extrabold text-foreground font-mono">
            {LOAN_OFFICES.length} Apex Hubs
          </span>
          <span className="text-[9px] text-muted-foreground block mt-0.5">
            NABARD, RRB, PACS, PSB
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-card border border-border">
          <span className="text-[10px] text-muted-foreground block">
            Overall Credit Health
          </span>
          <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="size-4" /> 98.2%
          </span>
          <span className="text-[9px] text-muted-foreground block mt-0.5">
            Repayment Compliance
          </span>
        </div>
      </div>

      {/* State Filter Buttons */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] no-scrollbar">
        {["All", "Punjab", "Maharashtra", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "Gujarat"].map((st) => (
          <button
            key={st}
            onClick={() => setSelectedState(st)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap border transition-all ${
              selectedState === st
                ? "bg-primary text-primary-foreground font-bold border-primary shadow-xs"
                : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* District-wise Lending Performance Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>District Saturation Scorecard</span>
          <span className="text-primary">{filteredStates.length} Hubs</span>
        </div>

        {filteredStates.map((item) => (
          <div
            key={item.state + item.district}
            onClick={() => onSelectStateDistrict(item.district, item.state)}
            className="p-3 rounded-xl border border-border bg-card hover:border-primary/50 transition-all cursor-pointer space-y-2 shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">
                  {item.state} ({item.district})
                </h4>
                <p className="text-[10px] text-muted-foreground">
                  Primary Agro-Basket: {item.topCrop}
                </p>
              </div>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {item.saturationRate}% Saturation
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>Sanctioned: ₹{item.totalSanctionedCr} Cr</span>
                <span>Target: ₹{item.targetCr} Cr</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${item.saturationRate}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border/60 text-[10px]">
              <span className="text-muted-foreground">
                KCC Beneficiaries: <strong className="text-foreground">{item.activeKccHolders}</strong>
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                NPA: {item.npaRisk}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
