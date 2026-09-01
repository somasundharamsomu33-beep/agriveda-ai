import React from 'react';
import { Bell, CloudRain, Sprout, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotificationsView: React.FC = () => {
  const { t } = useLanguage();

  const notifications = [
    {
      id: '1',
      title: 'Rain Alert: Delay Evening Irrigation',
      desc: 'Rain probability 40% in Tiruvallur region. Save water by delaying irrigation.',
      time: '10 mins ago',
      icon: <CloudRain className="w-5 h-5 text-blue-600" />,
      type: 'Weather'
    },
    {
      id: '2',
      title: 'Scheduled Fertigation Due Tomorrow',
      desc: 'Apply NPK 19:19:19 @ 15kg/acre to your Paddy crop.',
      time: '2 hours ago',
      icon: <Sprout className="w-5 h-5 text-emerald-600" />,
      type: 'Crop'
    },
    {
      id: '3',
      title: 'Market Price Surge in Kanchipuram APMC',
      desc: 'Tomato prices rose 4.2% today to ₹3,100 / quintal.',
      time: '5 hours ago',
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      type: 'Market'
    }
  ];

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          <span>{t('notificationsHeader')}</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">Priority agricultural alerts and AI advice</p>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4 hover:border-blue-200 transition-all"
          >
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
              {n.icon}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">{n.title}</h3>
                <span className="text-[10px] text-slate-400 font-semibold">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">{n.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
