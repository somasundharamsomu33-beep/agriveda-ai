import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle2, Clock, Sprout, AlertCircle, Bell, X, Calculator, CalendarDays } from 'lucide-react';
import { CropCalendar, CalendarEvent, UserProfile } from '../types';
import { translations, defaultCropCalendar } from '../data/mockData';
import { FertilizerCalculator } from './FertilizerCalculator';

interface CropCalendarViewProps {
  profile: UserProfile;
}

export const CropCalendarView: React.FC<CropCalendarViewProps> = ({ profile }) => {
  const t = translations[profile.language] || translations.en;

  const [calendar, setCalendar] = useState<CropCalendar>(defaultCropCalendar);
  const [selectedCrop, setSelectedCrop] = useState(profile.primaryCrop || 'Tomato');
  const [sowingDate, setSowingDate] = useState('2024-06-01');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'calculator'>('timeline');

  // New Reminder Form state
  const [remTitle, setRemTitle] = useState('');
  const [remCategory, setRemCategory] = useState<'Fertilizer' | 'Irrigation' | 'Inspection' | 'Harvesting'>('Irrigation');
  const [remDay, setRemDay] = useState(20);
  const [remTime, setRemTime] = useState('7:00 AM');

  // Handler to add fertilizer calculated events to calendar
  const handleAddCalculatedReminders = (newEvents: CalendarEvent[]) => {
    setCalendar(prev => {
      // Filter out previous auto-generated fert events to avoid duplicate spam if re-synced
      const filteredExisting = prev.events.filter(ev => !ev.id.startsWith('fert-'));
      const combined = [...filteredExisting, ...newEvents].sort((a, b) => a.dayNumber - b.dayNumber);
      return { ...prev, events: combined };
    });
  };

  // Toggle stage completion
  const toggleEventComplete = (eventId: string) => {
    setCalendar(prev => ({
      ...prev,
      events: prev.events.map(ev =>
        ev.id === eventId ? { ...ev, completed: !ev.completed } : ev
      )
    }));
  };

  // Add custom reminder
  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remTitle) return;

    const newEv: CalendarEvent = {
      id: `custom-${Date.now()}`,
      dayNumber: remDay,
      dateStr: `Day ${remDay}`,
      title: remTitle,
      category: remCategory,
      description: `Custom farmer reminder scheduled for ${remTime}`,
      completed: false,
      recommendedTime: remTime
    };

    setCalendar(prev => ({
      ...prev,
      events: [...prev.events, newEv].sort((a, b) => a.dayNumber - b.dayNumber)
    }));

    setRemTitle('');
    setShowAddReminderModal(false);
  };

  return (
    <div className="space-y-5 pb-24 animate-in fade-in max-w-2xl mx-auto">
      
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
              Smart Crop Management
            </span>
            <h2 className="text-xl font-bold text-white mt-1">{t.cropCalendar}</h2>
          </div>

          <button
            onClick={() => setShowAddReminderModal(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addReminder}</span>
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSubTab === 'timeline'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Crop Stage Timeline</span>
          </button>

          <button
            onClick={() => setActiveSubTab('calculator')}
            className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              activeSubTab === 'calculator'
                ? 'bg-emerald-700 text-white shadow-2xs'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4 text-emerald-300" />
            <span>Fertilizer Calculator</span>
          </button>
        </div>

        {/* Crop & Sowing Selector (Visible in Timeline mode) */}
        {activeSubTab === 'timeline' && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-lg focus:outline-none"
              >
                <option value="Paddy / Rice">Paddy / Rice (135 Days)</option>
                <option value="Ragi / Finger Millet">Ragi / Finger Millet (105 Days)</option>
                <option value="Sorghum / Cholam">Sorghum / Cholam Millet (110 Days)</option>
                <option value="Moong Dal / Green Gram">Moong Dal / Green Gram (70 Days)</option>
                <option value="Black Gram / Urad Dal">Black Gram / Urad Dal (75 Days)</option>
                <option value="Groundnut / Peanut">Groundnut / Peanut (110 Days)</option>
                <option value="Tomato">Tomato (120 Days)</option>
                <option value="Chilli">Chilli (150 Days)</option>
                <option value="Cotton">Cotton (160 Days)</option>
                <option value="Sugarcane">Sugarcane (365 Days)</option>
                <option value="Brinjal">Brinjal (140 Days)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase">Sowing Date</label>
              <input
                type="date"
                value={sowingDate}
                onChange={e => setSowingDate(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs rounded-lg focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeSubTab === 'calculator' ? (
        <FertilizerCalculator
          profile={profile}
          selectedCrop={selectedCrop}
          onAddRemindersToCalendar={(events) => {
            handleAddCalculatedReminders(events);
            setActiveSubTab('timeline');
          }}
        />
      ) : (
        /* Timeline Events List */
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-700" />
              <span>{selectedCrop} Stage-by-Stage Advisory</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700">
              {calendar.events.filter(e => e.completed).length}/{calendar.events.length} Completed
            </span>
          </div>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
            {calendar.events.map((event) => (
              <div key={event.id} className="relative flex items-start justify-between gap-3 group">
                
                {/* Timeline Node Icon */}
                <button
                  onClick={() => toggleEventComplete(event.id)}
                  className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    event.completed
                      ? 'bg-emerald-700 border-emerald-700 text-white shadow-2xs'
                      : 'bg-white border-slate-300 hover:border-emerald-600 text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                {/* Event Details Card */}
                <div className={`flex-1 p-4 rounded-xl border transition-all ${
                  event.completed
                    ? 'bg-slate-50 border-slate-200 opacity-75'
                    : 'bg-slate-50/80 border-slate-200 hover:shadow-2xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                      {event.dateStr} • Day {event.dayNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {event.recommendedTime || 'Morning'}
                    </span>
                  </div>

                  <h4 className={`text-xs font-bold mt-2 ${event.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                    {event.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                    {event.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 relative">
            
            <button
              onClick={() => setShowAddReminderModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <div className="w-10 h-10 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Add Farming Reminder</h3>
              <p className="text-xs text-slate-500">Set custom alarm for irrigation, fertilizer, or harvest</p>
            </div>

            <form onSubmit={handleAddReminder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reminder Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Spray Neem Oil for Aphids"
                  value={remTitle}
                  onChange={e => setRemTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Crop Day</label>
                  <input
                    type="number"
                    value={remDay}
                    onChange={e => setRemDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={remTime}
                    onChange={e => setRemTime(e.target.value)}
                    placeholder="7:00 AM"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                Save Reminder
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
