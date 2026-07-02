import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MailOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function VerifyOTP({ onBack, onNext }: { onBack: () => void, onNext: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(47);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    setError(false);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit simulation
    if (index === 5 && value && newOtp.join('').length === 6) {
      if (newOtp.join('') === '123456') { // success trigger
        setTimeout(onNext, 500);
      } else { // error trigger
        setError(true);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.join('').length === 6;

  const handleResend = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    setError(false);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Toast Notification (C2) */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 50, opacity: 0, x: '-50%' }}
            className="absolute bottom-24 left-1/2 -ml-[50%] w-max bg-neutral-900 text-white px-4 py-3 rounded-xl flex items-center gap-3 z-50 shadow-lg"
          >
            <div className="bg-success rounded-full p-0.5">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-sm font-medium">Kode baru telah dikirim! Cek email.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex flex-col gap-4">
        <div className="flex items-center relative">
          <button onClick={onBack} className="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">Verifikasi</h1>
        </div>
        
        {/* Progress Stepper */}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-neutral-200 rounded-full"></div>
            <div className="h-1 flex-1 bg-neutral-200 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 flex flex-col items-center pt-8">
        <div className="w-[120px] h-[120px] bg-primary-light rounded-full flex items-center justify-center mb-6 text-primary relative">
          <MailOpen size={56} strokeWidth={1.5} />
          <div className="absolute top-2 right-2 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
        </div>

        <h2 className="text-[22px] font-bold text-neutral-900 mb-2 text-center">Cek Kode Verifikasimu</h2>
        <p className="text-neutral-600 text-center text-[15px] mb-1">
          Kami sudah mengirimkan kode 6 digit ke
        </p>
        <p className="font-bold text-primary mb-1">kerjantara@example.com</p>
        <p className="text-neutral-500 text-sm text-center mb-8">Kode berlaku selama 10 menit.</p>

        {/* OTP Inputs */}
        <div className={`flex gap-2 mb-2 ${error ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={`w-11 h-14 sm:w-[48px] sm:h-[56px] text-center text-xl font-bold rounded-[10px] border-2 focus:outline-none transition-colors ${
                error 
                  ? 'border-danger text-danger bg-danger/5' 
                  : digit 
                    ? 'border-primary text-neutral-900' 
                    : 'border-neutral-200 text-neutral-900 focus:border-primary'
              }`}
            />
          ))}
        </div>
        
        {error && (
          <p className="text-danger text-sm font-medium mt-2">Kode tidak valid. Coba lagi (2 kesempatan tersisa).</p>
        )}

        {/* Timer / Resend */}
        <div className="mt-8 text-center flex flex-col items-center">
          {timer > 0 ? (
            <p className="text-neutral-400 font-medium text-sm">
              Kirim ulang dalam 00:{timer.toString().padStart(2, '0')}
            </p>
          ) : (
            <button onClick={handleResend} className="text-primary font-bold text-sm hover:underline">
              Kirim ulang kode
            </button>
          )}

          <div className="mt-4 px-3 py-1.5 bg-blue-500/50 text-blue-950 font-semibold rounded-lg text-xs inline-block">
            Mockup: OTP 123456
          </div>
        </div>

        <button className="text-neutral-500 font-medium text-xs mt-6 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900">
          Salah alamat? Ubah di sini
        </button>

        {/* Action Button */}
        <div className="mt-auto mb-8 w-full">
          <button 
            onClick={onNext}
            disabled={!isComplete}
            className={`w-full h-[52px] rounded-[12px] font-semibold text-base transition-all ${
              isComplete && !error ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)]' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Verifikasi &rarr;
          </button>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
        }
      `}</style>
    </div>
  );
}
