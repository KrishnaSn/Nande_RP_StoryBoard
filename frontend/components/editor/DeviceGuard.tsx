'use client'

import { useState, useEffect } from 'react'
import { Monitor, Smartphone, AlertCircle } from 'lucide-react'

export default function DeviceGuard() {
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      // Logic: Mobile/Tablets are usually < 1024px or have touch capabilities 
      // while not being identified as a primary pointer device.
      const width = window.innerWidth
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      
      // We block anything smaller than 1024px (standard desktop/laptop minimum)
      // or devices that are clearly mobile/tablet based on UA strings for extra safety
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (width < 1024 || isMobileUA) {
        setIsDesktop(false)
      } else {
        setIsDesktop(true)
      }
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (isDesktop) return null

  return (
    <div className="fixed inset-0 z-[200] bg-[#050505] flex items-center justify-center p-8 text-center">
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        {/* Visual Identity */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-red-500/10">
            <img src="/logo.jpg" alt="Nande RP Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-black tracking-[0.2em] text-white uppercase italic">
            Nande RP <span className="text-red-500 not-italic">StoryBoard</span>
          </h1>
        </div>

        {/* Warning Icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <Smartphone size={48} className="opacity-50" />
            <div className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 border-4 border-[#050505]">
              <AlertCircle size={20} className="text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white uppercase tracking-widest">Desktop Required</h2>
          <p className="text-sm font-medium text-zinc-500 leading-relaxed uppercase tracking-tighter">
            The Cinematic Story Engine is a high-precision workspace optimized for large displays and keyboard/mouse workflows.
          </p>
          <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] pt-4">
            Please log in from a PC or Laptop to sequence your stories.
          </p>
        </div>

        {/* Requirements */}
        <div className="w-full grid grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
            <Monitor size={20} className="text-zinc-400" />
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Min 1024px Width</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-2">
             <div className="flex gap-1">
               <span className="w-2 h-2 rounded-sm bg-zinc-600" />
               <span className="w-2 h-2 rounded-sm bg-zinc-600" />
             </div>
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Precision Input</span>
          </div>
        </div>
      </div>
    </div>
  )
}
