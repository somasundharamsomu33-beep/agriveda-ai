import React, { useState } from 'react';
import { Wrench, Power, MapPin, CheckCircle2, Clock, ShieldCheck, PhoneCall } from 'lucide-react';
import { UserProfile } from '../../types';

interface TechnicianDashboardViewProps {
  profile: UserProfile;
}

export const TechnicianDashboardView: React.FC<TechnicianDashboardViewProps> = ({ profile }) => {
  const [isAvailableForService, setIsAvailableForService] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header with Available for Service ON/OFF Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-rose-600" />
            <span>Agri Technician Service Portal</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">📍 Service Area: Tiruvallur & Kanchipuram Districts</p>
        </div>

        {/* Available for Service Toggle */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Service Status</span>
            <span className={`text-xs font-black block ${isAvailableForService ? 'text-emerald-600' : 'text-slate-500'}`}>
              {isAvailableForService ? 'AVAILABLE FOR SERVICE ●' : 'OFF DUTY ○'}
            </span>
          </div>

          <button
            onClick={() => setIsAvailableForService(prev => !prev)}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
              isAvailableForService ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
            title="Toggle Available for Service Status"
          >
            <div className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
              <Power className={`w-3.5 h-3.5 ${isAvailableForService ? 'text-emerald-600' : 'text-slate-400'}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Dispatch Jobs</span>
          <p className="text-2xl font-black text-rose-600">2 In Progress</p>
          <span className="text-[11px] font-bold text-slate-500 block">Tractor Engine & Hydraulics</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Service Jobs</span>
          <p className="text-2xl font-black text-slate-900">48 Repairs</p>
          <span className="text-[11px] font-bold text-emerald-600 block">100% Satisfaction Rate</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Technician Rating</span>
          <p className="text-2xl font-black text-amber-600">4.9 ★</p>
          <span className="text-[11px] font-bold text-slate-500 block">Certified Master Tech</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Service Earnings</span>
          <p className="text-2xl font-black text-blue-700">₹36,400</p>
          <span className="text-[11px] font-bold text-slate-500 block">This Month</span>
        </div>
      </div>

      {/* Dispatch Service Requests */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Field Dispatch Service Requests</h3>

        <div className="space-y-3">
          {[
            { customer: 'Ravi Kumar (Farmer)', location: 'Kovilpatti Village (4.2 km away)', equipment: 'Mahindra 575 DI Tractor', issue: 'Hydraulic Lift Failure & Hose Leakage', urgent: true },
            { customer: 'Balasubramaniam Farm', location: 'Tiruvallur APMC Yard', equipment: 'Kubota Harvester', issue: 'Cutter Bar Alignment & Belt Change', urgent: false },
          ].map((job, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">{job.customer}</h4>
                  {job.urgent && <span className="px-2 py-0.5 bg-rose-100 text-rose-800 font-black text-[10px] rounded-md">EMERGENCY FIELD CALL</span>}
                </div>
                <p className="text-slate-600 font-medium">📍 {job.location} • Equipment: <span className="font-bold text-slate-900">{job.equipment}</span></p>
                <p className="text-rose-700 font-bold">Issue: {job.issue}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a href="tel:9876543210" className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200 font-bold flex items-center gap-1">
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Farmer</span>
                </a>

                <button className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition-colors cursor-pointer">
                  Accept Service Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
