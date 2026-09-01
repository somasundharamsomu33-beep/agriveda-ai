import React, { useState } from 'react';
import { HelpCircle, PhoneCall, ChevronDown, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const HelpSupportView: React.FC = () => {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [feedback, setFeedback] = useState('');

  const faqs = [
    {
      q: 'How does AgriVeda AI detect crop diseases?',
      a: 'AgriVeda uses multimodal vision models trained on thousands of plant pathology samples. Simply upload a leaf photo to get diagnostic analysis.'
    },
    {
      q: 'How do I switch the application language?',
      a: 'You can switch between English, தமிழ், हिंदी, and తెలుగు using the language selector in the header or in Settings.'
    },
    {
      q: 'Are the Kisan Helpline calls free?',
      a: 'Yes, 1800-180-1551 is a toll-free government helpline operational 24/7 for farmers across India.'
    }
  ];

  return (
    <div className="max-w-2xl w-full mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-blue-600" />
          <span>{t('helpHeader')}</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium">24/7 Kisan Helpline & Farmer Assistance</p>
      </div>

      {/* Kisan Helpline Banner */}
      <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-black text-amber-300 uppercase tracking-wider">{t('kisanHelpline')}</span>
          <h3 className="text-xl font-black text-white">Toll-Free Agricultural Support</h3>
          <p className="text-xs text-blue-100">Speak directly with agricultural experts and agronomists</p>
        </div>

        <a
          href="tel:18001801551"
          className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 text-slate-950" />
          <span>{t('callHotline')}</span>
        </a>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{t('faqsTitle')}</h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 bg-slate-50 hover:bg-slate-100 text-left text-xs font-bold text-slate-900 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-xs text-slate-600 font-medium leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">{t('submitFeedback')}</h3>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Share your thoughts or suggest new features for AgriVeda AI..."
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
        />
        <button
          onClick={() => {
            if (feedback.trim()) {
              alert("Thank you! Your feedback has been received.");
              setFeedback('');
            }
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Submit Feedback</span>
        </button>
      </div>
    </div>
  );
};
