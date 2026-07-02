import React, { useState, useEffect } from 'react';
import { 
  Plus, Users, Eye, Phone, MessageSquare, Star, Play, CheckCircle2, 
  MapPin, Clock, ShieldAlert, Award, FileText, ChevronRight, X, AlertTriangle
} from 'lucide-react';
import { JobRequest, WorkerProfile, TransactionStep } from '../types';
import KerjantaraLogo from '../components/KerjantaraLogo';

interface DashboardPemberiKerjaProps {
  userName: string;
  transactionStep: TransactionStep;
  setTransactionStep: (step: TransactionStep) => void;
  jobRequest: JobRequest;
  setJobRequest: (req: JobRequest) => void;
  selectedWorker: WorkerProfile | null;
  setSelectedWorker: (worker: WorkerProfile | null) => void;
  onOpenChat: () => void;
  onOpenDispute: () => void;
  onRestartTransaction: () => void;
}

export default function DashboardPemberiKerja({
  userName,
  transactionStep,
  setTransactionStep,
  jobRequest,
  setJobRequest,
  selectedWorker,
  setSelectedWorker,
  onOpenChat,
  onOpenDispute,
  onRestartTransaction
}: DashboardPemberiKerjaProps) {
  
  // Antd v3 layout states
  const [activeMenu, setActiveMenu] = useState<'beranda' | 'permintaan' | 'pekerja' | 'pesan'>('beranda');
  
  // Form input states
  const [category, setCategory] = useState('Tukang Cat');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Jl. Mawar No. 12, Kebayoran Baru');
  const [duration, setDuration] = useState('Setengah hari');
  const [budget, setBudget] = useState('180000');
  
  // Rating states
  const [starCount, setStarCount] = useState(5);
  const [reviewInput, setReviewInput] = useState('');
  const [aspects, setAspects] = useState<string[]>([]);
  const [submittedRating, setSubmittedRating] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);

  // Personality Filter & Portfolio Modal States
  const [selectedPersonality, setSelectedPersonality] = useState<string>('Semua');
  const [portfolioWorker, setPortfolioWorker] = useState<WorkerProfile | null>(null);

  // Match list candidates (3 Best Workers)
  const candidates: WorkerProfile[] = [
    {
      name: "Pak Budi Santoso",
      avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=60",
      rating: 4.9,
      completedJobs: 142,
      distance: "1.2 km",
      status: "Tersedia sekarang",
      skills: ["Cat Dinding", "Cat Plafon", "Plester tembok"],
      price: "Rp 150.000 - 200.000",
      bio: "Spesialis tukang cat interior dengan pengalaman 8 tahun. Ahli mengatasi rembesan air pada dinding, plesteran retak rambut, hingga pengecatan rapi 3 lapis.",
      personalityFilters: ["Sangat Teliti", "Sopan & Ramah", "Tepat Waktu"],
      portfolioBeforeAfter: [
        {
          title: "Restorasi Dinding Rembes & Berjamur",
          before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
          after: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      name: "Pak Agung Wijaya",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60",
      rating: 4.8,
      completedJobs: 98,
      distance: "1.9 km",
      status: "Tersedia pukul 14:00",
      skills: ["Cat Kayu", "Mengecat Besi", "Wallpaper"],
      price: "Rp 170.000 - 220.000",
      bio: "Biasa mengerjakan pengerjaan pagar besi eksterior tahan karat dan pernis kayu mengkilap. Kerja rapi, bersih, tanpa menyisakan noda cat berantakan.",
      personalityFilters: ["Inisiatif Tinggi", "Sopan & Ramah", "Cepat & Sigap"],
      portfolioBeforeAfter: [
        {
          title: "Finishing Cat Pagar Mewah Anti Karat",
          before: "https://images.unsplash.com/photo-1516331138075-f3ad157c6c74?w=400&auto=format&fit=crop&q=80",
          after: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&auto=format&fit=crop&q=80"
        }
      ]
    },
    {
      name: "Pak Cecep Rahman",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=60",
      rating: 4.7,
      completedJobs: 115,
      distance: "2.4 km",
      status: "Tersedia sekarang",
      skills: ["Cat Duco", "Melamic", "Mengecat Kusen"],
      price: "Rp 140.000 - 180.000",
      bio: "Fokus pada finishing mebel/furniture menggunakan semprotan Cat Duco premium atau pelitur melamic mengkilap tinggi untuk kusen pintu jendela jati.",
      personalityFilters: ["Sangat Teliti", "Pendiam / Fokus", "Cepat & Sigap"],
      portfolioBeforeAfter: [
        {
          title: "Pernis Melamic Meja Kayu Jati Kuno",
          before: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&auto=format&fit=crop&q=80",
          after: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&auto=format&fit=crop&q=80"
        }
      ]
    }
  ];

  const categories = [
    { name: "Tukang Cat", icon: "🎨" },
    { name: "Tukang Ledeng", icon: "🔧" },
    { name: "Teknisi Listrik", icon: "⚡" },
    { name: "Tukang Kayu", icon: "🪵" },
    { name: "Bersih-bersih", icon: "🧹" },
    { name: "Taman & Kebun", icon: "🌿" },
    { name: "Lainnya", icon: "⚙️" }
  ];

  // Simulated live matching timer (PK-3)
  useEffect(() => {
    if (transactionStep === 'matching') {
      const timer = setTimeout(() => {
        setTransactionStep('kandidat_list');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [transactionStep]);

  const handlePostJob = () => {
    setJobRequest({
      category,
      description: description || "Saya mencari tukang profesional untuk menyelesaikan perbaikan.",
      location,
      duration,
      budget: budget ? `Rp ${parseInt(budget).toLocaleString('id-ID')}` : 'Negosiasi'
    });
    setTransactionStep('matching');
  };

  const handleSelectCandidate = (candidate: WorkerProfile) => {
    setSelectedWorker(candidate);
  };

  const handleSendProposal = () => {
    setShowEscrowModal(true);
  };

  const confirmEscrowPayment = () => {
    setShowEscrowModal(false);
    setTransactionStep('proposal_sent');
    // In a real flow, the app redirects to waiting. Let's trigger simulated acceptance after some seconds.
    setTimeout(() => {
      // Auto transition inside simulation
    }, 1000);
  };

  const toggleAspect = (aspect: string) => {
    if (aspects.includes(aspect)) {
      setAspects(aspects.filter(a => a !== aspect));
    } else {
      setAspects([...aspects, aspect]);
    }
  };

  const formatRupiah = (val: string) => {
    const number = val.replace(/[^0-9]/g, '');
    return number;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F0F2F5] text-neutral-900 h-full overflow-hidden font-sans text-xs relative">
      {/* Main Content Area (Antd v3 styled background and card layout) */}
      <div className="flex-1 flex flex-col overflow-y-auto relative bg-[#f0f2f5] min-h-full pb-24">
        
        {/* TOP COMPACT STATUS BAR with Logo and User Info */}
        <div className="bg-white border-b border-[#e8e8e8] px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
          <KerjantaraLogo iconSize={18} textSize="text-xs" />
          
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></span>
              <span className="text-[9px] text-[#2f54eb] font-semibold bg-[#f0f5ff] border border-[#adc6ff] px-1 py-0.2 rounded font-sans uppercase">virt-sync</span>
            </div>
            
            <div className="h-4 w-px bg-neutral-200"></div>
            
            <div className="flex items-center gap-1.5 font-sans">
              <div className="w-5 h-5 rounded-full bg-[#1890ff] text-white flex items-center justify-center font-bold text-[9px]">
                {userName.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-[10px] font-semibold text-neutral-600 max-w-[80px] lg:max-w-[120px] truncate">{userName}</span>
            </div>
            
            <span className="text-[9px] text-primary bg-[#e6f7ff] border border-[#91d5ff] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
              Klien
            </span>
          </div>
        </div>

        {/* INTERACTIVE DEMO ALARM WIDGET FOR CONVENIENCE */}
        {transactionStep === 'proposal_sent' && (
          <div className="m-3 p-3 bg-blue-50 border border-blue-200 rounded-lg shadow-sm flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <AlertTriangle className="text-[#1890ff] shrink-0 mt-0.5" size={16} />
              <p className="text-[11px] text-[#003a8c] leading-snug">
                <strong>💡 Info Demo Simulasi:</strong> Tawaran Anda telah dikirim! Kini beralihlah ke <strong>Sisi Pekerja</strong> di menu simulator atas untuk memeriksa & menerima tawaran ini secara langsung.
              </p>
            </div>
          </div>
        )}

        {/* CONTENT SWITCHING BASED ON TRANSACTION STEP */}
        
        {/* [PK-1] HOME / DASHBOARD PEMBERI KERJA (IDLE) */}
        {transactionStep === 'idle' && (
          <div className="p-4 space-y-4">
            {/* Elegant Header Greeting Card */}
            <div className="bg-gradient-to-r from-[#1890ff] to-[#096dd9] text-white rounded-lg p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
              <p className="text-[10px] text-blue-100 uppercase tracking-wider mb-1 font-semibold">Selamat Datang 👋</p>
              <h2 className="text-lg font-bold mb-1">Halo, {userName || 'Ibu Sari'}</h2>
              <p className="text-[11px] text-blue-100 leading-snug">Cari tenaga terpercaya terdekat dalam hitungan detik. KTP aman terverifikasi.</p>
              
              <div className="mt-4 flex items-center gap-4 text-xs font-semibold">
                <div className="bg-white/15 px-3 py-1.5 rounded-md flex items-center gap-1">
                  <span>✨ KerjantaraScore:</span>
                  <span className="text-warning">⭐ 4.8</span>
                </div>
                <div className="bg-white/15 px-3 py-1.5 rounded-md">
                  💼 2 Pekerjaan Terakhir
                </div>
              </div>
            </div>

            {/* Quick Action Large CTA */}
            <button
              onClick={() => setTransactionStep('creating')}
              className="w-full bg-[#f5a623] hover:bg-[#e0951a] text-neutral-900 h-12 rounded-lg font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Plus size={18} />
              Cari Pekerja Sekarang &rarr;
            </button>

            {/* Reputasi Rating antd card */}
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-2 mb-3 mt-0 flex items-center gap-1.5">
                <Award size={16} className="text-[#1890ff]" />
                Sistem Reputasi Kerjantara
              </h3>
              <div className="flex items-center gap-4">
                <div className="text-center shrink-0">
                  <div className="text-3xl font-extrabold text-neutral-900 leading-none">4.8</div>
                  <div className="flex text-amber-400 mt-1 justify-center">
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-1 font-semibold">2 ulasan diterima</p>
                </div>
                <div className="flex-1 bg-neutral-50 rounded-lg p-3 border border-neutral-100 text-[11px] text-neutral-500 leading-relaxed">
                  "Sangat profesional, menyambut pekerja dengan ramah dan selalu membayar bonus tambahan jika pekerjaan cepat selesai." <br/>
                  <span className="font-semibold text-[#1890ff] mt-1 block">— Pak Baim, Tukang Ledeng</span>
                </div>
              </div>
            </div>

            {/* Simple Antd Table Mockup for Work History */}
            <div className="bg-white border border-[#e8e8e8] rounded-lg shadow-sm">
              <h3 className="font-bold text-neutral-800 border-b border-[#e8e8e8] p-3 mt-0 flex justify-between items-center bg-[#fafafa]">
                <span>Riwayat Transaksi</span>
                <span className="text-xs text-[#1890ff] font-semibold cursor-pointer">Lihat Semua</span>
              </h3>
              <div className="divide-y divide-[#e8e8e8]">
                <div className="p-3 flex justify-between items-center hover:bg-[#fafafa] transition-colors">
                  <div>
                    <p className="font-bold text-neutral-800 text-sm">Pak Baim (Ledeng)</p>
                    <p className="text-neutral-400 text-[10px] mt-0.5">Wastafel bocor · 12 Mei 2026</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-neutral-900">Rp 120.000</div>
                    <span className="text-[10px] text-success bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-bold">SUKSES</span>
                  </div>
                </div>
                <div className="p-3 flex justify-between items-center hover:bg-[#fafafa] transition-colors">
                  <div>
                    <p className="font-bold text-neutral-800 text-sm">Pak Cecep (Taman)</p>
                    <p className="text-neutral-400 text-[10px] mt-0.5">Rapikan kebun depan · 28 April 2026</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-neutral-900">Rp 150.000</div>
                    <span className="text-[10px] text-success bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-bold">SUKSES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* [PK-2] FORM PERMINTAAN PEKERJAAN (CREATING) */}
        {transactionStep === 'creating' && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#e8e8e8] pb-3 mb-4">
                <h3 className="font-bold text-base text-neutral-950 flex items-center gap-1.5 mt-0">
                  Buat Permintaan Baru
                </h3>
                <button 
                  onClick={() => setTransactionStep('idle')}
                  className="text-neutral-400 hover:text-neutral-600 p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {/* 1. Kategori */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Pilih Jenis Pekerjaan</label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((cat, idx) => {
                      const isLainnya = cat.name === 'Lainnya';
                      return (
                        <div
                          key={idx}
                          onClick={() => setCategory(cat.name)}
                          className={`p-3 rounded-lg border-2 text-center cursor-pointer transition-all ${
                            isLainnya ? 'col-span-2 flex items-center justify-center gap-2 py-2.5' : ''
                          } ${
                            category === cat.name
                              ? 'border-[#1890ff] bg-[#e6f7ff]'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className={isLainnya ? 'text-base' : 'text-lg mb-1'}>{cat.icon}</div>
                          <span className="font-bold text-[11px] text-neutral-850">{cat.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Deskripsi */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Detail Masalah (Deskripsi Pekerjaan)</label>
                  <textarea
                    placeholder="Contoh: Saya butuh tukang untuk mengecat kamar tidur ukuran 4x3 meter, warna putih minimalis. Bahan cat sudah saya sediakan..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full text-xs p-3 border border-neutral-300 rounded-[6px] focus:outline-none focus:border-[#1890ff] placeholder:text-neutral-400 text-neutral-900 leading-relaxed"
                  />
                </div>

                {/* 3. Lokasi */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Alamat & Lokasi Pengerjaan</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 text-xs p-2.5 border border-neutral-300 rounded-[6px] focus:outline-none focus:border-[#1890ff]"
                    />
                  </div>
                  <div className="h-20 bg-neutral-100 rounded-md border border-neutral-200 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#e3eae9] flex items-center justify-center text-neutral-400 font-bold opacity-40">Static Map Simulation</div>
                    <MapPin className="text-[#1890ff] animate-bounce z-10" size={24} />
                    <span className="absolute bottom-1 right-2 text-[9px] text-neutral-400 bg-white/70 px-1 rounded">Kebayoran Baru</span>
                  </div>
                </div>

                {/* 4. Durasi */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Rencana Durasi</label>
                  <div className="flex gap-2">
                    {['Setengah hari', 'Satu hari penuh', 'Lebih dari 1 hari'].map((dur, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDuration(dur)}
                        className={`flex-1 py-2 text-[10px] font-bold border rounded-md transition-all ${
                          duration === dur
                            ? 'bg-[#1890ff] border-[#1890ff] text-white'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Anggaran */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Taksiran Anggaran (Rp)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-xs">Rp</div>
                    <input
                      type="tel"
                      value={budget}
                      onChange={(e) => setBudget(formatRupiah(e.target.value))}
                      placeholder="Contoh: 180.000"
                      className="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-neutral-300 rounded-[6px] focus:outline-none focus:border-[#1890ff]"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400 leading-none">Kosongkan bila ingin menegosiasikan harga di tempat</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={handlePostJob}
                  className="w-full bg-[#1890ff] hover:bg-blue-600 text-white py-3 rounded-lg font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-1"
                >
                  Cari Pekerja Sekarang &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* [PK-3] LOADING MATCH (MATCHING) */}
        {transactionStep === 'matching' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-white">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-neutral-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
              <div className="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold">🎯</div>
            </div>
            
            <h3 className="text-base font-bold text-neutral-900 mb-2">Mencocokkan Pekerja Terbaik...</h3>
            <p className="text-neutral-500 text-[11px] max-w-[260px] leading-relaxed mb-6">
              Sistem Kerjantara sedang menyortir data KTP, Kitacode, jarak real-time, dan kecocokan keahlian Anda...
            </p>

            <div className="bg-[#fafafa] border border-neutral-200 rounded-lg p-3 text-left w-full max-w-sm">
              <div className="text-[10px] uppercase font-bold text-[#1890ff] mb-1">Rincian Orderanmu:</div>
              <p className="font-semibold text-xs text-neutral-800">🛠️ Kategori: {category}</p>
              <p className="font-semibold text-xs text-neutral-800">📍 Lokasi: Kebayoran Baru, Jakarta</p>
            </div>
          </div>
        )}

        {/* [PK-4] DAFTAR KANDIDAT & SELECT (KANDIDAT_LIST) */}
        {transactionStep === 'kandidat_list' && (
          <div className="p-4 space-y-4 text-left">
            <div className="border-b border-neutral-200 pb-2">
              <h3 className="font-bold text-sm text-neutral-900 leading-none">3 Kandidat Terbaik Untuk {category}</h3>
              <p className="text-[10px] text-neutral-500 mt-1">Dipilih otomatis berdasarkan verifikasi KTP, jarak terdekat & reputasi gemilang.</p>
            </div>

            {/* Filter Kepribadian (Personality Filters) */}
            <div className="space-y-1.5 bg-neutral-50/70 p-2.5 rounded-lg border border-neutral-200/60 shadow-xs">
              <span className="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">
                🔍 Filter Kepribadian (KerjantaraScore Verified):
              </span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
                {["Semua", "Sangat Teliti", "Sopan & Ramah", "Tepat Waktu", "Inisiatif Tinggi", "Cepat & Sigap", "Pendiam / Fokus"].map((trait) => (
                  <button
                    key={trait}
                    onClick={() => setSelectedPersonality(trait)}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide whitespace-nowrap border shrink-0 transition-all cursor-pointer ${
                      selectedPersonality === trait
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {trait === 'Semua' ? '🌟 Semua Kepribadian' : `🤝 ${trait}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {candidates
                .filter(cand => selectedPersonality === 'Semua' || cand.personalityFilters?.includes(selectedPersonality))
                .map((cand, idx) => {
                  const isSelected = selectedWorker?.name === cand.name;
                  return (
                    <div
                      key={idx}
                      className={`bg-white rounded-lg border-2 p-4 transition-all relative ${
                        isSelected ? 'border-[#1890ff] bg-[#e6f7ff]/20 shadow-md' : 'border-[#e8e8e8] shadow-sm'
                      }`}
                    >
                      {idx === 0 && (
                        <div className="absolute -top-2.5 right-4 bg-amber-400 text-neutral-900 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm border border-white">
                          ⭐ REKOMENDASI TERBAIK
                        </div>
                      )}
                      
                      <div className="flex gap-3">
                        <img src={cand.avatar} alt="Avatar" className="w-[48px] h-[48px] rounded-full object-cover border border-neutral-200" />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-xs text-neutral-900 leading-none mb-1">{cand.name}</h4>
                              <div className="flex items-center gap-1.5">
                                <span className="text-warning font-extrabold flex items-center text-[10px]">⭐ {cand.rating}</span>
                                <span className="text-neutral-400">·</span>
                                <span className="text-[10px] text-neutral-500 font-semibold">{cand.completedJobs} Pesanan Selesai</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{cand.distance}</span>
                            </div>
                          </div>

                          {/* Profil Singkat (Short Bio) */}
                          <div className="mt-2 text-[10px] text-neutral-600 bg-neutral-50/70 p-2.5 border-l-2 border-neutral-300 rounded-r-md leading-relaxed">
                            <span className="font-extrabold text-neutral-800 uppercase text-[9px] block mb-0.5">Profil Singkat:</span>
                            {cand.bio}
                          </div>

                          {/* Verified Personality Labels */}
                          {cand.personalityFilters && cand.personalityFilters.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {cand.personalityFilters.map((trait, tIdx) => (
                                <span 
                                  key={tIdx} 
                                  className="bg-amber-400/10 text-amber-800 border border-amber-400/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-flex items-center gap-0.5"
                                  title="Verified via KerjantaraScore reviews"
                                >
                                  ⭐ {trait}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Specs chip list */}
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {cand.skills.map((skill, sIdx) => (
                              <span key={sIdx} className="bg-neutral-100 text-neutral-600 border border-neutral-200 px-1.5 py-0.5 rounded text-[9px] font-semibold">{skill}</span>
                            ))}
                          </div>

                          <div className="mt-3.5 pt-3 border-t border-[#e8e8e8] flex justify-between items-center bg-[#fafafa] -mx-4 -mb-4 px-4 py-2.5 rounded-b-lg">
                            <div>
                              <span className="text-[10px] text-neutral-400 block leading-none mb-1">Estimasi Harga</span>
                              <span className="font-bold text-xs text-neutral-950">{cand.price}</span>
                            </div>
                            <div className="flex gap-1.5">
                              {cand.portfolioBeforeAfter && cand.portfolioBeforeAfter.length > 0 && (
                                <button
                                  onClick={() => setPortfolioWorker(cand)}
                                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[9px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                                >
                                  🖼️ Portofolio
                                </button>
                              )}
                              <button
                                onClick={() => handleSelectCandidate(cand)}
                                className={`px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-success text-white'
                                    : 'bg-[#1890ff] text-white hover:bg-blue-600'
                                }`}
                              >
                                {isSelected ? 'Terpilih ✓' : 'Pilih'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

              {candidates.filter(cand => selectedPersonality === 'Semua' || cand.personalityFilters?.includes(selectedPersonality)).length === 0 && (
                <div className="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
                  <span className="text-2xl block mb-2">🔍</span>
                  <p className="text-xs font-bold text-neutral-700">Tidak ada pekerja ditemukan</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Belum ada pekerja di sekitarmu yang terverifikasi membawa sifat "{selectedPersonality}" saat ini.</p>
                </div>
              )}
            </div>

            <div className="h-24"></div>
          </div>
        )}

        {/* [PK-5] WAITING ACCEPTANCE (PROPOSAL_SENT) */}
        {transactionStep === 'proposal_sent' && selectedWorker && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-sm">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4 animate-pulse">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 leading-none mb-1.5">Tawaranmu Telah Dikirim</h3>
              <p className="text-neutral-500 text-[11px] leading-relaxed mb-4">
                Sedang menunggu konfirmasi terima dari <strong>{selectedWorker.name}</strong>. Estimasi tersisa 02:59 detik.
              </p>

              {/* Loader Countdown */}
              <div className="w-full bg-neutral-100 rounded-full h-1.5">
                <div className="bg-amber-400 h-1.5 rounded-full animate-pulse" style={{ width: '65%' }}></div>
              </div>

              {/* Summary card info */}
              <div className="mt-5 border-t border-[#e8e8e8] pt-4.5 text-left space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pekerja:</span>
                  <span className="font-bold text-neutral-900">{selectedWorker.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Pekerjaan:</span>
                  <span className="font-bold text-neutral-900">{category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400 font-medium">Tarif Kisaran:</span>
                  <span className="font-extrabold text-neutral-900">{selectedWorker.price}</span>
                </div>
              </div>

              <div className="mt-5 flex gap-2.5 justify-center">
                <button
                  onClick={onOpenChat}
                  className="flex-1 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 py-2 rounded-md font-bold text-[10px] flex items-center justify-center gap-1"
                >
                  <MessageSquare size={14} /> Hubungi Chat
                </button>
                <button
                  onClick={() => setTransactionStep('idle')}
                  className="flex-1 bg-[#fff5f5] text-red-600 hover:bg-red-100 py-2 rounded-md font-bold text-[10px] flex items-center justify-center gap-1 border border-red-200"
                >
                  Batalkan Pencarian
                </button>
              </div>
            </div>
          </div>
        )}

        {/* [PK-6] MONITORING WORKER (ACCEPTED / ARRIVED / WORKING / SUBMITTING_PROOF / WAITING_APPROVAL) */}
        {(transactionStep === 'accepted' || transactionStep === 'arrived' || transactionStep === 'working' || transactionStep === 'submitting_proof' || transactionStep === 'waiting_approval') && selectedWorker && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg shadow-sm">
              <div className="px-3.5 py-2.5 bg-neutral-50 border-b border-[#e8e8e8] flex justify-between items-center rounded-t-lg">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
                  <span className="font-bold text-[11px] text-green-700">Pekerjaan Sedang Dipantau</span>
                </div>
                <span className="text-[10px] font-semibold text-[#1890ff] bg-[#e6f7ff] whitespace-nowrap px-1.5 py-0.5 rounded uppercase border border-[#91d5ff]">
                  {transactionStep === 'accepted' && 'OTW Lokasi'}
                  {transactionStep === 'arrived' && 'Tiba di Lokasi'}
                  {transactionStep === 'working' && 'Sedang Mengerjakan'}
                  {transactionStep === 'submitting_proof' && 'Penyelesaian Bukti'}
                  {transactionStep === 'waiting_approval' && 'Review Hasil'}
                </span>
              </div>

              <div className="p-4 space-y-4">
                {/* Worker headinfo */}
                <div className="flex gap-3 items-center">
                  <img src={selectedWorker.avatar} alt="Selected" className="w-[44px] h-[44px] rounded-full object-cover border" />
                  <div className="flex-1">
                    <h4 className="font-bold text-xs text-neutral-900 leading-none mb-1">{selectedWorker.name}</h4>
                    <p className="text-[10px] text-neutral-400 font-semibold">Tukang Cat Profesional Terverifikasi</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={onOpenChat} className="p-2 border rounded-full text-[#1890ff] bg-[#e6f7ff] border-[#1890ff]/30 hover:bg-blue-50">
                      <MessageSquare size={16} />
                    </button>
                    <a href="tel:0812" className="p-2 border rounded-full text-neutral-600 bg-neutral-50 hover:bg-neutral-100">
                      <Phone size={16} />
                    </a>
                  </div>
                </div>

                {/* Progress bar tracking (4 steps: OTW -> ARRIVED -> WORK -> WAITING APPROVAL) */}
                <div className="bg-neutral-50 border border-neutral-200.5 rounded-lg p-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 mb-1">
                    <span className={transactionStep === 'accepted' ? 'text-primary' : 'text-success'}>Perjalanan</span>
                    <span className={(transactionStep === 'arrived') ? 'text-primary' : (transactionStep === 'working' || transactionStep === 'waiting_approval') ? 'text-success' : ''}>Sudah Tiba</span>
                    <span className={transactionStep === 'working' ? 'text-primary' : (transactionStep === 'waiting_approval') ? 'text-success' : ''}>Bekerja</span>
                    <span className={transactionStep === 'waiting_approval' ? 'text-primary font-bold' : ''}>Tinjau</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-l-full ${transactionStep === 'accepted' ? 'bg-[#1890ff] animate-pulse' : 'bg-success'}`}></div>
                    <div className={`h-full ${(transactionStep === 'arrived') ? 'bg-[#1890ff] animate-pulse' : (transactionStep === 'working' || transactionStep === 'waiting_approval') ? 'bg-success' : 'bg-neutral-200'}`}></div>
                    <div className={`h-full ${transactionStep === 'working' ? 'bg-[#1890ff] animate-pulse' : (transactionStep === 'waiting_approval') ? 'bg-success' : 'bg-neutral-200'}`}></div>
                    <div className={`h-full ${transactionStep === 'waiting_approval' ? 'bg-[#1890ff]' : 'bg-neutral-200'}`}></div>
                  </div>
                </div>

                {/* Simulated Real Map Navigation Tracking */}
                {(transactionStep === 'accepted') && (
                  <div className="h-28 bg-[#dbeafe] rounded-lg border border-blue-200 flex flex-col justify-between p-3 overflow-hidden relative">
                    <div className="absolute top-2 left-2 bg-white/80 backdrop-blur border border-blue-300 text-[10px] font-bold text-blue-800 px-2.5 py-0.5 rounded-full shadow-sm">
                      📍 Sedang OTW · estimasi tiba: 4 menit
                    </div>
                    {/* SVG map visual animation mockup */}
                    <svg className="absolute inset-0 w-full h-full text-blue-300 opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M 0,50 Q 25,10 50,50 T 100,50" fill="none" stroke="currentColor" strokeWidth="6" />
                      <path d="M 30,0 L 30,100 M 70,0 L 70,100" fill="none" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <div className="absolute top-1/2 left-1/4 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow animate-bounce"></div>
                    <div className="absolute top-[40%] right-1/4 w-3 h-3 bg-red-600 rounded-full border border-white shadow"></div>
                    <div className="text-[10px] text-neutral-500 font-semibold mt-auto z-10 bg-white/50 px-1 py-0.5 rounded self-start">Jarak Tersisa: 450 meter</div>
                  </div>
                )}

                {/* WORKING & TIMER */}
                {transactionStep === 'working' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Durasi Aktif Mengerjakan</span>
                    <div className="text-2xl font-mono font-extrabold text-[#1a202c] leading-tight my-1">
                      01:14:26
                    </div>
                    <p className="text-[10px] text-neutral-500">Mulai bekerja sejak pukul 10:05 WIB</p>
                  </div>
                )}

                {/* WAITING APPROVAL SCREEN FROM WORKER Selesai */}
                {transactionStep === 'waiting_approval' && (
                  <div className="space-y-3.5 bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="text-center">
                      <h4 className="font-bold text-xs text-green-800 mb-1 mt-0">Pekerjaan Selesai & Menunggu Konfirmasimu</h4>
                      <p className="text-[10px] text-green-700 leading-relaxed">Pak {selectedWorker.name} sudah menyatakan pekerjaan selesai secara resmi.</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-neutral-500 block uppercase">Unggulan Bukti Foto:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-24 bg-neutral-100 rounded border overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=60" alt="bukti 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="h-24 bg-neutral-100 rounded border overflow-hidden">
                          <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&auto=format&fit=crop&q=60" alt="bukti 2" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded border text-[11px] text-neutral-600 leading-snug">
                      <strong>Catatan Pekerja:</strong> "Sudah saya cat ulang 2 lapis rapi Bu, semua sisa sampah dan cat juga sudah dibereskan kembali seperti semula. Terima kasih!"
                    </div>

                    {/* TWO DECISION BUTTONS FOR EMPLOYER */}
                    <div className="pt-2 flex flex-col gap-2">
                      <button
                        onClick={() => setTransactionStep('done')}
                        className="w-full py-2.5 bg-success hover:bg-green-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1.5"
                      >
                        <Award size={14} /> Setujui & Lepas Dana ({selectedWorker?.price})
                      </button>
                      <button
                        onClick={onOpenDispute}
                        className="w-full py-2 bg-white hover:bg-neutral-50 border border-neutral-300 text-red-600 font-bold rounded-md text-[10px] uppercase tracking-wide flex items-center justify-center gap-1"
                      >
                        <ShieldAlert size={14} /> Ada Masalah? Lapor Dispute
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <button
              onClick={onOpenDispute}
              className="w-full text-center text-red-500 font-bold hover:underline py-1 mt-4"
            >
              Laporkan Masalah Pekerjaan (Dispute Ticket)
            </button>
          </div>
        )}

        {/* [PK-7] BERI RATING & SELESAI (DONE) */}
        {transactionStep === 'done' && selectedWorker && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-sm">
              {!submittedRating ? (
                <div className="space-y-5">
                  <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-neutral-900 leading-none mb-1">Pekerjaan Selesai!</h3>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">Terima kasih atas kerja samamu dengan Pak {selectedWorker.name}. Pembayaran telah berhasil dikirim ke dompetnya.</p>
                  </div>

                  <div className="border-t border-b border-[#e8e8e8] py-4">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Beri Ulasan Bintang Anda</span>
                    <div className="flex gap-1.5 justify-center mt-1">
                      {[1, 2, 3, 4, 5].map((starIdx) => (
                        <button
                          key={starIdx}
                          type="button"
                          onClick={() => setStarCount(starIdx)}
                          className={`text-2xl transition-transform hover:scale-110 ${
                            starCount >= starIdx ? 'text-amber-400' : 'text-neutral-200'
                          }`}
                        >
                          <Star size={24} fill={starCount >= starIdx ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-amber-500 font-bold mt-1 block h-4">
                      {starCount === 5 && 'Luar biasa! (Sangat Puas)'}
                      {starCount === 4 && 'Sangat Baik (Puas)'}
                      {starCount === 3 && 'Cukup Memuaskan'}
                      {starCount === 2 && 'Mengecewakan'}
                      {starCount === 1 && 'Sangat Buruk'}
                    </span>
                  </div>

                  {/* Multiselect Aspects */}
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-bold text-neutral-600 block uppercase">Pilih Aspek Terbaik:</span>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {["Tepat Waktu", "Sangat Rapi", "Ramah & Sopan", "Komunikatif", "Bersih", "Harga Sesuai"].map((item, idx) => {
                        const hasSelected = aspects.includes(item);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleAspect(item)}
                            className={`px-2.5 py-1 text-[10px] font-semibold border-2 rounded-full cursor-pointer transition-all ${
                              hasSelected
                                ? 'bg-primary border-primary text-white font-bold'
                                : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                            }`}
                          >
                            {item}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Textarea ulasan */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase">Ulasan Tertulis (Opsional)</label>
                    <textarea
                      placeholder="Contoh: Pak Budi kerjanya cepat, rapi, dan bersih sekali sesudah mengecat. Sangat saya rekomendasikan!"
                      value={reviewInput}
                      onChange={(e) => setReviewInput(e.target.value)}
                      rows={2}
                      className="w-full text-xs p-3 border border-neutral-300 rounded focus:outline-none focus:border-[#1890ff] placeholder:text-neutral-400 text-neutral-900 leading-relaxed"
                    />
                  </div>

                  <button
                    onClick={() => setSubmittedRating(true)}
                    className="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow"
                  >
                    Kirim Ulasan Bintang &rarr;
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto animate-bounce">
                    🎉
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-neutral-900 leading-none mb-1">Matur Nuwun / Terima Kasih!</h3>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">Ulasan Anda membantu menjaga reputasi ekosistem Kerjantara.id & menaikkan KerjantaraScore pekerja.</p>
                  </div>

                  <div className="bg-[#fafafa] border border-neutral-100 rounded-lg p-3.5 space-y-2 text-left">
                    <div className="flex gap-1.5 items-center">
                      <span className="font-bold text-neutral-700 text-[11px]">Ulasan Anda:</span>
                      <div className="flex text-amber-400">
                        {Array.from({ length: starCount }).map((_, i) => (
                          <Star key={i} size={11} fill="currentColor" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-600 italic">"{reviewInput || 'Bintang 5 diberikan!'}"</p>
                  </div>

                  {/* Reset Transaction to restart simulation */}
                  <div className="pt-3">
                    <button
                      onClick={onRestartTransaction}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow"
                    >
                      Buka Permintaan Baru (Reset Simulasi)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* FLOATING ACTION BOTTOM BAR / BAR NOTIFIKASI (Antd v3 Styled, Mobile-Friendly) */}
      {transactionStep === 'kandidat_list' && selectedWorker ? (
        <div className="absolute bottom-4 left-4 right-4 z-45 bg-[#ffffff]/98 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,10,32,0.18)] border border-neutral-200/90 py-2.5 px-3.5 flex items-center justify-between gap-3 max-w-sm sm:max-w-xl mx-auto transition-all animate-fade-in-up">
          <div className="text-left min-w-0 flex-1">
            <span className="text-[9px] text-[#1890ff] font-bold uppercase tracking-wider block leading-none">Calon Terpilih</span>
            <p className="font-extrabold text-xs text-neutral-900 truncate leading-tight mt-1">{selectedWorker.name}</p>
            <p className="text-[9px] text-neutral-500 font-medium leading-none mt-1">
              Estimasi: <span className="font-semibold text-neutral-800">{selectedWorker.price}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSelectedWorker(null)}
              className="px-2.5 py-1.5 bg-[#f5f5f5] hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 border border-neutral-300 font-bold rounded text-[9px] uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap"
            >
              Batal
            </button>
            <button
              onClick={handleSendProposal}
              className="bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-[9px] px-3.5 py-1.5 rounded shadow-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
            >
              Hubungi & Konfirmasi &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-4 left-4 right-4 z-40 bg-[#001529]/95 backdrop-blur-md text-white rounded-xl shadow-[0_8px_24px_rgba(0,10,30,0.25)] border border-white/10 py-1.5 px-3 flex items-center justify-around max-w-sm sm:max-w-md mx-auto">
          {/* Beranda Button */}
          <button
            onClick={() => { setActiveMenu('beranda'); if (transactionStep === 'creating') setTransactionStep('idle'); }}
            className={`flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative ${
              activeMenu === 'beranda' && transactionStep !== 'creating'
                ? 'text-[#1890ff] scale-105'
                : 'text-[#ffffffa6] hover:text-white'
            }`}
          >
            <FileText size={16} />
            <span className="text-[9px] font-bold tracking-tight font-sans">Beranda</span>
            {activeMenu === 'beranda' && transactionStep !== 'creating' && (
              <div className="absolute bottom-0 w-3 h-0.5 bg-[#1890ff] rounded-full"></div>
            )}
          </button>
          
          {/* Buat Kerja Button */}
          <button
            onClick={() => { setActiveMenu('permintaan'); setTransactionStep('creating'); }}
            className={`flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative ${
              transactionStep === 'creating'
                ? 'text-[#1890ff] scale-105'
                : 'text-[#ffffffa6] hover:text-white'
            }`}
          >
            <Plus size={16} />
            <span className="text-[9px] font-bold tracking-tight font-sans">Buat Kerja</span>
            {transactionStep === 'creating' && (
              <div className="absolute bottom-0 w-3 h-0.5 bg-[#1890ff] rounded-full"></div>
            )}
          </button>
          
          {/* Pantau Kerja Button */}
          <button
            onClick={() => {
              if (transactionStep !== 'idle' && transactionStep !== 'creating') {
                setActiveMenu('pekerja');
              } else {
                alert("Belum ada pekerjaan berjalan. Buat permintaan pekerjaan dahulu!");
              }
            }}
            disabled={transactionStep === 'idle' || transactionStep === 'creating'}
            className={`flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative ${
              transactionStep !== 'idle' && transactionStep !== 'creating' && activeMenu === 'pekerja'
                ? 'text-[#1890ff] scale-105'
                : (transactionStep === 'idle' || transactionStep === 'creating')
                  ? 'text-[#ffffff25] cursor-not-allowed'
                  : 'text-[#ffffffa6] hover:text-white'
            }`}
          >
            <Play size={16} />
            <span className="text-[9px] font-bold tracking-tight font-sans">Pantau</span>
            {transactionStep !== 'idle' && transactionStep !== 'creating' && activeMenu === 'pekerja' && (
              <div className="absolute bottom-0 w-3 h-0.5 bg-[#1890ff] rounded-full"></div>
            )}
          </button>

          {/* Chat Live Button */}
          {(transactionStep !== 'idle' && transactionStep !== 'creating') && (
            <button
              onClick={onOpenChat}
              className="flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md text-[#ffffffa6] hover:text-white transition-all"
            >
              <MessageSquare size={16} />
              <span className="text-[9px] font-bold tracking-tight font-sans">Chat Live</span>
            </button>
          )}
        </div>
      )}

      {/* VISUAL PORTFOLIO MODAL (Before-After & Side-Gig Proof) */}
      {portfolioWorker && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-all p-3 animate-fade-in animate-duration-200">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-t-2xl rounded-b-xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200/90 max-h-[85%] animate-slide-up text-left">
            <header className="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">📸</span>
                <div className="text-left font-sans">
                  <h4 className="font-extrabold text-xs text-white leading-none">Portofolio Pekerjaan</h4>
                  <span className="text-[9px] text-amber-100 leading-none block mt-0.5">Bukti Penyelesaian Side-Gig Terverifikasi</span>
                </div>
              </div>
              <button 
                onClick={() => setPortfolioWorker(null)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2 p-1.5 bg-neutral-50 rounded-lg border border-neutral-150">
                  <img src={portfolioWorker.avatar} alt="Worker" className="w-8 h-8 rounded-full object-cover border" />
                  <div className="font-sans text-left">
                    <p className="font-extrabold text-[11px] text-neutral-800 leading-none">{portfolioWorker.name}</p>
                    <p className="text-[9px] text-neutral-500 leading-none mt-1">⭐ {portfolioWorker.rating} · {portfolioWorker.completedJobs} Proyek Berhasil</p>
                  </div>
                </div>
                
                <p className="text-[10px] text-neutral-500 leading-relaxed mb-3">
                  Berikut hasil pengerjaan nyata yang diunggah oleh <strong>{portfolioWorker.name}</strong> dan telah divalidasi oleh sistem review foto sebelum-sesudah Kerjantara.id:
                </p>

                {portfolioWorker.portfolioBeforeAfter?.map((item, pIdx) => (
                  <div key={pIdx} className="space-y-2 bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100">
                    <span className="text-[9px] bg-amber-400/20 text-amber-900 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide inline-block leading-none">
                      📌 {item.title}
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      {/* Before frame */}
                      <div className="relative rounded-lg overflow-hidden border border-red-200 shadow-sm bg-neutral-100">
                        <img src={item.before} alt="Sebelum" className="w-full h-28 object-cover" />
                        <div className="absolute top-1.5 left-1.5 bg-red-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase leading-none shadow-sm">
                          SEBELUM
                        </div>
                      </div>

                      {/* After frame */}
                      <div className="relative rounded-lg overflow-hidden border border-green-200 shadow-sm bg-neutral-100">
                        <img src={item.after} alt="Sesudah" className="w-full h-28 object-cover" />
                        <div className="absolute top-1.5 left-1.5 bg-green-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase leading-none shadow-sm animate-pulse">
                          SESUDAH ✨
                        </div>
                      </div>
                    </div>

                    <div className="text-[9px] text-neutral-550 leading-relaxed bg-white border border-neutral-150 p-2 rounded-lg italic">
                      💬 <strong className="text-neutral-700 not-italic uppercase text-[8px]">Ulasan Rekan Klien:</strong> "Sangat puas dengan hasilnya. Dinding rembes tuntas diatasi dan kembali rapi seperti baru!"
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="p-3 border-t border-neutral-100 bg-neutral-50 flex gap-2">
              <button 
                onClick={() => setPortfolioWorker(null)}
                className="flex-1 py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-md transition-colors cursor-pointer"
              >
                Tutup Portofolio
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* ESCROW PAYMENT MODAL */}
      {showEscrowModal && selectedWorker && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-all p-3 animate-fade-in">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-t-2xl rounded-b-xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200/90 animate-slide-up text-left">
            <header className="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-[#1890ff]" />
                <h4 className="font-extrabold text-sm text-white tracking-wide">Pengaktifan Rekening Bersama</h4>
              </div>
              <button 
                onClick={() => setShowEscrowModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </header>

            <div className="p-5 space-y-4">
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                Platform menggunakan sistem <strong>Escrow (Rekening Bersama)</strong>. Dana Anda akan diamankan oleh Kerjantara.id dan <strong>baru diteruskan ke pekerja setelah Anda menyetujui hasil pekerjaannya</strong>.
              </p>

              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-50">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">Pekerja:</span>
                  <span className="text-[11px] font-extrabold text-neutral-900">{selectedWorker.name}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border border-blue-50">
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">Estimasi Biaya:</span>
                  <span className="text-[11px] font-extrabold text-[#1890ff]">{selectedWorker.price}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded p-3 text-[10px] text-amber-800 flex items-start gap-2">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span className="leading-relaxed">Jika pekerja batal atau Anda tidak puas dengan hasilnya, dana dapat ditarik kembali 100% melalui Dispute Resolution secara otomatis.</span>
              </div>
            </div>

            <footer className="p-4 border-t border-neutral-100 bg-neutral-50 flex flex-col gap-2">
              <button 
                onClick={confirmEscrowPayment}
                className="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-lg text-xs uppercase tracking-wide shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldAlert size={14} /> Setor Dana ke Escrow
              </button>
              <button 
                onClick={() => setShowEscrowModal(false)}
                className="w-full py-2 bg-transparent text-neutral-500 hover:text-neutral-700 font-bold rounded-lg text-[10px] uppercase tracking-wide cursor-pointer"
              >
                Kembali
              </button>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
}
