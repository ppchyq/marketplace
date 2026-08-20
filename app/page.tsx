'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { 
  Search, Moon, Sun, ShoppingBag, Heart, Sparkles, X, 
  MapPin, Clock, MessageSquare, ShieldCheck, Tag, Eye
} from 'lucide-react';
import ExperimentalNav from '@/components/ExperimentalNav';

// โหลด Three.js Canvas แบบ Dynamic (Client-side Only)
const Canvas3D = dynamic(() => import('@/components/Canvas3D'), { ssr: false });

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  location: string;
  time: string;
  image: string;
  description: string;
  seller: string;
  condition: string;
}

const SAMPLE_PRODUCTS: Product[] = [
  { 
    id: 1, 
    title: 'หนังสือ Calculus II สภาพ 95%', 
    price: 180, 
    category: 'หนังสือเรียน', 
    location: 'ตึกวิศวะ', 
    time: '10 นาทีที่แล้ว',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    description: 'หนังสือแคลคูลัส 2 สภาพดีมาก ไม่มีรอยขีดเขียน มีสรุปสูตรสำคัญแถมให้ในเล่ม เหมาะสำหรับนิสิตวิศวะ/วิทยาศาสตร์',
    seller: 'พี่นก (วิศวะ ปี 3)',
    condition: 'มือสอง (สภาพ 95%)'
  },
  { 
    id: 2, 
    title: 'เสื้อกาวน์ปฏิบัติการ Size L', 
    price: 250, 
    category: 'เสื้อผ้า/ยูนิฟอร์ม', 
    location: 'ตึกวิทยาศาสตร์', 
    time: '30 นาทีที่แล้ว',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    description: 'เสื้อกาวน์แล็ปแขนยาว ผ้าหนาปานกลาง ซักสะอาดเรียบร้อย ไม่มีรอยเปื้อนเคมี ใส่ไปแล็ปแค่ 3 ครั้ง',
    seller: 'กิ๊ฟ (สหเวช ปี 2)',
    condition: 'มือสอง (สภาพ 98%)'
  },
  { 
    id: 3, 
    title: 'iPad Air 4 64GB WiFi (มีรอยนิดหน่อย)', 
    price: 9500, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'หอพักใน', 
    time: '1 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
    description: 'ใช้งานได้ปกติทุกฟังก์ชั่น สแกนนิ้วติด แบตอึด 88% มีรอยตรงมุมเครื่องนิดหน่อย นัดรับได้ที่หอในหรือหน้ามหาลัย แถมเคสให้ด้วยครับ',
    seller: 'มาร์ค (ไอซีที ปี 4)',
    condition: 'มือสอง (มีรอยตามการใช้งาน)'
  },
  { 
    id: 4, 
    title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio FX-991EX', 
    price: 400, 
    category: 'อุปกรณ์การเรียน', 
    location: 'โรงอาหารกลาง', 
    time: '2 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    description: 'รุ่นยอดฮิตสอบผ่านสบาย ปุ่มกดตอบสนองดี หน้าจอใสไม่มีรอย แถมฝาครอบแท้ ตัวเครื่องรับประกันใช้งานได้แน่นอน',
    seller: 'แบงค์ (บัญชี ปี 2)',
    condition: 'มือสอง (สภาพดี)'
  },
  { 
    id: 5, 
    title: 'จักรยานปั่นในมหาลัย สภาพพร้อมใช้งาน', 
    price: 1200, 
    category: 'อื่นๆ', 
    location: 'ลานจอดรถตึกกิจกรรม', 
    time: '3 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
    description: 'ปั่นไปเรียนสะดวกมาก เบรกทำงานได้ปกติ ยางเพิ่งเปลี่ยนใหม่เดือนที่แล้ว มีตะกร้าหน้าใส่กระเป๋าเรียนได้',
    seller: 'ตั้ม (เกษตร ปี 3)',
    condition: 'มือสองพร้อมใช้งาน'
  },
  { 
    id: 6, 
    title: 'หูฟังไร้สาย Sony WH-1000XM4 ตัดเสียงดีมาก', 
    price: 4800, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'หอพักนอก (ประตู 2)', 
    time: '4 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    description: 'หูฟังตัดเสียงรบกวนระดับท็อป ใส่ อ่านหนังสือในห้องสมุดเงียบกริบ แบตเตอรี่ยังอึด อุปกรณ์ครบกล่องพร้อมเคสพกพา',
    seller: 'เจมส์ (สถาปัตย์ ปี 4)',
    condition: 'มือสอง (สภาพ 90%)'
  },
  { 
    id: 7, 
    title: 'โคมไฟอ่านหนังสือ LED ถนอมสายตา ปรับแสงได้', 
    price: 190, 
    category: 'อุปกรณ์การเรียน', 
    location: 'หอพักใน ตึก 4', 
    time: '5 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&w=600&q=80',
    description: 'โคมไฟตั้งโต๊ะเสียบ USB หรือใช้แบตในตัวได้ ปรับระดับความสว่างได้ 3 ระดับ แสงนวลตาเหมาะสำหรับอ่านหนังสือดึกๆ',
    seller: 'พลอย (มนุษยศาสตร์ ปี 1)',
    condition: 'ของใหม่ไม่ได้ใช้งาน'
  },
  { 
    id: 8, 
    title: 'รองเท้า Sneaker Nike Air Force 1 (Size 42)', 
    price: 1500, 
    category: 'เสื้อผ้า/ยูนิฟอร์ม', 
    location: 'หน้ามหาลัย', 
    time: '6 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80',
    description: 'รองเท้าผ้าใบสีขาวทรงคลาสสิก ใส่เรียนใส่เที่ยวได้ ส้นยังไม่สึก ซักทำความสะอาดพร้อมใช้งาน',
    seller: 'บาส (บริหาร ปี 3)',
    condition: 'มือสอง (สภาพ 88%)'
  },
  { 
    id: 9, 
    title: 'กระเป๋าเป้ Anello ใส่โน้ตบุ๊ก 15 นิ้วได้', 
    price: 450, 
    category: 'เสื้อผ้า/ยูนิฟอร์ม', 
    location: 'ศูนย์หนังสือมหาลัย', 
    time: '8 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    description: 'กระเป๋าเป้สะพายหลังสีน้ำเงินเข้ม จุของได้เยอะมาก มีช่องใส่โน้ตบุ๊กกันกระแทก ซิปแข็งแรงทนทาน',
    seller: 'เมย์ (ครุศาสตร์ ปี 2)',
    condition: 'มือสอง (สภาพดี)'
  },
  { 
    id: 10, 
    title: 'คีย์บอร์ดกลไก Mechanical Keyboard RGB Swappable', 
    price: 890, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'ตึกวิศวะคอม', 
    time: '12 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    description: 'Red Switch เสียงพิมพ์นุ่มมือ ไม่รบกวนคนอื่น ไฟ RGB ปรับได้หลายโหมด ต่อสาย Type-C ได้ ถอดคีย์แคปเปลี่ยนได้สะดวก',
    seller: 'นนท์ (วิศวะคอม ปี 2)',
    condition: 'มือสอง (สภาพ 95%)'
  }
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="max-w-md md:max-w-4xl mx-auto min-h-screen pb-32 px-4 pt-4 relative">
      {/* Header */}
      <header className="flex items-center justify-between py-2">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="text-indigo-600 dark:text-indigo-400" size={24} />
            Campus Market <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded-full border border-indigo-500/20">3D Interactive</span>
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
            สินค้าแนะนำในมหาลัย (10 รายการ)
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SAMPLE_PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              whileHover={{ 
                y: -8, 
                scale: 1.03, 
                rotateX: 4, 
                rotateY: -4,
                boxShadow: "0px 20px 30px rgba(99, 102, 241, 0.2)" 
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-3 shadow-md hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative"
            >
              <div>
                <div className="relative h-36 w-full rounded-xl mb-2.5 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Heart size={14} />
                  </button>

                  <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={10} /> ดู 3D
                  </div>
                </div>

                <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-medium rounded-md">
                  {product.category}
                </span>
                <h3 className="font-semibold text-xs mt-1.5 line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors">
                  {product.title}
                </h3>
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

      {/* Product Detail Modal (3D View + Full Info) */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/60 text-white backdrop-blur-md hover:bg-slate-900 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="overflow-y-auto p-5 space-y-4">
                {/* 3D Visualizer Header in Modal */}
                <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center border border-indigo-500/20 shadow-inner">
                  <Canvas3D />
                  <div className="absolute bottom-2 left-3 text-[10px] bg-indigo-500/20 backdrop-blur-md text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-500/30">
                    🧊 Interactive 3D Model Viewport
                  </div>
                </div>

                {/* Product Title & Price */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-medium rounded-full">
                      {selectedProduct.category}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-medium rounded-full flex items-center gap-1">
                      <ShieldCheck size={12} /> {selectedProduct.condition}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mt-2">{selectedProduct.title}</h2>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    ฿{selectedProduct.price.toLocaleString()}
                  </p>
                </div>

                {/* Description */}
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Tag size={13} /> รายละเอียดสินค้า
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>

                {/* Location & Seller Info */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-[10px] flex items-center gap-1"><MapPin size={12} /> สถานที่นัดรับ</p>
                    <p className="font-semibold mt-0.5">{selectedProduct.location}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-[10px] flex items-center gap-1"><Clock size={12} /> ผู้ขาย</p>
                    <p className="font-semibold mt-0.5">{selectedProduct.seller}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => alert(`ทักแชทหา ${selectedProduct.seller} เรียบร้อย!`)}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} /> ทักแชทนัดรับสินค้า
                  </button>
                  <button 
                    onClick={() => alert('เพิ่มเข้าตระกร้าเรียบร้อย!')}
                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-2xl transition-colors"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Experimental Navigation */}
      <ExperimentalNav />
    </div>
  );
}