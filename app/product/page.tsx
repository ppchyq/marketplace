'use client';

import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddProductPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push('/home');
    }, 1500);
  };

  return (
    <div className="max-w-md md:max-w-xl mx-auto min-h-screen p-4 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between py-2 mb-4">
        <Link href="/home" className="p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-base font-bold">ลงประกาศขายสินค้า</h1>
        <div className="w-8"></div>
      </div>

      {submitted ? (
        <div className="flex flex-col items-center justify-center my-20 space-y-3 text-center">
          <CheckCircle size={56} className="text-emerald-500 animate-bounce" />
          <h2 className="text-xl font-bold">ลงประกาศสำเร็จ!</h2>
          <p className="text-xs text-slate-400">กำลังนำคุณกลับสู่หน้าหลัก...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Upload Image Slot */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">รูปภาพสินค้า</label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all">
              <Upload size={28} className="mb-2 text-indigo-500" />
              <span className="text-xs font-medium">อัปโหลดรูปภาพสินค้า</span>
              <span className="text-[10px] text-slate-400 mt-0.5">รองรับ JPG, PNG สูงสุด 5MB</span>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">ชื่อสินค้า / หัวข้อประกาศ</label>
            <input 
              required
              type="text" 
              placeholder="เช่น หนังสือเรียน Math I, เสื้อช็อป..." 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5">หมวดหมู่</label>
              <select className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option>หนังสือ/ชีทเรียน</option>
                <option>อุปกรณ์การเรียน</option>
                <option>เสื้อผ้า/ยูนิฟอร์ม</option>
                <option>ไอที/เครื่องใช้ไฟฟ้า</option>
                <option>อื่นๆ</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">ราคา (บาท)</label>
              <input 
                required
                type="number" 
                placeholder="0.00" 
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">สถานที่สะดวกนัดรับ</label>
            <input 
              required
              type="text" 
              placeholder="เช่น หน้าตึกวิศวะ, โรงอาหารกลาง" 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5">รายละเอียดเพิ่มเติม</label>
            <textarea 
              rows={3}
              placeholder="ระบุสภาพสินค้า เหตุผลที่ขาย หรือช่องทางติดต่อเพิ่มเติม..." 
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/20 active:scale-95 transition-all mt-4"
          >
            ลงประกาศขาย
          </button>
        </form>
      )}
    </div>
  );
}