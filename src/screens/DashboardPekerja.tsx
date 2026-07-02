import React, { useState, useEffect } from 'react';
import { 
  Check, Play, ArrowRight, MessageSquare, Phone, MapPin, Clock, Camera, 
  Trash2, ShieldAlert, Award, TrendingUp, AlertCircle, RefreshCw, Star, X
} from 'lucide-react';
import { JobRequest, WorkerProfile, TransactionStep } from '../types';
import KerjantaraLogo from '../components/KerjantaraLogo';

interface DashboardPekerjaProps {
  userName: string;
  transactionStep: TransactionStep;
  setTransactionStep: (step: TransactionStep) => void;
  jobRequest: JobRequest;
  selectedWorker: WorkerProfile | null;
  onOpenChat: () => void;
  onOpenDispute: () => void;
  onRestartTransaction: () => void;
}

export default function DashboardPekerja({
  userName,
  transactionStep,
  setTransactionStep,
  jobRequest,
  selectedWorker,
  onOpenChat,
  onOpenDispute,
  onRestartTransaction
}: DashboardPekerjaProps) {
  
  // Antd v3 layout states
  const [activeMenu, setActiveMenu] = useState<'beranda' | 'dompet' | 'riwayat'>('beranda');
  
  // Gamification states
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [activeScoreSubTab, setActiveScoreSubTab] = useState<'progress' | 'badges' | 'metrics'>('progress');

  // Worker Profile & Portfolio States
  const [workerBio, setWorkerBio] = useState('Spesialis tukang cat interior dengan pengalaman 8 tahun. Ahli mengatasi rembesan air pada dinding, plesteran retak rambut, hingga pengecatan rapi 3 lapis.');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBioInput, setTempBioInput] = useState('Spesialis tukang cat interior dengan pengalaman 8 tahun. Ahli mengatasi rembesan air pada dinding, plesteran retak rambut, hingga pengecatan rapi 3 lapis.');
  const [workerTraits, setWorkerTraits] = useState<string[]>(['Sangat Teliti', 'Sopan & Ramah', 'Tepat Waktu']);
  const [portfolioList, setPortfolioList] = useState([
    {
      title: "Restorasi Dinding Rembes & Berjamur",
      before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
      after: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&auto=format&fit=crop&q=80"
    }
  ]);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  // Simulation states
  const [isActive, setIsActive] = useState(true); // Availability Toggle
  const [walletBalance, setWalletBalance] = useState(1250000);
  const [countdown, setCountdown] = useState(179); // 3 menit countdown
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [proofPhotos, setProofPhotos] = useState<string[]>([]);
  const [workerNote, setWorkerNote] = useState('');
  const [isDoneConfirmed, setIsDoneConfirmed] = useState(false);
  const [payoutReceived, setPayoutReceived] = useState(false);
  const [showPayoutAnim, setShowPayoutAnim] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (transactionStep === 'done' && !payoutReceived && selectedWorker) {
      // Simulate reading price, e.g., "Rp 200.000 - 250.000". Let's parse base.
      const parsedPrice = parseInt(selectedWorker.price.replace(/[^\d]/g, '').slice(0, -5) + "000");
      const addedAmount = !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : 200000;
      
      setPayoutReceived(true);
      setShowPayoutAnim(true);
      timer = setTimeout(() => {
        setWalletBalance(prev => prev + addedAmount);
      }, 500); // 0.5s delay for animation to start
      
      setTimeout(() => setShowPayoutAnim(false), 4500);
    }
    return () => clearTimeout(timer);
  }, [transactionStep, payoutReceived, selectedWorker]);

  // Countdown timer for PW-2 / PW-3
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (transactionStep === 'proposal_sent' && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [transactionStep, countdown]);

  // Adjust balance when work reaches done
  useEffect(() => {
    if (transactionStep === 'done') {
      setWalletBalance(1425000); // 1.250.000 + 175.000 rupiah
    }
  }, [transactionStep]);

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleAcceptProposal = () => {
    setTransactionStep('accepted');
  };

  const handleUploadPhoto = () => {
    // Simulated upload of current image
    const dummyImgs = [
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&auto=format&fit=crop&q=60"
    ];
    if (proofPhotos.length < 2) {
      setProofPhotos([...proofPhotos, dummyImgs[proofPhotos.length]]);
    }
  };

  const handleDeletePhoto = (idx: number) => {
    setProofPhotos(proofPhotos.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F0F2F5] text-neutral-900 h-full overflow-hidden font-sans text-xs relative">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-[#f0f2f5] relative min-h-full pb-24">
        
        {/* TOP COMPACT STATUS BAR with Logo and User Info */}
        <div className="bg-white border-b border-[#e8e8e8] px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
          <KerjantaraLogo iconSize={18} textSize="text-xs" />
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-success animate-pulse' : 'bg-neutral-300'}`}></span>
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wide">
                {isActive ? 'AKTIF' : 'OFFLINE'}
              </span>
            </div>
            
            <div className="h-4 w-px bg-neutral-200"></div>
            
            <div className="flex items-center gap-1.5 font-sans">
              <div className="w-5 h-5 rounded-full bg-[#f5a623] text-neutral-900 flex items-center justify-center font-bold text-[9px]">
                PB
              </div>
              <span className="text-[10px] font-semibold text-neutral-600">Pak Budi</span>
            </div>
            
            <span className="text-[9px] text-amber-700 bg-[#fffbe6] border border-[#ffe58f] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
              Mitra
            </span>
          </div>
        </div>

        {/* DEMO TOOLTIPS FOR CONVENIENCE */}
        {transactionStep === 'idle' && (
          <div className="m-3 p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm flex flex-col gap-1 text-amber-800">
            <div className="flex items-start gap-1.5">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <p className="text-[11px] leading-snug">
                <strong>Panduan Simulasi Demo:</strong> Saat ini belum ada tawaran pekerjaan. Cobalah beralih ke <strong>Sisi Pemberi Kerja</strong> terlebih dahulu untuk mempublikasikan permintaan "Tukang Cat" yang baru!
              </p>
            </div>
          </div>
        )}

        {/* [PW-1] HOME / DASHBOARD PEKERJA */}
        {transactionStep === 'idle' && activeMenu === 'beranda' && (
          <div className="p-4 space-y-4">
            {/* Top Interactive Switch Box */}
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-neutral-900 leading-tight mb-0.5">Status Kehadiranmu</h4>
                <p className="text-[10px] text-neutral-400">Aktifkan agar pemberi kerja terdekat bisa merekrutmu.</p>
              </div>
              {/* Antd Switch style Mockup */}
              <button
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6 flex items-center rounded-full p-0.5 transition-all focus:outline-none ${
                  isActive ? 'bg-success' : 'bg-neutral-300'
                }`}
              >
                <div
                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-all ${
                    isActive ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>

            {/* Reputation Card (KerjantaraScore) */}
            <div 
              onClick={() => setShowScoreModal(true)}
              className="bg-gradient-to-br from-[#111215] via-[#181a20] to-[#0d0e11] text-white rounded-xl p-5 shadow-lg border border-neutral-800 relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-[9px] text-[#40a9ff] font-extrabold uppercase tracking-widest leading-none mb-1">Reputasi & Level</p>
                  <h3 className="text-sm font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider leading-none mt-0">
                    🥇 Level 4: Gold Worker
                  </h3>
                </div>
                <span className="bg-amber-400/15 text-amber-400 border border-amber-400/35 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Verified
                </span>
              </div>

              {/* Mini progress bar on card */}
              <div className="mt-3.5 mb-3.5">
                <div className="flex justify-between text-[9px] text-neutral-400 font-bold mb-1">
                  <span>Progres ke Platinum</span>
                  <span>4.92 / 4.95</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full" style={{ width: '90%' }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-3 text-left">
                <div>
                  <span className="text-[9px] text-neutral-400 block leading-none mb-1">KerjantaraScore:</span>
                  <span className="text-sm font-extrabold flex items-center gap-1 text-white leading-none mt-0.5">
                    ⭐ 4.92 <span className="text-[10px] text-neutral-500 font-bold">/5.0</span>
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block leading-none mb-1">Proyek Selesai:</span>
                  <span className="text-sm font-extrabold text-white leading-none mt-0.5">142 Proyek</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[9px] text-amber-200/90 font-bold border-t border-neutral-800 pt-2">
                <span className="flex items-center gap-1">
                  🎗️ 3 Badge Aktif Terpasang
                </span>
                <span className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5 font-bold transition-colors">
                  Rincian & Badges &rarr;
                </span>
              </div>
            </div>

            {/* Income Quick Summary Box */}
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-2 mb-3 mt-0">KitaDompet</h3>
              <div className="flex justify-between items-center bg-[#fafafa] p-3 rounded-lg border border-neutral-100">
                <div>
                  <span className="text-[10px] text-neutral-400 block leading-none mb-1">Total Saldo Terkumpul:</span>
                  <span className="text-base font-extrabold text-neutral-950">
                    Rp {walletBalance.toLocaleString('id-ID')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMenu('dompet')}
                  className="bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded transition-colors uppercase"
                >
                  Rincian
                </button>
              </div>
            </div>

            {/* PROFILE & PORTFOLIO WRAPPER CHIP */}
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm text-left">
              <h3 className="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-2 mb-3.5 mt-0 flex items-center justify-between">
                <span>👤 Profil & Portofolio Mitra</span>
                <span className="text-[9px] text-[#1890ff] font-extrabold uppercase tracking-wider bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">KerjantaraScore Verified</span>
              </h3>

              {/* SECTION 1: BRIEF BIO */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Profil Singkat (Bio Kamu)</span>
                  {!isEditingBio ? (
                    <button
                      type="button"
                      onClick={() => { setIsEditingBio(true); setTempBioInput(workerBio); }}
                      className="text-[#1890ff] text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
                    >
                      Ubah Rincian
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setWorkerBio(tempBioInput); setIsEditingBio(false); }}
                        className="text-success text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingBio(false)}
                        className="text-neutral-400 text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                </div>

                {!isEditingBio ? (
                  <p className="text-[11px] text-neutral-600 bg-neutral-50/70 p-2.5 border-l-2 border-neutral-400 rounded-r-md leading-relaxed font-sans">
                    {workerBio}
                  </p>
                ) : (
                  <textarea
                    value={tempBioInput}
                    onChange={(e) => setTempBioInput(e.target.value)}
                    rows={3}
                    className="w-full text-[11px] p-2 border border-neutral-300 rounded focus:outline-none focus:border-[#1890ff] text-neutral-800 bg-white leading-relaxed"
                    placeholder="Tulis keahlian dan pengalaman utamamu..."
                  />
                )}
              </div>

              {/* SECTION 2: PERSONALITY TRAITS */}
              <div className="space-y-2 mb-4 pt-3 border-t border-[#f0f0f0]">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Karakter Kerja Terpilih</span>
                <p className="text-[9px] text-neutral-400 mb-2 leading-tight">Pilih hingga 3 kelebihan yang dinilai oleh Klien dalam KerjantaraScore Anda:</p>
                
                <div className="flex flex-wrap gap-1.5">
                  {["Sangat Teliti", "Sopan & Ramah", "Tepat Waktu", "Inisiatif Tinggi", "Cepat & Sigap", "Pendiam / Fokus"].map((trait) => {
                    const isSelected = workerTraits.includes(trait);
                    return (
                      <button
                        key={trait}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setWorkerTraits(workerTraits.filter(t => t !== trait));
                          } else {
                            if (workerTraits.length < 3) {
                              setWorkerTraits([...workerTraits, trait]);
                            } else {
                              alert("Maksimal memilih 3 karakter kerja unggulan.");
                            }
                          }
                        }}
                        className={`px-2 py-1 rounded text-[9px] font-extrabold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400/15 border-amber-400 text-amber-800'
                            : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-305'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{trait}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 3: BEFORE-AFTER PORTFOLIO LIST */}
              <div className="space-y-2 pt-3 border-t border-[#f0f0f0]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                    🖼️ Portofolio Visual (Before-After)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddPortfolio(!showAddPortfolio)}
                    className="text-[#1890ff] text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
                  >
                    {showAddPortfolio ? 'Tutup Form' : 'Tambah Baru +'}
                  </button>
                </div>

                {/* Form to append mock work item */}
                {showAddPortfolio && (
                  <div className="bg-neutral-50/70 p-3 rounded-lg border border-neutral-200 space-y-2.5 my-2 text-[10px]">
                    <span className="font-extrabold text-neutral-700 uppercase tracking-wide block">Rincian Portofolio Baru</span>
                    
                    <div className="space-y-1 text-left">
                      <label className="text-[9px] font-extrabold text-neutral-500 block">Nama / Judul Proyek Side-Gig</label>
                      <input
                        type="text"
                        value={newPortTitle}
                        onChange={(e) => setNewPortTitle(e.target.value)}
                        placeholder="Contoh: Perbaikan Ganti Saringan Bak Mandi"
                        className="w-full text-[10px] p-2 border border-neutral-300 rounded focus:border-[#1890ff] bg-white text-neutral-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2 border border-[#ffe58f] bg-[#fffbe6]/60 rounded">
                        <span className="font-bold text-[8px] text-amber-800 block mb-1">FOTO SEBELUM</span>
                        <div className="text-[18px]">🛖</div>
                        <span className="text-[8px] text-neutral-400 block mt-0.5">Disediakan otomatis</span>
                      </div>
                      <div className="p-2 border border-[#b7eb8f] bg-[#f6ffed]/60 rounded">
                        <span className="font-bold text-[8px] text-green-800 block mb-1">FOTO SESUDAH</span>
                        <div className="text-[18px]">✨🚽</div>
                        <span className="text-[8px] text-neutral-400 block mt-0.5">Disediakan otomatis</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!newPortTitle.trim()) {
                          alert("Harap masukkan judul proyek portofolio!");
                          return;
                        }
                        const newMockItem = {
                          title: newPortTitle,
                          before: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
                          after: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&q=80"
                        };
                        setPortfolioList([newMockItem, ...portfolioList]);
                        setNewPortTitle('');
                        setShowAddPortfolio(false);
                      }}
                      className="w-full py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded text-[9px] uppercase tracking-wide cursor-pointer"
                    >
                      Simpan Portofolio Baru
                    </button>
                  </div>
                )}

                {/* Display items list */}
                <div className="grid grid-cols-1 gap-2.5 mt-2">
                  {portfolioList.map((item, idx) => (
                    <div key={idx} className="p-2 bg-[#fafafa] border border-neutral-200 rounded-lg flex gap-3 relative group">
                      <div className="flex gap-1 shrink-0">
                        {/* before visual block */}
                        <div className="relative text-center">
                          <img src={item.before} alt="Sebelum" className="w-12 h-12 object-cover rounded border border-red-250 animate-fade-in" />
                          <span className="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[6px] font-bold uppercase rounded-b text-center leading-none py-0.5 scale-90">Sebelum</span>
                        </div>
                        {/* after visual block */}
                        <div className="relative text-center">
                          <img src={item.after} alt="Sesudah" className="w-12 h-12 object-cover rounded border border-green-250 animate-fade-in" />
                          <span className="absolute bottom-0 inset-x-0 bg-green-600 text-white text-[6px] font-bold uppercase rounded-b text-center leading-none py-0.5 scale-90">Sesudah</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 pr-6 text-left my-auto">
                        <span className="font-extrabold text-[10px] text-neutral-800 block truncate leading-tight uppercase">{item.title}</span>
                        <p className="text-[9px] text-[#52c41a] font-black mt-1 leading-none uppercase">✓ Terverifikasi Sistem</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setPortfolioList(portfolioList.filter((_, i) => i !== idx));
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer bg-transparent border-0"
                        title="Hapus Portofolio"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}

                  {portfolioList.length === 0 && (
                    <p className="text-[10px] text-neutral-400 text-center italic py-4 bg-[#fafafa] rounded-lg border border-dashed">
                      Belum ada sebelum-sesudah portofolio visual terpasang. Klik tombol tambah baru di atas.
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* DOMPET SCREEN IN PEKERJA */}
        {activeMenu === 'dompet' && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-3 mb-4 mt-0 flex items-center justify-between">
                <span>Rincian Dompet Mitra</span>
                <button onClick={() => setActiveMenu('beranda')} className="text-[#1890ff] font-semibold">Beranda</button>
              </h3>
              <div className="bg-[#e6f7ff] border border-[#91d5ff] rounded-lg p-4 text-center">
                <span className="text-[10px] text-neutral-500 uppercase font-semibold">Saldo Dompet Kerja Anda</span>
                <h2 className="text-2xl font-black text-neutral-950 mt-1 mb-2">Rp {walletBalance.toLocaleString('id-ID')}</h2>
                <div className="bg-white/80 rounded px-2.5 py-1 text-[10px] text-neutral-500 font-semibold inline-block">
                  ✓ Penarikan Dana Instant Terhubung Rekening Bank Anda
                </div>
              </div>

              {/* Fake History list */}
              <div className="mt-5 space-y-3">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Histori Pencairan</span>
                <div className="divide-y divide-[#e8e8e8] border border-neutral-200 rounded overflow-hidden">
                  {transactionStep === 'done' && (
                    <div className="p-3 bg-green-50 flex justify-between items-center">
                      <div>
                        <p className="font-bold text-neutral-800">Komisi Pekerjaan: Cat Kamar</p>
                        <p className="text-[9px] text-neutral-400">Dikonfirmasi oleh Ibu Sari · Baru saja</p>
                      </div>
                      <span className="font-black text-success">+ Rp 175.000</span>
                    </div>
                  )}
                  <div className="p-3 bg-white flex justify-between items-center text-[10px]">
                    <div>
                      <p className="font-bold text-neutral-800">Pencairan Sukses Ke BCA</p>
                      <p className="text-[9px] text-neutral-400">Selesai diproses · 28 Mei 2026</p>
                    </div>
                    <span className="font-black text-neutral-700">- Rp 450.000</span>
                  </div>
                  <div className="p-3 bg-white flex justify-between items-center text-[10px]">
                    <div>
                      <p className="font-bold text-neutral-800">Komisi Pekerjaan: Ledeng</p>
                      <p className="text-[9px] text-neutral-400">Dikonfirmasi Bp. Adi · 27 Mei 2026</p>
                    </div>
                    <span className="font-black text-success">+ Rp 120.000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* [PW-2] NOTIFIKASI TAWARAN BARU & COUNTDOWN (PROPOSAL_SENT) */}
        {transactionStep === 'proposal_sent' && activeMenu === 'beranda' && (
          <div className="p-4 space-y-4 animate-bounce-slow">
            {/* Pulsing Orange High-Attention Alert */}
            <div className="bg-[#fffbe6] border-2 border-[#ffe58f] rounded-lg p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#ffe58f]/20 rounded-full blur-xl"></div>
              
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold text-white bg-[#f6ad55] px-2.5 py-0.5 rounded uppercase tracking-wider shadow">
                  ⚡ Ada Tawaran Masuk!
                </span>
                <span className="text-xs font-mono font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded animate-pulse">
                  ⏱️ {formatTime(countdown)}
                </span>
              </div>

              <h3 className="font-bold text-lg text-neutral-900 mt-1 mb-1">{jobRequest.category}</h3>
              <p className="text-[10.5px] text-neutral-500 mb-4 font-semibold italic">dari Ibu Sari (Kebayoran Baru) · ⭐ 4.8</p>

              <div className="space-y-2 border-t border-[#ffe58f] pt-3.5 text-xs text-neutral-700">
                <p>📍 <strong>Jarak:</strong> 1.2 Km darimu</p>
                <p>💼 <strong>Deskripsi:</strong> "{jobRequest.description}"</p>
                <p>💵 <strong>Estimasi Tarif:</strong> <span className="font-bold text-[#1890ff]">{selectedWorker?.price}</span></p>
              </div>

              <div className="mt-5 space-y-2">
                {/* Accept options */}
                <div className="p-3 bg-white rounded-lg border border-neutral-200 mb-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span className="text-[11px] text-neutral-600 leading-snug font-semibold">Saya setuju siap sedia hadir di lokasi tepat waktu & sanggup mengerjakan sesuai instruksi.</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={onOpenChat}
                    className="flex-1 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold rounded-lg uppercase tracking-wide flex items-center justify-center gap-1.5 shadow"
                  >
                    <MessageSquare size={13} /> Chat Dulu
                  </button>
                  <button
                    onClick={handleAcceptProposal}
                    disabled={!agreeTerms}
                    className={`flex-1 py-2.5 font-bold rounded-lg uppercase tracking-wide shadow flex items-center justify-center gap-1 ${
                      agreeTerms 
                        ? 'bg-[#1890ff] text-white hover:bg-blue-600' 
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    }`}
                  >
                    Terima Pekerjaan &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* [PW-5] NAVIGASI PERJALANAN (ACCEPTED) */}
        {transactionStep === 'accepted' && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#e8e8e8] pb-2">
                <h3 className="font-bold text-sm text-neutral-900 mt-0">Navigasi Ke Lokasi Kerja</h3>
                <span className="px-2 py-0.5 text-[9px] font-bold text-white bg-blue-600 rounded">OTW</span>
              </div>

              <div className="bg-[#d1e9ff]/30 p-3 rounded-lg border border-blue-200 flex items-start gap-3">
                <MapPin className="text-[#1890ff] shrink-0 mt-0.5" size={20} />
                <div className="flex-1">
                  <span className="text-[10px] text-neutral-400 font-semibold block leading-none mb-1">Destinasi Alamat:</span>
                  <span className="font-bold text-xs text-neutral-900">{jobRequest.location}</span>
                </div>
              </div>

              {/* Interactive Virtual Map mockup for worker en_route */}
              <div className="h-44 bg-[#e2f1ff] rounded-lg border border-blue-200 relative overflow-hidden flex flex-col justify-end p-3">
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur border text-[9px] font-bold px-2 py-0.5 rounded">
                  🗺️ Navigasi GPS: Berjalan Kaki ~12 menit
                </div>
                {/* SVG path visualization */}
                <svg className="absolute inset-0 w-full h-full text-[#1890ff] opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M10,90 Q 40,80 50,50 T 90,10" fill="none" stroke="currentColor" strokeWidth="6" />
                </svg>
                {/* Simulated Moving Pin */}
                <div className="absolute bottom-[20%] left-[25%] w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow animate-pulse"></div>
                <div className="absolute top-[15%] right-[15%] w-3.5 h-3.5 bg-red-600 rounded-full border border-white shadow"></div>

                <div className="flex items-center gap-1.5 bg-white/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-neutral-600 font-semibold self-start z-10 border border-neutral-300/30">
                  <span>Jarak tersisa: 340 meter</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => setTransactionStep('arrived')}
                  className="w-full py-2.5 bg-success hover:bg-green-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1"
                >
                  <Check size={14} /> SAYA SUDAH TIBA DI LOKASI ✓
                </button>
                <div className="flex gap-2">
                  <button onClick={onOpenChat} className="flex-1 py-1.5 bg-white border border-neutral-300 rounded font-bold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-1 text-[10px]">
                    <MessageSquare size={12} /> Chat Pembeli
                  </button>
                  <button onClick={onOpenDispute} className="flex-1 py-1.5 bg-[#fff5f5] text-red-600 border border-red-200 rounded font-bold hover:bg-red-50 flex items-center justify-center gap-1 text-[10px]">
                    <ShieldAlert size={12} /> Lapor Dispute
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARRIVED ACTION NEEDED (ARRIVED) */}
        {transactionStep === 'arrived' && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto mb-3">
                <Check size={28} />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 mt-1 mb-1.5">Anda Sudah Tiba di Lokasi</h3>
              <p className="text-neutral-500 text-[11px] leading-relaxed mb-4">
                Silakan hubungi Ibu Sari untuk disambut dan diperlihatkan area kerja. Jika siap sedia, klik tombol 'Mulai Kerja' di bawah!
              </p>

              <button
                onClick={() => setTransactionStep('working')}
                className="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1"
              >
                🚀 MULAI BEKERJA (START WORK)
              </button>
            </div>
          </div>
        )}

        {/* [PW-6] ACTIVE WORK ON-GOING (WORKING) */}
        {transactionStep === 'working' && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#e8e8e8] pb-2">
                <h3 className="font-bold text-sm text-neutral-900 leading-none mt-0">Progres Mengerjakan Aktif</h3>
                <span className="px-2 py-0.5 text-[9px] font-bold text-white bg-amber-500 rounded animate-pulse">LIVE</span>
              </div>

              {/* Stopwatch Mock */}
              <div className="bg-neutral-800 text-white p-4 rounded-lg text-center font-mono">
                <span className="text-[9px] text-neutral-400 block tracking-wider uppercase">Waktu Mulai Pengerjaan</span>
                <div className="text-2xl font-black mt-1 mb-0.5 tracking-widest text-[#f5a623]">01:14:26</div>
                <span className="text-[9px] text-neutral-400">Dimulai: 10:05 | Estimasi Pekerjaan: 4 jam</span>
              </div>

              {/* Photo Proof Grid */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">Dokumentasi Foto Progres:</span>
                  <span className="text-[9px] text-neutral-400">Min. 1 foto wajib</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleUploadPhoto}
                    type="button"
                    className="h-20 border-2 border-dashed border-neutral-300 rounded flex flex-col items-center justify-center text-neutral-400 hover:text-[#1890ff] hover:bg-blue-50/20 transition-all font-semibold"
                  >
                    <Camera size={20} />
                    <span className="text-[9px] mt-1">Tambah</span>
                  </button>

                  {proofPhotos.map((photo, index) => (
                    <div key={index} className="h-20 rounded border border-neutral-200 relative overflow-hidden bg-neutral-100">
                      <img src={photo} alt="Bukti" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleDeletePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setTransactionStep('submitting_proof')}
                  disabled={proofPhotos.length === 0}
                  className={`w-full py-2.5 font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1 transition-all ${
                    proofPhotos.length > 0
                      ? 'bg-success text-white hover:bg-green-600'
                      : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Selesaikan Pekerjaan &rarr;
                </button>
                <p className="text-[9px] text-neutral-400 text-center mt-2">Unggah minimal 1 foto dokumentasi progres proyek di atas demi validitas pencairan.</p>
              </div>
            </div>
          </div>
        )}

        {/* [PW-7] SUBMIT PROOF & WAITING APPROVAL (SUBMITTING_PROOF / WAITING_APPROVAL) */}
        {(transactionStep === 'submitting_proof' || transactionStep === 'waiting_approval') && (
          <div className="p-4 space-y-4">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm space-y-4">
              {transactionStep === 'submitting_proof' ? (
                <>
                  <h3 className="font-bold text-sm text-neutral-900 border-b border-[#e8e8e8] pb-2 mt-0">Ringkasan Selesai Kerja</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Tulis Catatan Untuk Pembeli</label>
                    <textarea
                      placeholder="Contoh: Sudah selesai dicat ulang kamar tidur warna putih gading 2 kali usap, sisa sampah cat telah dibersihkan Bu..."
                      value={workerNote}
                      onChange={(e) => setWorkerNote(e.target.value)}
                      rows={2.5}
                      className="w-full text-xs p-3 border border-neutral-300 rounded focus:outline-none focus:border-[#1890ff] text-neutral-900"
                    />
                  </div>

                  <div className="bg-[#fafafa] rounded p-3 border">
                    <span className="text-[9px] text-neutral-400 font-bold block mb-1">LAMPIRAN FOTO:</span>
                    <div className="flex gap-2">
                      {proofPhotos.map((photo, i) => (
                        <div key={i} className="w-14 h-14 rounded border overflow-hidden">
                          <img src={photo} alt="lampiran" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTransactionStep('waiting_approval');
                      // Wait simulator to progress inside demo. Let's auto simulate.
                    }}
                    className="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow"
                  >
                    Kirim & Minta Konfirmasi &rarr;
                  </button>
                </>
              ) : (
                <div className="text-center p-4 space-y-4">
                  <div className="w-10 h-10 rounded-full border-4 border-[#e8e8e8] border-t-[#1890ff] animate-spin mx-auto"></div>
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900 mt-1 mb-1">Menunggu Verifikasi Ibu Sari</h3>
                    <p className="text-neutral-500 text-[11px] leading-relaxed">
                      Ibu Sari sedang memeriksa hasil pekerjaanmu di lokasi kerja. Biasanya konfirmasi berlangsung kurang dari 10 menit.
                    </p>
                  </div>
                  <div className="bg-[#fffbe6] border border-[#ffe58f] p-3 text-left rounded text-amber-800 text-[10px] leading-snug">
                    💡 <strong>Tips Mitra:</strong> Di saat menunggu, silakan bersihkan sisa peralatan, rapikan area sekitar, dan ucapkan terima kasih kepada Ibu Sari secara sopan.
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <button onClick={onOpenChat} className="w-full py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold rounded text-[10px] uppercase">
                      Hubungi Chat Ibu Sari
                    </button>
                    <div className="text-[10px] text-neutral-400 font-semibold italic">Auto-konfirmasi dalam 30 menit jika tidak ada tanggapan Klien.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* [PW-8] WORK COMPLETED SUCCESS SUMMARY (DONE) */}
        {transactionStep === 'done' && (
          <div className="p-4 space-y-4 animate-bounce-slow">
            <div className="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-lg space-y-5">
              <div className="w-16 h-16 bg-[#e6f7ff] text-primary rounded-full flex items-center justify-center mx-auto text-2xl animate-spin-slow">
                🏆
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-neutral-900 leading-none mb-1">Kerja Bagus, Pak Budi! 🎉</h3>
                <p className="text-neutral-500 text-[11px] leading-relaxed">Pekerjaan pengerjaan cat telah selesai dan sukses disetujui Ibu Sari.</p>
              </div>

              {/* Ledger Komisi */}
              <div className="bg-success/5 border-2 border-dashed border-success/30 rounded-lg p-4">
                <span className="text-[9.5px] uppercase font-bold text-success block leading-none mb-1">KOMISI DITERIMA DI DOMPET:</span>
                <span className="text-xl font-mono font-extrabold text-success">Rp 175.000</span>
                <p className="text-[9px] text-neutral-400 mt-1.5 font-bold leading-none">Status: Sukses Dibayarkan & Cair Instan</p>
              </div>

              {/* Rating from Employer */}
              <div className="bg-amber-50 rounded-lg border border-amber-200 p-3.5 text-left space-y-1.5 text-[10.5px]">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-800 uppercase text-[9px] tracking-wide">Ulasan Bintang Ibu Sari:</span>
                  <div className="flex text-amber-400">
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                    <Star size={11} fill="currentColor" />
                  </div>
                </div>
                <p className="text-neutral-600 italic">"Sangat ramah, hasil catnya rapi dan bersih kembali setelah dibereskan. Membawa semua perlengkapan sendiri. Highly recommended!"</p>
              </div>

              {/* Progress and Level Update */}
              <div className="bg-neutral-50 rounded border p-3 flex justify-between items-center text-left text-[11px] cursor-pointer" onClick={() => setShowScoreModal(true)}>
                <div>
                  <span className="font-extrabold text-neutral-800 block">KerjantaraScore Naik! ⭐</span>
                  <span className="text-neutral-400 text-[10px]">Tingkat kepatuhan proyek optimal · Lihat rincian</span>
                </div>
                <span className="font-mono font-black text-primary">4.90 &rarr; 4.92</span>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  onClick={onRestartTransaction}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow"
                >
                  Siap Sedia Terima Tawaran Baru (Reset)
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* KERJANTARASCORE GAMIFICATION MODAL (Antd v3 Styled Drawer) */}
      {showScoreModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-all p-3 animate-fade-in animate-duration-200">
          <div className="bg-white w-full max-w-sm sm:max-w-md rounded-t-2xl rounded-b-xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200/90 max-h-[85%] animate-slide-up">
            <header className="px-4 py-3 bg-gradient-to-r from-neutral-900 to-neutral-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={18} className="text-amber-400" />
                <div className="text-left font-sans">
                  <h4 className="font-extrabold text-xs text-white leading-none">Rincian KerjantaraScore</h4>
                  <span className="text-[9px] text-neutral-400 leading-none block mt-0.5">Metrik Reputasi & Badge Pencapaian</span>
                </div>
              </div>
              <button 
                onClick={() => setShowScoreModal(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </header>

            {/* Menu Tabs */}
            <div className="flex border-b border-neutral-200 bg-neutral-50/50">
              <button 
                onClick={() => setActiveScoreSubTab('progress')}
                className={`flex-1 py-3 font-bold text-[10px] tracking-wider border-b-2 text-center transition-all ${
                  activeScoreSubTab === 'progress' 
                    ? 'border-[#1890ff] text-[#1890ff] bg-white' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                PROGRES LEVEL
              </button>
              <button 
                onClick={() => setActiveScoreSubTab('badges')}
                className={`flex-1 py-3 font-bold text-[10px] tracking-wider border-b-2 text-center transition-all ${
                  activeScoreSubTab === 'badges' 
                    ? 'border-[#1890ff] text-[#1890ff] bg-white' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                BADGE AKTIF
              </button>
              <button 
                onClick={() => setActiveScoreSubTab('metrics')}
                className={`flex-1 py-3 font-bold text-[10px] tracking-wider border-b-2 text-center transition-all ${
                  activeScoreSubTab === 'metrics' 
                    ? 'border-[#1890ff] text-[#1890ff] bg-white' 
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                NILAI METRIK
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* SUBTAB 1: PROGRESS & BENEFITS */}
              {activeScoreSubTab === 'progress' && (
                <div className="space-y-4 text-left">
                  {/* Circular style info */}
                  <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 text-amber-500/10 text-7xl font-sans font-black select-none leading-none -translate-y-2 translate-x-1">4</div>
                    <span className="text-[9px] bg-amber-400 font-extrabold text-neutral-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                      🥇 LEVEL 4 / GOLD
                    </span>
                    <h3 className="font-extrabold text-xs text-amber-900 uppercase tracking-wide leading-none mt-1.5 mb-1">Gold Worker Elite</h3>
                    
                    <div className="my-2.5 flex flex-col">
                      <div className="text-2xl font-black text-neutral-900 flex items-baseline gap-1">
                        4.92<span className="text-xs font-semibold text-neutral-500">/ 5.0</span>
                      </div>
                      <span className="text-[9px] text-neutral-500 font-medium leading-normal mt-0.5">Skor performa murni berdasarkan kepatuhan ketiadaan kecurangan, ketepatan waktu, dan rating bintang.</span>
                    </div>

                    {/* Progress Bar & Next Target */}
                    <div className="space-y-1.5 text-left border-t border-amber-200/40 pt-2.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="font-bold text-neutral-600">Target Level 5 (Platinum)</span>
                        <span className="font-mono font-bold text-[#1890ff]">Minimal: 4.95 ⭐</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#1890ff] h-full rounded-full transition-all duration-500" style={{ width: '90%' }}></div>
                      </div>
                      <div className="flex justify-between text-[8px] text-neutral-500 font-medium leading-none">
                        <span>Kurang 0.03 Poin</span>
                        <span>Selesaikan 8 Proyek lagi</span>
                      </div>
                    </div>
                  </div>

                  {/* Level Benefits Perks */}
                  <div className="space-y-2">
                    <h5 className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Keuntungan Anda (Tingkat Emas):</h5>
                    <div className="grid grid-cols-1 gap-1.5">
                      <div className="flex items-start gap-2 p-2 bg-[#f6ffed] border border-[#b7eb8f] rounded-lg">
                        <span className="text-xs text-success font-bold mt-0.5">✓</span>
                        <div className="text-left font-sans">
                          <p className="font-extrabold text-[10px] text-neutral-800 leading-tight">Prioritas Pencarian Utama (+25%)</p>
                          <p className="text-[9px] text-neutral-500 leading-tight mt-0.5">Profil ditampilkan paling atas bagi Klien di radius terdekat.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-[#f6ffed] border border-[#b7eb8f] rounded-lg">
                        <span className="text-xs text-success font-bold mt-0.5">✓</span>
                        <div className="text-left font-sans">
                          <p className="font-extrabold text-[10px] text-neutral-800 leading-tight">Label Emas Mengkilap</p>
                          <p className="text-[9px] text-neutral-500 leading-tight mt-0.5">Sertifikasi ikon verified menarik klien berkali-kali lipat.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 p-2 bg-[#f6ffed] border border-[#b7eb8f] rounded-lg">
                        <span className="text-xs text-success font-bold mt-0.5">✓</span>
                        <div className="text-left font-sans">
                          <p className="font-extrabold text-[10px] text-neutral-800 leading-tight">Pencairan Instan Bebas Admin</p>
                          <p className="text-[9px] text-neutral-500 leading-tight mt-0.5">Semua proses pencairan saldo komisi dibebaskan dari biaya admin.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 2: ACHIEVEMENT BADGES */}
              {activeScoreSubTab === 'badges' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Badge 1 */}
                    <div className="p-2.5 border border-amber-200/60 bg-amber-50/40 rounded-xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                        🏆
                      </div>
                      <div className="flex-1 min-w-0 text-left font-sans">
                        <div className="flex items-center gap-1.5">
                          <h6 className="font-extrabold text-[11px] text-neutral-800 leading-none">Raja Proyek Rakyat</h6>
                          <span className="text-[8px] bg-amber-400 text-neutral-900 font-extrabold px-1.5 py-0.5 rounded leading-none uppercase scale-90">Aktif</span>
                        </div>
                        <p className="text-[9px] text-neutral-500 mt-1 leading-snug">Berhasil menyelesaikan lebih dari 100 proyek tanpa pembatalan sepihak.</p>
                      </div>
                    </div>

                    {/* Badge 2 */}
                    <div className="p-2.5 border border-amber-200/60 bg-amber-50/40 rounded-xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                        ⚡
                      </div>
                      <div className="flex-1 min-w-0 text-left font-sans">
                        <div className="flex items-center gap-1.5">
                          <h6 className="font-extrabold text-[11px] text-neutral-800 leading-none">Petir Ketepatan Waktu</h6>
                          <span className="text-[8px] bg-amber-400 text-neutral-900 font-extrabold px-1.5 py-0.5 rounded leading-none uppercase scale-90">Aktif</span>
                        </div>
                        <p className="text-[9px] text-neutral-500 mt-1 leading-snug">Rata-rata kedatangan sebelum jam pengerjaan yang didukung GPS.</p>
                      </div>
                    </div>

                    {/* Badge 3 */}
                    <div className="p-2.5 border border-blue-200/60 bg-blue-50/30 rounded-xl flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-lg shrink-0">
                        🤝
                      </div>
                      <div className="flex-1 min-w-0 text-left font-sans">
                        <div className="flex items-center gap-1.5">
                          <h6 className="font-extrabold text-[11px] text-neutral-800 leading-none">Mitra Tertib Prima</h6>
                          <span className="text-[8px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded leading-none uppercase scale-90">Aktif</span>
                        </div>
                        <p className="text-[9px] text-neutral-500 mt-1 leading-snug">Selalu disiplin mengunggah foto sebelum & sesudah pengerjaan secara transparan.</p>
                      </div>
                    </div>

                    {/* Badge 4 (Locked / Progressing) */}
                    <div className="p-2.5 border border-neutral-200 bg-white rounded-xl flex items-center gap-3 opacity-75">
                      <div className="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg shrink-0 filter grayscale">
                        🌟
                      </div>
                      <div className="flex-1 min-w-0 text-left font-sans">
                        <div className="flex items-center justify-between">
                          <h6 className="font-extrabold text-[11px] text-neutral-500 leading-none">Bintang Tetangga</h6>
                          <span className="text-[8px] bg-neutral-200 text-neutral-600 font-bold px-1.5 py-0.5 rounded leading-none uppercase">Progress (8/10)</span>
                        </div>
                        <div className="mt-1.5 w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <p className="text-[9px] text-neutral-400 mt-1 leading-snug">Raih 10 kali ulasan bintang lima berturut-turut tanpa jeda aduan.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: EXPLICIT METRICS BREAKDOWN */}
              {activeScoreSubTab === 'metrics' && (
                <div className="space-y-3">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 text-left">Nilai Performa Anda:</span>
                  <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white text-left font-sans">
                    <div className="p-2.5 flex justify-between items-center bg-neutral-50/50">
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Ketepatan Jam Datang</span>
                        <p className="text-[9px] text-neutral-400 leading-none">Sistem GPS & kecocokan OTP</p>
                      </div>
                      <span className="font-black text-xs text-[#1890ff] shrink-0 ml-2">⭐ 4.95 / 5.0</span>
                    </div>

                    <div className="p-2.5 flex justify-between items-center bg-neutral-50/50">
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Komunikasi & Sikap Kerja</span>
                        <p className="text-[9px] text-neutral-400 leading-none">Kepuasan obrolan & sopan santun</p>
                      </div>
                      <span className="font-black text-xs text-[#1890ff] shrink-0 ml-2">⭐ 4.88 / 5.0</span>
                    </div>
                    
                    <div className="p-2.5 flex justify-between items-center bg-neutral-50/50">
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Kerapihan & Kualitas Hasil</span>
                        <p className="text-[9px] text-neutral-400 leading-none">Berdasarkan data ulasan feedback Klien</p>
                      </div>
                      <span className="font-black text-xs text-[#1890ff] shrink-0 ml-2">⭐ 4.94 / 5.0</span>
                    </div>

                    <div className="p-2.5 flex justify-between items-center bg-neutral-50/50">
                      <div className="min-w-0 flex-1">
                        <span className="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Bebas Pelanggaran Sewenang-wenang</span>
                        <p className="text-[9px] text-neutral-400 leading-none">Aman dari klaim sengketa / denda penalti</p>
                      </div>
                      <span className="font-black text-[10px] text-success shrink-0 ml-2">100% BEBAS ✓</span>
                    </div>
                  </div>

                  <p className="text-neutral-500 font-medium text-[9px] leading-relaxed text-center mt-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                    💡 <strong>Tips Menjaga Skor:</strong> Hindari membatalkan kontrak sepihak kurang dari 24 jam sebelum pengerjaan agar reputasi Emas Anda selalu bersinar optimal!
                  </p>
                </div>
              )}
            </div>

            <footer className="p-3 border-t border-neutral-100 bg-neutral-50 flex gap-2">
              <button 
                onClick={() => setShowScoreModal(false)}
                className="flex-1 py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-md transition-colors cursor-pointer"
              >
                Tutup Rincian
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* FLOATING BOTTOM MENU BAR (Antd v3 Styled, Mobile-Friendly) */}
      <div className="absolute bottom-4 left-4 right-4 z-40 bg-[#001529]/95 backdrop-blur-md text-white rounded-xl shadow-[0_8px_24px_rgba(0,10,30,0.25)] border border-white/10 py-1.5 px-3 flex items-center justify-around max-w-sm sm:max-w-md mx-auto">
        {/* Beranda/Dashboard Button */}
        <button
          onClick={() => setActiveMenu('beranda')}
          className={`flex-1 max-w-[90px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative ${
            activeMenu === 'beranda'
              ? 'text-[#1890ff] scale-105 font-bold'
              : 'text-[#ffffffa6] hover:text-white'
          }`}
        >
          <Award size={16} />
          <span className="text-[9px] font-bold tracking-tight font-sans">Dashboard</span>
          {activeMenu === 'beranda' && (
            <div className="absolute bottom-0 w-3 h-0.5 bg-[#1895ff] rounded-full"></div>
          )}
        </button>
        
        {/* KitaDompet Button */}
        <button
          onClick={() => setActiveMenu('dompet')}
          className={`flex-1 max-w-[90px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative ${
            activeMenu === 'dompet'
              ? 'text-[#1890ff] scale-105 font-bold'
              : 'text-[#ffffffa6] hover:text-white'
          }`}
        >
          <TrendingUp size={16} />
          <span className="text-[9px] font-bold tracking-tight font-sans">KitaDompet</span>
          {activeMenu === 'dompet' && (
            <div className="absolute bottom-0 w-3 h-0.5 bg-[#1895ff] rounded-full"></div>
          )}
        </button>

        {/* Chat Live Button */}
        {transactionStep !== 'idle' && (
          <button
            onClick={onOpenChat}
            className="flex-1 max-w-[90px] flex flex-col items-center gap-1 py-1 rounded-md text-[#ffffffa6] hover:text-white transition-all"
          >
            <MessageSquare size={16} />
            <span className="text-[9px] font-bold tracking-tight font-sans">Chat Live</span>
          </button>
        )}
      </div>

      {showPayoutAnim && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Confetti effect background */}
          <div className="absolute inset-0 bg-success/10 animate-fade-out" style={{ animationDuration: '3s' }}></div>
          
          <div className="bg-white px-5 py-4 rounded-2xl shadow-2xl border-4 border-success flex flex-col items-center animate-slide-up transform translate-y-0 opacity-100 z-10 transition-all">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center -mt-10 mb-2 shadow-lg border-4 border-white animate-bounce">
              <span className="text-3xl">💸</span>
            </div>
            <h3 className="font-black text-xl text-neutral-900 tracking-tight leading-none mb-1">Cair ke KitaDompet!</h3>
            <p className="text-[11px] font-bold text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-widest mt-1 mb-2">Escrow Dilepas Klien</p>
            <p className="text-xs text-neutral-500 font-medium text-center leading-relaxed">Hasil jerih payahmu telah masuk otomatis dan siap ditarik.</p>
          </div>
        </div>
      )}

    </div>
  );
}
