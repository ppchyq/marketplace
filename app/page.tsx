'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Search, Moon, Sun, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import ExperimentalNav from '@/components/ExperimentalNav';

// โหลด Canvas3D แบบ Dynamic (Client-Side Only)
const Canvas3D = dynamic(() => import('@/components/Canvas3D'), { ssr: false });

const SAMPLE_PRODUCTS = [
  { 
    id: 1, 
    title: 'หนังสือ Calculus II สภาพ 95%', 
    price: 180, 
    category: 'หนังสือเรียน', 
    location: 'ตึกวิศวะ', 
    time: '10 นาทีที่แล้ว',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 2, 
    title: 'เสื้อกาวน์ปฏิบัติการ Size L', 
    price: 250, 
    category: 'เสื้อผ้า/ยูนิฟอร์ม', 
    location: 'ตึกวิทยาศาสตร์', 
    time: '30 นาทีที่แล้ว',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 3, 
    title: 'iPad Air 4 64GB WiFi (มีรอยนิดหน่อย)', 
    price: 9500, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'หอพักใน', 
    time: '1 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 4, 
    title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio', 
    price: 400, 
    category: 'อุปกรณ์การเรียน', 
    location: 'โรงอาหารกลาง', 
    time: '2 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80'
  },
  { 
    id: 5, 
    title: 'จักรยานปั่นในมหาลัย สภาพพร้อมใช้งาน', 
    price: 1200, 
    category: 'อื่นๆ', 
    location: 'ลานจอดรถตึกกิจกรรม', 
    time: '3 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80'
  },
];

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="max-w-md md:max-w-4xl mx-auto min-h-screen pb-32 px-4 pt-4">
      {/* Header */}
      <header className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-indigo-600 dark:text-indigo-400" size={24} />
            Campus Market <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/20">3D Edition</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">ตลาดซื้อขายยุคใหม่ในวิทยาลัย</p>
        </div>

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
          placeholder="ค้นหาสินค้าด้วย AI หรือคีย์เวิร์ด..." 
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-200/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
      </div>

      {/* 3D Immersive Hero Section */}
      <div className="my-5">
        <Canvas3D />
      </div>

      {/* Product Feed Grid with 3D Card Hover Effects */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base flex items-center gap-1.5">
            <Sparkles size={18} className="text-indigo-500" />
            สินค้ามาใหม่
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SAMPLE_PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -6, scale: 1.02, rotateX: 2, rotateY: -2 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              <div>
                <div className="relative h-36 w-full rounded-xl mb-2.5 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors">
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
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floating Experimental Navigation */}
      <ExperimentalNav />
    </div>
  );
}