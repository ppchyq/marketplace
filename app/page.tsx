'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Moon, Sun, ShoppingBag, Sparkles, X, 
  MessageSquare, ShoppingCart, Trash2, Eye, Plus, ShieldCheck, Zap, SlidersHorizontal,
  PlusCircle, CreditCard, QrCode, Wallet, CheckCircle2, Upload
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
  isHot?: boolean;
}

interface CartItem extends Product {
  quantity: number;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, title: 'หนังสือ Calculus II สภาพ 95%', price: 180, category: 'หนังสือเรียน', location: 'ตึกวิศวะ', time: '10 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', description: 'หนังสือแคลคูลัส 2 สภาพดีมาก ไม่มีรอยขีดเขียน มีสรุปสูตรสำคัญแถมให้ในเล่ม', seller: 'พี่นก (วิศวะ ปี 3)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 5 นาที', condition: 'มือสอง (สภาพ 95%)', isHot: true },
  { id: 2, title: 'เสื้อกาวน์ปฏิบัติการ Size L', price: 250, category: 'เสื้อผ้า/ยูนิฟอร์ม', location: 'ตึกวิทยาศาสตร์', time: '30 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80', description: 'เสื้อกาวน์แล็ปแขนยาว ผ้าหนาปานกลาง ซักสะอาดเรียบร้อย ใส่ไปแล็ปแค่ 3 ครั้ง', seller: 'กิ๊ฟ (สหเวช ปี 2)', sellerStatus: 'ใช้งานล่าสุด 15 นาทีที่แล้ว', sellerResponseRate: 'ตอบภายใน 15 นาที', condition: 'มือสอง (สภาพ 98%)' },
  { id: 3, title: 'iPad Air 4 64GB WiFi (มีรอยนิดหน่อย)', price: 9500, category: 'ไอที/เครื่องใช้ไฟฟ้า', location: 'หอพักใน', time: '1 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80', description: 'ใช้งานได้ปกติทุกฟังก์ชั่น สแกนนิ้วติด แบตอึด 88% แถมเคสให้ด้วยครับ', seller: 'มาร์ค (ไอซีที ปี 4)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 2 นาที', condition: 'มือสอง (มีรอยตามการใช้งาน)', isHot: true },
  { id: 4, title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio FX-991EX', price: 400, category: 'อุปกรณ์การเรียน', location: 'โรงอาหารกลาง', time: '2 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80', description: 'รุ่นยอดฮิตสอบผ่านสบาย ปุ่มกดตอบสนองดี หน้าจอใสไม่มีรอย แถมฝาครอบแท้', seller: 'แบงค์ (บัญชี ปี 2)', sellerStatus: 'ใช้งานล่าสุด 1 ชม. ที่แล้ว', sellerResponseRate: 'ตอบภายใน 30 นาที', condition: 'มือสอง (สภาพดี)' },
  { id: 5, title: 'จักรยานปั่นในมหาลัย สภาพพร้อมใช้งาน', price: 1200, category: 'อื่นๆ', location: 'ลานจอดรถตึกกิจกรรม', time: '3 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', description: 'ปั่นไปเรียนสะดวกมาก เบรกทำงานได้ปกติ ยางเพิ่งเปลี่ยนใหม่เดือนที่แล้ว', seller: 'ตั้ม (เกษตร ปี 3)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 10 นาที', condition: 'มือสองพร้อมใช้งาน' },
  { id: 6, title: 'หูฟังไร้สาย Sony WH-1000XM4', price: 4800, category: 'ไอที/เครื่องใช้ไฟฟ้า', location: 'หอพักนอก (ประตู 2)', time: '4 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80', description: 'หูฟังตัดเสียงรบกวนระดับท็อป ใส่ อ่านหนังสือในห้องสมุดเงียบกริบ แบตเตอรี่ยังอึด', seller: 'เจมส์ (สถาปัตย์ ปี 4)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 5 นาที', condition: 'มือสอง (สภาพ 90%)', isHot: true },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card' | 'truemoney'>('promptpay');

  // Form State สำหรับลงขายสินค้าใหม่
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    category: 'อุปกรณ์การเรียน',
    location: '',
    description: '',
    condition: 'มือสอง (สภาพดี)',
  });

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;

    const createdProduct: Product = {
      id: Date.now(),
      title: newProduct.title,
      price: Number(newProduct.price),
      category: newProduct.category,
      location: newProduct.location || 'ในมหาลัย',
      time: 'เมื่อกี้',
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      description: newProduct.description || 'ไม่มีรายละเอียดเพิ่มเติม',
      seller: 'คุณ (ผู้ใช้ปัจจุบัน)',
      sellerStatus: 'ออนไลน์อยู่',
      sellerResponseRate: 'ตอบไวที่สุด',
      condition: newProduct.condition,
      isHot: true
    };

    setProducts([createdProduct, ...products]);
    setIsAddProductOpen(false);
    setNewProduct({ title: '', price: '', category: 'อุปกรณ์การเรียน', location: '', description: '', condition: 'มือสอง (สภาพดี)' });
    alert('🎉 ลงประกาศขายสินค้าสำเร็จแล้ว!');
  };

  const handlePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setPaymentSuccess(false);
    }, 2500);
  };

  return (
    <div className="max-w-md md:max-w-6xl mx-auto min-h-screen pb-32 px-4 pt-6 font-sans selection:bg-cyan-500 selection:text-black">
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-cyan-500/25">
            <ShoppingBag size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-cyan-500 to-indigo-500 bg-clip-text text-transparent block">
              NEXT-GEN MARKET
            </span>
            <h1 className="text-xl md:text-2xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-700 dark:from-white dark:via-cyan-200 dark:to-slate-400 bg-clip-text text-transparent">
              CAMPUS NEXUS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ปุ่มลงขายสินค้าใหม่ */}
          <button 
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">ลงขายสินค้า</span>
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-cyan-500/10 text-slate-800 dark:text-slate-100 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all border border-slate-200/60 dark:border-slate-700/50"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-cyan-500/10 text-slate-800 dark:text-slate-100 hover:text-cyan-500 dark:hover:text-cyan-400 transition-all border border-slate-200/60 dark:border-slate-700/50"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative my-6">
        <div className="absolute left-4 top-3.5 p-1 bg-cyan-500/10 rounded-lg text-cyan-500">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          placeholder="ค้นหาสินค้า, เสื้อกาวน์, เครื่องคิดเลข หรือนัดรับ..." 
          className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium shadow-sm transition-all"
        />
        <button className="absolute right-3 top-3 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-cyan-500 transition-colors">
          <SlidersHorizontal size={18} />
        </button>
      </div>

      {/* 3D Showcase Box */}
      <div className="my-6 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl relative bg-white">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50 text-white text-xs font-bold shadow-lg">
          <Sparkles size={14} className="text-cyan-400 animate-spin" />
          <span>Interactive 3D Preview (หมุนดูได้)</span>
        </div>
        <div className="h-64 md:h-72 w-full bg-white">
          <Canvas3D />
        </div>
      </div>

      {/* Product List */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Zap size={22} className="text-cyan-500 fill-cyan-500" />
              รายการสินค้ามาใหม่
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">รวมสินค้าสภาพดีพร้อมนัดรับรอบมหาลัย</p>
          </div>
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            {products.length} PRODUCTS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-sm hover:shadow-2xl hover:border-cyan-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div>
                <div className="relative h-44 w-full rounded-2xl mb-3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    unoptimized 
                    className="object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                  
                  {product.isHot && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
                      HOT
                    </span>
                  )}

                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-cyan-300 text-[9px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={12} /> กดเพื่อส่อง 3D
                  </div>

                  <button
                    onClick={(e) => addToCart(product, e)}
                    title="ใส่ตะกร้าทันที"
                    className="absolute top-2 right-2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500 text-white backdrop-blur-md transition-all z-10 hover:scale-110 active:scale-95 shadow-md"
                  >
                    <Plus size={16} className="font-bold" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg">
                    {product.category}
                  </span>
                </div>

                <h3 className="font-bold text-xs mt-2 line-clamp-2 leading-snug group-hover:text-cyan-500 transition-colors">
                  {product.title}
                </h3>
              </div>
              
              <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                <p className="text-cyan-600 dark:text-cyan-400 font-black text-base tracking-tight">
                  ฿{product.price.toLocaleString()}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-1">
                  <span>{product.location}</span>
                  <span>{product.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal ลงขายสินค้าใหม่ */}
      <AnimatePresence>
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-black text-base flex items-center gap-2">
                  <PlusCircle size={20} className="text-cyan-500" /> ลงขายสินค้าใหม่
                </h3>
                <button onClick={() => setIsAddProductOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">ชื่อสินค้า *</label>
                  <input 
                    type="text" required placeholder="เช่น หนังสือ Physics I สภาพดี"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">ราคา (บาท) *</label>
                    <input 
                      type="number" required placeholder="250"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">หมวดหมู่</label>
                    <select 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                    >
                      <option>หนังสือเรียน</option>
                      <option>อุปกรณ์การเรียน</option>
                      <option>เสื้อผ้า/ยูนิฟอร์ม</option>
                      <option>ไอที/เครื่องใช้ไฟฟ้า</option>
                      <option>อื่นๆ</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">สถานที่นัดรับ</label>
                  <input 
                    type="text" placeholder="เช่น โรงอาหารกลาง, ตึกวิศวะ"
                    value={newProduct.location}
                    onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">รายละเอียดเพิ่มเติม</label>
                  <textarea 
                    rows={3} placeholder="บอกรายละเอียด สภาพสินค้า และของแถม..."
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  ยืนยันการลงขาย
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer & Checkout Trigger */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl border-l border-slate-200 dark:border-slate-800"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-black text-base flex items-center gap-2">
                    <ShoppingCart size={20} className="text-cyan-500" /> ตะกร้าสินค้า
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
                          <p className="text-xs font-black text-cyan-600 dark:text-cyan-400 mt-1">฿{item.price.toLocaleString()} x {item.quantity}</p>
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
                    <span className="text-cyan-600 dark:text-cyan-400 text-xl">฿{totalPrice.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
                  >
                    ดำเนินการชำระเงิน
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Portal Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              {paymentSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 size={64} className="text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black">ชำระเงินสำเร็จ!</h3>
                  <p className="text-xs text-slate-400">ระบบได้ส่งใบเสร็จและแจ้งผู้ขายเรียบร้อยแล้ว</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-black text-base flex items-center gap-2">
                      <CreditCard size={20} className="text-cyan-500" /> ระบบชำระเงิน
                    </h3>
                    <button onClick={() => setIsCheckoutOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-4 text-xs">
                    {/* ยอดชำระ */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/50 flex justify-between items-center">
                      <span className="font-bold text-slate-500">ยอดชำระสุทธิ</span>
                      <span className="text-2xl font-black text-cyan-500">฿{totalPrice.toLocaleString()}</span>
                    </div>

                    {/* ช่องทางชำระเงิน */}
                    <div>
                      <label className="block font-bold mb-2">เลือกช่องทางการชำระเงิน</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => setPaymentMethod('promptpay')}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                            paymentMethod === 'promptpay' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-bold' : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <QrCode size={20} /> PromptPay
                        </button>
                        <button 
                          onClick={() => setPaymentMethod('card')}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                            paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-bold' : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <CreditCard size={20} /> บัตรเครดิต
                        </button>
                        <button 
                          onClick={() => setPaymentMethod('truemoney')}
                          className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                            paymentMethod === 'truemoney' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-bold' : 'border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <Wallet size={20} /> TrueMoney
                        </button>
                      </div>
                    </div>

                    {/* แสดงรายละเอียดตามช่องทาง */}
                    {paymentMethod === 'promptpay' && (
                      <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-2">
                        <div className="w-36 h-36 mx-auto bg-slate-100 rounded-xl flex items-center justify-center border border-slate-300">
                          <QrCode size={100} className="text-slate-800" />
                        </div>
                        <p className="text-[10px] text-slate-400">สแกน QR Code เพื่อชำระเงินผ่านแอปธนาคาร</p>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div className="space-y-2">
                        <input type="text" placeholder="หมายเลขบัตร 16 หลัก" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" placeholder="MM/YY" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                          <input type="text" placeholder="CVV" className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'truemoney' && (
                      <input type="text" placeholder="เบอร์โทรศัพท์ TrueMoney Wallet" className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
                    )}

                    <button 
                      onClick={handlePayment}
                      className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 mt-2"
                    >
                      ยืนยันการชำระเงิน ฿{totalPrice.toLocaleString()}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}