import { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INSTRUCTIONS = [
  "Posisikan wajahmu dalam bingkai oval",
  "Kedipkan mata 2 kali",
  "Gelengkan kepala pelan ke kanan, lalu ke kiri"
];

export default function SelfieCamera({ onCancel, onNext }: { onCancel: () => void, onNext: () => void }) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'detecting' | 'detected' | 'too_far' | 'success'>('detecting');

  useEffect(() => {
    // Fake liveness flow
    if (step === 0) {
      setTimeout(() => setStatus('too_far'), 1000);
      setTimeout(() => setStatus('detected'), 2500);
      setTimeout(() => setStep(1), 3500);
    } else if (step === 1) {
      setStatus('detecting');
      setTimeout(() => setStatus('detected'), 1500);
      setTimeout(() => setStep(2), 2500);
    } else if (step === 2) {
      setStatus('detecting');
      setTimeout(() => setStatus('detected'), 2000);
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => onNext(), 1500);
      }, 3000);
    }
  }, [step, onNext]);

  return (
    <div className="flex-1 bg-neutral-900 flex flex-col relative overflow-hidden">
      {/* Fake Camera Feed Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
         {/* Simulate blur around face */}
         <div className="w-[80%] h-[60%] bg-orange-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between">
        <button onClick={onCancel} className="text-white flex items-center gap-1 font-medium hover:text-neutral-200">
          <ArrowLeft size={20} /> Kembali
        </button>
        <h1 className="font-semibold text-white">Verifikasi Wajah</h1>
        <div className="w-[70px]"></div>
      </header>

      {/* Main Overlay */}
      <div className="flex-1 relative z-10 flex flex-col">
        {/* Top Text Area */}
        <div className="pt-24 px-6 flex flex-col items-center">
            <h2 className="text-xl font-bold text-white text-center drop-shadow-md">
              {status === 'success' ? 'Verifikasi Berhasil!' : 'Verifikasi Wajahmu'}
            </h2>
            <p className="text-white/80 text-sm text-center mt-1 w-64">
              Ikuti petunjuk berikut untuk membuktikan bahwa kamu benar-benar hadir
            </p>
        </div>

        {/* Center Oval & Instructions */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-10">
          
          {/* Active Instruction Tooltip */}
          <AnimatePresence mode="wait">
            {status !== 'success' && (
              <motion.div 
                key={step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-black/60 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium mb-6 text-center max-w-[280px]"
              >
                {INSTRUCTIONS[step]}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Oval Guide */}
          <div className="relative">
             <div className="w-[240px] h-[320px] rounded-[120px] border-[4px] border-dashed border-white/40 overflow-hidden relative">
               {/* When success, fill with green tint */}
               <AnimatePresence>
                 {status === 'success' && (
                   <motion.div 
                     initial={{ opacity: 0 }} 
                     animate={{ opacity: 1 }} 
                     className="absolute inset-0 bg-success/80 flex items-center justify-center backdrop-blur-md"
                   >
                     <motion.div
                       initial={{ scale: 0.5 }}
                       animate={{ scale: 1 }}
                       transition={{ type: 'spring', damping: 10 }}
                     >
                       <Check size={80} className="text-white" strokeWidth={3} />
                     </motion.div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
             
             {/* Dynamic Border based on status */}
             <div className={`absolute -inset-1 rounded-[120px] border-[4px] opacity-70 transition-colors duration-300 ${
               status === 'too_far' ? 'border-warning' :
               status === 'detected' ? 'border-primary' :
               'border-transparent' // success state covered inside
             }`}></div>
          </div>
          
          {/* Status Text Indicator */}
          <div className="h-6 mt-6">
            {status === 'detecting' && <span className="text-white/70 text-sm">Mendeteksi wajah...</span>}
            {status === 'detected' && <span className="text-success font-medium text-sm drop-shadow">Wajah terdeteksi ✓</span>}
            {status === 'too_far' && <span className="text-warning font-medium text-sm drop-shadow">Terlalu jauh — mendekat sedikit</span>}
          </div>
        </div>

        {/* Bottom Area: Progress & Cancel */}
        <div className="pb-8 px-6 flex flex-col items-center">
          {/* Progress Bar (Liveness steps) */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-primary" 
              initial={{ width: '0%' }}
              animate={{ width: `${((step) / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>

          <button onClick={onCancel} className="text-white/80 font-medium py-3 px-6 hover:text-white transition-colors">
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
}
