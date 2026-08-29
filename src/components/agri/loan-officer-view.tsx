"use client";

import React, { useState } from "react";
import {
  Building2,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  MapPin,
  Route,
  Activity,
  FileText,
  IndianRupee,
  Layers,
  ChevronRight,
  TrendingUp,
  Phone,
  BadgeCheck,
  ExternalLink,
  Sparkles,
  MapPinned,
} from "lucide-react";
import {
  LOAN_OFFICES,
  FARMERS_DATA,
  type LoanOffice,
  type FarmerProfile,
} from "@/data/agri-data";

interface LoanOfficerViewProps {
  selectedOffice: LoanOffice;
  onSelectOffice: (office: LoanOffice) => void;
  onFocusFarmer: (farmer: FarmerProfile) => void;
  onPlanInspectionRoute: (farmers: FarmerProfile[]) => void;
  onUpdateFarmerStatus: (farmerId: string, newStatus: FarmerProfile["applicationStatus"]) => void;
}

export function LoanOfficerView({
  selectedOffice,
  onSelectOffice,
  onFocusFarmer,
  onPlanInspectionRoute,
  onUpdateFarmerStatus,
}: LoanOfficerViewProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");

  // State-exclusive filtering: Loan officers only see farmers within their state jurisdiction
  const stateFarmers = FARMERS_DATA.filter(
    (f) => f.state.toLowerCase() === selectedOffice.state.toLowerCase()
  );

  const relevantFarmers = stateFarmers.filter((f) => {
    if (filterStatus === "All") return true;
    return f.applicationStatus === filterStatus;
  });

  const pendingInspections = stateFarmers.filter(
    (f) => f.applicationStatus === "Under Review" || f.applicationStatus === "Pending Verification"
  );

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Branch Selector Header */}
      <div className="p-3.5 rounded-2xl bg-card border border-border space-y-3 shadow-md">
        <div className="flex items-start gap-3">
          <img
            src={selectedOffice.managerPhotoUrl}
            alt={selectedOffice.managerName}
            className="size-12 rounded-xl object-cover border-2 border-amber-500 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {selectedOffice.type} Agri Desk
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {selectedOffice.state} Jurisdiction
              </span>
            </div>
            <h3 className="text-xs font-bold text-foreground truncate mt-0.5">
              {selectedOffice.name}
            </h3>
            <p className="text-[10px] text-muted-foreground truncate">
              {selectedOffice.managerName}
            </p>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Active Banking Branch:
          </label>
          <select
            value={selectedOffice.id}
            onChange={(e) => {
              const found = LOAN_OFFICES.find((o) => o.id === e.target.value);
              if (found) onSelectOffice(found);
            }}
            className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background font-medium focus:ring-2 focus:ring-amber-500 text-foreground"
          >
            {LOAN_OFFICES.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name.split("-")[0].trim()} ({o.district}, {o.state})
              </option>
            ))}
          </select>
        </div>

        {/* Branch Lending Metrics */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-center font-mono">
          <div className="p-1.5 rounded-lg bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[9px]">Sanctioned Qtr</span>
            <strong className="text-foreground">₹{selectedOffice.sanctionedThisQuarterCr} Cr</strong>
          </div>
          <div className="p-1.5 rounded-lg bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[9px]">Available Funds</span>
            <strong className="text-amber-600 dark:text-amber-400">₹{selectedOffice.availableCreditFundsCr} Cr</strong>
          </div>
          <div className="p-1.5 rounded-lg bg-muted/40 border border-border">
            <span className="text-muted-foreground block text-[9px]">Avg Sanction</span>
            <strong className="text-emerald-600 dark:text-emerald-400">{selectedOffice.avgApprovalDays} Days</strong>
          </div>
        </div>
      </div>

      {/* Field Inspection Dispatch Route Button */}
      <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
            <Route className="size-3.5" /> State Inspection Route
          </span>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
            {pendingInspections.length} in {selectedOffice.state}
          </span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Compute the optimal multi-stop inspection circuit exclusively for applicant farms in <strong>{selectedOffice.state}</strong>.
        </p>
        <button
          onClick={() => onPlanInspectionRoute(pendingInspections)}
          disabled={pendingInspections.length === 0}
          className={`w-full py-2 text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer ${
            pendingInspections.length > 0
              ? "bg-amber-600 hover:bg-amber-500 text-white"
              : "bg-muted text-muted-foreground cursor-not-allowed opacity-60"
          }`}
        >
          <Route className="size-3.5" />
          Plot {selectedOffice.state} Inspection Circuit
        </button>
      </div>

      {/* Application Status Filter */}
      <div className="flex gap-1 overflow-x-auto pb-1 text-[10px] no-scrollbar">
        {["All", "Under Review", "Pending Verification", "Approved", "Disbursed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap border transition-all ${
              filterStatus === status
                ? "bg-amber-600 text-white font-bold border-amber-600 shadow-xs"
                : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Farmer Loan Application Pipeline List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span>{selectedOffice.state} Farmers Queue ({relevantFarmers.length})</span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
            {selectedOffice.state} Only
          </span>
        </div>

        {relevantFarmers.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-muted/20 border border-border text-xs text-muted-foreground space-y-2">
            <UserCheck className="size-8 mx-auto opacity-40 text-muted-foreground" />
            <p>No applicant farmers found in {selectedOffice.state} with filter: {filterStatus}.</p>
          </div>
        ) : (
          relevantFarmers.map((farmer) => {
            const isPending =
              farmer.applicationStatus === "Under Review" ||
              farmer.applicationStatus === "Pending Verification";

            return (
              <div
                key={farmer.id}
                className="p-3.5 rounded-2xl border border-border bg-card hover:border-amber-500/50 transition-all space-y-3 shadow-md"
              >
                {/* Farmer Header with Genuine Human Photo */}
                <div className="flex items-start gap-2.5">
                  <img
                    src={farmer.photoUrl}
                    alt={farmer.name}
                    className="size-11 rounded-xl object-cover border-2 border-emerald-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-foreground truncate">{farmer.name}</h4>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                          farmer.riskCategory === "Low"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {farmer.riskCategory} Risk ({farmer.creditScore} CIBIL)
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {farmer.relationType || (farmer.gender === "female" ? "d/o" : "s/o")} {farmer.fatherName} • {farmer.village}, {farmer.district}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      📞 {farmer.phone}
                    </p>
                  </div>
                </div>

                {/* Land & Authentic Crop Yield Breakdown for Officer */}
                <div className="p-2.5 rounded-xl bg-muted/40 border border-border text-[10px] space-y-1.5">
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Total Owned:</span>
                      <strong className="text-foreground">{farmer.totalAcresOwned} Acres</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[9px]">Cultivable:</span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{farmer.cultivableAcres} Acres</strong>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-border/60">
                    <span className="text-muted-foreground block text-[9px]">Crop Yield Verification:</span>
                    <span className="text-foreground font-semibold block">
                      Kharif: {farmer.kharifCropDetails.crop} ({farmer.kharifCropDetails.yieldPerAcreQtl} Qtl/ac)
                    </span>
                    <span className="text-foreground font-semibold block">
                      Rabi: {farmer.rabiCropDetails.crop} ({farmer.rabiCropDetails.yieldPerAcreQtl} Qtl/ac)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/60 font-mono">
                    <span className="text-muted-foreground">Annual Farm Revenue:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      ₹{farmer.annualGrossFarmIncome.toLocaleString()}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-border/60">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <BadgeCheck className="size-3 text-emerald-500" /> BhuNaksha / 7/12:
                    </span>
                    <span className="text-foreground font-bold font-mono truncate max-w-[140px]" title={farmer.landTitleNumber}>
                      {farmer.landTitleNumber.split("(")[0]}
                    </span>
                  </div>
                </div>

                {/* Loan Details & Satellite Verification */}
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Requested Loan:</span>
                    <strong className="text-foreground font-mono">
                      ₹{farmer.requestedLoanAmount.toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Purpose:</span>
                    <span className="text-foreground truncate max-w-[170px]">{farmer.loanPurpose}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1 border-t border-amber-500/20">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Activity className="size-3 text-emerald-500" /> Satellite NDVI Index:
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                      {(farmer.satelliteNdvi * 100).toFixed(0)}% (Vigorous)
                    </strong>
                  </div>
                </div>

                {/* Action Buttons for Loan Officer */}
                <div className="flex items-center gap-1.5 pt-1">
                  <button
                    onClick={() => onFocusFarmer(farmer)}
                    className="flex-1 py-1.5 px-2 text-[10px] font-semibold rounded-lg bg-secondary hover:bg-accent text-foreground flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <MapPin className="size-3 text-amber-600" />
                    View Parcel
                  </button>

                  {isPending && (
                    <button
                      onClick={() => onUpdateFarmerStatus(farmer.id, "Approved")}
                      className="flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="size-3" />
                      Sanction
                    </button>
                  )}

                  {farmer.applicationStatus === "Approved" && (
                    <button
                      onClick={() => onUpdateFarmerStatus(farmer.id, "Disbursed")}
                      className="flex-1 py-1.5 px-2 text-[10px] font-bold rounded-lg bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-xs"
                    >
                      <IndianRupee className="size-3" />
                      Disburse
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
