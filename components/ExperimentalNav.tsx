'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag, PlusCircle, Sparkles, Flame, Compass } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'หน้าหลัก', icon: ShoppingBag, color: 'text-indigo-400' },
  { href: '/product', label: 'ลงขาย 3D', icon: PlusCircle, color: 'text-emerald-400' },
  { href: '#', label: 'สำรวจ AR', icon: Compass, color: 'text-cyan-400' },
  { href: '#', label: 'ฮิตติดเทรนด์', icon: Flame, color: 'text-amber-400' },
];

export default function ExperimentalNav() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.nav 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 p-2.5 rounded-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isHovered = hoveredIndex === index;

          return (
            <Link key={index} href={item.href}>
              <motion.div
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                animate={{
                  scale: isHovered ? 1.25 : 1,
                  y: isHovered ? -8 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative group p-3 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Icon size={22} className={item.color} />

                {/* Tooltip Popup */}
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -45, scale: 1 }}
                    className="absolute whitespace-nowrap px-3 py-1 rounded-xl bg-slate-800 text-white text-[11px] font-semibold border border-white/10 shadow-lg pointer-events-none"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </motion.nav>
    </div>
  );
}