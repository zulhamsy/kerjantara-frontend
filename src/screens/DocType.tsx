import { useState } from 'react';
import { ArrowLeft, Lock, CreditCard, CarFront, Book, Lightbulb, CheckCircle2 } from 'lucide-react';

export default function DocType({ onBack, onNext }: { onBack: () => void, onNext: () => void }) {
  const [docType, setDocType] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex flex-col gap-4">
        <div className="flex items-center relative">
          <button onClick={onBack} className="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">Verifikasi Identitas</h1>
        </div>
        
        {/* Progress Stepper (3) */}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-neutral-200 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-24">
        {/* Context Banner */}
        <div className="bg-primary-light border-l-4 border-primary p-4 rounded-r-xl mb-6 flex gap-3 items-start">
          <Lock size={20} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-neutral-900 font-medium">Data kamu dienkripsi dan hanya digunakan untuk verifikasi. Tidak dibagikan ke pihak ketiga.</p>
          </div>
        </div>

        <h2 className="text-[24px] font-bold text-neutral-900 mb-2 leading-[1.3]">
          Pilih Dokumen<br/>Identitasmu
        </h2>
        <p className="text-neutral-600 text-sm mb-6 leading-relaxed">
          Dokumen digunakan untuk memverifikasi identitasmu dan meningkatkan kepercayaan klien.
        </p>

        {/* Document Selection List */}
        <div className="flex flex-col gap-3 mb-8">
          {/* Option 1: KTP */}
          <div 
            onClick={() => setDocType('ktp')}
            className={`flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all ${
              docType === 'ktp' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${docType === 'ktp' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}>
              <CreditCard size={20} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-neutral-900 text-base">KTP</span>
                <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full">Direkomendasikan</span>
              </div>
              <p className="text-xs text-neutral-500">Proses verifikasi lebih cepat</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${docType === 'ktp' ? 'border-primary bg-primary text-white' : 'border-neutral-300'}`}>
              {docType === 'ktp' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
          </div>

          {/* Option 2: SIM */}
          <div 
            onClick={() => setDocType('sim')}
            className={`flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all ${
              docType === 'sim' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
           <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${docType === 'sim' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}>
              <CarFront size={20} />
            </div>
            <div className="flex-1">
              <span className="block font-bold text-neutral-900 text-base mb-1">SIM</span>
              <p className="text-xs text-neutral-500">SIM A atau SIM C masih berlaku</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${docType === 'sim' ? 'border-primary bg-primary text-white' : 'border-neutral-300'}`}>
              {docType === 'sim' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
          </div>

          {/* Option 3: Paspor */}
          <div 
            onClick={() => setDocType('paspor')}
            className={`flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all ${
              docType === 'paspor' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 ${docType === 'paspor' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}>
              <Book size={20} />
            </div>
            <div className="flex-1">
              <span className="block font-bold text-neutral-900 text-base mb-1">Paspor</span>
              <p className="text-xs text-neutral-500">Paspor yang masih berlaku</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${docType === 'paspor' ? 'border-primary bg-primary text-white' : 'border-neutral-300'}`}>
               {docType === 'paspor' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
          </div>
        </div>

        {/* Tips Collapsible */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
          <button 
            onClick={() => setShowTips(!showTips)}
            className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lightbulb size={18} className="text-accent" />
              <span className="font-semibold text-neutral-900 text-sm">Tips Foto yang Baik</span>
            </div>
            <svg className={`w-5 h-5 text-neutral-400 transition-transform ${showTips ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          
          {showTips && (
            <div className="p-4 pt-0 text-sm text-neutral-600 space-y-3">
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                <p>Pastikan foto tidak buram atau terpotong</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                <p>Ambil di tempat dengan pencahayaan cukup</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
                <p>Semua teks di dokumen harus terbaca jelas</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FIXED Bottom Action CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100">
        <button 
          onClick={onNext}
          disabled={!docType}
          className={`w-full h-[52px] rounded-[12px] font-semibold text-base transition-all ${
            docType ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Pilih &amp; Ambil Foto &rarr;
        </button>
      </div>
    </div>
  );
}
