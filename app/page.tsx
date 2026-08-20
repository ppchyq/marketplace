'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Moon, Sun, ShoppingBag, Sparkles, X, 
  MessageSquare, ShoppingCart, Trash2, Eye, Plus, Clock, CheckCircle2, Zap
} from 'lucide-react';

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
  sellerStatus: string;
  sellerResponseRate: string;
  condition: string;
}

interface CartItem extends Product {
  quantity: number;
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
    description: 'หนังสือแคลคูลัส 2 สภาพดีมาก ไม่มีรอยขีดเขียน มีสรุปสูตรสำคัญแถมให้ในเล่ม',
    seller: 'พี่นก (วิศวะ ปี 3)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 5 นาที',
    condition: 'มือสอง (สภาพ 95%)'
  },
  { 
    id: 2, 
    title: 'เสื้อกาวน์ปฏิบัติการ Size L', 
    price: 250, 
    category: 'เสื้อผ้า/ยูนิฟอร์ม', 
    location: 'ตึกวิทยาศาสตร์', 
    time: '30 นาทีที่แล้ว',
    image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=600&q=80',
    description: 'เสื้อกาวน์แล็ปแขนยาว ผ้าหนาปานกลาง ซักสะอาดเรียบร้อย ใส่ไปแล็ปแค่ 3 ครั้ง',
    seller: 'กิ๊ฟ (สหเวช ปี 2)',
    sellerStatus: 'ใช้งานล่าสุด 15 นาทีที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 15 นาที',
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
    description: 'ใช้งานได้ปกติทุกฟังก์ชั่น สแกนนิ้วติด แบตอึด 88% แถมเคสให้ด้วยครับ',
    seller: 'มาร์ค (ไอซีที ปี 4)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 2 นาที',
    condition: 'มือสอง (มีรอยตามการใช้งาน)'
  },
  { 
    id: 4, 
    title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio FX-991EX', 
    price: 400, 
    category: 'อุปกรณ์การเรียน', 
    location: 'โรงอาหารกลาง', 
    time: '2 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48b?auto=format&fit=crop&w=600&q=80',
    description: 'รุ่นยอดฮิตสอบผ่านสบาย ปุ่มกดตอบสนองดี หน้าจอใสไม่มีรอย แถมฝาครอบแท้',
    seller: 'แบงค์ (บัญชี ปี 2)',
    sellerStatus: 'ใช้งานล่าสุด 1 ชม. ที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 30 นาที',
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
    description: 'ปั่นไปเรียนสะดวกมาก เบรกทำงานได้ปกติ ยางเพิ่งเปลี่ยนใหม่เดือนที่แล้ว',
    seller: 'ตั้ม (เกษตร ปี 3)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 10 นาที',
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
    description: 'หูฟังตัดเสียงรบกวนระดับท็อป ใส่ อ่านหนังสือในห้องสมุดเงียบกริบ แบตเตอรี่ยังอึด',
    seller: 'เจมส์ (สถาปัตย์ ปี 4)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 5 นาที',
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
    description: 'โคมไฟตั้งโต๊ะเสียบ USB หรือใช้แบตในตัวได้ ปรับระดับความสว่างได้ 3 ระดับ',
    seller: 'พลอย (มนุษยศาสตร์ ปี 1)',
    sellerStatus: 'ใช้งานล่าสุด 3 ชม. ที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 1 ชม.',
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
    description: 'รองเท้าผ้าใบสีขาวทรงคลาสสิก ใส่เรียนใส่เที่ยวได้ ส้นยังไม่สึก ซักทำความสะอาดแล้ว',
    seller: 'บาส (บริหาร ปี 3)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 5 นาที',
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
    description: 'กระเป๋าเป้สะพายหลังสีน้ำเงินเข้ม จุของได้เยอะมาก มีช่องใส่โน้ตบุ๊กกันกระแทก',
    seller: 'เมย์ (ครุศาสตร์ ปี 2)',
    sellerStatus: 'ใช้งานล่าสุด 2 ชม. ที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 20 นาที',
    condition: 'มือสอง (สภาพดี)'
  },
  { 
    id: 10, 
    title: 'คีย์บอร์ดกลไก Mechanical Keyboard RGB', 
    price: 890, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'ตึกวิศวะคอม', 
    time: '12 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
    description: 'Red Switch เสียงพิมพ์นุ่มมือ ไม่รบกวนคนอื่น ไฟ RGB ปรับได้หลายโหมด',
    seller: 'นนท์ (วิศวะคอม ปี 2)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 1 นาที',
    condition: 'มือสอง (สภาพ 95%)'
  }
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // กันไม่ให้กดเปิด Pop-up
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const goToChat = (product: Product) => {
    router.push(`/chat?seller=${encodeURIComponent(product.seller)}&product=${encodeURIComponent(product.title)}`);
  };

  return (
    <div className="max-w-md md:max-w-4xl mx-auto min-h-screen pb-32 px-4 pt-6 relative selection:bg-indigo-500 selection:text-white">
      {/* Header ดีไซน์ใหม่ หัวข้อใหญ่เท่ดุดัน */}
      <header className="flex items-center justify-between py-2 border-b border-slate-200/80 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/30">
              <ShoppingBag size={22} />
            </span>
            <span className="text-[11px] font-black tracking-widest uppercase bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Campus Marketplace 3D
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            CAMPUS HUB
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95 transition-all shadow-sm"
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </header>

      {/* ช่องค้นหาลุคไซเบอร์ */}
      <div className="relative my-5">
        <Search className="absolute left-4 top-3.5 text-indigo-500" size={20} />
        <input 
          type="text" 
          placeholder="ค้นหาสินค้าด้วย AI เช่น หนังสือ, iPad, รองเท้า..." 
          className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium shadow-inner transition-all"
        />
      </div>

      {/* Canvas 3D Hero */}
      <div className="my-6 h-52 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
        <Canvas3D />
      </div>

      {/* รายการสินค้า */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black flex items-center gap-2 tracking-tight">
            <Sparkles size={22} className="text-indigo-500" />
            สินค้าหลุดจองล่าสุด
          </h2>
          <span className="text-xs font-semibold text-slate-400">10 รายการพร้อมส่ง</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SAMPLE_PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-3 shadow-sm hover:shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                {/* รูปสินค้า + ปุ่มลงตะกร้าบนรูป */}
                <div className="relative h-40 w-full rounded-2xl mb-3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    unoptimized 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={12} /> กดเพื่อดู 3D
                  </div>

                  {/* ปุ่มกดใส่ตะกร้าทันทีที่ทัชรูป */}
                  <button
                    onClick={(e) => addToCart(product, e)}
                    title="ลงตะกร้าทันที"
                    className="absolute top-2 right-2 p-2.5 rounded-xl bg-indigo-600 text-white shadow-lg hover:bg-indigo-500 active:scale-90 transition-all z-10"
                  >
                    <Plus size={16} className="font-bold" />
                  </button>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  {product.category}
                </span>
                <h3 className="font-bold text-xs mt-2 line-clamp-2 leading-snug group-hover:text-indigo-500 transition-colors">
                  {product.title}
                </h3>
              </div>
              
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <p className="text-indigo-600 dark:text-indigo-400 font-black text-base">฿{product.price.toLocaleString()}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium mt-1">
                  <span>{product.location}</span>
                  <span>{product.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pop-up แสดงรายละเอียดสินค้า + การโต้ตอบของผู้ขาย + ปุ่มสลับตำแหน่ง */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 z-20 p-2.5 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="overflow-y-auto p-5 space-y-4">
                {/* 3D Box View */}
                <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-950 border border-indigo-500/30">
                  <Canvas3D category={selectedProduct.category} />
                  <div className="absolute bottom-3 left-3 text-[10px] font-bold bg-indigo-500/20 backdrop-blur-md text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                    🧊 โมเดล 3D โต้ตอบได้ (หมุนดูได้)
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-black">{selectedProduct.title}</h2>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">฿{selectedProduct.price.toLocaleString()}</p>
                </div>

                {/* การตอบกลับและสถานะของผู้ขาย (Seller Response Status) */}
                <div className="p-3.5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200/50 dark:border-indigo-800/40 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      ผู้ขาย: {selectedProduct.seller}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      ● {selectedProduct.sellerStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Zap size={13} className="text-amber-500" />
                    อัตราการตอบแชท: <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedProduct.sellerResponseRate}</span>
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-slate-400 text-[10px] font-medium">สถานที่นัดรับ</p>
                    <p className="font-bold mt-0.5">{selectedProduct.location}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <p className="text-slate-400 text-[10px] font-medium">สภาพสินค้า</p>
                    <p className="font-bold mt-0.5">{selectedProduct.condition}</p>
                  </div>
                </div>

                {/* สลับตำแหน่งปุ่ม: ปุ่มลงตะกร้าเป็นปุ่มหลัก (Main Button) / ปุ่มทักแชทเป็นปุ่มรอง */}
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      alert('เพิ่มสินค้าลงตะกร้าเรียบร้อย!');
                    }}
                    className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingCart size={18} /> ใส่ตะกร้าเลย
                  </button>
                  <button 
                    onClick={() => goToChat(selectedProduct)}
                    className="px-4 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare size={16} /> ทักแชท
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/70 backdrop-blur-sm">
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-black text-base flex items-center gap-2">
                    <ShoppingCart size={20} className="text-indigo-500" /> ตะกร้าสินค้า
                  </h3>
                  <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 space-y-3 max-h-[65vh] overflow-y-auto">
                  {cart.length === 0 ? (
                    <p className="text-xs text-center text-slate-400 py-12">ไม่มีสินค้าในตะกร้า</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <h4 className="font-bold text-xs line-clamp-1">{item.title}</h4>
                          <p className="text-xs font-black text-indigo-500 mt-1">฿{item.price.toLocaleString()} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 p-2">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-sm font-black">
                    <span>ราคารวมทั้งหมด</span>
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl">฿{totalPrice.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert('สั่งซื้อสินค้าเรียบร้อยแล้ว!');
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-indigo-500/30 active:scale-95"
                  >
                    ยืนยันการสั่งซื้อ / นัดรับ
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}