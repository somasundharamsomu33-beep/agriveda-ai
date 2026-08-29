import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Sprout,
  Store,
  GraduationCap,
  Building2,
  Landmark,
  FileText,
  MapPin,
  Camera,
  Check,
  Search,
  Filter,
  RefreshCw,
  Eye,
  History,
  ShieldAlert
} from 'lucide-react';
import {
  VerificationApplication,
  VerificationStatusLevel,
  UserRole,
  UserProfile
} from '../../types';
import { VerificationEngine } from '../../lib/verificationEngine';

interface VerificationAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApproveUser?: (userId: string, newStatus: VerificationStatusLevel) => void;
}

export const VerificationAdminModal: React.FC<VerificationAdminModalProps> = ({
  isOpen,
  onClose,
  onApproveUser
}) => {
  if (!isOpen) return null;

  const [applications, setApplications] = useState<VerificationApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<VerificationApplication | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  useEffect(() => {
    const apps = VerificationEngine.getApplications();
    setApplications(apps);
    if (apps.length > 0) {
      setSelectedApp(apps[0]);
    }
  }, []);

  const refreshApplications = () => {
    const apps = VerificationEngine.getApplications();
    setApplications(apps);
    if (selectedApp) {
      const updatedSelected = apps.find(a => a.id === selectedApp.id) || apps[0];
      setSelectedApp(updatedSelected || null);
    }
  };

  const handleApprove = (appId: string) => {
    const updated = VerificationEngine.approveApplication(
      appId,
      'Admin Compliance Lead',
      reviewerNotes || 'All identity proofs, cadastral records and regulatory licenses verified.'
    );
    if (updated) {
      refreshApplications();
      setActionSuccessMsg(`Application for ${updated.applicantName} approved to FULLY_VERIFIED!`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (onApproveUser) {
        onApproveUser(updated.userId, 'FULLY_VERIFIED');
      }
    }
  };

  const handleRejectOrAction = (appId: string, status: 'REJECTED' | 'ACTION_REQUIRED') => {
    if (!reviewerNotes) {
      alert('Please enter reviewer notes describing the reason or required documentation.');
      return;
    }
    const updated = VerificationEngine.rejectOrRequestAction(
      appId,
      'Admin Compliance Lead',
      status,
      reviewerNotes
    );
    if (updated) {
      refreshApplications();
      setActionSuccessMsg(`Application status updated to ${status}.`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
      if (onApproveUser) {
        onApproveUser(updated.userId, status);
      }
    }
  };

  const filteredApps = applications.filter(app => {
    const matchRole = roleFilter === 'all' || app.role === roleFilter;
    const matchQuery =
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchQuery;
  });

  const fullyVerifiedCount = applications.filter(a => a.status === 'FULLY_VERIFIED').length;
  const pendingCount = applications.filter(a => a.status === 'ROLE_VERIFIED' || a.status === 'PENDING_REVIEW').length;

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'farmer': return <Sprout className="w-4 h-4 text-emerald-400" />;
      case 'business': return <Store className="w-4 h-4 text-amber-400" />;
      case 'researcher': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'institute': return <Building2 className="w-4 h-4 text-cyan-400" />;
      case 'loan-officer': return <Landmark className="w-4 h-4 text-blue-400" />;
      default: return <User className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl text-white overflow-hidden my-4 flex flex-col max-h-[90vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>AgriVeda Verification &amp; Compliance Audit Console</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40 text-[10px] uppercase font-black">
                  Admin Authority
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Inspect land cadastre proofs, GSTIN/PAN documents, and verify agricultural stakeholders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Metrics Strip */}
        <div className="px-6 py-3 bg-slate-950/80 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 text-xs font-bold">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400">Total Applications:</span>
            <span className="text-white font-mono text-sm font-black">{applications.length}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
            <span className="text-emerald-300">Fully Verified:</span>
            <span className="text-emerald-400 font-mono text-sm font-black">{fullyVerifiedCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
            <span className="text-amber-300">Pending Review:</span>
            <span className="text-amber-400 font-mono text-sm font-black">{pendingCount}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
            <span className="text-blue-300">DPDP Compliance:</span>
            <span className="text-blue-400 font-mono text-xs font-black">100% Stamped</span>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccessMsg && (
          <div className="mx-6 mt-3 p-3 bg-emerald-950/80 border border-emerald-400 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Main 2-Column Inspection Workspace */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* Left Column: Applications List (5 Cols) */}
          <div className="lg:col-span-5 border-r border-slate-800 flex flex-col min-h-0 bg-slate-950/50">
            
            {/* Search and Filters */}
            <div className="p-3 border-b border-slate-800 space-y-2 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applicant or role..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px] font-bold">
                {['all', 'farmer', 'business', 'researcher', 'institute', 'loan-officer'].map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                      roleFilter === r
                        ? 'bg-emerald-600 text-white font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r === 'loan-officer' ? 'Bank' : r}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredApps.map(app => {
                const meta = VerificationEngine.getStatusMeta(app.status);
                const isSelected = selectedApp?.id === app.id;
                return (
                  <div
                    key={app.id}
                    onClick={() => setSelectedApp(app)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-slate-900 border-emerald-400 ring-2 ring-emerald-500/20 shadow-lg'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-lg bg-slate-800 shrink-0">
                          {getRoleIcon(app.role)}
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-black text-white truncate">{app.applicantName}</h5>
                          <span className="text-[10px] text-slate-400 font-mono capitalize block">{app.role}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border uppercase shrink-0 ${meta.badgeClass}`}>
                        {meta.badgeText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-900">
                      <span>Submitted: {app.submittedAt}</span>
                      <span>Logs: {app.auditLogs.length}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Application Inspection Details (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col min-h-0 bg-slate-900">
            {selectedApp ? (
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                
                {/* Applicant Title Banner */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                      {getRoleIcon(selectedApp.role)}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{selectedApp.applicantName}</h4>
                      <p className="text-xs text-slate-400">
                        {selectedApp.email} • {selectedApp.phone}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-black border uppercase inline-block ${
                      VerificationEngine.getStatusMeta(selectedApp.status).badgeClass
                    }`}>
                      {VerificationEngine.getStatusMeta(selectedApp.status).badgeText}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">Application #{selectedApp.id}</span>
                  </div>
                </div>

                {/* Role Specific Verified Parameters Inspection */}
                {selectedApp.data.farmerData && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h5 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sprout className="w-4 h-4" /> Farmer &amp; Land Cadastre Inspection
                    </h5>

                    <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Identity Proof</span>
                        <span className="font-bold text-white">{selectedApp.data.farmerData.identityType}: {selectedApp.data.farmerData.identityNumber}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Land Survey No.</span>
                        <span className="font-bold text-white">{selectedApp.data.farmerData.landSurveyNumber} ({selectedApp.data.farmerData.acreage} Acres)</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Farming Practice</span>
                        <span className="font-bold text-white">{selectedApp.data.farmerData.farmingPractice}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Expected Yield</span>
                        <span className="font-bold text-white">{selectedApp.data.farmerData.expectedProductionQuintals} Quintals</span>
                      </div>
                    </div>

                    {/* Land Photos Inspection */}
                    {selectedApp.data.farmerData.farmlandPhotos && (
                      <div className="space-y-2 pt-2 border-t border-slate-900">
                        <span className="text-[11px] font-bold text-slate-300 block">Farmland Geotagged Photographs:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedApp.data.farmerData.farmlandPhotos.map(p => (
                            <div key={p.id} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700">
                              <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                              <div className="absolute bottom-1 left-1 bg-slate-900/80 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-300">
                                GPS: {p.coords[1].toFixed(4)}°N, {p.coords[0].toFixed(4)}°E
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedApp.data.businessData && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Store className="w-4 h-4" /> B2B Business &amp; GSTIN Inspection
                    </h5>

                    <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Business Name</span>
                        <span className="font-bold text-white">{selectedApp.data.businessData.businessName}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">GSTIN</span>
                        <span className="font-bold text-white font-mono">{selectedApp.data.businessData.gstin}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Storage Capacity</span>
                        <span className="font-bold text-white">{selectedApp.data.businessData.storageCapacityMT} MT</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Procurement Crops</span>
                        <span className="font-bold text-white">{selectedApp.data.businessData.procurementCrops.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApp.data.scholarData && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h5 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" /> Academic Scholar Inspection
                    </h5>

                    <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">University</span>
                        <span className="font-bold text-white">{selectedApp.data.scholarData.universityName}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Program</span>
                        <span className="font-bold text-white">{selectedApp.data.scholarData.programType}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 sm:col-span-2">
                        <span className="text-[10px] text-slate-400 font-bold block">Supervisor</span>
                        <span className="font-bold text-white">{selectedApp.data.scholarData.guideOrSupervisorName} ({selectedApp.data.scholarData.guideEmail})</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedApp.data.bankData && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <h5 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Landmark className="w-4 h-4" /> Banking License &amp; Officer Inspection
                    </h5>

                    <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Bank Name</span>
                        <span className="font-bold text-white">{selectedApp.data.bankData.bankName}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">RBI License</span>
                        <span className="font-bold text-white font-mono">{selectedApp.data.bankData.rbiBankingLicenseNumber}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Authorized Officer</span>
                        <span className="font-bold text-white">{selectedApp.data.bankData.authorizedOfficerName} ({selectedApp.data.bankData.employeeId})</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold block">Branch</span>
                        <span className="font-bold text-white">{selectedApp.data.bankData.branchName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Immutable Audit Log Trail */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h5 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-4 h-4 text-emerald-400" /> Compliance Audit Trail
                  </h5>

                  <div className="space-y-2">
                    {selectedApp.auditLogs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-300">{log.action}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{log.timestamp}</span>
                        </div>
                        <p className="text-slate-400 font-medium">{log.details}</p>
                        <span className="text-[9px] text-slate-500 font-mono block">By: {log.actor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviewer Action Controls */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                  <h5 className="text-xs font-black text-white uppercase tracking-wider">
                    Administrative Compliance Decision
                  </h5>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1 font-bold">Reviewer Remarks / Audit Note</label>
                    <input
                      type="text"
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      placeholder="e.g. Land survey, GPS coordinates & GSTIN verified against registry."
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve to FULLY_VERIFIED 🛡️</span>
                    </button>

                    <button
                      onClick={() => handleRejectOrAction(selectedApp.id, 'ACTION_REQUIRED')}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Request Action</span>
                    </button>

                    <button
                      onClick={() => handleRejectOrAction(selectedApp.id, 'REJECTED')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500 text-xs">
                Select an application from the left pane to inspect credentials.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
