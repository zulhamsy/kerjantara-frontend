import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Camera, Paperclip, ShieldAlert, CheckCheck } from 'lucide-react';
import { ChatMessage } from '../types';

interface SharedChatProps {
  onBack: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  currentUser: 'client' | 'worker';
  otherUserName: string;
}

export default function SharedChat({
  onBack,
  messages,
  onSendMessage,
  currentUser,
  otherUserName,
}: SharedChatProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = currentUser === 'worker' 
    ? ["Saya sudah di lokasi 📍", "Saya sedang di jalan", "Estimasi pengerjaan 2 jam", "Sudah selesai ya Bu"]
    : ["Berapa estimasi harganya?", "Bisakah datang sekarang?", "Alatnya sudah lengkap?", "Terima kasih!"];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(text);
    setInputText('');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F4F3F0] h-full overflow-hidden font-sans">
      {/* Header */}
      <header className="px-4 py-3 bg-white border-b border-neutral-200 flex items-center gap-3 shadow-sm shrink-0">
        <button onClick={onBack} className="p-1 -ml-1 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
            {otherUserName.slice(0, 2).toUpperCase()}
          </div>
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></span>
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-bold text-neutral-900 leading-tight">{otherUserName}</h2>
          <p className="text-[10px] text-success font-medium">Sedang Online</p>
        </div>
      </header>

      {/* Security Banner */}
      <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2.5 shrink-0">
        <ShieldAlert size={16} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-[11px] text-amber-800 leading-snug">
          <strong>Transaksi dilindungi Kerjantara.id.</strong> Jagalah kerahasiaan kontak pribadimu demi keamanan bersama.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUser;
          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] ${
                isMe ? 'ml-auto items-end' : 'mr-auto items-start'
              }`}
            >
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isMe
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white text-neutral-900 rounded-tl-none border border-neutral-100'
                }`}
              >
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-1 px-1">
                <span className="text-[10px] text-neutral-400">{msg.time}</span>
                {isMe && <CheckCheck size={12} className="text-primary" />}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Replies */}
      <div className="px-4 py-2 overflow-x-auto whitespace-nowrap bg-white border-t border-neutral-100 shrink-0 flex gap-2 no-scrollbar">
        {quickReplies.map((reply, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(reply)}
            className="inline-block px-3.5 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full border border-neutral-200 hover:bg-neutral-200 transition-colors shrink-0"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input panel */}
      <div className="p-3 bg-white border-t border-neutral-200 flex items-center gap-2.5 shrink-0">
        <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-50">
          <Paperclip size={20} />
        </button>
        <button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-50">
          <Camera size={20} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Ketik pesan..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend(inputText)}
            className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all pr-10 text-neutral-900"
          />
        </div>
        <button
          onClick={() => handleSend(inputText)}
          className="p-3 bg-primary text-white rounded-xl hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
