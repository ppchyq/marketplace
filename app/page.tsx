'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
// บรรทัดที่ 8 ถึง 13
import { 
  Search, Moon, Sun, ShoppingBag, Sparkles, X, 
  MessageSquare, ShoppingCart, Trash2, Plus, Zap,
  PlusCircle, CreditCard, QrCode, Wallet, CheckCircle2, MapPin, History, Send, Check, ArrowLeft, Minus, Loader2, Flame, Box, ImageIcon, UserCheck, LogOut, Lock, User, Ticket
} from 'lucide-react';

const Canvas3D = dynamic(() => import('@/components/Canvas3D'), { ssr: false });

interface UserProfile {
  id: string;
  name: string;
  email: string;
  faculty: string;
}

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
  stock: number; // จำนวนสินค้าคงเหลือ
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
  buyerName: string;
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
  { id: 1, sku: 'SKU-CALC-001', title: 'หนังสือ Calculus II สภาพ 95%', price: 180, category: 'หนังสือเรียน', location: 'ตึกวิศวะ', time: '10 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', description: 'หนังสือแคลคูลัส 2 สภาพดีมาก ไม่มีรอยขีดเขียน มีสรุปสูตรสำคัญแถมให้ในเล่ม', seller: 'พี่นก (วิศวะ ปี 3)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 5 นาที', condition: 'มือสอง (สภาพ 95%)', stock: 1, isHot: true },
  { id: 2, sku: 'SKU-LAB-002', title: 'เสื้อกาวน์ปฏิบัติการ Size L', price: 250, category: 'เสื้อผ้า/ยูนิฟอร์ม', location: 'ตึกวิทยาศาสตร์', time: '30 นาทีที่แล้ว', image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80', description: 'เสื้อกาวน์แล็ปแขนยาว ผ้าหนาปานกลาง ซักสะอาดเรียบร้อย ใส่ไปแล็ปแค่ 3 ครั้ง', seller: 'กิ๊ฟ (สหเวช ปี 2)', sellerStatus: 'ใช้งานล่าสุด 15 นาทีที่แล้ว', sellerResponseRate: 'ตอบภายใน 15 นาที', condition: 'มือสอง (สภาพ 98%)', stock: 2 },
  { id: 3, sku: 'SKU-IPAD-003', title: 'iPad Air 4 64GB WiFi (มีรอยนิดหน่อย)', price: 9500, category: 'ไอที/เครื่องใช้ไฟฟ้า', location: 'หอพักใน', time: '1 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80', description: 'ใช้งานได้ปกติทุกฟังก์ชั่น สแกนนิ้วติด แบตอึด 88% แถมเคสให้ด้วยครับ', seller: 'มาร์ค (ไอซีที ปี 4)', sellerStatus: 'ออนไลน์อยู่', sellerResponseRate: 'ตอบไวภายใน 2 นาที', condition: 'มือสอง (มีรอยตามการใช้งาน)', stock: 1, isHot: true },
  { id: 4, sku: 'SKU-CASI-004', title: 'เครื่องคิดเลขวิทยาศาสตร์ Casio FX-991EX', price: 400, category: 'อุปกรณ์การเรียน', location: 'โรงอาหารกลาง', time: '2 ชม. ที่แล้ว', image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80', description: 'รุ่นยอดฮิตสอบผ่านสบาย ปุ่มกดตอบสนองดี หน้าจอใสไม่มีรอย แถมฝาครอบแท้', seller: 'แบงค์ (บัญชี ปี 2)', sellerStatus: 'ใช้งานล่าสุด 1 ชม. ที่แล้ว', sellerResponseRate: 'ตอบภายใน 30 นาที', condition: 'มือสอง (สภาพดี)', stock: 3 },
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', faculty: 'วิศวกรรมศาสตร์' });

  // Core App State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [vouchers, setVouchers] = useState<Voucher[]>(INITIAL_VOUCHERS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Showcase Mode (3D / Image)
  const [modelView, setModelView] = useState<'3d' | 'image'>('3d');

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVoucherCenterOpen, setIsVoucherCenterOpen] = useState(false);
  const [activeChatSeller, setActiveChatSeller] = useState<{ seller: string; product: string } | null>(null);
  
  // Payment Status State
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
    condition: 'มือสอง (สภาพดี)',
    stock: '1' // เพิ่มจำนวนคงเหลือ
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ระบบ Login / Register สมมุติ
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'register' && !authForm.name) {
      alert('กรุณากรอกชื่อผู้ใช้งานด้วยครับ');
      return;
    }
    const user: UserProfile = {
      id: `USR-${Date.now()}`,
      name: authMode === 'login' ? (authForm.email.split('@')[0] || 'ผู้ใช้งาน') : authForm.name,
      email: authForm.email,
      faculty: authForm.faculty,
    };
    setCurrentUser(user);
  };

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      setCurrentUser(null);
      setCart([]);
    }
  };

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
    
    // ตรวจสอบสต็อก
    if (product.stock <= 0) {
      alert('ขออภัย สินค้านี้หมดแล้ว!');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      const currentInCart = existing ? existing.quantity : 0;
      
      // ป้องกันไม่ให้หยิบเกินสต็อกที่มี
      if (currentInCart + quantityToAdd > product.stock) {
        alert(`สินค้านี้เหลือในสต็อกเพียง ${product.stock} ชิ้นเท่านั้น!`);
        return prevCart;
      }

      if (existing) {
        return prevCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item);
      }
      return [...prevCart, { ...product, quantity: quantityToAdd }];
    });
  };

  const handleBuyNow = (product: Product, quantity: number) => {
    if (product.stock <= 0) {
      alert('ขออภัย สินค้านี้หมดแล้ว!');
      return;
    }
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

  // เพิ่มสินค้าใหม่พร้อมจำนวนสต็อก
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) return;
    
    const stockNum = Math.max(1, parseInt(newProduct.stock) || 1);

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
      seller: `${currentUser?.name || 'คุณ'} (${currentUser?.faculty || 'นักศึกษา'})`, // ผูกกับชื่อบัญชีที่เข้าสู่ระบบ
      sellerStatus: 'ออนไลน์อยู่',
      sellerResponseRate: 'ตอบไวที่สุด',
      condition: newProduct.condition,
      stock: stockNum,
      isHot: true
    };

    setProducts([createdProduct, ...products]);
    setIsAddProductOpen(false);
    setNewProduct({ title: '', price: '', category: 'อุปกรณ์การเรียน', location: '', image: '', description: '', condition: 'มือสอง (สภาพดี)', stock: '1' });
    alert(`ลงขายสินค้าสำเร็จ! จำนวนสต็อก ${stockNum} ชิ้น`);
  };

  // ชำระเงิน + ตัดสต็อกสินค้าจริง
  const handlePayment = () => {
    if (!shippingAddress.trim()) {
      alert('กรุณากรอกที่อยู่/จุดนัดรับสินค้าด้วยครับ');
      return;
    }
    setPaymentState('processing');
    
    setTimeout(() => {
      // 1. ตัดสต็อกสินค้าคงเหลือในระบบ
      setProducts((prevProducts) => 
        prevProducts.map((p) => {
          const itemInCart = cart.find((ci) => ci.id === p.id);
          if (itemInCart) {
            return { ...p, stock: Math.max(0, p.stock - itemInCart.quantity) };
          }
          return p;
        })
      );

      // 2. สร้างออเดอร์ใหม่
      const newOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        total: totalPrice,
        discount: discountAmount,
        finalTotal: finalTotal,
        status: 'ชำระเงินสำเร็จ (รอจัดส่ง)',
        address: shippingAddress,
        paymentMethod: paymentMethod.toUpperCase(),
        buyerName: currentUser?.name || 'บัญชีผู้ซื้อ'
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
      }, 1500);
    }, 1500);
  };

  // ----------------------------------------------------
  // หน้าต่างสมัครสมาชิก / เข้าสู่ระบบ (Auth Screen)
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-cyan-500">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/20 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[140px]" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative z-10">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white mb-3 shadow-lg shadow-cyan-500/30">
              <ShoppingBag size={28} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">CAMPUS NEXUS</h1>
            <p className="text-xs text-slate-400 mt-1">ตลาดนัดซื้อ-ขาย สำหรับเด็กมหาลัย</p>
          </div>

          <div className="flex p-1 bg-slate-800/80 rounded-xl mb-6">
            <button 
              onClick={() => setAuthMode('login')} 
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'login' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              เข้าสู่ระบบ
            </button>
            <button 
              onClick={() => setAuthMode('register')} 
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${authMode === 'register' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              สมัครสมาชิก
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">ชื่อ - นามสกุล / ชื่อเล่น</label>
                <div className="relative flex items-center">
                  <User size={16} className="absolute left-3 text-slate-500" />
                  <input type="text" required placeholder="เช่น พี่นก วิศวะ" value={authForm.name} onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">อีเมลนักศึกษา / ทั่วไป</label>
              <input type="email" required placeholder="student@university.ac.th" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">รหัสผ่าน</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-slate-500" />
                <input type="password" required placeholder="••••••••" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500" />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">คณะ / ชั้นปี</label>
                <select value={authForm.faculty} onChange={(e) => setAuthForm({ ...authForm, faculty: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500">
                  <option value="คณะวิศวกรรมศาสตร์">คณะวิศวกรรมศาสตร์</option>
                  <option value="คณะวิทยาศาสตร์">คณะวิทยาศาสตร์</option>
                  <option value="คณะบริหารธุรกิจ / บัญชี">คณะบริหารธุรกิจ / บัญชี</option>
                  <option value="คณะเทคโนโลยีสารสนเทศ (ICT)">คณะเทคโนโลยีสารสนเทศ (ICT)</option>
                  <option value="คณะสหเวชศาสตร์ / พยาบาล">คณะสหเวชศาสตร์ / พยาบาล</option>
                  <option value="คณะมนุษยศาสตร์">คณะมนุษยศาสตร์</option>
                </select>
              </div>
            )}

            <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-500/25 active:scale-95 transition-all">
              {authMode === 'login' ? 'เข้าสู่ระบบเลย' : 'ยืนยันการสมัครสมาชิก'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ----------------------------------------------------
  // หน้าหลักแอปพลิเคชัน (เมื่อ Login แล้ว)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F17] text-slate-900 dark:text-slate-100 font-sans relative selection:bg-cyan-500 selection:text-white pb-32 transition-colors duration-300 overflow-x-hidden">
      
      {/* Background Glow Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[140px]" />
      </div>

      <div className="max-w-md md:max-w-6xl mx-auto px-3 sm:px-4 pt-4 sm:pt-6 relative z-10 w-full">

        {/* Header */}
        <header className="flex items-center justify-between p-2.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-200/40 dark:shadow-none sticky top-2 sm:top-4 z-40 w-full">
          
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25 ring-2 ring-white/20 shrink-0">
              <ShoppingBag size={18} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div className="truncate">
              <span className="text-[8px] sm:text-[10px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 block">NEXT-GEN MARKET</span>
              <h1 className="text-sm sm:text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-200 dark:to-slate-400 truncate">
                CAMPUS NEXUS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* แสดงโปรไฟล์ผู้ใช้ปัจจุบัน */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <UserCheck size={14} />
              <span>{currentUser.name}</span>
            </div>

            <button 
              onClick={() => setIsVoucherCenterOpen(true)}
              className="flex items-center gap-1 p-2 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20 transition-all active:scale-95"
            >
              <Ticket size={16} className="animate-bounce" />
              <span className="hidden sm:inline">ส่วนลด</span>
            </button>

            <button onClick={() => setIsHistoryOpen(true)} className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
              <History size={16} />
            </button>

            <button onClick={() => setIsAddProductOpen(true)} className="flex items-center gap-1 p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 active:scale-95 transition-all">
              <PlusCircle size={16} />
              <span className="hidden sm:inline">ลงขาย</span>
            </button>

            <button onClick={() => setIsCartOpen(true)} className="relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300">
              <ShoppingCart size={16} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center shadow-md ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* ปุ่มสลับ Light / Dark Mode */}
            {mounted && (
              <button 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
                className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60 active:scale-95"
                title="สลับโหมดมืด/สว่าง"
              >
                {theme === 'dark' ? (
                  <Sun size={16} className="text-amber-400" />
                ) : (
                  <Moon size={16} className="text-indigo-600" />
                )}
              </button>
            )}

            {/* ปุ่มออกจากระบบ */}
            <button onClick={handleLogout} className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all border border-rose-500/20" title="ออกจากระบบ">
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="my-6 sm:my-8">
          <div className="relative rounded-3xl p-5 sm:p-8 bg-gradient-to-br from-cyan-500/10 via-indigo-500/5 to-transparent border border-cyan-500/20 overflow-hidden shadow-xl backdrop-blur-xl">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-[10px] sm:text-[11px] border border-cyan-500/20 mb-3">
                <Flame size={14} className="text-orange-500" /> ตลาดนัดนักศึกษา มหาวิทยาลัยอันดับ 1
              </span>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-2">
                ซื้อง่าย ขายคล่อง <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">
                  ส่งต่อไอเทมเด็กมหาลัย
                </span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mb-5">
                รวมหนังสือเรียน ยูนิฟอร์ม ไอที และอุปกรณ์การเรียน นัดรับในมหาลัยง่ายๆ ได้ทันที
              </p>

              {/* Search Input */}
              <div className="relative flex items-center">
                <Search size={18} className="absolute left-3.5 text-cyan-500 pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="ค้นหาสินค้า, เสื้อกาวน์..." 
                  className="w-full pl-10 pr-24 py-3 sm:py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs sm:text-sm font-semibold shadow-md dark:shadow-none backdrop-blur-md transition-all" 
                />
                <button className="absolute right-1.5 px-3.5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                  ค้นหา
                </button>
              </div>
            </div>
          </div>
        </section>

       
          <div className="h-60 sm:h-72 w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative">
            {modelView === '3d' ? (
              <Canvas3D />
            ) : (
              <div className="relative w-full h-full p-4 flex items-center justify-center">
                <Image
                  src="https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
                  alt="Showcase"
                  fill
                  unoptimized
                  className="object-contain p-4"
                />
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg sm:text-2xl font-black tracking-tight flex items-center gap-2">
                <Zap size={20} className="text-cyan-500 fill-cyan-500" /> สินค้ามาใหม่ล่าสุด
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">อัปเดตสดใหม่จากเพื่อนๆ ในรั้วมหาลัย</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {products.map((product) => (
              <motion.div 
                key={product.id} 
                onClick={() => handleSelectProduct(product)} 
                whileHover={{ y: -4, transition: { duration: 0.2 } }} 
                className={`cursor-pointer bg-white dark:bg-slate-900/80 backdrop-blur-xl border rounded-2xl sm:rounded-3xl p-3 shadow-md dark:shadow-none hover:shadow-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between group relative overflow-hidden ${product.stock <= 0 ? 'opacity-60 border-slate-300 dark:border-slate-800' : 'border-slate-200/80 dark:border-slate-800'}`}
              >
                <div>
                  <div className="relative h-36 sm:h-44 w-full rounded-xl sm:rounded-2xl mb-2.5 overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image src={product.image} alt={product.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    
                    {/* ป้ายแสดงสถานะสินค้า / สต็อก */}
                    {product.stock <= 0 ? (
                      <span className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center font-black text-white text-xs tracking-wider">
                        สินค้าหมด (OUT OF STOCK)
                      </span>
                    ) : (
                      <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-cyan-400 text-[9px] font-black px-2 py-0.5 rounded-full border border-cyan-500/30">
                        เหลือ {product.stock} ชิ้น
                      </span>
                    )}

                    {product.isHot && product.stock > 0 && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[8px] sm:text-[9px] font-black px-2 py-0.5 rounded-full shadow-md flex items-center gap-0.5">
                        <Flame size={9} fill="white" /> HOT
                      </span>
                    )}
                  </div>

                  <span className="text-[9px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {product.category}
                  </span>
                  
                  <h3 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug mt-1.5 group-hover:text-cyan-500 transition-colors">
                    {product.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-end justify-between">
                  <div>
                    <p className="text-cyan-600 dark:text-cyan-400 font-black text-sm sm:text-lg tracking-tight">฿{product.price.toLocaleString()}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 flex items-center gap-0.5"><MapPin size={9} /> {product.location}</p>
                  </div>
                  <button 
                    onClick={(e) => addToCart(product, 1, e)} 
                    disabled={product.stock <= 0}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500 hover:text-white disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Modal Voucher Center */}
        <AnimatePresence>
          {isVoucherCenterOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-5 shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-sm sm:text-base flex items-center gap-2 text-amber-500"><Ticket size={18} /> ศูนย์เก็บโค้ดส่วนลดพิเศษ</h3>
                  <button onClick={() => setIsVoucherCenterOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={18} /></button>
                </div>

                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  {vouchers.map((v) => (
                    <div key={v.id} className="p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-amber-500 text-white rounded-md">{v.code}</span>
                        <h4 className="font-bold text-xs sm:text-sm mt-1">{v.title}</h4>
                        <p className="text-xs font-black text-amber-600 dark:text-amber-400">{v.discountText}</p>
                        <p className="text-[10px] text-slate-400">ขั้นต่ำ ฿{v.minSpend}</p>
                      </div>
                      <button 
                        onClick={() => collectVoucher(v.id)}
                        disabled={v.isCollected}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          v.isCollected 
                            ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-default' 
                            : 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 active:scale-95'
                        }`}
                      >
                        {v.isCollected ? <><Check size={12} /> เก็บแล้ว</> : 'กดเก็บโค้ด'}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal รายละเอียดสินค้า */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                
                <div className="flex items-center justify-between mb-3">
                  <button 
                    onClick={() => setSelectedProduct(null)} 
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-300"
                  >
                    <ArrowLeft size={14} /> ย้อนกลับ
                  </button>
                  <button onClick={() => setSelectedProduct(null)} className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500"><X size={16} /></button>
                </div>

                <div className="relative h-56 sm:h-64 w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-3 shadow-inner">
                  <Image src={selectedProduct.image} alt={selectedProduct.title} fill unoptimized className="object-cover" />
                </div>
                
                <h2 className="text-lg sm:text-xl font-black leading-snug">{selectedProduct.title}</h2>
                <p className="text-xl sm:text-2xl font-black text-cyan-500 my-1">฿{selectedProduct.price.toLocaleString()}</p>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50 my-2 text-xs space-y-1">
                  <p className="font-bold flex items-center justify-between">
                    <span>รหัสสินค้า (SKU):</span>
                    <span className="text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">{selectedProduct.sku}</span>
                  </p>
                  <p className="font-bold text-slate-700 dark:text-slate-200">ผู้ขาย: {selectedProduct.seller}</p>
                  <p className="text-slate-400">พิกัดนัดรับ: {selectedProduct.location}</p>
                  <p className="text-slate-400">สภาพ: {selectedProduct.condition}</p>
                  <p className="font-bold text-amber-500">คงเหลือในสต็อก: {selectedProduct.stock} ชิ้น</p>
                </div>
                
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-2">{selectedProduct.description}</p>
                
                {/* เลือกจำนวนสินค้า (ไม่เกินสต็อก) */}
                <div className="flex items-center justify-between my-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <span className="text-xs font-bold">จำนวนสินค้าที่ต้องการ:</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setProductQuantity(Math.max(1, productQuantity - 1))}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-all active:scale-95"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="font-black text-xs w-5 text-center">{productQuantity}</span>
                    <button 
                      onClick={() => setProductQuantity(Math.min(selectedProduct.stock, productQuantity + 1))}
                      className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 transition-all active:scale-95"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { addToCart(selectedProduct, productQuantity); }} 
                      disabled={selectedProduct.stock <= 0}
                      className="flex-1 py-3 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 hover:bg-cyan-500/20 disabled:opacity-50 transition-all active:scale-95"
                    >
                      <ShoppingCart size={15} /> ใส่ตะกร้า
                    </button>
                    <button 
                      onClick={() => handleBuyNow(selectedProduct, productQuantity)} 
                      disabled={selectedProduct.stock <= 0}
                      className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 transition-all active:scale-95"
                    >
                      <Zap size={15} /> {selectedProduct.stock <= 0 ? 'สินค้าหมด' : 'สั่งซื้อทันที'}
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => { openChatWithSeller(selectedProduct.seller, selectedProduct.title); setSelectedProduct(null); }} 
                    className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    <MessageSquare size={15} /> ทักแชทผู้ขาย ({selectedProduct.seller})
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
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md h-[480px] rounded-3xl p-4 shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm">{activeChatSeller.seller}</h3>
                    <p className="text-[10px] text-cyan-500 font-bold">สอบถาม: {activeChatSeller.product}</p>
                  </div>
                  <button onClick={() => setActiveChatSeller(null)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={16} /></button>
                </div>
                <div className="flex-1 overflow-y-auto my-2 space-y-2 p-1">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-2.5 rounded-2xl max-w-[80%] text-xs ${msg.sender === 'user' ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                  <input type="text" placeholder="พิมพ์ข้อความสอบถาม..." value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs focus:outline-none" />
                  <button onClick={sendMessage} className="p-2.5 bg-cyan-500 text-white rounded-xl shadow-md"><Send size={15} /></button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal ลงขายสินค้า (ผูกบัญชีคนขาย) */}
        <AnimatePresence>
          {isAddProductOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-sm sm:text-base flex items-center gap-2 text-cyan-500"><PlusCircle size={18} /> ลงขายสินค้าของคุณ</h3>
                  <button onClick={() => setIsAddProductOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={18} /></button>
                </div>

                <form onSubmit={handleAddProductSubmit} className="mt-4 space-y-3">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                    <User size={14} className="text-cyan-500" />
                    <span>ผู้ลงขาย: <b className="text-slate-800 dark:text-white">{currentUser.name}</b> ({currentUser.faculty})</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">ชื่อสินค้า</label>
                    <input type="text" required placeholder="เช่น หนังสือ Physics I" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold block mb-1">ราคา (บาท)</label>
                      <input type="number" required placeholder="250" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">จำนวนคงเหลือ (สต็อก)</label>
                      <input type="number" min="1" required placeholder="1" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">หมวดหมู่</label>
                    <select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500">
                      <option value="อุปกรณ์การเรียน">อุปกรณ์การเรียน</option>
                      <option value="หนังสือเรียน">หนังสือเรียน</option>
                      <option value="เสื้อผ้า/ยูนิฟอร์ม">เสื้อผ้า/ยูนิฟอร์ม</option>
                      <option value="ไอที/เครื่องใช้ไฟฟ้า">ไอที/เครื่องใช้ไฟฟ้า</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">สถานที่นัดรับ</label>
                    <input type="text" placeholder="เช่น ใต้ตึกวิศวะ, โรงอาหารกลาง" value={newProduct.location} onChange={(e) => setNewProduct({ ...newProduct, location: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500" />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">รายละเอียดสินค้า</label>
                    <textarea rows={2} placeholder="บอกสภาพสินค้า หรือข้อมูลเพิ่มเติม..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none" />
                  </div>

                  <div>
                    <label className="text-xs font-bold block mb-1">อัปโหลดรูปภาพ</label>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-500 hover:file:bg-cyan-500/20" />
                  </div>

                  <button type="submit" className="w-full py-3 mt-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all">
                    ลงขายสินค้าเลย
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Cart Drawer */}
        <AnimatePresence>
          {isCartOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 w-full max-w-md h-full p-5 shadow-2xl flex flex-col justify-between">
                
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-black text-base flex items-center gap-2"><ShoppingCart size={18} className="text-cyan-500" /> ตะกร้าสินค้า ({cart.length})</h3>
                    <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={18} /></button>
                  </div>

                  <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    {cart.length === 0 ? (
                      <p className="text-xs text-center text-slate-400 py-10">ยังไม่มีสินค้าในตะกร้า</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden shrink-0 bg-slate-200">
                            <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs truncate">{item.title}</h4>
                            <p className="text-xs font-black text-cyan-500 mt-0.5">฿{item.price.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400">จำนวนที่สั่งซื้อ: {item.quantity} ชิ้น (เหลือในคลัง {item.stock})</p>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {cart.length > 0 && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>ราคารวมทั้งหมด:</span>
                      <span className="text-cyan-500 text-base font-black">฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs rounded-2xl shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard size={16} /> ดำเนินการชำระเงิน
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Checkout */}
        <AnimatePresence>
          {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-sm sm:text-base flex items-center gap-2 text-cyan-500"><CreditCard size={18} /> ชำระเงิน & นัดรับ</h3>
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={18} /></button>
                </div>

                {paymentState === 'processing' ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Loader2 size={36} className="animate-spin text-cyan-500 mb-3" />
                    <p className="font-bold text-sm">กำลังยืนยันการชำระเงิน และตัดสต็อกสินค้า...</p>
                  </div>
                ) : paymentState === 'success' ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <CheckCircle2 size={48} className="text-emerald-500 mb-3" />
                    <p className="font-black text-base">ชำระเงินสำเร็จแล้ว!</p>
                    <p className="text-xs text-slate-400 mt-1">ตัดสต็อกสินค้าเรียบร้อย ขอบคุณที่สั่งซื้อครับ</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs flex justify-between items-center">
                      <span className="text-slate-400">สั่งซื้อในนามบัญชี:</span>
                      <span className="font-bold text-cyan-500">{currentUser.name}</span>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">จุดนัดรับ / ที่อยู่จัดส่ง</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="เช่น หน้าตึกวิศวะ ข้างโรงอาหารกลาง" 
                        value={shippingAddress} 
                        onChange={(e) => setShippingAddress(e.target.value)} 
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500" 
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">เลือกโค้ดส่วนลดที่เก็บไว้</label>
                      <select 
                        onChange={(e) => {
                          const v = vouchers.find(item => item.id === e.target.value);
                          setSelectedVoucher(v || null);
                        }}
                        className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                      >
                        <option value="">-- เลือกส่วนลด --</option>
                        {vouchers.filter(v => v.isCollected).map(v => (
                          <option key={v.id} value={v.id}>{v.title} ({v.discountText})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1">ช่องทางชำระเงิน</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setPaymentMethod('promptpay')} className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${paymentMethod === 'promptpay' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500' : 'border-slate-200 dark:border-slate-800'}`}>
                          <QrCode size={16} /> พร้อมเพย์
                        </button>
                        <button onClick={() => setPaymentMethod('card')} className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${paymentMethod === 'card' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500' : 'border-slate-200 dark:border-slate-800'}`}>
                          <CreditCard size={16} /> บัตรเครดิต
                        </button>
                        <button onClick={() => setPaymentMethod('truemoney')} className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 ${paymentMethod === 'truemoney' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-500' : 'border-slate-200 dark:border-slate-800'}`}>
                          <Wallet size={16} /> ทรูมันนี่
                        </button>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>รวมยอดสินค้า:</span>
                        <span>฿{totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-emerald-500 font-bold">
                        <span>ส่วนลด:</span>
                        <span>-฿{discountAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200 dark:border-slate-700">
                        <span>ยอดสุทธิ:</span>
                        <span className="text-cyan-500">฿{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handlePayment} 
                      className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-black text-xs shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
                    >
                      ยืนยันการชำระเงิน ฿{finalTotal.toLocaleString()}
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal ประวัติการสั่งซื้อ */}
        <AnimatePresence>
          {isHistoryOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-5 shadow-2xl relative max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-black text-sm sm:text-base flex items-center gap-2 text-cyan-500"><History size={18} /> ประวัติรายการสั่งซื้อของคุณ</h3>
                  <button onClick={() => setIsHistoryOpen(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"><X size={18} /></button>
                </div>

                <div className="mt-4 space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-xs text-center text-slate-400 py-8">ยังไม่มีประวัติการสั่งซื้อ</p>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                        <div className="flex justify-between font-bold">
                          <span className="text-cyan-500">{order.id}</span>
                          <span className="text-slate-400">{order.date}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">ผู้สั่งซื้อ: {order.buyerName}</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          {order.items.map(i => `${i.title} (x${i.quantity})`).join(', ')}
                        </p>
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-emerald-500 font-bold">{order.status}</span>
                          <span className="font-black text-sm">฿{order.finalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}