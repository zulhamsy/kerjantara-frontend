import { useEffect } from 'react';
import KerjantaraLogo from '../components/KerjantaraLogo';

export default function Splash({ onFinish }: { onFinish: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex-1 bg-primary flex flex-col items-center justify-center relative">
      <div className="flex flex-col items-center">
        <KerjantaraLogo variant="white" iconSize={64} textSize="text-3xl" />
        <p className="text-white/70 mt-4 text-xs tracking-wider uppercase font-semibold">Karirmu, Mulai di Sini.</p>
      </div>
      
      {/* Loading bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white rounded-full animate-[progress_2s_ease-in-out_forwards]"></div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
