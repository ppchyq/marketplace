'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Send, CheckCheck, Clock, ShieldCheck, 
  Sparkles, Image as ImageIcon, MapPin, Tag, Phone
} from 'lucide-react';

interface Message {
  id: number;
  sender: 'user' | 'seller';
  text: string;
  time: string;
  isRead?: boolean;
}

function ChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sellerName = searchParams.get('seller') || 'พี่นก (วิศวะ ปี 3)';
  const productName = searchParams.get('product') || 'หนังสือ Calculus II สภาพ 95%';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'seller',
      text: `สวัสดีครับสนใจ ${productName} ใช่ไหมครับ? ทักมาสอบถามหรือนัดรับได้เลยครับ`,
      time: '10:00 AM',
      isRead: true
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // เลื่อนจอลงด้านล่างสุดอัตโนมัติเมื่อมีข้อความใหม่
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ฟังก์ชันคำตอบอัตโนมัติของผู้ขาย
  const getAutoReply = (userMessage: string) => {
    const text = userMessage.toLowerCase();
    if (text.includes('ลด') || text.includes('ต่อรอง')) {
      return 'ลดได้นิดหน่อยครับผม ถ้ามารับเองที่ตึกแถวนี้ลดให้อีก 20 บาทครับ!';
    } else if (text.includes('นัดรับ') || text.includes('ที่ไหน') || text.includes('สะดวก')) {
      return 'สะดวกนัดรับหน้าตึกกิจกรรม หรือศูนย์อาหารกลางช่วงเที่ยงๆ ครับ';
    } else if (text.includes('รูป') || text.includes('สภาพ')) {
      return 'สภาพสวยตามรูปเลยครับ ไม่มีรอยขีดเขียนเพิ่ม สามารถเช็กของจริงก่อนจ่ายเงินได้ครับ';
    } else if (text.includes('ส่ง') || text.includes('ไปรษณีย์')) {
      return 'มีบริการส่งด่วนในมหาลัยครับ หรือส่งพัสดุ +30 บาทครับผม';
    }
    return 'รับทราบครับ! ยินดีให้บริการครับ มีอะไรสอบถามเพิ่มเติมได้ตลอดเลยนะครับ';
  };

  const handleSend = (textToSend?: string) => {
    const messageText = textToSend || inputText;
    if (!messageText.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newUserMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: currentTime,
      isRead: true
    };

    setMessages((prev) => [...prev, newUserMsg]);
    if (!textToSend) setInputText('');

    // จำลองผู้ขายกำลังพิมพ์ตอบกลับ
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const sellerReply: Message = {
        id: Date.now() + 1,
        sender: 'seller',
        text: getAutoReply(messageText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: true
      };
      setMessages((prev) => [...prev, sellerReply]);
    }, 1500);
  };

  return (
    <div className="max-w-md md:max-w-2xl mx-auto h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-white border-x border-amber-900/30">
      
      {/* Header แชทลุคพรีเมียม */}
      <header className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-amber-600/30 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="font-serif font-bold text-sm text-amber-100 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-amber-500" />
              {sellerName}
            </h2>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              กำลังใช้งาน • ตอบไวภายใน 5 นาที
            </p>
          </div>
        </div>

        <button 
          onClick={() => alert(`กำลังโทรหา ${sellerName}...`)}
          className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 hover:bg-amber-600/30 transition-all"
        >
          <Phone size={16} />
        </button>
      </header>

      {/* บาร์แสดงสินค้าที่กำลังคุยอยู่ */}
      <div className="p-2.5 px-4 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate">
          <Tag size={14} className="text-amber-400 shrink-0" />
          <span className="text-slate-300 font-medium truncate">สนใจ: <strong className="text-amber-200 font-serif">{productName}</strong></span>
        </div>
        <span className="text-[10px] text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30 shrink-0 font-mono">
          นัดรับมหาลัย
        </span>
      </div>

      {/* ส่วนแสดงข้อความสนทนา */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div 
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-amber-600 text-white rounded-br-none border border-amber-500/40'
                  : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/80 font-sans'
              }`}
            >
              {msg.text}
            </div>
            <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1 px-1 font-mono">
              <span>{msg.time}</span>
              {msg.sender === 'user' && <CheckCheck size={12} className="text-amber-400" />}
            </div>
          </div>
        ))}

        {/* สถานะผู้ขายกำลังพิมพ์ */}
        {isTyping && (
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 p-2.5 px-4 rounded-2xl rounded-bl-none w-fit">
            <span className="text-[11px] text-slate-400 font-mono">{sellerName} กำลังพิมพ์</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply (ถามด่วน) */}
      <div className="p-2 bg-slate-900/90 border-t border-slate-800 flex gap-1.5 overflow-x-auto no-scrollbar text-[11px]">
        {[
          'ลดราคาได้ไหมครับ?', 
          'นัดรับตรงไหนสะดวกครับ?', 
          'ขอดูรูปเพิ่มเติมหน่อยครับ',
          'สภาพสินค้าเป็นยังไงบ้าง?'
        ].map((quickText, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(quickText)}
            className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800 hover:bg-amber-600/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/40 transition-all font-sans"
          >
            {quickText}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
        className="p-3 bg-slate-900 border-t border-amber-600/20 flex items-center gap-2"
      >
        <button 
          type="button"
          onClick={() => alert('อัปโหลดรูปภาพ')}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ImageIcon size={18} />
        </button>

        <input 
          type="text" 
          placeholder="พิมพ์ข้อความทักผู้ขาย..." 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none transition-all font-sans"
        />

        <button 
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white transition-all shadow-md shadow-amber-600/20 active:scale-95"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-xs text-slate-400">กำลังโหลดห้องแชท...</div>}>
      <ChatContent />
    </Suspense>
  );
}