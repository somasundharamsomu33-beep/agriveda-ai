"use client";

import React, { useState } from "react";
import { X, Calculator, Sparkles, CheckCircle2, ShieldCheck, IndianRupee, ArrowRight } from "lucide-react";
import { estimateKccEligibility } from "@/data/agri-data";

interface LoanCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAcres?: number;
  initialCrop?: string;
  onApplyDirect?: (loanAmount: number, crop: string, acres: number) => void;
}

export function LoanCalculatorModal({
  isOpen,
  onClose,
  initialAcres = 4.5,
  initialCrop = "Wheat / Paddy",
  onApplyDirect,
}: LoanCalculatorModalProps) {
  const [landAcres, setLandAcres] = useState<number>(initialAcres);
  const [cropType, setCropType] = useState<string>(initialCrop);
  const [loanTenureMonths, setLoanTenureMonths] = useState<number>(12);

  if (!isOpen) return null;

  const calculation = estimateKccEligibility(landAcres, cropType);
  const subsidizedLimit = Math.min(calculation.totalSanctionLimit, 300000);
  const monthlyEffectiveInterest = (subsidizedLimit * 0.04) / 12;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary border border-primary/20">
              <Calculator className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Kisan Credit Card (KCC) Limit Calculator
                <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                  4% Subsidized Rate
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Scale of Finance calculator based on RBI & NABARD guidelines
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Total Cultivable Land (Acres)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0.5"
                  max="100"
                  step="0.5"
                  value={landAcres}
                  onChange={(e) => setLandAcres(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  Acres
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1.5">
                Primary Crop / Horticulture
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-medium"
              >
                <option value="Wheat / Paddy">Wheat / Paddy (Alluvial)</option>
                <option value="Basmati Paddy / Rice">Basmati Rice</option>
                <option value="Sugarcane">Sugarcane (High Scale)</option>
                <option value="Cotton & Soybean">Cotton & Soybean (Black Soil)</option>
                <option value="Grapes / Export Horticulture">Grapes / Horticulture</option>
                <option value="Chilli & Spices">Chilli / Spices</option>
                <option value="Banana / Fruit Orchards">Banana / Papaya</option>
                <option value="Pulses & Oilseeds">Pulses & Mustard</option>
              </select>
            </div>
          </div>

          {/* Scale of Finance Breakdown Card */}
          <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
              <span>Scale of Finance Breakdown</span>
              <span className="text-primary font-mono font-semibold">
                ₹{calculation.scaleOfFinancePerAcre.toLocaleString()}/acre
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-background border border-border/80">
                <span className="text-[10px] text-muted-foreground block">Crop Cultivation</span>
                <span className="font-bold text-foreground">
                  ₹{calculation.cropLoanLimit.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border/80">
                <span className="text-[10px] text-muted-foreground block">+20% Post-Harvest</span>
                <span className="font-bold text-foreground">
                  ₹{calculation.postHarvestHouseholdLimit.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-background border border-border/80">
                <span className="text-[10px] text-muted-foreground block">+10% Farm Repair</span>
                <span className="font-bold text-foreground">
                  ₹{calculation.maintenanceFarmAssetsLimit.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Total Sanction & Interest Savings */}
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-primary block">
                  Eligible KCC Credit Limit
                </span>
                <div className="text-2xl font-extrabold text-foreground flex items-center">
                  <IndianRupee className="size-6 text-primary" />
                  {calculation.totalSanctionLimit.toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block">Subsidized Interest Rate</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  4.0% p.a.
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-primary/15 flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-3.5 text-amber-500" />
                Govt Prompt Repayment Savings:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                Save ₹{calculation.annualInterestSaved.toLocaleString()}/year
              </span>
            </div>
          </div>

          {/* Collateral Rule Note */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="size-4 shrink-0 mt-0.5" />
            <div>
              <strong>Collateral-Free Benefit:</strong> Loans up to ₹1,60,000 are 100% collateral-free with zero processing fee. Automatic crop insurance under PMFBY.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-muted/20 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onApplyDirect?.(calculation.totalSanctionLimit, cropType, landAcres);
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            Apply for ₹{calculation.totalSanctionLimit.toLocaleString()} KCC Loan
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
