'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes'; // เพิ่มการนำเข้าตรงนี้
import { PlusCircle, Search, Moon, Sun, ShoppingBag, Heart } from 'lucide-react';
// ข้อมูลสินค้าตัวอย่าง 5 อย่าง
const SAMPLE_PRODUCTS = [
  { id: 1, title: 'หนังสือ Calculus II สภาพ 95%', price: 180, category: 'หนังสือเรียน', location: 'ตึกวิศวะ', time: '10 นาทีที่แล้ว' },
  { id: 2, title: 'เสื้อกาวน์ปฏิบัติการ Size L', price: 250, category: 'เสื้อผ้า/ยูนิฟอร์ม', location: 'ตึกวิทยาศาสตร์', time: '30 นาทีที่แล้ว' },
  { id: 3, title: 'iPad Air 4 64GB WiFi (มีรอยนิดหน่อย)', price: 9500, category: 'ไอที/เครื่องใช้ไฟฟ้า', location: 'หอพักใน', time: '1 ชม. ที่แล้ว' },
  { id: 4, title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio', price: 400, category: 'อุปกรณ์การเรียน', location: 'โรงอาหารกลาง', time: '2 ชม. ที่แล้ว' },
  { id: 5, title: 'จักรยานปั่นในมหาลัย สภาพพร้อมใช้งาน', price: 1200, category: 'อื่นๆ', location: 'ลานจอดรถตึกกิจกรรม', time: '3 ชม. ที่แล้ว' },
];

export default function HomePage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-md md:max-w-4xl mx-auto min-h-screen pb-24 px-4 pt-4">
      {/* Header Bar */}
      <header className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-indigo-600 dark:text-indigo-400" size={24} />
            Campus Market
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">แหล่งซื้อขายในวิทยาลัย</p>
        </div>

        {/* Toggle Theme Button */}
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:opacity-80 transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>

      {/* Search Input */}
      <div className="relative my-4">
        <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="ค้นหาสินค้า, ชีทเรียน, อุปกรณ์..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-200/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* Quick Action Banner (สำหรับนักเรียนมาประกาศขาย) */}
      <div className="my-4 p-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg flex items-center justify-between">
        <div>
          <h2 className="font-bold text-base">มีของไม่ได้ใช้ไหม?</h2>
          <p className="text-xs text-indigo-100 opacity-90">ส่งต่อให้เพื่อนๆ ในมหาลัยได้ง่ายๆ</p>
        </div>
        <Link 
          href="/product" 
          className="bg-white text-indigo-600 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow hover:bg-indigo-50 transition-all flex items-center gap-1"
        >
          <PlusCircle size={16} /> ลงขายเลย
        </Link>
      </div>

      {/* Product Feed Grid */}
      <section className="mt-6">
        <h2 className="font-bold text-base mb-3">สินค้ามาใหม่ (5 รายการล่าสุด)</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SAMPLE_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-800 rounded-xl mb-2.5 flex items-center justify-center text-slate-400 text-xs">
                  [ รูปสินค้า {product.id} ]
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300">
                    <Heart size={14} />
                  </button>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium rounded-md">
                  {product.category}
                </span>
                <h3 className="font-semibold text-xs mt-1.5 line-clamp-2 leading-snug">{product.title}</h3>
              </div>
              
              <div className="mt-3">
                <p className="text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">฿{product.price.toLocaleString()}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>{product.location}</span>
                  <span>{product.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 max-w-md mx-auto md:max-w-4xl px-8 py-3 flex justify-around items-center">
        <Link href="/home" className="flex flex-col items-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
          <ShoppingBag size={20} />
          <span>หน้าหลัก</span>
        </Link>
        <Link href="/product" className="flex flex-col items-center text-slate-400 hover:text-indigo-600 text-xs">
          <PlusCircle size={20} />
          <span>เพิ่มสินค้า</span>
        </Link>
      </nav>
    </div>
  );
}