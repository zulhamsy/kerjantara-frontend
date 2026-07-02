import React, { useState, useEffect } from 'react';
import DashboardPemberiKerja from './DashboardPemberiKerja';
import DashboardPekerja from './DashboardPekerja';
import SharedChat from './SharedChat';
import SharedDispute from './SharedDispute';
import { JobRequest, WorkerProfile, TransactionStep, ChatMessage } from '../types';

interface DashboardProps {
  initialRole?: 'jobseeker' | 'client';
  userName?: string;
  userEmail?: string;
}

export default function Dashboard({ 
  initialRole = 'jobseeker',
  userName = 'Budi Santoso',
  userEmail = 'kerjantara@example.com'
}: DashboardProps) {
  
  // Tentukan state peran yang sedang dilihat (Simulasi Sisi)
  // Default disesuaikan dengan initialRole terdaftar
  const [currentViewRole, setCurrentViewRole] = useState<'client' | 'worker'>(
    initialRole === 'client' ? 'client' : 'worker'
  );

  // Global Sync Transaction States
  const [transactionStep, setTransactionStep] = useState<TransactionStep>('idle');
  const [jobRequest, setJobRequest] = useState<JobRequest>({
    category: 'Tukang Cat',
    description: 'Mengecat kamar tidur utama ukuran 4x3m dengan cat putih minimalis.',
    location: 'Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan',
    duration: 'Setengah hari',
    budget: 'Rp 180.000'
  });

  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  
  // Chat States [SH-1]
  const [isChatViewOpen, setIsChatViewOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'client',
      text: 'Halo Pak, apakah benar bisa mengerjakan cat dinding rapi 2 lapis hari ini?',
      time: '10:01'
    },
    {
      id: 'm2',
      sender: 'worker',
      text: 'Halo Bu Sari, betul sekali. Saya sudah terverifikasi KTP, membawa alat cat lengkap & siap meluncur setelah Ibu konfirmasi.',
      time: '10:02'
    }
  ]);

  // Dispute States [SH-2]
  const [isDisputeViewOpen, setIsDisputeViewOpen] = useState(false);

  // Restart/Reset Seluruh Alur Simulasi
  const handleRestartTransaction = () => {
    setTransactionStep('idle');
    setSelectedWorker(null);
    setAgreeTerms(false);
    setIsChatViewOpen(false);
    setIsDisputeViewOpen(false);
    setChatMessages([
      {
        id: 'm1',
        sender: 'client',
        text: 'Halo Pak, apakah benar bisa mengerjakan cat dinding rapi 2 lapis hari ini?',
        time: '10:01'
      },
      {
        id: 'm2',
        sender: 'worker',
        text: 'Halo Bu Sari, betul sekali. Saya sudah terverifikasi KTP, membawa alat cat lengkap & siap meluncur setelah Ibu konfirmasi.',
        time: '10:02'
      }
    ]);
  };

  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentViewRole === 'client' ? 'client' : 'worker',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMsg]);

    // Simulated reply based on roles
    if (text.toLowerCase().includes('tiba') || text.toLowerCase().includes('jalan')) {
      setTimeout(() => {
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: currentViewRole === 'client' ? 'worker' : 'client',
            text: 'Baik, terima kasih atas informasinya. Saya standby ya.',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1500);
    }
  };

  const handleDisputeSubmit = (reason: string, details: string) => {
    console.log("Dispute reported:", { reason, details });
  };

  // Auto progression mockup timers for real-time vibe
  useEffect(() => {
    if (transactionStep === 'matching') {
      const matchTimer = setTimeout(() => {
        setTransactionStep('kandidat_list');
      }, 3500);
      return () => clearTimeout(matchTimer);
    }
  }, [transactionStep]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f2f5] overflow-hidden select-none relative">
      
      {/* SIMULATOR ROLE PANEL CHOICE (Refactored to be ultra mobile-friendly & elegant) */}
      {!isChatViewOpen && !isDisputeViewOpen && (
        <div className="bg-[#001529] border-b border-[#ffffff10] px-3 py-2 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="text-[9px] text-[#f5a623] font-mono font-bold uppercase tracking-wider">
              SIMULASI AKUN
            </span>
          </div>
          <div className="flex bg-[#ffffff10] p-0.5 rounded border border-[#ffffff1a] shadow-inner">
            <button
              onClick={() => setCurrentViewRole('client')}
              className={`px-2.5 py-1 text-[9px] font-semibold rounded-sm transition-all focus:outline-none uppercase flex items-center gap-1 ${
                currentViewRole === 'client'
                  ? 'bg-[#1890ff] text-white font-bold shadow-sm'
                  : 'text-[#ffffffb3] hover:text-white'
              }`}
            >
              <span>💼 Pemberi Kerja</span>
            </button>
            <button
              onClick={() => {
                setCurrentViewRole('worker');
                // Auto create worker profile inside simulate
                if (!selectedWorker) {
                  setSelectedWorker({
                    name: "Pak Budi Santoso",
                    avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=60",
                    rating: 4.9,
                    completedJobs: 142,
                    distance: "1.2 km",
                    status: "Tersedia sekarang",
                    skills: ["Cat Dinding", "Cat Plafon", "Plester"],
                    price: "Rp 150.000 - 200.000"
                  });
                }
              }}
              className={`px-2.5 py-1 text-[9px] font-semibold rounded-sm transition-all focus:outline-none uppercase flex items-center gap-1 ${
                currentViewRole === 'worker'
                  ? 'bg-[#f5a623] text-neutral-900 font-extrabold shadow-sm'
                  : 'text-[#ffffffb3] hover:text-white'
              }`}
            >
              <span>🛠️ Pekerja</span>
            </button>
          </div>
        </div>
      )}

      {/* RENDER IN-APP CHAT VIEW */}
      {isChatViewOpen && (
        <SharedChat
          onBack={() => setIsChatViewOpen(false)}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          currentUser={currentViewRole === 'client' ? 'client' : 'worker'}
          otherUserName={currentViewRole === 'client' ? (selectedWorker?.name || "Pak Budi Santoso") : (userName || "Ibu Sari")}
        />
      )}

      {/* RENDER DISPUTE VIEW */}
      {isDisputeViewOpen && (
        <SharedDispute
          onBack={() => setIsDisputeViewOpen(false)}
          onSubmit={handleDisputeSubmit}
          currentUser={currentViewRole === 'client' ? 'client' : 'worker'}
        />
      )}

      {/* RENDER CURRENT VIEW DASHBOARD */}
      {!isChatViewOpen && !isDisputeViewOpen && currentViewRole === 'client' && (
        <DashboardPemberiKerja
          userName={userName || 'Ibu Sari'}
          transactionStep={transactionStep}
          setTransactionStep={setTransactionStep}
          jobRequest={jobRequest}
          setJobRequest={setJobRequest}
          selectedWorker={selectedWorker}
          setSelectedWorker={setSelectedWorker}
          onOpenChat={() => setIsChatViewOpen(true)}
          onOpenDispute={() => setIsDisputeViewOpen(true)}
          onRestartTransaction={handleRestartTransaction}
        />
      )}

      {!isChatViewOpen && !isDisputeViewOpen && currentViewRole === 'worker' && (
        <DashboardPekerja
          userName="Pak Budi Santoso"
          transactionStep={transactionStep}
          setTransactionStep={setTransactionStep}
          jobRequest={jobRequest}
          selectedWorker={selectedWorker}
          onOpenChat={() => setIsChatViewOpen(true)}
          onOpenDispute={() => setIsDisputeViewOpen(true)}
          onRestartTransaction={handleRestartTransaction}
        />
      )}

    </div>
  );
}
