'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Moon, Sun, ShoppingBag, Sparkles, X, 
  MessageSquare, ShoppingCart, Trash2, Eye, Plus, CheckCircle2, Zap, ShieldCheck
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
    title: 'หูฟังไร้สาย Sony WH-1000XM4', 
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
    title: 'โคมไฟอ่านหนังสือ LED ถนอมสายตา', 
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
    title: 'กระเป๋าเป้ Anello ใส่โน้ตบุ๊ก 15 นิ้ว', 
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
    title: 'คีย์บอร์ดกลไก Mechanical RGB', 
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
  },
  { 
    id: 11, 
    title: 'MacBook Air M1 RAM 8GB SSD 256GB', 
    price: 18500, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'หอพักใน ตึก 2', 
    time: '14 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
    description: 'สภาพนางฟ้า แบตเตอรี Health 92% กล่องอุปกรณ์ครบ ใช้ทำรายงานและตัดต่อเบาๆ',
    seller: 'เคท (นิเทศ ปี 3)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 3 นาที',
    condition: 'มือสอง (สภาพ 96%)'
  },
  { 
    id: 12, 
    title: 'แก้วเก็บความเย็น Yeti 30 oz ลายคลาสสิก', 
    price: 220, 
    category: 'อุปกรณ์การเรียน', 
    location: 'โรงอาหารตึกกลาง', 
    time: '15 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=600&q=80',
    description: 'เก็บความเย็นได้ข้ามคืน ไม่มีน้ำเกาะข้างแก้ว มีหลอดสแตนเลสให้',
    seller: 'อาร์ม (วิศวะ ปี 1)',
    sellerStatus: 'ใช้งานล่าสุด 30 นาทีที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 10 นาที',
    condition: 'สภาพดีเยี่ยม'
  },
  { 
    id: 13, 
    title: 'เมาส์ไร้สาย Logitech MX Master 3S', 
    price: 2600, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'ห้องสำนักหอสมุด', 
    time: '18 ชม. ที่แล้ว',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
    description: 'เมาส์เพื่อสุขภาพ เสียงคลิกเงียบมาก เชื่อมต่อได้ 3 เครื่องพร้อมกัน',
    seller: 'พีท (ไอที ปี 4)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 5 นาที',
    condition: 'มือสอง (สภาพ 92%)'
  },
  { 
    id: 14, 
    title: 'กระดานวาดรูปต่อคอม Wacom Intuos', 
    price: 1350, 
    category: 'อุปกรณ์การเรียน', 
    location: 'ตึกศิลปกรรม', 
    time: '1 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    description: 'เหมาะสำหรับสายวาดและไดคัทงาน ปากกาไม่ต้องชาร์จไฟ แถมหัวปากกาสำรอง 3 หัว',
    seller: 'ฝน (วิจิตรศิลป์ ปี 2)',
    sellerStatus: 'ใช้งานล่าสุด 4 ชม. ที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 30 นาที',
    condition: 'มือสอง (สภาพดี)'
  },
  { 
    id: 15, 
    title: 'กล้องฟิล์ม Olympus OM-1 พร้อมเลนส์ 50mm', 
    price: 4200, 
    category: 'อื่นๆ', 
    location: 'ลานไทรหน้ามหาลัย', 
    time: '1 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80',
    description: 'กล้องฟิล์มคลาสสิกทำงานเต็มระบบ สปีดชัตเตอร์ตรง เลนส์ใสไม่มีราไม่มีฝ้า',
    seller: 'ปอนด์ (นิเทศ ปี 4)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 10 นาที',
    condition: 'มือสอง (Vintage Classic)'
  },
  { 
    id: 16, 
    title: 'ชุดพับโต๊ะญี่ปุ่นไม้แท้ + เก้าอี้เบาะนุ่ม', 
    price: 350, 
    category: 'อื่นๆ', 
    location: 'หอพักนอก ประตู 3', 
    time: '1 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80',
    description: 'โต๊ะไม้พับเก็บได้ ขาแข็งแรงไม่โยก เหมาะกับนั่งอ่านหนังสือบนเตียงหรือพื้น',
    seller: 'ตูน (เศรษฐศาสตร์ ปี 2)',
    sellerStatus: 'ใช้งานล่าสุด 1 ชม. ที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 15 นาที',
    condition: 'มือสอง (สภาพดี)'
  },
  { 
    id: 17, 
    title: 'นาฬิกา Seiko Automatic Vintage สายสแตนเลส', 
    price: 3100, 
    category: 'เสื้อผ้า/ยูนิฟอร์ม', 
    location: 'ตึกบริหารธุรกิจ', 
    time: '2 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    description: 'นาฬิกาข้อมือผู้ชายระบบออโตเมติก หน้าปัดคลาสสิก เดินตรง มีช่องบอกวันและวันที่',
    seller: 'ก้อง (บริหาร ปี 4)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 5 นาที',
    condition: 'มือสอง (สภาพสะสม)'
  },
  { 
    id: 18, 
    title: 'พัดลมไอเย็นขนาดพกพา USB', 
    price: 150, 
    category: 'อุปกรณ์การเรียน', 
    location: 'ตึกเรียนรวม 2', 
    time: '2 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
    description: 'เติมน้ำหรือน้ำแข็งด้านบนแล้วเย็นเจี๊ยบ ปรับระดับความแรงลมได้ 3 ระดับ',
    seller: 'จอย (วิทยาการจัดการ ปี 1)',
    sellerStatus: 'ใช้งานล่าสุด 5 ชม. ที่แล้ว',
    sellerResponseRate: 'ตอบภายใน 1 ชม.',
    condition: 'มือสอง (สภาพ 90%)'
  },
  { 
    id: 19, 
    title: 'หนังสือฟิสิกส์มหาวิทยาลัย (University Physics)', 
    price: 290, 
    category: 'หนังสือเรียน', 
    location: 'ตึกฟิสิกส์', 
    time: '2 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
    description: 'ฉบับแปลไทย เล่มใหญ่เนื้อหาครบถ้วน มีโจทย์พร้อมเฉลยอย่างละเอียดท้ายบท',
    seller: 'บิว (วิทยาศาสตร์ ปี 2)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 10 นาที',
    condition: 'มือสอง (สภาพ 92%)'
  },
  { 
    id: 20, 
    title: 'ไมค์อัดเสียง USB Condenser Fifine K669B', 
    price: 780, 
    category: 'ไอที/เครื่องใช้ไฟฟ้า', 
    location: 'ตึกดนตรี', 
    time: '3 วันที่แล้ว',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
    description: 'เสียงคมชัด ใช้แคสเกม อัดเสียงร้อง หรือนำเสนอคุยงานใน Zoom แถมขาตั้งสามขา',
    seller: 'แดน (ดุริยางคศิลป์ ปี 3)',
    sellerStatus: 'ออนไลน์อยู่',
    sellerResponseRate: 'ตอบไวภายใน 2 นาที',
    condition: 'มือสอง (สภาพดีมาก)'
  }
];

export default function Home() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const goToChat = (product: Product) => {
    router.push(`/chat?seller=${encodeURIComponent(product.seller)}&product=${encodeURIComponent(product.title)}`);
  };

  return (
    <div className="max-w-md md:max-w-5xl mx-auto min-h-screen pb-32 px-4 pt-6 relative font-serif text-slate-800 dark:text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Premium Header ดีไซน์เรียบหรู คลาสสิก */}
      <header className="flex items-center justify-between py-3 border-b-2 border-amber-600/30 dark:border-amber-500/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-amber-600 text-white shadow-md shadow-amber-600/20">
              <ShoppingBag size={20} />
            </span>
            <span className="text-[11px] font-sans font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400">
              Classic Collection
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-1 font-serif text-slate-900 dark:text-amber-100">
            CAMPUS MARKETPLACE
          </h1>
        </div>

        <div className="flex items-center gap-3 font-sans">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-amber-600/20 text-slate-800 dark:text-amber-200 hover:border-amber-500 transition-all shadow-sm"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-amber-600/20 text-slate-800 dark:text-amber-200 hover:border-amber-500 transition-all shadow-sm"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* ช่องค้นหาสไตล์ Classic Elegant */}
      <div className="relative my-6 font-sans">
        <Search className="absolute left-4 top-3.5 text-amber-600 dark:text-amber-400" size={18} />
        <input 
          type="text" 
          placeholder="ค้นหาสินค้ามือสองพรีเมียมในมหาลัย..." 
          className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-amber-900/40 focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm shadow-inner transition-all"
        />
      </div>

      {/* 3D Showcase Banner */}
      <div className="my-6 h-56 rounded-2xl overflow-hidden border border-amber-600/20 shadow-xl bg-slate-950">
        <Canvas3D />
      </div>

      {/* หัวข้อรายการสินค้า 20 รายการ */}
      <section className="mt-8 font-sans">
        <div className="flex items-center justify-between mb-5 border-l-4 border-amber-600 pl-3">
          <div>
            <h2 className="text-xl font-bold font-serif tracking-wide text-slate-900 dark:text-amber-100 flex items-center gap-2">
              <Sparkles size={20} className="text-amber-500" />
              สินค้าคุณภาพแนะนำ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">คัดสรรสินค้ามือสองสภาพดี 20 รายการล่าสุด</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/20">
            20 Items
          </span>
        </div>

        {/* ตารางแสดงสินค้า 20 อย่าง */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SAMPLE_PRODUCTS.map((product) => (
            <motion.div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 250 }}
              className="cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-amber-900/30 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all flex flex-col justify-between group relative"
            >
              <div>
                <div className="relative h-40 w-full rounded-xl mb-3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image 
                    src={product.image} 
                    alt={product.title} 
                    fill 
                    unoptimized 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-md text-amber-300 text-[9px] font-medium px-2 py-0.5 rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={10} /> ดู 3D
                  </div>

                  <button
                    onClick={(e) => addToCart(product, e)}
                    title="ใส่ตะกร้าทันที"
                    className="absolute top-2 right-2 p-2 rounded-lg bg-amber-600 text-white shadow-md hover:bg-amber-700 transition-all z-10"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded border border-amber-500/20">
                  {product.category}
                </span>
                <h3 className="font-serif font-bold text-xs mt-2 line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {product.title}
                </h3>
              </div>
              
              <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-amber-700 dark:text-amber-400 font-serif font-black text-base">฿{product.price.toLocaleString()}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-sans">
                  <span>{product.location}</span>
                  <span>{product.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pop-up แสดงรายละเอียดสินค้า + การตอบกลับของผู้ขาย */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm font-sans">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-amber-600/30 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/80 text-amber-200 hover:bg-slate-900 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="overflow-y-auto p-5 space-y-4">
                <div className="relative h-56 w-full rounded-xl overflow-hidden bg-slate-950 border border-amber-500/20">
                  <Canvas3D category={selectedProduct.category} />
                  <div className="absolute bottom-3 left-3 text-[10px] bg-slate-900/90 backdrop-blur-md text-amber-300 px-3 py-1 rounded border border-amber-500/30 font-mono">
                    3D MODEL: {selectedProduct.category}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-serif font-bold text-slate-900 dark:text-amber-100">{selectedProduct.title}</h2>
                  <p className="text-2xl font-serif font-black text-amber-600 dark:text-amber-400 mt-1">฿{selectedProduct.price.toLocaleString()}</p>
                </div>

                {/* Seller Status & Response Rate */}
                <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <ShieldCheck size={16} className="text-amber-500" />
                      ผู้ขาย: {selectedProduct.seller}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ● {selectedProduct.sellerStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Zap size={12} className="text-amber-500" />
                    การโต้ตอบ: <span className="font-medium text-slate-700 dark:text-slate-300">{selectedProduct.sellerResponseRate}</span>
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedProduct.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-[10px]">สถานที่นัดรับ</p>
                    <p className="font-bold mt-0.5">{selectedProduct.location}</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 text-[10px]">สภาพสินค้า</p>
                    <p className="font-bold mt-0.5">{selectedProduct.condition}</p>
                  </div>
                </div>

                {/* ปุ่มสั่งซื้อใส่ตะกร้า (ปุ่มหลัก) & ปุ่มทักแชท */}
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct);
                      alert('เพิ่มสินค้าลงตะกร้าเรียบร้อย!');
                    }}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ShoppingCart size={16} /> ใส่ตะกร้าทันที
                  </button>
                  <button 
                    onClick={() => goToChat(selectedProduct)}
                    className="px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare size={15} /> ทักแชท
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
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm font-sans">
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="bg-white dark:bg-slate-900 w-full max-w-sm h-full p-5 flex flex-col justify-between shadow-2xl border-l border-amber-600/20"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="font-serif font-bold text-base flex items-center gap-2">
                    <ShoppingCart size={18} className="text-amber-600" /> ตะกร้าสินค้าของคุณ
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
                      <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div>
                          <h4 className="font-serif font-bold text-xs line-clamp-1">{item.title}</h4>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">฿{item.price.toLocaleString()} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-500 p-1.5">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold font-serif">
                    <span>ราคารวมทั้งหมด</span>
                    <span className="text-amber-600 dark:text-amber-400 text-lg">฿{totalPrice.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => {
                      alert('สั่งซื้อสินค้าเรียบร้อยแล้ว!');
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-all shadow-md active:scale-95"
                  >
                    ยืนยันการสั่งซื้อ
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