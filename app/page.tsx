import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function SplashScreen() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-6 max-w-md mx-auto text-center">
      <div className="w-full pt-8 text-right text-xs text-slate-400">
        Campus Marketplace v1.0
      </div>

      {/* Hero Icon & Title */}
      <div className="flex flex-col items-center space-y-4 my-auto">
        <div className="p-6 bg-indigo-600 dark:bg-indigo-500 rounded-3xl shadow-xl shadow-indigo-500/30 text-white animate-bounce">
          <ShoppingBag size={64} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Campus <span className="text-indigo-600 dark:text-indigo-400">Market</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
          ตลาดนัดซื้อ-ขาย ส่งต่อของใช้ และหนังสือเรียนสำหรับเพื่อนๆ ในวิทยาลัย
        </p>
      </div>

      {/* Action Button */}
      <div className="w-full pb-8 space-y-3">
        <Link 
          href="/home" 
          className="flex items-center justify-center gap-2 w-full py-4 px-6 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all text-center"
        >
          เข้าสู่หน้าหลัก <ArrowRight size={18} />
        </Link>
      </div>
    </main>
  );
}