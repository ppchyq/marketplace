'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { 
  Search, Moon, Sun, ShoppingBag, Sparkles, X, 
  MessageSquare, ShoppingCart, Trash2, Eye, Plus, ShieldCheck, Zap, SlidersHorizontal,
  PlusCircle, CreditCard, QrCode, Wallet, CheckCircle2, MapPin, Tag, History, Send, Package
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

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  discount: number;
  finalTotal: number;
  status: string;
  address: string;
}

interface ChatMessage {
  sender: 'user' | 'seller';
  text: string;
  time: string;
}

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, title: 'หนังสือ Calculus II สภาพ 95%', price: 180, category: 'หนังสือเรียน', location: 'ตึกวิศวะ', time: '10 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', description: 'หนังสือแคลคูลัส 2 สภาพดีมาก ไม่มีรอยขีดเขียน มีสรุปสูตรสำคัญแถมให้ในเล่ม', seller: 'พี่นก (วิศวะ ปี 3)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 5 นาที', condition: 'มือสอง (สภาพ 95%)', isHot: true },
  { id: 2, title: 'เสื้อกาวน์ปฏิบัติการ Size L', price: 250, category: 'เสื้อผ้า/ยูนิฟอร์ม', location: 'ตึกวิทยาศาสตร์', time: '30 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80', description: 'เสื้อกาวน์แล็ปแขนยาว ผ้าหนาปานกลาง ซักสะอาดเรียบร้อย ใส่ไปแล็ปแค่ 3 ครั้ง', seller: 'กิ๊ฟ (สหเวช ปี 2)', sellerStatus: 'ใช้งานล่าสุด 15 นาทีที่แล้ว', sellerResponseRate: 'ตอบภายใน 15 นาที', condition: 'มือสอง (สภาพ 98%)' },
  { id: 3, title: 'iPad Air 4 64GB WiFi (มีรอยนิดหน่อย)', price: 9500, category: 'ไอที/เครื่องใช้ไฟฟ้า', location: 'หอพักใน', time: '1 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80', description: 'ใช้งานได้ปกติทุกฟังก์ชั่น สแกนนิ้วติด แบตอึด 88% แถมเคสให้ด้วยครับ', seller: 'มาร์ค (ไอซีที ปี 4)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 2 นาที', condition: 'มือสอง (มีรอยตามการใช้งาน)', isHot: true },
  { id: 4, title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio FX-991EX', price: 400, category: 'อุปกรณ์การเรียน', location: 'โรงอาหารกลาง', time: '2 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80', description: 'รุ่นยอดฮิตสอบผ่านสบาย ปุ่มกดตอบสนองดี หน้าจอใสไม่มีรอย แถมฝาครอบแท้', seller: 'แบงค์ (บัญชี ปี 2)', sellerStatus: 'ใช้งานล่าสุด 1 ชม. ที่แล้ว', sellerResponseRate: 'ตอบภายใน 30 นาที', condition: 'มือสอง (สภาพดี)' },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [activeChatSeller, setActiveChatSeller] = useState<{ seller: string; product: string } | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Checkout & Coupon Form
  const [shippingAddress, setShippingAddress] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'card' | 'truemoney'>('promptpay');

  // Chat messages state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  // Form State สำหรับลงขาย
  const [newProduct, setNewProduct] = useState({ title: '', price: '', category: 'อุปกรณ์การเรียน', location: '', description: '', condition: 'มือสอง (สภาพดี)' });

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
  const finalTotal = Math.max(0, totalPrice - discount);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'CAMPUS2026') {
      setDiscount(100);
      setCouponApplied(true);
      alert('🎉 ใช้โค้ดส่วนลด 100 บาทสำเร็จ!');
    } else {
      alert('❌ โค้ดส่วนลดไม่ถูกต้อง (ลองใช้: CAMPUS2026)');
    }
  };

  const openChatWithSeller = (seller: string, productTitle: string) => {
    setActiveChatSeller({ seller, product: productTitle });
    setChatMessages([
      { sender: 'seller', text: `สวัสดีครับ สนใจ ${productTitle} สอบถามข้อมูลเพิ่มได้เลยครับ!`, time: 'เมื่อกี้' }
    ]);
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = { sender: 'user', text: inputMessage, time: 'เมื่อกี้' };
    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'seller', text: 'รับทราบครับผม สะดวกนัดรับที่ไหนแจ้งได้เลยนะครับ', time: 'เมื่อกี้' }
      ]);
    }, 1000);
  };

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
    if (!shippingAddress.trim()) {
      alert('กรุณากรอกที่อยู่/จุดนัดรับสินค้าก่อนชำระเงินครับ');
      return;
    }

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      total: totalPrice,
      discount: discount,
      finalTotal: finalTotal,
      status: 'ชำระเงินแล้ว (เตรียมจัดส่ง)',
      address: shippingAddress
    };

    setOrders([newOrder, ...orders]);
    setPaymentSuccess(true);
    
    setTimeout(() => {
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setPaymentSuccess(false);
      setDiscount(0);
      setCouponApplied(false);
      setCouponCode('');
      setShippingAddress('');
    }, 2000);
  };

  return (
    <div className="max-w-md md:max-w-6xl mx-auto min-h-screen pb-32 px-4 pt-6 font-sans">
      
      {/* Header */}
      <header className="flex items-center justify-between p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-xl sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-lg">
            <ShoppingBag size={22} />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest uppercase text-cyan-500 block">NEXT-GEN MARKET</span>
            <h1 className="text-xl font-black tracking-tighter">CAMPUS NEXUS</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* ปุ่มประวัติการสั่งซื้อ */}
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:text-cyan-500 transition-all border border-slate-200 dark:border-slate-700"
            title="ประวัติการสั่งซื้อ"
          >
            <History size={20} />
          </button>

          {/* ปุ่มลงขายสินค้าใหม่ */}
          <button 
            onClick={() => setIsAddProductOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
          >
            <PlusCircle size={18} />
            <span className="hidden sm:inline">ลงขาย</span>
          </button>

          {/* ปุ่มตะกร้า */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:text-cyan-500 transition-all border border-slate-200 dark:border-slate-700"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative my-6">
        <Search size={18} className="absolute left-4 top-4 text-cyan-500" />
        <input 
          type="text" 
          placeholder="ค้นหาสินค้า, เสื้อกาวน์, เครื่องคิดเลข..." 
          className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm font-medium"
        />
      </div>

      {/* 3D Showcase Box */}
      <div className="my-6 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative bg-white">
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          <Sparkles size={14} className="text-cyan-400" /> 3D Preview (หมุนดูได้)
        </div>
        <div className="h-64 w-full bg-white"><Canvas3D /></div>
      </div>

      {/* Product List */}
      <section className="mt-8">
        <h2 className="text-2xl font-black mb-4 flex items-center gap-2"><Zap size={22} className="text-cyan-500" /> สินค้ามาใหม่</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <motion.div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              whileHover={{ y: -4 }}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="relative h-40 w-full rounded-2xl mb-3 overflow-hidden bg-slate-100">
                  <Image src={product.image} alt={product.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform" />
                  <button onClick={(e) => addToCart(product, e)} className="absolute top-2 right-2 p-2 rounded-xl bg-slate-900/80 text-white hover:bg-cyan-500 transition-all">
                    <Plus size={16} />
                  </button>
                </div>
                <h3 className="font-bold text-xs line-clamp-2 leading-snug">{product.title}</h3>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-cyan-600 dark:text-cyan-400 font-black text-base">฿{product.price.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">{product.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal ส่องรายละเอียดสินค้า */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800"><X size={18} /></button>
              
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-slate-100 mb-4 border">
                <Image src={selectedProduct.image} alt={selectedProduct.title} fill unoptimized className="object-cover" />
              </div>

              <h2 className="text-xl font-black">{selectedProduct.title}</h2>
              <p className="text-2xl font-black text-cyan-500 my-2">฿{selectedProduct.price.toLocaleString()}</p>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl my-3 text-xs space-y-1">
                <p className="font-bold">ผู้ขาย: {selectedProduct.seller}</p>
                <p className="text-slate-400">พิกัดนัดรับ: {selectedProduct.location}</p>
                <p className="text-slate-400">สภาพ: {selectedProduct.condition}</p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-3">{selectedProduct.description}</p>

              <div className="flex gap-2 pt-2">
                <button onClick={() => { addToCart(selectedProduct); alert('เพิ่มลงตะกร้าแล้ว!'); }} className="flex-1 py-3 bg-cyan-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                  <ShoppingCart size={16} /> ใส่ตะกร้า
                </button>
                <button onClick={() => { openChatWithSeller(selectedProduct.seller, selectedProduct.title); setSelectedProduct(null); }} className="px-5 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5">
                  <MessageSquare size={16} /> ทักแชท
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal แชทกับผู้ขาย */}
      <AnimatePresence>
        {activeChatSeller && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md h-[500px] rounded-3xl p-4 shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <h3 className="font-bold text-sm">{activeChatSeller.seller}</h3>
                  <p className="text-[10px] text-cyan-500">สอบถามสินค้า: {activeChatSeller.product}</p>
                </div>
                <button onClick={() => setActiveChatSeller(null)} className="p-1.5 rounded-full hover:bg-slate-100"><X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto my-3 space-y-2 p-2">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl max-w-[80%] text-xs ${msg.sender === 'user' ? 'bg-cyan-500 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 border-t pt-3">
                <input 
                  type="text" 
                  placeholder="พิมพ์ข้อความ..." 
                  value={inputMessage} 
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none"
                />
                <button onClick={sendMessage} className="p-2.5 bg-cyan-500 text-white rounded-xl"><Send size={16} /></button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart & Checkout Portal */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md">
            <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="bg-white dark:bg-slate-900 w-full max-w-sm h-full p-5 flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
              <div>
                <div className="flex items-center justify-between pb-4 border-b">
                  <h3 className="font-black text-base flex items-center gap-2"><ShoppingCart size={20} className="text-cyan-500" /> ตะกร้าสินค้า</h3>
                  <button onClick={() => setIsCartOpen(false)}><X size={18} /></button>
                </div>
                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                  {cart.length === 0 ? <p className="text-xs text-center text-slate-400 py-12">ไม่มีสินค้าในตะกร้า</p> : cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                      <div>
                        <h4 className="font-bold text-xs">{item.title}</h4>
                        <p className="text-xs font-black text-cyan-500">฿{item.price.toLocaleString()} x {item.quantity}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-2"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
              {cart.length > 0 && (
                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between items-center text-sm font-black">
                    <span>ราคารวม</span>
                    <span className="text-cyan-500 text-xl">฿{totalPrice.toLocaleString()}</span>
                  </div>
                  <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-3.5 bg-cyan-500 text-white rounded-2xl font-black text-xs">สั่งซื้อสินค้า</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment & Coupon Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              {paymentSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 size={64} className="text-emerald-500 mx-auto animate-bounce" />
                  <h3 className="text-2xl font-black">ชำระเงินสำเร็จ!</h3>
                  <p className="text-xs text-slate-400">ระบบได้บันทึกคำสั่งซื้อของคุณแล้ว สามารถตรวจสอบได้ที่ประวัติการสั่งซื้อ</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <h3 className="font-black text-base flex items-center gap-2"><CreditCard size={20} className="text-cyan-500" /> ชำระเงิน & ใส่ที่อยู่</h3>
                    <button onClick={() => setIsCheckoutOpen(false)}><X size={18} /></button>
                  </div>

                  <div className="mt-4 space-y-4 text-xs">
                    {/* กรอกที่อยู่จัดส่ง */}
                    <div>
                      <label className="block font-bold mb-1 flex items-center gap-1"><MapPin size={14} className="text-cyan-500" /> ที่อยู่จัดส่ง / จุดนัดรับ *</label>
                      <textarea 
                        rows={2} required 
                        placeholder="ระบุตึก, หอพัก, เลขห้อง หรือสถานที่นัดรับลานกิจกรรม..."
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border focus:outline-none"
                      />
                    </div>

                    {/* โค้ดส่วนลด */}
                    <div>
                      <label className="block font-bold mb-1 flex items-center gap-1"><Tag size={14} className="text-cyan-500" /> โค้ดส่วนลด (ลองใช้: CAMPUS2026)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" placeholder="กรอกโค้ด..." 
                          value={couponCode} 
                          onChange={(e) => setCouponCode(e.target.value)}
                          disabled={couponApplied}
                          className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border uppercase font-bold"
                        />
                        <button onClick={applyCoupon} disabled={couponApplied} className="px-4 bg-slate-900 text-white rounded-xl font-bold">
                          {couponApplied ? 'ใช้แล้ว' : 'ใช้โค้ด'}
                        </button>
                      </div>
                    </div>

                    {/* สรุปราคา */}
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                      <div className="flex justify-between text-slate-500"><span>ราคารวม:</span><span>฿{totalPrice.toLocaleString()}</span></div>
                      {discount > 0 && <div className="flex justify-between text-emerald-500 font-bold"><span>ส่วนลด:</span><span>-฿{discount}</span></div>}
                      <div className="flex justify-between font-black text-sm pt-1 border-t"><span>ยอดชำระสุทธิ:</span><span className="text-cyan-500">฿{finalTotal.toLocaleString()}</span></div>
                    </div>

                    {/* ปุ่มชำระเงิน */}
                    <button onClick={handlePayment} className="w-full py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-xs shadow-lg">
                      ยืนยันชำระเงิน ฿{finalTotal.toLocaleString()}
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-black text-base flex items-center gap-2"><History size={20} className="text-cyan-500" /> ประวัติการสั่งซื้อ</h3>
                <button onClick={() => setIsHistoryOpen(false)}><X size={18} /></button>
              </div>

              <div className="mt-4 space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <Package size={40} className="mx-auto opacity-50" />
                    <p className="text-xs">ยังไม่มีประวัติการสั่งซื้อ</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border space-y-2 text-xs">
                      <div className="flex justify-between font-bold border-b pb-2">
                        <span>{order.id}</span>
                        <span className="text-emerald-500">{order.status}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">วันที่: {order.date}</p>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between">
                            <span>{item.title} (x{item.quantity})</span>
                            <span className="font-bold">฿{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-2 flex justify-between font-black text-sm">
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
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 border-b">
                <h3 className="font-black text-base flex items-center gap-2"><PlusCircle size={20} className="text-cyan-500" /> ลงขายสินค้า</h3>
                <button onClick={() => setIsAddProductOpen(false)}><X size={18} /></button>
              </div>

              <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3 text-xs">
                <div>
                  <label className="block font-bold mb-1">ชื่อสินค้า *</label>
                  <input type="text" required placeholder="เช่น เสื้อกาวน์, เครื่องคิดเลข..." value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
                </div>
                <div>
                  <label className="block font-bold mb-1">ราคา (บาท) *</label>
                  <input type="number" required placeholder="300" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
                </div>
                <div>
                  <label className="block font-bold mb-1">รายละเอียดเพิ่มเติม</label>
                  <textarea rows={3} placeholder="บอกสภาพสินค้า..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border" />
                </div>
                <button type="submit" className="w-full py-3 bg-cyan-500 text-white rounded-xl font-bold text-xs mt-2">ยืนยันลงขาย</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}