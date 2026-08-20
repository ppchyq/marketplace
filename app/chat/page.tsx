'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { ArrowLeft, Send, User, ShoppingBag, ShieldCheck } from 'lucide-react';

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const seller = searchParams.get('seller') || 'ผู้ขาย';
  const product = searchParams.get('product') || 'สินค้า';

  const [messages, setMessages] = useState([
    { sender: 'seller', text: `สวัสดีครับ สนใจสอบถามเกี่ยวกับ "${product}" ใช่ไหมครับ?` }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: inputText }]);
    const userMsg = inputText;
    setInputText('');

    // ข้อความตอบกลับอัตโนมัติจากผู้ขาย
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: 'seller', text: `ขอบคุณที่สนใจครับ! สามารถนัดรับ "${product}" ได้ตามสถานที่ที่ลงไว้เลยครับ สะดวกช่วงกี่โมงดีครับ?` }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-700">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="font-bold text-sm flex items-center gap-1.5">
            <User size={16} className="text-indigo-400" /> {seller}
          </h2>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 line-clamp-1">
            <ShoppingBag size={12} /> {product}
          </p>
        </div>
      </header>

      {/* Messages Feed */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <div className="text-center my-2">
          <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">
            เริ่มต้นการสนทนานัดรับสินค้าในมหาลัย
          </span>
        </div>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
        <input
          type="text"
          placeholder="พิมพ์ข้อความทักผู้ขาย..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white transition-colors"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">กำลังโหลดห้องแชท...</div>}>
      <ChatContent />
    </Suspense>
  );
}