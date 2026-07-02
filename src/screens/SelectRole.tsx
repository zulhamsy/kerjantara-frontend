import { useState } from 'react';
import { ArrowLeft, User, Building2, Check } from 'lucide-react';

export default function SelectRole({ onBack, onNext }: { onBack: () => void, onNext: (role: 'jobseeker' | 'client') => void }) {
  const [role, setRole] = useState<'jobseeker' | 'client' | null>(null);
  const [activeSubStep, setActiveSubStep] = useState<'role' | 'skills'>('role');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const categories = [
    { name: "Tukang Cat", icon: "🎨" },
    { name: "Tukang Ledeng", icon: "🔧" },
    { name: "Teknisi Listrik", icon: "⚡" },
    { name: "Tukang Kayu", icon: "🪵" },
    { name: "Bersih-bersih", icon: "🧹" },
    { name: "Taman & Kebun", icon: "🌿" },
    { name: "Lainnya", icon: "⚙️" }
  ];

  const handleBack = () => {
    if (activeSubStep === 'skills') {
      setActiveSubStep('role');
    } else {
      onBack();
    }
  };

  const handleNext = () => {
    if (role === 'client') {
      onNext('client');
    } else if (role === 'jobseeker') {
      if (activeSubStep === 'role') {
        setActiveSubStep('skills');
      } else {
        // Save to localStorage for demo persistence if needed
        localStorage.setItem('selectedWorkerSkills', JSON.stringify(selectedSkills));
        onNext('jobseeker');
      }
    }
  };

  const isNextDisabled = 
    !role || 
    (role === 'jobseeker' && activeSubStep === 'skills' && selectedSkills.length === 0);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-6 pb-4 flex flex-col gap-4">
        <div className="flex items-center relative">
          <button onClick={handleBack} className="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">
            {activeSubStep === 'role' ? 'Kamu siapa?' : 'Keahlianmu'}
          </h1>
        </div>
        
        {/* Progress Stepper */}
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className="h-1 flex-1 bg-primary rounded-full"></div>
            <div className={`h-1 flex-1 rounded-full transition-all duration-300 ${activeSubStep === 'skills' ? 'bg-primary' : 'bg-primary w-1/2'}`}></div>
            <div className="h-1 flex-1 bg-neutral-200 rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 px-5 flex flex-col items-center pt-4 overflow-y-auto">
        {activeSubStep === 'role' ? (
          <>
            <h2 className="text-[24px] font-bold text-neutral-900 mb-2 text-center leading-[1.3]">
              Kamu Bergabung<br/>Sebagai Apa?
            </h2>
            <p className="text-neutral-600 text-center text-sm mb-8 leading-relaxed px-4">
              Pilih peranmu agar kami bisa menyesuaikan pengalamanmu di Kerjantara.id
            </p>

            {/* Role Cards */}
            <div className="w-full flex flex-col gap-4">
              {/* Card A: Pencari Kerja */}
              <div 
                onClick={() => setRole('jobseeker')}
                className={`relative p-5 rounded-[16px] border-2 cursor-pointer transition-all ${
                  role === 'jobseeker' 
                    ? 'border-primary bg-primary-light' 
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                {role === 'jobseeker' && (
                  <div className="absolute top-4 right-4 text-primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-0 right-4 -translate-y-1/2 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Paling Banyak
                </div>
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${role === 'jobseeker' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                  <User size={24} />
                </div>
                <h3 className="font-bold text-lg text-neutral-900 mb-1">Pencari Kerja</h3>
                <p className="text-sm text-neutral-600 leading-relaxed pr-6">
                  Saya ingin melamar kerja, freelance, atau mengerjakan proyek
                </p>
              </div>

              {/* Card B: Klien */}
              <div 
                onClick={() => setRole('client')}
                className={`relative p-5 rounded-[16px] border-2 cursor-pointer transition-all ${
                  role === 'client' 
                    ? 'border-primary bg-primary-light' 
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                {role === 'client' && (
                  <div className="absolute top-4 right-4 text-primary">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                    </svg>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${role === 'client' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                  <Building2 size={24} />
                </div>
                <h3 className="font-bold text-lg text-neutral-900 mb-1">Klien / Perusahaan</h3>
                <p className="text-sm text-neutral-600 leading-relaxed pr-6">
                  Saya ingin merekrut talenta atau membuka lowongan
                </p>
              </div>
            </div>

            <p className="text-neutral-400 text-xs text-center mt-6">
              Peran bisa ditambah atau diubah kapan saja dari Pengaturan.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-[24px] font-bold text-neutral-900 mb-2 text-center leading-[1.3]">
              Apa Saja Keahlianmu?
            </h2>
            <p className="text-neutral-600 text-center text-sm mb-6 leading-relaxed px-4">
              Pilih satu atau beberapa kategori pekerjaan yang sesuai dengan keahlian yang kamu kuasai.
            </p>

            {/* Categories Grid Selection */}
            <div className="w-full grid grid-cols-2 gap-3 max-w-sm mx-auto pb-4">
              {categories.map((cat) => {
                const isSelected = selectedSkills.includes(cat.name);
                const isLainnya = cat.name === 'Lainnya';
                return (
                  <div
                    key={cat.name}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedSkills(selectedSkills.filter(s => s !== cat.name));
                      } else {
                        setSelectedSkills([...selectedSkills, cat.name]);
                      }
                    }}
                    className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative select-none ${
                      isLainnya ? 'col-span-2 py-3 flex-row gap-2' : ''
                    } ${
                      isSelected
                        ? 'border-primary bg-primary-light ring-1 ring-primary'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 text-primary">
                        <Check size={16} strokeWidth={3} />
                      </div>
                    )}
                    <div className={isLainnya ? 'text-lg' : 'text-2xl mb-1.5'}>{cat.icon}</div>
                    <span className="font-extrabold text-xs text-neutral-800">{cat.name}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Action Button */}
        <div className="mt-auto mb-8 w-full pt-6 bg-white z-10">
          <button 
            onClick={handleNext}
            disabled={isNextDisabled}
            className={`w-full h-[52px] rounded-[12px] font-semibold text-base transition-all ${
              !isNextDisabled 
                ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' 
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {activeSubStep === 'skills' ? 'Selesai & Lanjut' : 'Lanjut'} &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
