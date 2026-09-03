'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { 
  Search, Moon, Sun, ShoppingBag, Sparkles, X, 
  MessageSquare, ShoppingCart, Trash2, Plus, Zap,
  PlusCircle, CreditCard, QrCode, Wallet, CheckCircle2, MapPin, Tag, History, Send, Package, Ticket, Check, ArrowLeft, Minus, Upload, Loader2, ShieldCheck, Clock, Flame, Star, ChevronRight
} from 'lucide-react';

const Canvas3D = dynamic(() => import('@/components/Canvas3D'), { ssr: false });

interface Product {
  id: number;
  sku: string;
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

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  status: string;
  address: string;
  paymentMethod: string;
}

interface Voucher {
  id: string;
  code: string;
  title: string;
  discountText: string;
  discountValue: number;
  minSpend: number;
  isCollected: boolean;
  type: 'flat' | 'shipping';
}

const INITIAL_VOUCHERS: Voucher[] = [
  { id: 'v1', code: 'CAMPUS2026', title: 'ส่วนลดเด็กมหาลัย', discountText: 'ลด ฿100', discountValue: 100, minSpend: 200, isCollected: false, type: 'flat' },
  { id: 'v2', code: 'FREESHIP', title: 'โค้ดส่งฟรี / นัดรับฟรี', discountText: 'ลดค่าจัดส่ง ฿40', discountValue: 40, minSpend: 0, isCollected: false, type: 'shipping' },
  { id: 'v3', code: 'WELCOME50', title: 'ส่วนลดสมาชิกใหม่', discountText: 'ลด ฿50', discountValue: 50, minSpend: 100, isCollected: false, type: 'flat' },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, sku: 'SKU-CALC-001', title: 'หนังสือ Calculus II สภาพ 95%', price: 180, category: 'หนังสือเรียน', location: 'ตึกวิศวะ', time: '10 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', description: 'หนังสือแคลคูลัส 2 สภาพดีมาก ไม่มีรอยขีดเขียน มีสรุปสูตรสำคัญแถมให้ในเล่ม', seller: 'พี่นก (วิศวะ ปี 3)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 5 นาที', condition: 'มือสอง (สภาพ 95%)', isHot: true },
  { id: 2, sku: 'SKU-LAB-002', title: 'เสื้อกาวน์ปฏิบัติการ Size L', price: 250, category: 'เสื้อผ้า/ยูนิฟอร์ม', location: 'ตึกวิทยาศาสตร์', time: '30 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80', description: 'เสื้อกาวน์แล็ปแขนยาว ผ้าหนาปานกลาง ซักสะอาดเรียบร้อย ใส่ไปแล็ปแค่ 3 ครั้ง', seller: 'กิ๊ฟ (สหเวช ปี 2)', sellerStatus: 'ใช้งานล่าสุด 15 นาทีที่แล้ว', sellerResponseRate: 'ตอบภายใน 15 นาที', condition: 'มือสอง (สภาพ 98%)' },
  { id: 3, sku: 'SKU-IPAD-003', title: 'iPad Air 4 64GB WiFi (มีรอยนิดหน่อย)', price: 9500, category: 'ไอที/เครื่องใช้ไฟฟ้า', location: 'หอพักใน', time: '1 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80', description: 'ใช้งานได้ปกติทุกฟังก์ชั่น สแกนนิ้วติด แบตอึด 88% แถมเคสให้ด้วยครับ', seller: 'มาร์ค (ไอซีที ปี 4)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 2 นาที', condition: 'มือสอง (มีรอยตามการใช้งาน)', isHot: true },
  { id: 4, sku: 'SKU-CASI-004', title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio FX-991EX', price: 400, category: 'อุปกรณ์การเรียน', location: 'โรงอาหารกลาง', time: '2 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80', description: 'รุ่นยอดฮิตสอบผ่านสบาย ปุ่มกดตอบสนองดี หน้าจอใสไม่มีรอย แถมฝาครอบแท้', seller: 'แบงค์ (บัญชี ปี 2)', sellerStatus: 'ใช้งานล่าสุด 1 ชม. ที่แล้ว', sellerResponseRate: 'ตอบภายใน 30 นาที', condition: 'มือสอง (สภาพดี)' },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVoucherCenterOpen, setIsVoucherCenterOpen] = useState(false);
  const [activeChatSeller, setActiveChatSeller] = useState<{ seller: string; product: string } | null>(null);
  
  // Payment Status State (idle | processing | success)
  const [paymentState, setPaymentState] = useState<'idle' | 'processing' | 'success'>('idle');
  
  // Checkout Form State
  const [shippingAddress, setShippingAddress] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card' | 'truemoney'>('promptpay');

  // Chat State
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'seller'; text: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Form ลงขาย
  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    price: '', 
    category: 'อุปกรณ์การเรียน', 
    location: '', 
    image: '',
    description: '', 
    condition: 'มือสอง (สภาพดี)' 
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductQuantity(1);
  };

  const addToCart = (product: Product, quantityToAdd: number = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item);
      }
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    addToCart(product, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((item) => item.id !== id));

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = selectedVoucher && totalPrice >= selectedVoucher.minSpend ? selectedVoucher.discountValue : 0;
  const finalTotal = Math.max(0, totalPrice - discountAmount);

  const collectVoucher = (id: string) => {
    setVouchers((prev) => prev.map((v) => v.id === id ? { ...v, isCollected: true } : v));
  };

  const openChatWithSeller = (seller: string, productTitle: string) => {
    setActiveChatSeller({ seller, product: productTitle });
    setChatMessages([{ sender: 'seller', text: `สวัสดีครับ สนใจ ${productTitle} สอบถามเพิ่มได้เลยครับ!` }]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    setChatMessages((prev) => [...prev, { sender: 'user', text: inputMessage }]);
    setInputMessage('');
    setTimeout(() => setChatMessages((prev) => [...prev, { sender: 'seller', text: 'รับทราบครับผม สะดวกนัดรับที่ไหนแจ้งได้เลยนะครับ' }]), 1000);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;
    const createdProduct: Product = {
      id: Date.now(),
      sku: `SKU-USER-${Math.floor(100 + Math.random() * 900)}`,
      title: newProduct.title,
      price: Number(newProduct.price),
      category: newProduct.category,
      location: newProduct.location || 'ในมหาลัย',
      time: 'เมื่อกี้',
      image: newProduct.image || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
      description: newProduct.description || 'ไม่มีรายละเอียดเพิ่มเติม',
      seller: 'คุณ (ผู้ใช้ปัจจุบัน)',
      sellerStatus: 'ออนไลน์อยู่',
      sellerResponseRate: 'ตอบไวที่สุด',
      condition: newProduct.condition,
      isHot: true
    };
    setProducts([createdProduct, ...products]);
    setIsAddProductOpen(false);
    setNewProduct({ title: '', price: '', category: 'อุปกรณ์การเรียน', location: '', image: '', description: '', condition: 'มือสอง (สภาพดี)' });
  };

  const handlePayment = () => {
    if (!shippingAddress.trim()) {
      alert('กรุณากรอกที่อยู่/จุดนัดรับสินค้าด้วยครับ');
      return;
    }
    
    setPaymentState('processing');

    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        total: totalPrice,
        discount: discountAmount,
        finalTotal: finalTotal,
        status: 'ชำระเงินสำเร็จ (รอจัดส่ง)',
        address: shippingAddress,
        paymentMethod: paymentMethod.toUpperCase()
      };
      setOrders([newOrder, ...orders]);
      
      setPaymentState('success');

      setTimeout(() => {
        setCart([]);
        setIsCheckoutOpen(false);
        setIsCartOpen(false);
        setPaymentState('idle');
        setSelectedVoucher(null);
        setShippingAddress('');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans relative selection:bg-cyan-500 selection:text-white pb-32">
      
      {/* Background Glow Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="max-w-md md:max-w-6xl mx-auto px-4 pt-6 relative z-10">

        {/* Header */}
        <header className="flex items-center justify-between p-3.5 sm:p-4 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-none sticky top-4 z-40">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 ring-2 ring-white/20">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 block">NEXT-GEN MARKET</span>
              <h1 className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400">
                CAMPUS NEXUS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ปุ่มเก็บโค้ดส่วนลด */}
            <button 
              onClick={() => setIsVoucherCenterOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20 transition-all active:scale-95"
            >
              <Ticket size={18} className="animate-bounce" />
              <span className="hidden sm:inline">ส่วนลด</span>
            </button>

            {/* ปุ่มประวัติการสั่งซื้อ */}
            <button onClick={() => setIsHistoryOpen(true)} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60">
              <History size={18} />
            </button>

            {/* ปุ่มลงขาย */}
            <button onClick={() => setIsAddProductOpen(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-95 transition-all">
              <PlusCircle size={18} />
              <span className="hidden sm:inline">ลงขาย</span>
            </button>

            {/* ปุ่มตะกร้า */}
            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60">
              <ShoppingCart size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
              {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-indigo-600" />}
            </button>
          </div>
        </header>

        {/* Hero Section & Search Bar */}
        <section className="my-8">
          <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent border border-cyan-500/20 overflow-hidden shadow-2xl backdrop-blur-xl">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-[11px] border border-cyan-500/20 mb-3">
                <Flame size={14} className="text-orange-500" /> ตลาดนัดนักศึกษา มหาวิทยาลัยอันดับ 1
              </span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight mb-2">
                ซื้อง่าย ขายคล่อง <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">
                  ส่งต่อไอเทมเด็กมหาลัย
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mb-6">
                รวมหนังสือเรียน ยูนิฟอร์ม ไอที และอุปกรณ์การเรียน นัดรับในมหาลัยง่ายๆ ได้ทันที
              </p>

              {/* Search Input */}
              <div className="relative flex items-center">
                <Search size={20} className="absolute left-4 text-cyan-500 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="ค้นหาสินค้า, เสื้อกาวน์, เครื่องคิดเลข..." 
                  className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-semibold shadow-xl shadow-slate-200/30 dark:shadow-none backdrop-blur-md transition-all" 
                />
                <button className="absolute right-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                  ค้นหา
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 3D Interactive Showcase */}
        <div className="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative bg-white dark:bg-slate-900">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 dark:bg-slate-800/80 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg">
            <Sparkles size={14} className="text-cyan-400 animate-spin" /> Interactive 3D Model View
          </div>
          <div className="h-72 w-full bg-gradient-to-b from-slate-100 to-white dark:from-slate-900 dark:to-slate-950 flex items-center justify-center">
            <Canvas3D />
          </div>
        </div>

        {/* Products Grid Section */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
                <Zap size={22} className="text-cyan-500 fill-cyan-500" /> สินค้ามาใหม่ล่าสุด
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">อัปเดตสดใหม่จากเพื่อนๆ ในรั้วมหาลัย</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                onClick={() => handleSelectProduct(product)} 
                whileHover={{ y: -6, transition: { duration: 0.2 } }} 
                className="cursor-pointer bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3.5 shadow-xl shadow-slate-200/40 dark:shadow-none hover:shadow-2xl hover:border-cyan-500/50 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div>
                  <div className="relative h-44 w-full rounded-2xl mb-3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image src={product.image} alt={product.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    {product.isHot && (
                      <span className="absolute top-2.5 left-2.5 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                        <Flame size={10} fill="white" /> HOT
                      </span>
                    )}
                    <button 
                      onClick={(e) => addToCart(product, 1, e)} 
                      className="absolute top-2.5 right-2.5 p-2.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500 text-white shadow-lg backdrop-blur-md transition-all active:scale-95"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {product.category}
                  </span>
                  
                  <h3 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug mt-2 group-hover:text-cyan-500 transition-colors">
                    {product.title}
                  </h3>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-end justify-between">
                  <div>
                    <p className="text-cyan-600 dark:text-cyan-400 font-black text-base sm:text-lg tracking-tight">฿{product.price.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><MapPin size={10} /> {product.location}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">{product.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Modal Shopee-Style Voucher Center */}
        <AnimatePresence>
          {isVoucherCenterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-base flex items-center gap-2 text-amber-500"><Ticket size={20} /> ศูนย์เก็บโค้ดส่วนลดพิเศษ</h3>
                  <button onClick={() => setIsVoucherCenterOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X size={18} /></button>
                </div>

                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {vouchers.map((v) => (
                    <div key={v.id} className="p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-500 text-white rounded-md">{v.code}</span>
                        <h4 className="font-bold text-sm mt-1">{v.title}</h4>
                        <p className="text-xs font-black text-amber-600 dark:text-amber-400">{v.discountText}</p>
                        <p className="text-[10px] text-slate-400">ขั้นต่ำ ฿{v.minSpend}</p>
                      </div>
                      <button 
                        onClick={() => collectVoucher(v.id)}
                        disabled={v.isCollected}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          v.isCollected 
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-default' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 active:scale-95'
                        }`}
                      >
                        {v.isCollected ? <><Check size={14} /> เก็บแล้ว</> : 'กดเก็บโค้ด'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal ส่องรายละเอียดสินค้า */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <ArrowLeft size={16} /> ย้อนกลับ
                  </button>
                  <button onClick={() => setSelectedProduct(null)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"><X size={18} /></button>
                </div>

                <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4 shadow-inner">
                  <Image src={selectedProduct.image} alt={selectedProduct.title} fill unoptimized className="object-cover" />
                </div>
                
                <h2 className="text-xl font-black leading-snug">{selectedProduct.title}</h2>
                <p className="text-2xl font-black text-cyan-500 my-2">฿{selectedProduct.price.toLocaleString()}</p>
                
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 my-3 text-xs space-y-1.5">
                  <p className="font-bold flex items-center justify-between">
                    <span>รหัสสินค้า (SKU):</span>
                    <span className="text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">{selectedProduct.sku}</span>
                  </p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">ผู้ขาย: {selectedProduct.seller}</p>
                  <p className="text-slate-400">พิกัดนัดรับ: {selectedProduct.location}</p>
                  <p className="text-slate-400">สภาพ: {selectedProduct.condition}</p>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-3">{selectedProduct.description}</p>
                
                {/* ตัวเลือกจำนวนสินค้า */}
                <div className="flex items-center justify-between my-4 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                  <span className="text-xs font-bold">จำนวนสินค้าที่ต้องการ:</span>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-all active:scale-95"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-black text-sm w-6 text-center">{productQuantity}</span>
                    <button 
                      onClick={() => setProductQuantity(productQuantity + 1)}
                      className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-all active:scale-95"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* ปุ่มทักแชท / ใส่ตะกร้า / สั่งซื้อทันที */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => { addToCart(selectedProduct, productQuantity); alert(`เพิ่มลงตะกร้า ${productQuantity} ชิ้นแล้ว!`); }} 
                      className="flex-1 py-3.5 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-cyan-500/20 transition-all active:scale-95"
                    >
                      <ShoppingCart size={16} /> ใส่ตะกร้า
                    </button>
                    <button 
                      onClick={() => handleBuyNow(selectedProduct, productQuantity)} 
                      className="flex-1 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all active:scale-95"
                    >
                      <Zap size={16} /> สั่งซื้อทันที
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => { openChatWithSeller(selectedProduct.seller, selectedProduct.title); setSelectedProduct(null); }} 
                    className="w-full py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <MessageSquare size={16} /> ทักแชทผู้ขาย
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal แชท */}
        <AnimatePresence>
          {activeChatSeller && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md h-[500px] rounded-3xl p-5 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-sm">{activeChatSeller.seller}</h3>
                    <p className="text-[10px] text-cyan-500 font-bold">สอบถามสินค้า: {activeChatSeller.product}</p>
                  </div>
                  <button onClick={() => setActiveChatSeller(null)} className="p-1.5 rounded-full hover:bg-slate-100"><X size={18} /></button>
                </div>
                <div className="flex-1 overflow-y-auto my-3 space-y-2.5 p-2">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-xs ${msg.sender === 'user' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <input type="text" placeholder="พิมพ์ข้อความสอบถาม..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none" />
                  <button onClick={sendMessage} className="p-3 bg-cyan-500 text-white rounded-xl shadow-md"><Send size={16} /></button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Cart Drawer */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="bg-white dark:bg-slate-900 w-full max-w-sm h-full p-6 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-black text-base flex items-center gap-2"><ShoppingCart size={20} className="text-cyan-500" /> ตะกร้าสินค้า</h3>
                    <button onClick={() => setIsCartOpen(false)}><X size={18} /></button>
                  </div>
                  <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {cart.length === 0 ? <p className="text-xs text-center text-slate-400 py-16">ตะกร้าของคุณยังว่างเปล่า</p> : cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <h4 className="font-bold text-xs">{item.title}</h4>
                          <p className="text-[10px] text-cyan-500 font-bold">{item.sku}</p>
                          <p className="text-xs font-black text-slate-700 dark:text-slate-200 mt-1">฿{item.price.toLocaleString()} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>
                {cart.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-sm font-black">
                      <span>ราคารวมทั้งหมด</span>
                      <span className="text-cyan-500 text-xl">฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all">
                      ไปหน้าชำระเงิน
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Checkout & Payment Portal */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                
                {/* หน้าโหมด Loading: กรุณารอสักครู่ */}
                {paymentState === 'processing' && (
                  <div className="py-14 text-center space-y-4">
                    <Loader2 size={56} className="text-cyan-500 mx-auto animate-spin" />
                    <h3 className="text-xl font-black">กำลังดำเนินการชำระเงิน...</h3>
                    <p className="text-xs text-slate-400">กรุณารอสักครู่ ระบบกำลังตรวจสอบการชำระเงินของท่าน</p>
                  </div>
                )}

                {/* หน้าโหมด Success: สั่งซื้อเรียบร้อยแล้ว */}
                {paymentState === 'success' && (
                  <div className="py-10 text-center space-y-3">
                    <CheckCircle2 size={64} className="text-emerald-500 mx-auto animate-bounce" />
                    <h3 className="text-2xl font-black">สั่งซื้อสินค้าเรียบร้อยแล้ว!</h3>
                    <p className="text-xs text-slate-400">ขอบคุณสำหรับการสั่งซื้อ ระบบได้บันทึกคำสั่งซื้อของคุณแล้ว</p>
                  </div>
                )}

                {/* หน้าโหมด Idle: เลือกวิธีชำระและสรุปสินค้า */}
                {paymentState === 'idle' && (
                  <>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-black text-base flex items-center gap-2"><CreditCard size={20} className="text-cyan-500" /> ชำระเงิน & ยืนยันคำสั่งซื้อ</h3>
                      <button onClick={() => setIsCheckoutOpen(false)}><X size={18} /></button>
                    </div>

                    <div className="mt-4 space-y-4 text-xs">
                      
                      {/* แสดงรายการสินค้าพร้อมรหัส (SKU) */}
                      <div>
                        <label className="block font-bold mb-2 text-slate-700 dark:text-slate-200">รายการสินค้าในคำสั่งซื้อ</label>
                        <div className="space-y-2 max-h-36 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {cart.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/50 dark:border-slate-700/50 last:border-none">
                              <div>
                                <p className="font-bold text-slate-800 dark:text-slate-100">{item.title}</p>
                                <p className="text-[10px] text-cyan-500 font-bold">รหัส: {item.sku} (x{item.quantity})</p>
                              </div>
                              <span className="font-black">฿{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ที่อยู่จัดส่ง */}
                      <div>
                        <label className="block font-bold mb-1 flex items-center gap-1"><MapPin size={14} className="text-cyan-500" /> ที่อยู่จัดส่ง / จุดนัดรับ *</label>
                        <textarea rows={2} required placeholder="ระบุตึก, หอพัก, เลขห้อง หรือสถานที่นัดรับ..." value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                      </div>

                      {/* เลือกโค้ดส่วนลดที่เก็บไว้ */}
                      <div>
                        <label className="block font-bold mb-1 flex items-center gap-1"><Tag size={14} className="text-amber-500" /> เลือกโค้ดส่วนลดที่เก็บไว้</label>
                        <select 
                          onChange={(e) => {
                            const v = vouchers.find(v => v.id === e.target.value);
                            setSelectedVoucher(v || null);
                          }}
                          className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold"
                        >
                          <option value="">-- เลือกโค้ดส่วนลด --</option>
                          {vouchers.filter(v => v.isCollected).map(v => (
                            <option key={v.id} value={v.id}>
                              {v.title} ({v.discountText}) - ขั้นต่ำ ฿{v.minSpend}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* ช่องทางชำระเงิน */}
                      <div>
                        <label className="block font-bold mb-2">เลือกช่องทางการชำระเงิน</label>
                        <div className="grid grid-cols-3 gap-2">
                          <button onClick={() => setPaymentMethod('promptpay')} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${paymentMethod === 'promptpay' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-bold' : 'border-slate-200 dark:border-slate-800'}`}><QrCode size={18} /> PromptPay</button>
                          <button onClick={() => setPaymentMethod('card')} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-bold' : 'border-slate-200 dark:border-slate-800'}`}><CreditCard size={18} /> บัตรเครดิต</button>
                          <button onClick={() => setPaymentMethod('truemoney')} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 ${paymentMethod === 'truemoney' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500 font-bold' : 'border-slate-200 dark:border-slate-800'}`}><Wallet size={18} /> TrueMoney</button>
                        </div>
                      </div>

                      {/* QR Code สำหรับ PromptPay */}
                      {paymentMethod === 'promptpay' && (
                        <div className="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-inner">
                          <QrCode size={88} className="mx-auto text-slate-800 dark:text-slate-200" />
                          <p className="text-[10px] text-slate-400 font-medium">สแกน QR Code เพื่อชำระเงินผ่านแอปธนาคาร</p>
                        </div>
                      )}

                      {/* สรุปยอดเงิน */}
                      <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between text-slate-500"><span>ราคารวม:</span><span>฿{totalPrice.toLocaleString()}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between text-emerald-500 font-bold"><span>ส่วนลด:</span><span>-฿{discountAmount}</span></div>}
                        <div className="flex justify-between font-black text-sm pt-1.5 border-t border-slate-200 dark:border-slate-700"><span>ยอดชำระสุทธิ:</span><span className="text-cyan-500">฿{finalTotal.toLocaleString()}</span></div>
                      </div>

                      <button onClick={handlePayment} className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all">
                        ยืนยันการชำระเงิน ฿{finalTotal.toLocaleString()}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal ประวัติการสั่งซื้อ */}
        <AnimatePresence>
          {isHistoryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-base flex items-center gap-2"><History size={20} className="text-cyan-500" /> ประวัติการสั่งซื้อ</h3>
                  <button onClick={() => setIsHistoryOpen(false)}><X size={18} /></button>
                </div>
                <div className="mt-4 space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 space-y-2">
                      <Package size={44} className="mx-auto opacity-40" />
                      <p className="text-xs font-medium">ยังไม่มีประวัติการสั่งซื้อ</p>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                        <div className="flex justify-between font-bold border-b border-slate-200/50 dark:border-slate-700/50 pb-2">
                          <span>{order.id} ({order.paymentMethod})</span>
                          <span className="text-emerald-500">{order.status}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">วันที่: {order.date}</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                              <span>{item.title} ({item.sku}) x{item.quantity}</span>
                              <span className="font-bold">฿{(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-2 flex justify-between font-black text-sm">
                          <span>ยอดรวมสุทธิ</span>
                          <span className="text-cyan-500">฿{order.finalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal เพิ่มลงสินค้าใหม่ */}
        <AnimatePresence>
          {isAddProductOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-base flex items-center gap-2"><PlusCircle size={20} className="text-cyan-500" /> ลงขายสินค้าใหม่</h3>
                  <button onClick={() => setIsAddProductOpen(false)}><X size={18} /></button>
                </div>

                <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold mb-1">ชื่อสินค้า *</label>
                    <input type="text" required placeholder="เช่น เสื้อกาวน์, เครื่องคิดเลข..." value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">ราคา (บาท) *</label>
                    <input type="number" required placeholder="300" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                  </div>
                  
                  {/* ปุ่มอัปโหลดรูปภาพ */}
                  <div>
                    <label className="block font-bold mb-1">รูปภาพสินค้า *</label>
                    <div className="flex items-center gap-3">
                      <label className="cursor-pointer flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold transition-all active:scale-95">
                        <Upload size={16} /> เลือกรูปภาพจากเครื่อง
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {newProduct.image && (
                        <div className="relative h-11 w-11 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                          <Image src={newProduct.image} alt="preview" fill unoptimized className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">สถานที่นัดรับ</label>
                    <input type="text" placeholder="ตึกวิศวะ, หอพัก..." value={newProduct.location} onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">รายละเอียดเพิ่มเติม</label>
                    <textarea rows={2} placeholder="บอกสภาพสินค้า..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none" />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-black text-xs mt-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all">
                    ยืนยันการลงขายสินค้า
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}