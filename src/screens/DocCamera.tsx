import { useState, useEffect } from 'react';
import { X, Camera, Image as ImageIcon, Zap, CheckCircle2 } from 'lucide-react';

export default function DocCamera({ onCancel, onNext }: { onCancel: () => void, onNext: () => void }) {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [quality, setQuality] = useState<'analyzing' | 'good' | 'bad'>('analyzing');

  useEffect(() => {
    if (!hasPhoto) {
      setQuality('analyzing');
      const timer1 = setTimeout(() => setQuality('bad'), 1500); // simulate bad positioning initially
      const timer2 = setTimeout(() => setQuality('good'), 3000); // simulate good positioning
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  }, [hasPhoto]);

  // If photo is taken
  if (hasPhoto) {
    return (
      <div className="flex-1 bg-black flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between">
          <button onClick={() => setHasPhoto(false)} className="text-white flex items-center gap-1 font-medium hover:text-neutral-200">
            <X size={20} /> Batal
          </button>
          <h1 className="font-semibold text-white">Preview Foto</h1>
          <div className="w-[60px]"></div> {/* Spacer */}
        </header>

        {/* Captured Photo (Simulation) */}
        <div className="flex-1 flex items-center justify-center p-6 mt-12 mb-28">
           <div className="w-full aspect-[16/10] bg-neutral-800 rounded-xl border border-neutral-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-neutral-600 flex items-center justify-center">
                 {/* Fake Document Mockup */}
                 <div className="w-[80%] h-[70%] bg-[#f4ebd0]/80 rounded relative flex gap-4 p-4 blur-[1px]">
                   <div className="w-16 h-20 bg-neutral-400 rounded-sm"></div>
                   <div className="flex-1 flex flex-col gap-2">
                     <div className="w-full h-3 bg-neutral-800/40 rounded-sm"></div>
                     <div className="w-3/4 h-2 bg-neutral-800/20 rounded-sm"></div>
                     <div className="w-1/2 h-2 bg-neutral-800/20 rounded-sm"></div>
                     <div className="w-full h-2 bg-neutral-800/20 rounded-sm mt-auto"></div>
                   </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-black z-20 flex gap-4">
           <button 
             onClick={() => setHasPhoto(false)}
             className="flex-1 h-[52px] border border-white text-white rounded-[12px] font-semibold text-base hover:bg-white/10"
           >
             Ambil Ulang
           </button>
           <button 
             onClick={onNext}
             className="flex-1 h-[52px] bg-primary text-white rounded-[12px] font-semibold text-base shadow-lg"
           >
             Gunakan Foto Ini &rarr;
           </button>
        </div>
      </div>
    );
  }

  // Camera View
  return (
    <div className="flex-1 bg-neutral-900 flex flex-col relative overflow-hidden">
      {/* Fake Camera Feed Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
        <div className="w-full h-[60%] bg-gradient-to-b from-neutral-800 to-neutral-700 blur-xl"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-white flex items-center gap-1 font-medium hover:text-neutral-200">
          <X size={20} /> Batal
        </button>
        <h1 className="font-semibold text-white">Foto Dokumen</h1>
        <button className="text-white p-2">
          <Zap size={20} />
        </button>
      </header>

      {/* Overlay with Cutout */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Top Dark Cover */}
        <div className="flex-1 bg-black/60 pt-24 px-6 flex flex-col items-center">
            {quality === 'analyzing' && <span className="bg-black/50 text-white text-sm px-4 py-1.5 rounded-full animate-pulse">Menganalisis...</span>}
            {quality === 'bad' && <span className="bg-danger/80 text-white text-sm px-4 py-1.5 rounded-full flex gap-1.5 items-center backdrop-blur-sm"><X size={16}/> Terlalu gelap atau buram</span>}
            {quality === 'good' && <span className="bg-success text-white text-sm px-4 py-1.5 rounded-full flex gap-1.5 items-center shadow-lg"><CheckCircle2 size={16}/> Posisi bagus! Siap diambil.</span>}
        </div>

        {/* Viewfinder Frame Row */}
        <div className="flex bg-black/60 items-stretch">
          <div className="w-6 bg-black/60 shrink-0"></div>
          
          {/* Transparent Frame Area */}
          <div className="flex-1 aspect-[16/10] relative">
             <div className="absolute inset-0 border border-white/30 rounded-xl"></div>
             
             {/* Corner Guides */}
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
             
             {/* Crosshair / Label */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
                <Camera size={24} className="text-white mb-2" />
                <span className="text-white text-xs tracking-wider">Posisikan dokumen di dalam bingkai</span>
             </div>
          </div>
          
          <div className="w-6 bg-black/60 shrink-0"></div>
        </div>

        {/* Bottom Dark Cover & Controls */}
        <div className="flex-[1.5] bg-black/60 flex flex-col pb-8 relative">
           
           {/* Guidelines text */}
           <div className="flex justify-center gap-4 mt-6 px-4">
              <span className="text-[11px] text-white/80">Cahaya cukup</span>
              <span className="text-[11px] text-white/80">&bull;</span>
              <span className="text-[11px] text-white/80">Dokumen rata</span>
              <span className="text-[11px] text-white/80">&bull;</span>
              <span className="text-[11px] text-white/80">Sisi terlihat</span>
           </div>

           {/* Camera Controls */}
           <div className="mt-auto px-8 flex justify-between items-center relative h-24">
             <button className="flex flex-col items-center gap-1 text-white/80 hover:text-white">
                <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>
                <span className="text-[10px] font-medium">Dari Galeri</span>
             </button>
             
             {/* Shutter Button */}
             <button 
               onClick={() => setHasPhoto(true)}
               disabled={quality !== 'good'}
               className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full border-[4px] flex items-center justify-center transition-all ${
                 quality === 'good' ? 'border-primary ring-4 ring-primary/30' : 'border-white'
               }`}
             >
                <div className={`w-[60px] h-[60px] rounded-full ${quality === 'good' ? 'bg-white' : 'bg-white/80'}`}></div>
             </button>

             <div className="w-10"></div> {/* Spacer for symmetry */}
           </div>
        </div>
      </div>
    </div>
  );
}
