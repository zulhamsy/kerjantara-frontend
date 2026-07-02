<script lang="ts">
  import { 
    Check, Play, ArrowRight, MessageSquare, Phone, MapPin, Clock, Camera, 
    Trash2, ShieldAlert, Award, TrendingUp, AlertCircle, RefreshCw, Star, X
  } from '@lucide/svelte';
  import type { JobRequest, WorkerProfile, TransactionStep } from '../types';
  import KerjantaraLogo from '../components/KerjantaraLogo.svelte';

  let {
    userName,
    transactionStep = $bindable(),
    jobRequest,
    selectedWorker,
    onOpenChat,
    onOpenDispute,
    onRestartTransaction
  } = $props<{
    userName: string;
    transactionStep: TransactionStep;
    jobRequest: JobRequest;
    selectedWorker: WorkerProfile | null;
    onOpenChat: () => void;
    onOpenDispute: () => void;
    onRestartTransaction: () => void;
  }>();

  let activeMenu = $state<'beranda' | 'dompet' | 'riwayat'>('beranda');
  let showScoreModal = $state(false);
  let activeScoreSubTab = $state<'progress' | 'badges' | 'metrics'>('progress');

  let workerBio = $state('Spesialis tukang cat interior dengan pengalaman 8 tahun. Ahli mengatasi rembesan air pada dinding, plesteran retak rambut, hingga pengecatan rapi 3 lapis.');
  let isEditingBio = $state(false);
  let tempBioInput = $state('Spesialis tukang cat interior dengan pengalaman 8 tahun. Ahli mengatasi rembesan air pada dinding, plesteran retak rambut, hingga pengecatan rapi 3 lapis.');
  let workerTraits = $state<string[]>(['Sangat Teliti', 'Sopan & Ramah', 'Tepat Waktu']);
  let portfolioList = $state([
    {
      title: "Restorasi Dinding Rembes & Berjamur",
      before: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
      after: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&auto=format&fit=crop&q=80"
    }
  ]);
  let newPortTitle = $state('');
  let showAddPortfolio = $state(false);

  let isActive = $state(true); // Availability Toggle
  let walletBalance = $state(1250000);
  let countdown = $state(179); // 3 menit countdown
  let agreeTerms = $state(false);
  let proofPhotos = $state<string[]>([]);
  let workerNote = $state('');
  let isDoneConfirmed = $state(false);
  let payoutReceived = $state(false);
  let showPayoutAnim = $state(false);

  $effect(() => {
    if (transactionStep === 'done' && !payoutReceived && selectedWorker) {
      const parsedPrice = parseInt(selectedWorker.price.replace(/[^\d]/g, '').slice(0, -5) + "000");
      const addedAmount = !isNaN(parsedPrice) && parsedPrice > 0 ? parsedPrice : 200000;
      
      payoutReceived = true;
      showPayoutAnim = true;
      const timer = setTimeout(() => {
        walletBalance = walletBalance + addedAmount;
      }, 500);
      
      const animTimer = setTimeout(() => showPayoutAnim = false, 4500);
      return () => { clearTimeout(timer); clearTimeout(animTimer); };
    }
  });

  $effect(() => {
    if (transactionStep === 'proposal_sent' && countdown > 0) {
      const interval = setInterval(() => {
        countdown = countdown - 1;
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  $effect(() => {
    if (transactionStep === 'done') {
      walletBalance = 1425000;
    }
  });

  const formatTime = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleAcceptProposal = () => {
    transactionStep = 'accepted';
  };

  const handleUploadPhoto = () => {
    const dummyImgs = [
      "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&auto=format&fit=crop&q=60"
    ];
    if (proofPhotos.length < 2) {
      proofPhotos = [...proofPhotos, dummyImgs[proofPhotos.length]];
    }
  };

  const handleDeletePhoto = (idx: number) => {
    proofPhotos = proofPhotos.filter((_, i) => i !== idx);
  };
</script>

<div class="flex-1 flex flex-col bg-[#F0F2F5] text-neutral-900 h-full overflow-hidden font-sans text-xs relative">
  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col overflow-y-auto bg-[#f0f2f5] relative min-h-full pb-24">
    
    <!-- TOP COMPACT STATUS BAR -->
    <div class="bg-white border-b border-[#e8e8e8] px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
      <KerjantaraLogo iconSize={18} textSize="text-xs" />
      
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full {isActive ? 'bg-success animate-pulse' : 'bg-neutral-300'}"></span>
          <span class="text-[9px] text-neutral-400 font-bold uppercase tracking-wide">
            {isActive ? 'AKTIF' : 'OFFLINE'}
          </span>
        </div>
        
        <div class="h-4 w-px bg-neutral-200"></div>
        
        <div class="flex items-center gap-1.5 font-sans">
          <div class="w-5 h-5 rounded-full bg-[#f5a623] text-neutral-900 flex items-center justify-center font-bold text-[9px]">
            PB
          </div>
          <span class="text-[10px] font-semibold text-neutral-600">Pak Budi</span>
        </div>
        
        <span class="text-[9px] text-amber-700 bg-[#fffbe6] border border-[#ffe58f] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
          Mitra
        </span>
      </div>
    </div>

    <!-- DEMO TOOLTIPS -->
    {#if transactionStep === 'idle'}
      <div class="m-3 p-3 bg-amber-50 border border-amber-200 rounded-lg shadow-sm flex flex-col gap-1 text-amber-800">
        <div class="flex items-start gap-1.5">
          <AlertCircle size={15} class="mt-0.5 shrink-0" />
          <p class="text-[11px] leading-snug">
            <strong>Panduan Simulasi Demo:</strong> Saat ini belum ada tawaran pekerjaan. Cobalah beralih ke <strong>Sisi Pemberi Kerja</strong> terlebih dahulu untuk mempublikasikan permintaan "Tukang Cat" yang baru!
          </p>
        </div>
      </div>
    {/if}

    <!-- CONTENT MODULES -->
    {#if transactionStep === 'idle' && activeMenu === 'beranda'}
      <div class="p-4 space-y-4">
        <!-- Status Switch Box -->
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <h4 class="font-bold text-neutral-900 leading-tight mb-0.5">Status Kehadiranmu</h4>
            <p class="text-[10px] text-neutral-400">Aktifkan agar pemberi kerja terdekat bisa merekrutmu.</p>
          </div>
          <button
            onclick={() => isActive = !isActive}
            class="w-12 h-6 flex items-center rounded-full p-0.5 transition-all focus:outline-none cursor-pointer {
              isActive ? 'bg-success' : 'bg-neutral-300'
            }"
          >
            <div
              class="bg-white w-5 h-5 rounded-full shadow-md transform transition-all {
                isActive ? 'translate-x-6' : 'translate-x-0'
              }"
            ></div>
          </button>
        </div>

        <!-- Reputation Card (KerjantaraScore) -->
        <div 
          onclick={() => showScoreModal = true}
          class="bg-gradient-to-br from-[#111215] via-[#181a20] to-[#0d0e11] text-white rounded-xl p-5 shadow-lg border border-neutral-800 relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
        >
          <div class="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-xl pointer-events-none"></div>
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="text-[9px] text-[#40a9ff] font-extrabold uppercase tracking-widest leading-none mb-1">Reputasi & Level</p>
              <h3 class="text-sm font-black text-amber-400 flex items-center gap-1.5 uppercase tracking-wider leading-none mt-0">
                🥇 Level 4: Gold Worker
              </h3>
            </div>
            <span class="bg-amber-400/15 text-amber-400 border border-amber-400/35 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Verified
            </span>
          </div>

          <div class="mt-3.5 mb-3.5">
            <div class="flex justify-between text-[9px] text-neutral-400 font-bold mb-1">
              <span>Progres ke Platinum</span>
              <span>4.92 / 4.95</span>
            </div>
            <div class="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div class="bg-gradient-to-r from-amber-400 to-amber-300 h-full rounded-full" style="width: 90%"></div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 border-t border-neutral-800 pt-3 text-left">
            <div>
              <span class="text-[9px] text-neutral-400 block leading-none mb-1">KerjantaraScore:</span>
              <span class="text-sm font-extrabold flex items-center gap-1 text-white leading-none mt-0.5">
                ⭐ 4.92 <span class="text-[10px] text-neutral-500 font-bold">/5.0</span>
              </span>
            </div>
            <div>
              <span class="text-[9px] text-neutral-400 block leading-none mb-1">Proyek Selesai:</span>
              <span class="text-sm font-extrabold text-white leading-none mt-0.5">142 Proyek</span>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between text-[9px] text-amber-200/90 font-bold border-t border-neutral-800 pt-2">
            <span>🎗️ 3 Badge Aktif Terpasang</span>
            <span class="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-0.5 font-bold transition-colors">
              Rincian & Badges &rarr;
            </span>
          </div>
        </div>

        <!-- Income Summary -->
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
          <h3 class="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-2 mb-3 mt-0">KitaDompet</h3>
          <div class="flex justify-between items-center bg-[#fafafa] p-3 rounded-lg border border-neutral-100">
            <div>
              <span class="text-[10px] text-neutral-400 block leading-none mb-1">Total Saldo Terkumpul:</span>
              <span class="text-base font-extrabold text-neutral-950">
                Rp {walletBalance.toLocaleString('id-ID')}
              </span>
            </div>
            <button
              type="button"
              onclick={() => activeMenu = 'dompet'}
              class="bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-[10px] px-3.5 py-1.5 rounded transition-colors uppercase cursor-pointer"
            >
              Rincian
            </button>
          </div>
        </div>

        <!-- Profile & Portfolio -->
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm text-left">
          <h3 class="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-2 mb-3.5 mt-0 flex items-center justify-between">
            <span>👤 Profil & Portofolio Mitra</span>
            <span class="text-[9px] text-[#1890ff] font-extrabold uppercase tracking-wider bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">KerjantaraScore Verified</span>
          </h3>

          <!-- BIO -->
          <div class="space-y-2 mb-4">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Profil Singkat (Bio Kamu)</span>
              {#if !isEditingBio}
                <button
                  type="button"
                  onclick={() => { isEditingBio = true; tempBioInput = workerBio; }}
                  class="text-[#1890ff] text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
                >
                  Ubah Rincian
                </button>
              {:else}
                <div class="flex gap-2">
                  <button
                    type="button"
                    onclick={() => { workerBio = tempBioInput; isEditingBio = false; }}
                    class="text-success text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onclick={() => isEditingBio = false}
                    class="text-neutral-400 text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
                  >
                    Batal
                  </button>
                </div>
              {/if}
            </div>

            {#if !isEditingBio}
              <p class="text-[11px] text-neutral-600 bg-neutral-50/70 p-2.5 border-l-2 border-neutral-400 rounded-r-md leading-relaxed font-sans">
                {workerBio}
              </p>
            {:else}
              <textarea
                bind:value={tempBioInput}
                rows={3}
                class="w-full text-[11px] p-2 border border-neutral-300 rounded focus:outline-none focus:border-[#1890ff] text-neutral-800 bg-white leading-relaxed"
                placeholder="Tulis keahlian dan pengalaman utamamu..."
              ></textarea>
            {/if}
          </div>

          <!-- CHARACTER TRAITS -->
          <div class="space-y-2 mb-4 pt-3 border-t border-[#f0f0f0]">
            <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Karakter Kerja Terpilih</span>
            <p class="text-[9px] text-neutral-400 mb-2 leading-tight">Pilih hingga 3 kelebihan yang dinilai oleh Klien dalam KerjantaraScore Anda:</p>
            
            <div class="flex flex-wrap gap-1.5">
              {#each ["Sangat Teliti", "Sopan & Ramah", "Tepat Waktu", "Inisiatif Tinggi", "Cepat & Sigap", "Pendiam / Fokus"] as trait}
                {@const isSelected = workerTraits.includes(trait)}
                <button
                  type="button"
                  onclick={() => {
                    if (isSelected) {
                      workerTraits = workerTraits.filter(t => t !== trait);
                    } else {
                      if (workerTraits.length < 3) {
                        workerTraits = [...workerTraits, trait];
                      } else {
                        alert("Maksimal memilih 3 karakter kerja unggulan.");
                      }
                    }
                  }}
                  class="px-2 py-1 rounded text-[9px] font-extrabold border transition-all cursor-pointer {
                    isSelected
                      ? 'bg-amber-400/15 border-amber-400 text-amber-800'
                      : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-305'
                  }"
                >
                  {isSelected ? '✓ ' : ''}{trait}
                </button>
              {/each}
            </div>
          </div>

          <!-- PORTFOLIO -->
          <div class="space-y-2 pt-3 border-t border-[#f0f0f0]">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                🖼️ Portofolio Visual (Before-After)
              </span>
              <button
                type="button"
                onclick={() => showAddPortfolio = !showAddPortfolio}
                class="text-[#1890ff] text-[10px] font-bold hover:underline cursor-pointer bg-transparent border-0"
              >
                {showAddPortfolio ? 'Tutup Form' : 'Tambah Baru +'}
              </button>
            </div>

            {#if showAddPortfolio}
              <div class="bg-neutral-50/70 p-3 rounded-lg border border-neutral-200 space-y-2.5 my-2 text-[10px]">
                <span class="font-extrabold text-neutral-700 uppercase tracking-wide block">Rincian Portofolio Baru</span>
                
                <div class="space-y-1 text-left">
                  <label class="text-[9px] font-extrabold text-neutral-500 block">Nama / Judul Proyek Side-Gig</label>
                  <input
                    type="text"
                    bind:value={newPortTitle}
                    placeholder="Contoh: Perbaikan Ganti Saringan Bak Mandi"
                    class="w-full text-[10px] p-2 border border-neutral-300 rounded focus:border-[#1890ff] bg-white text-neutral-800"
                  />
                </div>

                <div class="grid grid-cols-2 gap-2 text-center">
                  <div class="p-2 border border-[#ffe58f] bg-[#fffbe6]/60 rounded">
                    <span class="font-bold text-[8px] text-amber-800 block mb-1">FOTO SEBELUM</span>
                    <div class="text-[18px]">🛖</div>
                    <span class="text-[8px] text-neutral-400 block mt-0.5">Disediakan otomatis</span>
                  </div>
                  <div class="p-2 border border-[#b7eb8f] bg-[#f6ffed]/60 rounded">
                    <span class="font-bold text-[8px] text-green-800 block mb-1">FOTO SESUDAH</span>
                    <div class="text-[18px]">✨🚽</div>
                    <span class="text-[8px] text-neutral-400 block mt-0.5">Disediakan otomatis</span>
                  </div>
                </div>

                <button
                  type="button"
                  onclick={() => {
                    if (!newPortTitle.trim()) {
                      alert("Harap masukkan judul proyek portofolio!");
                      return;
                    }
                    const newMockItem = {
                      title: newPortTitle,
                      before: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80",
                      after: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=400&q=80"
                    };
                    portfolioList = [newMockItem, ...portfolioList];
                    newPortTitle = '';
                    showAddPortfolio = false;
                  }}
                  class="w-full py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded text-[9px] uppercase tracking-wide cursor-pointer"
                >
                  Simpan Portofolio Baru
                </button>
              </div>
            {/if}

            <div class="grid grid-cols-1 gap-2.5 mt-2">
              {#each portfolioList as item, idx}
                <div class="p-2 bg-[#fafafa] border border-neutral-200 rounded-lg flex gap-3 relative group">
                  <div class="flex gap-1 shrink-0">
                    <div class="relative text-center">
                      <img src={item.before} alt="Sebelum" class="w-12 h-12 object-cover rounded border border-red-250 animate-fade-in" />
                      <span class="absolute bottom-0 inset-x-0 bg-red-600 text-white text-[6px] font-bold uppercase rounded-b text-center leading-none py-0.5 scale-90">Sebelum</span>
                    </div>
                    <div class="relative text-center">
                      <img src={item.after} alt="Sesudah" class="w-12 h-12 object-cover rounded border border-green-250 animate-fade-in" />
                      <span class="absolute bottom-0 inset-x-0 bg-green-600 text-white text-[6px] font-bold uppercase rounded-b text-center leading-none py-0.5 scale-90">Sesudah</span>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0 pr-6 text-left my-auto">
                    <span class="font-extrabold text-[10px] text-neutral-800 block truncate leading-tight uppercase">{item.title}</span>
                    <p class="text-[9px] text-[#52c41a] font-black mt-1 leading-none uppercase">✓ Terverifikasi Sistem</p>
                  </div>

                  <button
                    type="button"
                    onclick={() => {
                      portfolioList = portfolioList.filter((_, i) => i !== idx);
                    }}
                    class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer bg-transparent border-0"
                    title="Hapus Portofolio"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              {/each}

              {#if portfolioList.length === 0}
                <p class="text-[10px] text-neutral-400 text-center italic py-4 bg-[#fafafa] rounded-lg border border-dashed">
                  Belum ada sebelum-sesudah portofolio visual terpasang. Klik tombol tambah baru di atas.
                </p>
              {/if}
            </div>
          </div>
        </div>
      </div>

    {:else if activeMenu === 'dompet'}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
          <h3 class="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-3 mb-4 mt-0 flex items-center justify-between">
            <span>Rincian Dompet Mitra</span>
            <button onclick={() => activeMenu = 'beranda'} class="text-[#1890ff] font-semibold cursor-pointer">Beranda</button>
          </h3>
          <div class="bg-[#e6f7ff] border border-[#91d5ff] rounded-lg p-4 text-center">
            <span class="text-[10px] text-neutral-500 uppercase font-semibold">Saldo Dompet Kerja Anda</span>
            <h2 class="text-2xl font-black text-neutral-950 mt-1 mb-2">Rp {walletBalance.toLocaleString('id-ID')}</h2>
            <div class="bg-white/80 rounded px-2.5 py-1 text-[10px] text-neutral-500 font-semibold inline-block">
              ✓ Penarikan Dana Instant Terhubung Rekening Bank Anda
            </div>
          </div>

          <div class="mt-5 space-y-3">
            <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Histori Pencairan</span>
            <div class="divide-y divide-[#e8e8e8] border border-neutral-200 rounded overflow-hidden">
              {#if transactionStep === 'done'}
                <div class="p-3 bg-green-50 flex justify-between items-center">
                  <div>
                    <p class="font-bold text-neutral-800">Komisi Pekerjaan: Cat Kamar</p>
                    <p class="text-[9px] text-neutral-400">Dikonfirmasi oleh Ibu Sari · Baru saja</p>
                  </div>
                  <span class="font-black text-success">+ Rp 175.000</span>
                </div>
              {/if}
              <div class="p-3 bg-white flex justify-between items-center text-[10px]">
                <div>
                  <p class="font-bold text-neutral-800">Pencairan Sukses Ke BCA</p>
                  <p class="text-[9px] text-neutral-400">Selesai diproses · 28 Mei 2026</p>
                </div>
                <span class="font-black text-neutral-700">- Rp 450.000</span>
              </div>
              <div class="p-3 bg-white flex justify-between items-center text-[10px]">
                <div>
                  <p class="font-bold text-neutral-800">Komisi Pekerjaan: Ledeng</p>
                  <p class="text-[9px] text-neutral-400">Dikonfirmasi Bp. Adi · 27 Mei 2026</p>
                </div>
                <span class="font-black text-success">+ Rp 120.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {:else if transactionStep === 'proposal_sent' && activeMenu === 'beranda'}
      <div class="p-4 space-y-4">
        <!-- Tawaran Baru Countdown -->
        <div class="bg-[#fffbe6] border-2 border-[#ffe58f] rounded-lg p-5 shadow-lg relative overflow-hidden">
          <div class="absolute top-0 right-0 w-20 h-20 bg-[#ffe58f]/20 rounded-full blur-xl"></div>
          
          <div class="flex justify-between items-start mb-3">
            <span class="text-[10px] font-bold text-white bg-[#f6ad55] px-2.5 py-0.5 rounded uppercase tracking-wider shadow">
              ⚡ Ada Tawaran Masuk!
            </span>
            <span class="text-xs font-mono font-extrabold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded animate-pulse">
              ⏱️ {formatTime(countdown)}
            </span>
          </div>

          <h3 class="font-bold text-lg text-neutral-900 mt-1 mb-1">{jobRequest.category}</h3>
          <p class="text-[10.5px] text-neutral-500 mb-4 font-semibold italic">dari Ibu Sari (Kebayoran Baru) · ⭐ 4.8</p>

          <div class="space-y-2 border-t border-[#ffe58f] pt-3.5 text-xs text-neutral-700">
            <p>📍 <strong>Jarak:</strong> 1.2 Km darimu</p>
            <p>💼 <strong>Deskripsi:</strong> "{jobRequest.description}"</p>
            <p>💵 <strong>Estimasi Tarif:</strong> <span class="font-bold text-[#1890ff]">{selectedWorker?.price}</span></p>
          </div>

          <div class="mt-5 space-y-2">
            <div class="p-3 bg-white rounded-lg border border-neutral-200 mb-1">
              <label class="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  bind:checked={agreeTerms}
                  class="mt-0.5"
                />
                <span class="text-[11px] text-neutral-600 leading-snug font-semibold">Saya setuju siap sedia hadir di lokasi tepat waktu & sanggup mengerjakan sesuai instruksi.</span>
              </label>
            </div>

            <div class="flex gap-2">
              <button
                onclick={onOpenChat}
                class="flex-1 py-2.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold rounded-lg uppercase tracking-wide flex items-center justify-center gap-1.5 shadow cursor-pointer"
              >
                <MessageSquare size={13} /> Chat Dulu
              </button>
              <button
                onclick={handleAcceptProposal}
                disabled={!agreeTerms}
                class="flex-1 py-2.5 font-bold rounded-lg uppercase tracking-wide shadow flex items-center justify-center gap-1 cursor-pointer {
                  agreeTerms 
                    ? 'bg-[#1890ff] text-white hover:bg-blue-600' 
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }"
              >
                Terima Pekerjaan &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

    {:else if transactionStep === 'accepted'}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm space-y-4">
          <div class="flex justify-between items-center border-b border-[#e8e8e8] pb-2">
            <h3 class="font-bold text-sm text-neutral-900 mt-0">Navigasi Ke Lokasi Kerja</h3>
            <span class="px-2 py-0.5 text-[9px] font-bold text-white bg-blue-600 rounded">OTW</span>
          </div>

          <div class="bg-[#d1e9ff]/30 p-3 rounded-lg border border-blue-200 flex items-start gap-3">
            <MapPin class="text-[#1890ff] shrink-0 mt-0.5" size={20} />
            <div class="flex-1">
              <span class="text-[10px] text-neutral-400 font-semibold block leading-none mb-1">Destinasi Alamat:</span>
              <span class="font-bold text-xs text-neutral-900">{jobRequest.location}</span>
            </div>
          </div>

          <div class="h-44 bg-[#e2f1ff] rounded-lg border border-blue-200 relative overflow-hidden flex flex-col justify-end p-3">
            <div class="absolute top-2 left-2 bg-white/90 backdrop-blur border text-[9px] font-bold px-2 py-0.5 rounded">
              🗺️ Navigasi GPS: Berjalan Kaki ~12 menit
            </div>
            <svg class="absolute inset-0 w-full h-full text-[#1890ff] opacity-15" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,90 Q 40,80 50,50 T 90,10" fill="none" stroke="currentColor" stroke-width="6" />
            </svg>
            <div class="absolute bottom-[20%] left-[25%] w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow animate-pulse"></div>
            <div class="absolute top-[15%] right-[15%] w-3.5 h-3.5 bg-red-600 rounded-full border border-white shadow"></div>

            <div class="flex items-center gap-1.5 bg-white/70 backdrop-blur px-2 py-0.5 rounded text-[10px] text-neutral-600 font-semibold self-start z-10 border border-neutral-300/30">
              <span>Jarak tersisa: 340 meter</span>
            </div>
          </div>

          <div class="pt-2 flex flex-col gap-2">
            <button
              onclick={() => transactionStep = 'arrived'}
              class="w-full py-2.5 bg-success hover:bg-green-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check size={14} /> SAYA SUDAH TIBA DI LOKASI ✓
            </button>
            <div class="flex gap-2">
              <button onclick={onOpenChat} class="flex-1 py-1.5 bg-white border border-neutral-300 rounded font-bold text-neutral-700 hover:bg-neutral-50 flex items-center justify-center gap-1 text-[10px] cursor-pointer">
                <MessageSquare size={12} /> Chat Pembeli
              </button>
              <button onclick={onOpenDispute} class="flex-1 py-1.5 bg-[#fff5f5] text-red-600 border border-red-200 rounded font-bold hover:bg-red-50 flex items-center justify-center gap-1 text-[10px] cursor-pointer">
                <ShieldAlert size={12} /> Lapor Dispute
              </button>
            </div>
          </div>
        </div>
      </div>

    {:else if transactionStep === 'arrived'}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-sm">
          <div class="w-12 h-12 bg-green-50 text-success rounded-full flex items-center justify-center mx-auto mb-3">
            <Check size={28} />
          </div>
          <h3 class="font-bold text-sm text-neutral-900 mt-1 mb-1.5">Anda Sudah Tiba di Lokasi</h3>
          <p class="text-neutral-500 text-[11px] leading-relaxed mb-4">
            Silakan hubungi Ibu Sari untuk disambut dan diperlihatkan area kerja. Jika siap sedia, klik tombol 'Mulai Kerja' di bawah!
          </p>

          <button
            onclick={() => transactionStep = 'working'}
            class="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1 cursor-pointer"
          >
            🚀 MULAI BEKERJA (START WORK)
          </button>
        </div>
      </div>

    {:else if transactionStep === 'working'}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm space-y-4">
          <div class="flex justify-between items-center border-b border-[#e8e8e8] pb-2">
            <h3 class="font-bold text-sm text-neutral-900 leading-none mt-0">Progres Mengerjakan Aktif</h3>
            <span class="px-2 py-0.5 text-[9px] font-bold text-white bg-amber-500 rounded animate-pulse">LIVE</span>
          </div>

          <div class="bg-neutral-800 text-white p-4 rounded-lg text-center font-mono">
            <span class="text-[9px] text-neutral-400 block tracking-wider uppercase">Waktu Mulai Pengerjaan</span>
            <div class="text-2xl font-black mt-1 mb-0.5 tracking-widest text-[#f5a623]">01:14:26</div>
            <span class="text-[9px] text-neutral-400">Dimulai: 10:05 | Estimasi Pekerjaan: 4 jam</span>
          </div>

          <!-- Photo Proof Grid -->
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-bold text-neutral-500 uppercase">Dokumentasi Foto Progres:</span>
              <span class="text-[9px] text-neutral-400">Min. 1 foto wajib</span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button
                onclick={handleUploadPhoto}
                type="button"
                class="h-20 border-2 border-dashed border-neutral-300 rounded flex flex-col items-center justify-center text-neutral-400 hover:text-[#1890ff] hover:bg-blue-50/20 transition-all font-semibold cursor-pointer"
              >
                <Camera size={20} />
                <span class="text-[9px] mt-1">Tambah</span>
              </button>

              {#each proofPhotos as photo, index}
                <div class="h-20 rounded border border-neutral-200 relative overflow-hidden bg-neutral-100">
                  <img src={photo} alt="Bukti" class="w-full h-full object-cover" />
                  <button
                    onclick={() => handleDeletePhoto(index)}
                    class="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black cursor-pointer"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              {/each}
            </div>
          </div>

          <div class="pt-2">
            <button
              onclick={() => transactionStep = 'submitting_proof'}
              disabled={proofPhotos.length === 0}
              class="w-full py-2.5 font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1 transition-all cursor-pointer {
                proofPhotos.length > 0
                  ? 'bg-success text-white hover:bg-green-600'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }"
            >
              Selesaikan Pekerjaan &rarr;
            </button>
            <p class="text-[9px] text-neutral-400 text-center mt-2">Unggah minimal 1 foto dokumentasi progres proyek di atas demi validitas pencairan.</p>
          </div>
        </div>
      </div>

    {:else if transactionStep === 'submitting_proof' || transactionStep === 'waiting_approval'}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm space-y-4">
          {#if transactionStep === 'submitting_proof'}
            <h3 class="font-bold text-sm text-neutral-900 border-b border-[#e8e8e8] pb-2 mt-0">Ringkasan Selesai Kerja</h3>
            
            <div class="space-y-1">
              <label class="text-[10px] font-bold text-neutral-500 uppercase">Tulis Catatan Untuk Pembeli</label>
              <textarea
                placeholder="Contoh: Sudah selesai dicat ulang kamar tidur warna putih gading 2 kali usap, sisa sampah cat telah dibersihkan Bu..."
                bind:value={workerNote}
                rows={2.5}
                class="w-full text-xs p-3 border border-neutral-300 rounded focus:outline-none focus:border-[#1890ff] text-neutral-900"
              ></textarea>
            </div>

            <div class="bg-[#fafafa] rounded p-3 border">
              <span class="text-[9px] text-neutral-400 font-bold block mb-1">LAMPIRAN FOTO:</span>
              <div class="flex gap-2">
                {#each proofPhotos as photo}
                  <div class="w-14 h-14 rounded border overflow-hidden">
                    <img src={photo} alt="lampiran" class="w-full h-full object-cover" />
                  </div>
                {/each}
              </div>
            </div>

            <button
              onclick={() => transactionStep = 'waiting_approval'}
              class="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow cursor-pointer"
            >
              Kirim & Minta Konfirmasi &rarr;
            </button>
          {:else}
            <div class="text-center p-4 space-y-4">
              <div class="w-10 h-10 rounded-full border-4 border-[#e8e8e8] border-t-[#1890ff] animate-spin mx-auto"></div>
              <div>
                <h3 class="font-bold text-sm text-neutral-900 mt-1 mb-1">Menunggu Verifikasi Ibu Sari</h3>
                <p class="text-neutral-500 text-[11px] leading-relaxed">
                  Ibu Sari sedang memeriksa hasil pekerjaanmu di lokasi kerja. Biasanya konfirmasi berlangsung kurang dari 10 menit.
                </p>
              </div>
              <div class="bg-[#fffbe6] border border-[#ffe58f] p-3 text-left rounded text-amber-800 text-[10px] leading-snug">
                💡 <strong>Tips Mitra:</strong> Di saat menunggu, silakan bersihkan sisa peralatan, rapikan area sekitar, dan ucapkan terima kasih kepada Ibu Sari secara sopan.
              </div>

              <div class="pt-2 flex flex-col gap-2">
                <button onclick={onOpenChat} class="w-full py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-bold rounded text-[10px] uppercase cursor-pointer">
                  Hubungi Chat Ibu Sari
                </button>
                <div class="text-[10px] text-neutral-400 font-semibold italic">Auto-konfirmasi dalam 30 menit jika tidak ada tanggapan Klien.</div>
              </div>
            </div>
          {/if}
        </div>
      </div>

    {:else if transactionStep === 'done'}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-lg space-y-5">
          <div class="w-16 h-16 bg-[#e6f7ff] text-primary rounded-full flex items-center justify-center mx-auto text-2xl">
            🏆
          </div>
          <div>
            <h3 class="font-extrabold text-sm text-neutral-900 leading-none mb-1">Kerja Bagus, Pak Budi! 🎉</h3>
            <p class="text-neutral-500 text-[11px] leading-relaxed">Pekerjaan pengerjaan cat telah selesai dan sukses disetujui Ibu Sari.</p>
          </div>

          <!-- Ledger Komisi -->
          <div class="bg-success/5 border-2 border-dashed border-success/30 rounded-lg p-4">
            <span class="text-[9.5px] uppercase font-bold text-success block leading-none mb-1">KOMISI DITERIMA DI DOMPET:</span>
            <span class="text-xl font-mono font-extrabold text-success">Rp 175.000</span>
            <p class="text-[9px] text-neutral-400 mt-1.5 font-bold leading-none">Status: Sukses Dibayarkan & Cair Instan</p>
          </div>

          <!-- Rating from Employer -->
          <div class="bg-amber-50 rounded-lg border border-amber-200 p-3.5 text-left space-y-1.5 text-[10.5px]">
            <div class="flex justify-between items-center">
              <span class="font-bold text-amber-800 uppercase text-[9px] tracking-wide">Ulasan Bintang Ibu Sari:</span>
              <div class="flex text-amber-400">
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
              </div>
            </div>
            <p class="text-neutral-600 italic">"Sangat ramah, hasil catnya rapi dan bersih kembali setelah dibereskan. Membawa semua perlengkapan sendiri. Highly recommended!"</p>
          </div>

          <!-- Progress and Level Update -->
          <div class="bg-neutral-50 rounded border p-3 flex justify-between items-center text-left text-[11px] cursor-pointer" onclick={() => showScoreModal = true}>
            <div>
              <span class="font-extrabold text-neutral-800 block">KerjantaraScore Naik! ⭐</span>
              <span class="text-neutral-400 text-[10px]">Tingkat kepatuhan proyek optimal · Lihat rincian</span>
            </div>
            <span class="font-mono font-black text-primary">4.90 &rarr; 4.92</span>
          </div>

          <div class="pt-2 space-y-2">
            <button
              onclick={onRestartTransaction}
              class="w-full py-2.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow cursor-pointer"
            >
              Siap Sedia Terima Tawaran Baru (Reset)
            </button>
          </div>
        </div>
      </div>
    {/if}

  </div>

  <!-- GAMIFICATION MODAL -->
  {#if showScoreModal}
    <div class="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-all p-3">
      <div class="bg-white w-full max-w-sm sm:max-w-md rounded-t-2xl rounded-b-xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200/90 max-h-[85%]">
        <header class="px-4 py-3 bg-gradient-to-r from-neutral-900 to-neutral-950 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Award size={18} class="text-amber-400" />
            <div class="text-left font-sans">
              <h4 class="font-extrabold text-xs text-white leading-none">Rincian KerjantaraScore</h4>
              <span class="text-[9px] text-neutral-400 leading-none block mt-0.5">Metrik Reputasi & Badge Pencapaian</span>
            </div>
          </div>
          <button 
            onclick={() => showScoreModal = false}
            class="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </header>

        <!-- Menu Tabs -->
        <div class="flex border-b border-neutral-200 bg-neutral-50/50">
          {#each ['progress', 'badges', 'metrics'] as tab}
            <button 
              onclick={() => activeScoreSubTab = tab as any}
              class="flex-1 py-3 font-bold text-[10px] tracking-wider border-b-2 text-center transition-all cursor-pointer {
                activeScoreSubTab === tab 
                  ? 'border-[#1890ff] text-[#1890ff] bg-white' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }"
            >
              {#if tab === 'progress'}PROGRES LEVEL{/if}
              {#if tab === 'badges'}BADGE AKTIF{/if}
              {#if tab === 'metrics'}NILAI METRIK{/if}
            </button>
          {/each}
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          {#if activeScoreSubTab === 'progress'}
            <div class="space-y-4 text-left">
              <div class="bg-amber-50/60 border border-amber-200/50 rounded-xl p-4 relative overflow-hidden">
                <div class="absolute top-0 right-0 text-amber-500/10 text-7xl font-sans font-black select-none leading-none -translate-y-2 translate-x-1">4</div>
                <span class="text-[9px] bg-amber-400 font-extrabold text-neutral-900 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                  🥇 LEVEL 4 / GOLD
                </span>
                <h3 class="font-extrabold text-xs text-amber-900 uppercase tracking-wide leading-none mt-1.5 mb-1">Gold Worker Elite</h3>
                
                <div class="my-2.5 flex flex-col">
                  <div class="text-2xl font-black text-neutral-900 flex items-baseline gap-1">
                    4.92<span class="text-xs font-semibold text-neutral-500">/ 5.0</span>
                  </div>
                  <span class="text-[9px] text-neutral-500 font-medium leading-normal mt-0.5">Skor performa murni berdasarkan kepatuhan ketiadaan kecurangan, ketepatan waktu, dan rating bintang.</span>
                </div>

                <div class="space-y-1.5 text-left border-t border-amber-200/40 pt-2.5">
                  <div class="flex justify-between items-center text-[9px]">
                    <span class="font-bold text-neutral-600">Target Level 5 (Platinum)</span>
                    <span class="font-mono font-bold text-[#1890ff]">Minimal: 4.95 ⭐</span>
                  </div>
                  <div class="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-[#1890ff] h-full rounded-full transition-all duration-500" style="width: 90%"></div>
                  </div>
                  <div class="flex justify-between text-[8px] text-neutral-550 font-medium leading-none">
                    <span>Kurang 0.03 Poin</span>
                    <span>Selesaikan 8 Proyek lagi</span>
                  </div>
                </div>
              </div>

              <!-- benefits -->
              <div class="space-y-2">
                <h5 class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest leading-none">Keuntungan Anda (Tingkat Emas):</h5>
                <div class="grid grid-cols-1 gap-1.5">
                  <div class="flex items-start gap-2 p-2 bg-[#f6ffed] border border-[#b7eb8f] rounded-lg">
                    <span class="text-xs text-success font-bold mt-0.5">✓</span>
                    <div class="text-left font-sans">
                      <p class="font-extrabold text-[10px] text-neutral-800 leading-tight">Prioritas Pencarian Utama (+25%)</p>
                      <p class="text-[9px] text-neutral-500 leading-tight mt-0.5">Profil ditampilkan paling atas bagi Klien di radius terdekat.</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2 p-2 bg-[#f6ffed] border border-[#b7eb8f] rounded-lg">
                    <span class="text-xs text-success font-bold mt-0.5">✓</span>
                    <div class="text-left font-sans">
                      <p class="font-extrabold text-[10px] text-neutral-800 leading-tight">Label Emas Mengkilap</p>
                      <p class="text-[9px] text-neutral-500 leading-tight mt-0.5">Sertifikasi ikon verified menarik klien berkali-kali lipat.</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-2 p-2 bg-[#f6ffed] border border-[#b7eb8f] rounded-lg">
                    <span class="text-xs text-success font-bold mt-0.5">✓</span>
                    <div class="text-left font-sans">
                      <p class="font-extrabold text-[10px] text-neutral-800 leading-tight">Pencairan Instan Bebas Admin</p>
                      <p class="text-[9px] text-neutral-500 leading-tight mt-0.5">Semua proses pencairan saldo komisi dibebaskan dari biaya admin.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {:else if activeScoreSubTab === 'badges'}
            <div class="space-y-2.5">
              <div class="grid grid-cols-1 gap-2">
                <!-- Badge 1 -->
                <div class="p-2.5 border border-amber-200/60 bg-amber-50/40 rounded-xl flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                    🏆
                  </div>
                  <div class="flex-1 min-w-0 text-left font-sans">
                    <div class="flex items-center gap-1.5">
                      <h6 class="font-extrabold text-[11px] text-neutral-800 leading-none">Raja Proyek Rakyat</h6>
                      <span class="text-[8px] bg-amber-400 text-neutral-900 font-extrabold px-1.5 py-0.5 rounded leading-none uppercase scale-90">Aktif</span>
                    </div>
                    <p class="text-[9px] text-neutral-550 mt-1 leading-snug">Berhasil menyelesaikan lebih dari 100 proyek tanpa pembatalan sepihak.</p>
                  </div>
                </div>

                <!-- Badge 2 -->
                <div class="p-2.5 border border-amber-200/60 bg-amber-50/40 rounded-xl flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-lg shrink-0">
                    ⚡
                  </div>
                  <div class="flex-1 min-w-0 text-left font-sans">
                    <div class="flex items-center gap-1.5">
                      <h6 class="font-extrabold text-[11px] text-neutral-800 leading-none">Petir Ketepatan Waktu</h6>
                      <span class="text-[8px] bg-amber-400 text-neutral-900 font-extrabold px-1.5 py-0.5 rounded leading-none uppercase scale-90">Aktif</span>
                    </div>
                    <p class="text-[9px] text-neutral-550 mt-1 leading-snug">Rata-rata kedatangan sebelum jam pengerjaan yang didukung GPS.</p>
                  </div>
                </div>

                <!-- Badge 3 -->
                <div class="p-2.5 border border-blue-200/60 bg-blue-50/30 rounded-xl flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-lg shrink-0">
                    🤝
                  </div>
                  <div class="flex-1 min-w-0 text-left font-sans">
                    <div class="flex items-center gap-1.5">
                      <h6 class="font-extrabold text-[11px] text-neutral-800 leading-none">Mitra Tertib Prima</h6>
                      <span class="text-[8px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded leading-none uppercase scale-90">Aktif</span>
                    </div>
                    <p class="text-[9px] text-neutral-550 mt-1 leading-snug">Selalu disiplin mengunggah foto sebelum & sesudah pengerjaan secara transparan.</p>
                  </div>
                </div>

                <!-- Badge 4 -->
                <div class="p-2.5 border border-neutral-200 bg-white rounded-xl flex items-center gap-3 opacity-75">
                  <div class="w-9 h-9 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-lg shrink-0 filter grayscale">
                    🌟
                  </div>
                  <div class="flex-1 min-w-0 text-left font-sans">
                    <div class="flex items-center justify-between">
                      <h6 class="font-extrabold text-[11px] text-neutral-505 leading-none">Bintang Tetangga</h6>
                      <span class="text-[8px] bg-neutral-200 text-neutral-600 font-bold px-1.5 py-0.5 rounded leading-none uppercase">Progress (8/10)</span>
                    </div>
                    <div class="mt-1.5 w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                      <div class="bg-amber-400 h-full rounded-full" style="width: 80%"></div>
                    </div>
                    <p class="text-[9px] text-neutral-400 mt-1 leading-snug">Raih 10 kali ulasan bintang lima berturut-turut tanpa jeda aduan.</p>
                  </div>
                </div>
              </div>
            </div>
          {:else if activeScoreSubTab === 'metrics'}
            <div class="space-y-3">
              <span class="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 text-left">Nilai Performa Anda:</span>
              <div class="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white text-left font-sans">
                <div class="p-2.5 flex justify-between items-center bg-neutral-50/50">
                  <div class="min-w-0 flex-1">
                    <span class="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Ketepatan Jam Datang</span>
                    <p class="text-[9px] text-neutral-400 leading-none">Sistem GPS & kecocokan OTP</p>
                  </div>
                  <span class="font-black text-xs text-[#1890ff] shrink-0 ml-2">⭐ 4.95 / 5.0</span>
                </div>

                <div class="p-2.5 flex justify-between items-center bg-neutral-50/50">
                  <div class="min-w-0 flex-1">
                    <span class="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Komunikasi & Sikap Kerja</span>
                    <p class="text-[9px] text-neutral-400 leading-none">Kepuasan obrolan & sopan santun</p>
                  </div>
                  <span class="font-black text-xs text-[#1890ff] shrink-0 ml-2">⭐ 4.88 / 5.0</span>
                </div>
                
                <div class="p-2.5 flex justify-between items-center bg-neutral-50/50">
                  <div class="min-w-0 flex-1">
                    <span class="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Kerapihan & Kualitas Hasil</span>
                    <p class="text-[9px] text-neutral-400 leading-none">Berdasarkan data ulasan feedback Klien</p>
                  </div>
                  <span class="font-black text-xs text-[#1890ff] shrink-0 ml-2">⭐ 4.94 / 5.0</span>
                </div>

                <div class="p-2.5 flex justify-between items-center bg-neutral-50/50">
                  <div class="min-w-0 flex-1">
                    <span class="font-extrabold text-[11px] text-neutral-800 block leading-none mb-1">Bebas Pelanggaran Sewenang-wenang</span>
                    <p class="text-[9px] text-neutral-400 leading-none">Aman dari klaim sengketa / denda penalti</p>
                  </div>
                  <span class="font-black text-[10px] text-success shrink-0 ml-2">100% BEBAS ✓</span>
                </div>
              </div>

              <p class="text-neutral-500 font-medium text-[9px] leading-relaxed text-center mt-3 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                💡 <strong>Tips Menjaga Skor:</strong> Hindari membatalkan kontrak sepihak kurang dari 24 jam sebelum pengerjaan agar reputasi Emas Anda selalu bersinar optimal!
              </p>
            </div>
          {/if}
        </div>

        <footer class="p-3 border-t border-neutral-100 bg-neutral-50 flex gap-2">
          <button 
            onclick={() => showScoreModal = false}
            class="flex-1 py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-md transition-colors cursor-pointer"
          >
            Tutup Rincian
          </button>
        </footer>
      </div>
    </div>
  {/if}

  <!-- FLOATING BOTTOM MENU BAR -->
  <div class="absolute bottom-4 left-4 right-4 z-40 bg-[#001529]/95 backdrop-blur-md text-white rounded-xl shadow-[0_8px_24px_rgba(0,10,30,0.25)] border border-white/10 py-1.5 px-3 flex items-center justify-around max-w-sm sm:max-w-md mx-auto">
    <!-- Beranda/Dashboard Button -->
    <button
      onclick={() => activeMenu = 'beranda'}
      class="flex-1 max-w-[90px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative cursor-pointer {
        activeMenu === 'beranda'
          ? 'text-[#1890ff] scale-105 font-bold'
          : 'text-[#ffffffa6] hover:text-white'
      }"
    >
      <Award size={16} />
      <span class="text-[9px] font-bold tracking-tight font-sans">Dashboard</span>
      {#if activeMenu === 'beranda'}
        <div class="absolute bottom-0 w-3 h-0.5 bg-[#1895ff] rounded-full"></div>
      {/if}
    </button>
    
    <!-- KitaDompet Button -->
    <button
      onclick={() => activeMenu = 'dompet'}
      class="flex-1 max-w-[90px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative cursor-pointer {
        activeMenu === 'dompet'
          ? 'text-[#1890ff] scale-105 font-bold'
          : 'text-[#ffffffa6] hover:text-white'
      }"
    >
      <TrendingUp size={16} />
      <span class="text-[9px] font-bold tracking-tight font-sans">KitaDompet</span>
      {#if activeMenu === 'dompet'}
        <div class="absolute bottom-0 w-3 h-0.5 bg-[#1895ff] rounded-full"></div>
      {/if}
    </button>

    <!-- Chat Live Button -->
    {#if transactionStep !== 'idle'}
      <button
        onclick={onOpenChat}
        class="flex-1 max-w-[90px] flex flex-col items-center gap-1 py-1 rounded-md text-[#ffffffa6] hover:text-white transition-all cursor-pointer"
      >
        <MessageSquare size={16} />
        <span class="text-[9px] font-bold tracking-tight font-sans">Chat Live</span>
      </button>
    {/if}
  </div>

  {#if showPayoutAnim}
    <div class="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center p-4 overflow-hidden">
      <div class="absolute inset-0 bg-success/10 animate-fade-out" style="animation-duration: 3s"></div>
      
      <div class="bg-white px-5 py-4 rounded-2xl shadow-2xl border-4 border-success flex flex-col items-center animate-slide-up transform translate-y-0 opacity-100 z-10 transition-all">
        <div class="w-16 h-16 bg-success rounded-full flex items-center justify-center -mt-10 mb-2 shadow-lg border-4 border-white animate-bounce">
          <span class="text-3xl">💸</span>
        </div>
        <h3 class="font-black text-xl text-neutral-900 tracking-tight leading-none mb-1">Cair ke KitaDompet!</h3>
        <p class="text-[11px] font-bold text-success bg-success/10 px-3 py-1 rounded-full uppercase tracking-widest mt-1 mb-2">Escrow Dilepas Klien</p>
        <p class="text-xs text-neutral-500 font-medium text-center leading-relaxed">Hasil jerih payahmu telah masuk otomatis dan siap ditarik.</p>
      </div>
    </div>
  {/if}

</div>
