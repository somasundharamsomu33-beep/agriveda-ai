import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { translations } from '../data/mockData';

export const ExternalSupportWidget = ({ language = 'en' }: { language?: 'en' | 'ta' | 'hi' | 'te' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const t = translations[language] || translations.en;

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/external-support', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, language })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply || 'Support is unavailable right now.' }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to support.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-24 right-4 z-[999]">
            {isOpen && (
                <div className="w-80 h-96 bg-[#090b0e]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col shadow-2xl mb-4 overflow-hidden shadow-[#2bb673]/20">
                    <div className="flex justify-between items-center p-4 border-b border-white/10 bg-gradient-to-r from-[#2bb673]/20 to-transparent">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-[#2bb673]" />
                            AgriVeda Support
                        </h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm mt-4">
                                👋 Need help using AgriVeda? Ask our AI Support!
                            </div>
                        )}
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === 'user' ? 'bg-[#2bb673] text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'}`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 text-gray-400 p-3 rounded-xl text-sm rounded-tl-sm animate-pulse">
                                    Typing...
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-3 border-t border-white/10 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your question..."
                            className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#2bb673]"
                        />
                        <button onClick={sendMessage} className="bg-[#2bb673] p-2 rounded-lg text-white hover:bg-[#209f63] transition-colors">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-[#2bb673]/90 hover:bg-[#209f63] shadow-lg shadow-[#2bb673]/30 text-white rounded-full p-4 transition-transform hover:scale-110 flex items-center justify-center group backdrop-blur-md"
                    title="Platform Support"
                >
                    <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
                </button>
            )}
        </div>
    );
};
