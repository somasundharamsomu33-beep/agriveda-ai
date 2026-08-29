"use client";

import React, { useState } from "react";
import { X, Send, CheckCircle2, ShieldAlert, FileText, Building2, User, IndianRupee } from "lucide-react";
import { LOAN_OFFICES, AGRI_LOAN_SCHEMES, type LoanOffice } from "@/data/agri-data";

interface ApplyLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
  defaultCrop?: string;
  defaultOfficeId?: string;
  onSuccess?: (appData: Record<string, unknown>) => void;
}

export function ApplyLoanModal({
  isOpen,
  onClose,
  defaultAmount = 250000,
  defaultCrop = "Wheat / Paddy",
  defaultOfficeId,
  onSuccess,
}: ApplyLoanModalProps) {
  const [farmerName, setFarmerName] = useState("Sardar Balwinder Singh");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [aadhaar, setAadhaar] = useState("4589 1234 8921");
  const [village, setVillage] = useState("Jagraon Kalan");
  const [district, setDistrict] = useState("Ludhiana");
  const [state, setState] = useState("Punjab");
  const [landAcres, setLandAcres] = useState(6.5);
  const [loanAmount, setLoanAmount] = useState(defaultAmount);
  const [selectedSchemeId, setSelectedSchemeId] = useState("scheme-kcc");
  const [selectedOfficeId, setSelectedOfficeId] = useState(defaultOfficeId || LOAN_OFFICES[0].id);
  const [purpose, setPurpose] = useState("Crop Input, Seeds & Super Seeder Machinery");
  const [submitted, setSubmitted] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppId = `SIH-KCC-${Date.now().toString().slice(-6)}`;
    setGeneratedAppId(newAppId);
    setSubmitted(true);
    onSuccess?.({
      applicationId: newAppId,
      farmerName,
      phone,
      landAcres,
      loanAmount,
      selectedSchemeId,
      selectedOfficeId,
      village,
      district,
      state,
      purpose,
    });
  };

  const selectedOffice = LOAN_OFFICES.find((o) => o.id === selectedOfficeId) || LOAN_OFFICES[0];
  const selectedScheme = AGRI_LOAN_SCHEMES.find((s) => s.id === selectedSchemeId) || AGRI_LOAN_SCHEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in-0 duration-200">
      <div className="bg-card text-card-foreground border border-border w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <FileText className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Fast-Track Agricultural Loan Application</h2>
              <p className="text-xs text-muted-foreground">
                Kisan Credit Card (KCC) & NABARD Direct Branch Routing
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

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              <CheckCircle2 className="size-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Application Successfully Registered!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your application has been assigned to <strong className="text-foreground">{selectedOffice.name}</strong>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border max-w-sm mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Application ID:</span>
                <span className="font-mono font-bold text-primary">{generatedAppId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Requested Limit:</span>
                <span className="font-bold text-foreground">₹{loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interest Rate:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">4.0% Subsidized</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Branch Officer:</span>
                <span className="font-medium text-foreground">{selectedOffice.managerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Sanction Time:</span>
                <span className="font-medium text-foreground">{selectedOffice.avgApprovalDays} Days</span>
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground">
              A physical/satellite inspection appointment SMS has been dispatched to {phone}.
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 transition-colors"
            >
              Done & Return to Map
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Farmer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Mobile Number (Aadhaar Linked)
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Village & Taluk
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  District & State
                </label>
                <input
                  type="text"
                  required
                  value={`${district}, ${state}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(",");
                    setDistrict(parts[0]?.trim() || "");
                    if (parts[1]) setState(parts[1].trim());
                  }}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Cultivable Land Holding (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={landAcres}
                  onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary font-semibold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Requested Loan Amount (₹)
                </label>
                <input
                  type="number"
                  step="5000"
                  required
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value) || 50000)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary font-bold text-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Loan Purpose / Machinery
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="E.g., Drip irrigation, solar pump, crop seeds..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Scheme Selection */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Select Government Scheme
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => setSelectedSchemeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary font-medium"
              >
                {AGRI_LOAN_SCHEMES.map((scheme) => (
                  <option key={scheme.id} value={scheme.id}>
                    {scheme.title} (Effective: {scheme.maxSubsidizedRate}% p.a.)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Branch Office Selection */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Select Nearest Processing Bank / Loan Branch
              </label>
              <select
                value={selectedOfficeId}
                onChange={(e) => setSelectedOfficeId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary font-medium"
              >
                {LOAN_OFFICES.map((office) => (
                  <option key={office.id} value={office.id}>
                    {office.name} ({office.district}, {office.state}) - {office.avgApprovalDays}d turnaround
                  </option>
                ))}
              </select>
            </div>

            {/* Document Checklist Indicator */}
            <div className="p-3 rounded-xl bg-muted/40 border border-border text-[11px] space-y-1.5">
              <span className="font-semibold text-muted-foreground block">
                Required Verification Documents (Upload or Bring to Branch):
              </span>
              <div className="grid grid-cols-2 gap-1 text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" /> Land Record (7/12, Khasra)
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" /> Aadhaar & e-KYC
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" /> Bank Savings Account
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3 text-emerald-500" /> Soil Health Card
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-sm flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="size-3.5" />
                Submit Application to Branch
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
