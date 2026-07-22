<script lang="ts">
  import { 
    Plus, Users, Eye, Phone, MessageSquare, Star, Play, CheckCircle2, 
    MapPin, Clock, ShieldAlert, Award, FileText, ChevronRight, X, AlertTriangle, Loader2
  } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { api } from '../api/client';
  import type { SkillCategory, RateCard, CreateJobRequest, CreateJobResponse, Candidate, CreatePaymentResponse } from '../api/types';
  import type { JobRequest, WorkerProfile, TransactionStep } from '../types';
  import { appState } from '../appState.svelte';
  import { getAddressFromCoords } from '../api/geo';
  import KerjantaraLogo from '../components/KerjantaraLogo.svelte';

  let {
    userName,
    transactionStep = $bindable(),
    jobRequest = $bindable(),
    selectedWorker = $bindable(),
    onOpenChat,
    onOpenDispute,
    onRestartTransaction,
    onLogout
  } = $props<{
    userName: string;
    transactionStep: TransactionStep;
    jobRequest: JobRequest;
    selectedWorker: WorkerProfile | null;
    onOpenChat: () => void;
    onOpenDispute: () => void;
    onRestartTransaction: () => void;
    onLogout?: () => void;
  }>();
  
  let activeMenu = $state<'beranda' | 'permintaan' | 'pekerja' | 'pesan'>('beranda');
  
  // Job Form States
  let parentCategoryId = $state<number | null>(null);
  let selectedCategoryId = $state<number | null>(null);
  let description = $state('');
  let location = $state('Mencari lokasi...');
  let duration = $state('Setengah hari');
  let budget = $state('180000');
  let lat = $state(-6.2088);
  let lng = $state(106.8456);

  // Map States
  let map: any = null;
  let marker: any = null;
  
  let starCount = $state(5);
  let reviewInput = $state('');
  let aspects = $state<string[]>([]);
  let submittedRating = $state(false);
  let showEscrowModal = $state(false);

  let selectedPersonality = $state<string>('Semua');
  let portfolioWorker = $state<WorkerProfile | null>(null);

  let parentCategories = $state<SkillCategory[]>([]);
  let rateCards = $state<RateCard[]>([]);
  let isLoadingData = $state(false);

  // Derived flat list for easier lookups
  const allSubCategories = $derived(
    parentCategories.flatMap(p => p.children || [])
  );

  const subCategories = $derived(
    parentCategoryId 
      ? parentCategories.find(p => p.id === parentCategoryId)?.children || []
      : []
  );

  // Sync sub-category selection when parent changes
  $effect(() => {
    if (parentCategoryId) {
      const sub = parentCategories.find(p => p.id === parentCategoryId)?.children;
      if (sub && sub.length > 0) {
        if (!sub.some(s => s.id === selectedCategoryId)) {
          selectedCategoryId = sub[0].id;
        }
      }
    }
  });

  onMount(async () => {
    isLoadingData = true;
    
    // 1. Fetch Categories First (Independent)
    try {
      const response = await api.get<{ categories: SkillCategory[] }>('/ref/skill-categories');
      if (response && response.categories) {
        parentCategories = response.categories;
        console.log("Categories loaded:", parentCategories.length);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Fallback
      parentCategories = [
        { 
          id: 10, label: "Konstruksi & Renovasi", code: "KONSTRUKSI", 
          children: [
            { id: 11, label: "Tukang Cat", code: "TUKANG_CAT" },
            { id: 14, label: "Tukang Ledeng", code: "TUKANG_LEDENG" }
          ]
        },
        { 
          id: 1, label: "Rumah Tangga", code: "RUMAH_TANGGA",
          children: [
            { id: 2, label: "ART Harian", code: "ART_HARIAN" }
          ]
        }
      ];
    }

    // 2. Fetch Rate Cards (Optional, don't block)
    try {
      const rates = await api.get<RateCard[]>('/ref/rate-cards');
      if (rates) rateCards = rates;
    } catch (err) {
      console.warn('Failed to fetch rate cards:', err);
    }

    // 3. Initial Selection
    if (parentCategories.length > 0) {
      if (parentCategoryId === null) parentCategoryId = parentCategories[0].id;
      
      const sub = parentCategories.find(p => p.id === parentCategoryId)?.children;
      if (sub && sub.length > 0 && selectedCategoryId === null) {
        selectedCategoryId = sub[0].id;
      }
    }

    isLoadingData = false;

    // 4. Initialize Map
    if (transactionStep === 'creating') {
      setTimeout(initMap, 200);
    }
  });

  // Re-init map when step changes to creating
  $effect(() => {
    if (transactionStep === 'creating' && !map) {
      setTimeout(initMap, 100);
    }
  });

  async function initMap() {
    if (typeof window === 'undefined' || !(window as any).L) return;
    if (!document.getElementById('map-container')) return;
    const L = (window as any).L;

    // Get current location
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
      });
      lat = pos.coords.latitude;
      lng = pos.coords.longitude;
    } catch (e) {
      console.warn("Could not get GPS, using default");
    }

    if (!map) {
      map = L.map('map-container').setView([lat, lng], 16);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      marker = L.marker([lat, lng], { draggable: true }).addTo(map);
      
      marker.on('moveend', async (e: any) => {
        const newPos = e.target.getLatLng();
        lat = newPos.lat;
        lng = newPos.lng;
        location = "Mencari alamat...";
        location = await getAddressFromCoords(lat, lng);
      });

      // Initial address fetch
      location = await getAddressFromCoords(lat, lng);
    } else {
      map.setView([lat, lng], 16);
      marker.setLatLng([lat, lng]);
    }
  }

  const selectedRateCard = $derived(
    rateCards.find(r => r.skill_cat_id === selectedCategoryId)
  );

  const categoryName = $derived(
    allSubCategories.find(c => c.id === selectedCategoryId)?.label || "Pekerjaan"
  );

  let candidates = $state<WorkerProfile[]>([]);

  $effect(() => {
    // Logic for matching removed as it is now in handlePostJob
  });

  let isPostingJob = $state(false);

  const handlePostJob = async () => {
    if (isPostingJob || !selectedCategoryId) return;
    isPostingJob = true;

    try {
      // 1. Prepare Request
      const payload: CreateJobRequest = {
        skill_cat_id: selectedCategoryId,
        description: description || "Saya mencari tukang profesional untuk menyelesaikan perbaikan.",
        budget: parseInt(budget) || 0,
        lat: lat,
        lng: lng,
        city_code: "JAKARTA" // Default for now, can be extracted from Nominatim address
      };

      // 2. UI Transition
      transactionStep = 'matching';

      // 3. API Call
      const res = await api.post<CreateJobResponse>('/jobs', payload);
      
      // Sync global state
      appState.currentJob = { id: res.job_id } as any;

      // Update Local State for UI
      jobRequest = {
        category: allSubCategories.find(c => c.id === selectedCategoryId)?.label || "Pekerjaan",
        description: payload.description,
        location: location,
        duration: duration,
        budget: budget ? `Rp ${parseInt(budget).toLocaleString('id-ID')}` : 'Negosiasi'
      };

      // Map backend candidates to frontend WorkerProfile format
      candidates = res.candidates.map(c => ({
        name: c.full_name,
        avatar: c.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.full_name)}&background=random`,
        rating: c.kerjantara_score,
        completedJobs: c.total_jobs_done,
        distance: `${c.distance_km.toFixed(1)} km`,
        status: "Tersedia",
        skills: [jobRequest.category],
        price: c.price || budget,
        bio: c.bio,
        match_id: c.match_id,
        worker_id: c.worker_id
      } as any));

      // 4. Done matching
      setTimeout(() => {
        transactionStep = 'kandidat_list';
      }, 1500);

    } catch (err: any) {
      console.error("Job posting error:", err);
      alert("Gagal membuat pekerjaan: " + (err.message || "Terjadi kesalahan sistem."));
      transactionStep = 'creating';
    } finally {
      isPostingJob = false;
    }
  };

  const handleSelectCandidate = (candidate: any) => {
    selectedWorker = candidate;
  };

  const handleSendProposal = async () => {
    if (!selectedWorker?.match_id || !appState.currentJob) {
      alert("Harap pilih pekerja terlebih dahulu.");
      return;
    }

    try {
      // 1. Accept match in backend
      await api.patch(`/jobs/${appState.currentJob.id}/accept-match`, {
        match_id: selectedWorker.match_id
      });

      // 2. Open payment modal
      showEscrowModal = true;
    } catch (err: any) {
      console.error("Match acceptance error:", err);
      if (err.code === 'JOB_TAKEN') {
        alert("Maaf, pekerja ini baru saja mengambil pekerjaan lain. Silakan pilih kandidat lain.");
      } else {
        alert("Gagal menghubungi pekerja: " + (err.message || "Terjadi kesalahan"));
      }
    }
  };

  const confirmEscrowPayment = async () => {
    if (!appState.currentJob) return;
    
    try {
      // 1. Create Payment session in backend
      const paymentRes = await api.post<CreatePaymentResponse>('/payments/create', {
        job_id: appState.currentJob.id
      });

      // 2. Open Midtrans Snap UI
      const snap = (window as any).snap;
      if (!snap) throw new Error("Midtrans SDK not loaded");

      snap.pay(paymentRes.snap_token, {
        onSuccess: (result: any) => {
          console.log('Payment success:', result);
          showEscrowModal = false;
          transactionStep = 'proposal_sent';
        },
        onPending: (result: any) => {
          console.log('Payment pending:', result);
          alert("Pembayaran tertunda. Harap selesaikan pembayaran Anda.");
        },
        onError: (result: any) => {
          console.error('Payment error:', result);
          alert("Gagal melakukan pembayaran.");
        },
        onClose: () => {
          console.log('Payment popup closed');
        }
      });

    } catch (err: any) {
      console.error("Payment initiation error:", err);
      alert("Gagal memproses pembayaran: " + (err.message || "Terjadi kesalahan"));
    }
  };

  const toggleAspect = (aspect: string) => {
    if (aspects.includes(aspect)) {
      aspects = aspects.filter(a => a !== aspect);
    } else {
      aspects = [...aspects, aspect];
    }
  };

  let isConfirming = $state(false);

  const handleConfirmJob = async () => {
    if (!appState.currentJob || isConfirming) return;
    isConfirming = true;

    try {
      await api.patch(`/jobs/${appState.currentJob.id}/confirm`);
      transactionStep = 'done';
    } catch (err: any) {
      console.error("Confirmation error:", err);
      alert("Gagal mengkonfirmasi pekerjaan: " + (err.message || "Terjadi kesalahan"));
    } finally {
      isConfirming = false;
    }
  };
</script>

<div class="flex-1 flex flex-col bg-[#F0F2F5] text-neutral-900 h-full overflow-hidden font-sans text-xs relative">
  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col overflow-y-auto relative bg-[#f0f2f5] min-h-full pb-24">
    
    <!-- TOP COMPACT STATUS BAR -->
    <div class="bg-white border-b border-[#e8e8e8] px-4 py-2 flex items-center justify-between shadow-sm shrink-0">
      <KerjantaraLogo iconSize={18} textSize="text-xs" />
      
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 font-sans">
          <div class="w-5 h-5 rounded-full bg-[#1890ff] text-white flex items-center justify-center font-bold text-[9px]">
            {userName.slice(0, 1).toUpperCase()}
          </div>
          <span class="text-[10px] font-semibold text-neutral-600 max-w-[80px] lg:max-w-[120px] truncate">{userName}</span>
        </div>
        
        <span class="text-[9px] text-primary bg-[#e6f7ff] border border-[#91d5ff] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0">
          Employer
        </span>

        {#if onLogout}
          <div class="h-4 w-px bg-neutral-200"></div>
          <button
            onclick={onLogout}
            class="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-[9px] rounded shadow-xs uppercase cursor-pointer"
          >
            Keluar
          </button>
        {/if}
      </div>
    </div>

    <!-- Verification Pending Banner -->
    {#if appState.user?.verif_status === 'pending'}
      <div class="bg-blue-600 text-white px-4 py-3 flex items-center gap-3 shadow-md">
        <div class="bg-white/20 p-1.5 rounded-lg shrink-0">
          <Clock size={20} class="text-white animate-pulse" />
        </div>
        <div class="flex-1">
          <p class="text-[11px] font-bold leading-tight">Verifikasi Identitas Sedang Diproses</p>
          <p class="text-[9px] text-blue-100 mt-0.5 leading-snug">Data KTP & Selfie Anda sedang ditinjau admin. Beberapa fitur mungkin terbatas hingga disetujui.</p>
        </div>
      </div>
    {/if}

    <!-- CONTENT SWITCHING -->
    {#if transactionStep === 'idle'}
      <div class="p-4 space-y-4">
        <!-- Elegant Greeting Card -->
        <div class="bg-gradient-to-r from-[#1890ff] to-[#096dd9] text-white rounded-lg p-5 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <p class="text-[10px] text-blue-100 uppercase tracking-wider mb-1 font-semibold">Selamat Datang 👋</p>
          <h2 class="text-lg font-bold mb-1">Halo, {userName || 'Ibu Sari'}</h2>
          <p class="text-[11px] text-blue-100 leading-snug">Cari tenaga terpercaya terdekat dalam hitungan detik. KTP aman terverifikasi.</p>
          
          <div class="mt-4 flex items-center gap-4 text-xs font-semibold">
            <div class="bg-white/15 px-3 py-1.5 rounded-md flex items-center gap-1">
              <span>✨ KerjantaraScore:</span>
              <span class="text-warning">⭐ 4.8</span>
            </div>
            <div class="bg-white/15 px-3 py-1.5 rounded-md">
              💼 2 Pekerjaan Terakhir
            </div>
          </div>
        </div>

        <!-- Quick Action CTA -->
        <button
          onclick={() => transactionStep = 'creating'}
          class="w-full bg-[#f5a623] hover:bg-[#e0951a] text-neutral-900 h-12 rounded-lg font-bold text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Plus size={18} />
          Cari Pekerja Sekarang &rarr;
        </button>

        <!-- Reputation Card -->
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
          <h3 class="font-bold text-neutral-800 border-b border-[#e8e8e8] pb-2 mb-3 mt-0 flex items-center gap-1.5">
            <Award size={16} class="text-[#1890ff]" />
            Sistem Reputasi Kerjantara
          </h3>
          <div class="flex items-center gap-4">
            <div class="text-center shrink-0">
              <div class="text-3xl font-extrabold text-neutral-900 leading-none">4.8</div>
              <div class="flex text-amber-400 mt-1 justify-center">
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
                <Star size={11} fill="currentColor" />
              </div>
              <p class="text-[9px] text-neutral-400 mt-1 font-semibold">2 ulasan diterima</p>
            </div>
            <div class="flex-1 bg-neutral-50 rounded-lg p-3 border border-neutral-100 text-[11px] text-neutral-500 leading-relaxed">
              "Sangat profesional, menyambut pekerja dengan ramah dan selalu membayar bonus tambahan jika pekerjaan cepat selesai." <br/>
              <span class="font-semibold text-[#1890ff] mt-1 block">— Pak Baim, Tukang Ledeng</span>
            </div>
          </div>
        </div>

        <!-- Riwayat Transaksi -->
        <div class="bg-white border border-[#e8e8e8] rounded-lg shadow-sm">
          <h3 class="font-bold text-neutral-800 border-b border-[#e8e8e8] p-3 mt-0 flex justify-between items-center bg-[#fafafa]">
            <span>Riwayat Transaksi</span>
            <span class="text-xs text-[#1890ff] font-semibold cursor-pointer">Lihat Semua</span>
          </h3>
          <div class="divide-y divide-[#e8e8e8]">
            <div class="p-3 flex justify-between items-center hover:bg-[#fafafa] transition-colors">
              <div>
                <p class="font-bold text-neutral-800 text-sm">Pak Baim (Ledeng)</p>
                <p class="text-neutral-400 text-[10px] mt-0.5">Wastafel bocor · 12 Mei 2026</p>
              </div>
              <div class="text-right">
                <div class="text-xs font-bold text-neutral-900">Rp 120.000</div>
                <span class="text-[10px] text-success bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-bold">SUKSES</span>
              </div>
            </div>
            <div class="p-3 flex justify-between items-center hover:bg-[#fafafa] transition-colors">
              <div>
                <p class="font-bold text-neutral-800 text-sm">Pak Cecep (Taman)</p>
                <p class="text-neutral-400 text-[10px] mt-0.5">Rapikan kebun depan · 28 April 2026</p>
              </div>
              <div class="text-right">
                <div class="text-xs font-bold text-neutral-900">Rp 150.000</div>
                <span class="text-[10px] text-success bg-green-50 border border-green-200 px-1.5 py-0.5 rounded font-bold">SUKSES</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    {:else if transactionStep === 'creating'}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-4 shadow-sm">
          <div class="flex items-center justify-between border-b border-[#e8e8e8] pb-3 mb-4">
            <h3 class="font-bold text-base text-neutral-950 flex items-center gap-1.5 mt-0">
              Buat Permintaan Baru
            </h3>
            <button 
              onclick={() => transactionStep = 'idle'}
              class="text-neutral-400 hover:text-neutral-600 p-1 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div class="space-y-4">
            <!-- 1. Kategori (Two-Tier Dropdown) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div class="space-y-1.5">
                  <label class="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Kategori Utama</label>
                  <select 
                    bind:value={parentCategoryId}
                    class="w-full h-11 px-3 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary transition-all cursor-pointer"
                  >
                     {#if isLoadingData}
                        <option value={null}>Memuat...</option>
                     {:else}
                        {#if parentCategories.length === 0}
                           <option value={null}>Tidak ada kategori</option>
                        {/if}
                        {#each parentCategories as cat}
                           <option value={cat.id}>{cat.label}</option>
                        {/each}
                     {/if}
                  </select>
               </div>
               <div class="space-y-1.5">
                  <label class="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Sub-Kategori Keahlian</label>
                  <select 
                    bind:value={selectedCategoryId}
                    disabled={!parentCategoryId || isLoadingData}
                    class="w-full h-11 px-3 bg-white border border-neutral-300 rounded-lg text-sm focus:outline-none focus:border-primary transition-all disabled:bg-neutral-50 cursor-pointer"
                  >
                     {#if isLoadingData}
                        <option value={null}>Memuat...</option>
                     {:else}
                        {#if subCategories.length === 0}
                           <option value={null}>Pilih kategori utama dahulu</option>
                        {/if}
                        {#each subCategories as sub}
                           <option value={sub.id}>{sub.label}</option>
                        {/each}
                     {/if}
                  </select>
               </div>
            </div>

            <!-- 2. Deskripsi -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Detail Masalah (Deskripsi Pekerjaan)</label>
              <textarea
                placeholder="Contoh: Saya butuh tukang untuk mengecat kamar tidur ukuran 4x3 meter, warna putih minimalis..."
                bind:value={description}
                rows={2}
                class="w-full text-sm p-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary placeholder:text-neutral-400 text-neutral-900 leading-relaxed"
              ></textarea>
            </div>

            <!-- 3. Lokasi & Map -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Alamat Pengerjaan</label>
              <textarea
                bind:value={location}
                rows={2}
                class="w-full text-xs p-3 border border-neutral-300 rounded-t-lg focus:outline-none focus:border-primary"
              ></textarea>
              <div id="map-container" class="h-48 bg-neutral-100 rounded-b-lg border-x border-b border-neutral-300 relative overflow-hidden z-0">
                 <!-- Map will be injected here -->
              </div>
              <p class="text-[9px] text-neutral-400 italic">Geser pin pada peta untuk menyesuaikan lokasi tepatnya</p>
            </div>

            <!-- 4. Durasi -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Rencana Durasi</label>
              <div class="flex gap-2">
                {#each ['Setengah hari', 'Satu hari penuh', 'Lebih dari 1 hari'] as dur}
                  <button
                    type="button"
                    onclick={() => duration = dur}
                    class="flex-1 py-2 text-[10px] font-bold border rounded-md transition-all cursor-pointer {
                      duration === dur
                        ? 'bg-[#1890ff] border-[#1890ff] text-white'
                        : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                    }"
                  >
                    {dur}
                  </button>
                {/each}
              </div>
            </div>

            <!-- 5. Anggaran -->
            <div class="space-y-1.5">
              <label class="text-[11px] font-bold text-neutral-600 uppercase tracking-wide">Taksiran Anggaran (Rp)</label>
              <div class="relative">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-xs">Rp</div>
                <input
                  type="tel"
                  value={budget}
                  oninput={(e) => budget = formatRupiah((e.target as HTMLInputElement).value)}
                  placeholder="Contoh: 180.000"
                  class="w-full pl-9 pr-4 py-2.5 text-xs font-bold border border-neutral-300 rounded-[6px] focus:outline-none focus:border-[#1890ff]"
                />
              </div>
              {#if selectedRateCard}
                <div class="bg-blue-50 border border-blue-100 rounded p-2 mt-1">
                  <p class="text-[9px] text-blue-700 leading-tight">
                    <span class="font-bold">💡 Saran Harga:</span> {selectedRateCard.label} (Rp {selectedRateCard.min_rate.toLocaleString('id-ID')} - {selectedRateCard.max_rate.toLocaleString('id-ID')})
                  </p>
                </div>
              {:else}
                <span class="text-[10px] text-neutral-400 leading-none">Kosongkan bila ingin menegosiasikan harga di tempat</span>
              {/if}
            </div>
          </div>

          <div class="mt-6">
            <button
              type="button"
              onclick={handlePostJob}
              disabled={isPostingJob || isLoadingData}
              class="w-full bg-[#1890ff] hover:bg-blue-600 text-white py-3 rounded-lg font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {#if isPostingJob}
                <Loader2 class="animate-spin" size={14} />
                Mencari Pekerja Terdekat...
              {:else}
                Cari Pekerja Sekarang &rarr;
              {/if}
            </button>
          </div>
        </div>
      </div>

    {:else if transactionStep === 'matching'}
      <div class="flex-1 flex flex-col items-center justify-center p-6 text-center select-none bg-white">
        <div class="relative w-24 h-24 mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-neutral-100"></div>
          <div class="absolute inset-0 rounded-full border-4 border-t-primary animate-spin"></div>
          <div class="absolute inset-2 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold">🎯</div>
        </div>
        
        <h3 class="text-base font-bold text-neutral-900 mb-2">Mencocokkan Pekerja Terbaik...</h3>
        <p class="text-neutral-500 text-[11px] max-w-[260px] leading-relaxed mb-6">
          Sistem Kerjantara sedang menyortir data KTP, Kitacode, jarak real-time, dan kecocokan keahlian Anda...
        </p>

        <div class="bg-[#fafafa] border border-neutral-200 rounded-lg p-3 text-left w-full max-w-sm">
          <div class="text-[10px] uppercase font-bold text-[#1890ff] mb-1">Rincian Orderanmu:</div>
          <p class="font-semibold text-xs text-neutral-800">🛠️ Kategori: {categoryName}</p>
          <p class="font-semibold text-xs text-neutral-800">📍 Lokasi: Kebayoran Baru, Jakarta</p>
        </div>
      </div>

    {:else if transactionStep === 'kandidat_list'}
      <div class="p-4 space-y-4 text-left">
        <div class="border-b border-neutral-200 pb-2">
          <h3 class="font-bold text-sm text-neutral-900 leading-none">3 Kandidat Terbaik Untuk {categoryName}</h3>
          <p class="text-[10px] text-neutral-500 mt-1">Dipilih otomatis berdasarkan verifikasi KTP, jarak terdekat & reputasi gemilang.</p>
        </div>

        <!-- Filter Kepribadian -->
        <div class="space-y-1.5 bg-neutral-50/70 p-2.5 rounded-lg border border-neutral-200/60 shadow-xs">
          <span class="text-[9px] font-extrabold text-neutral-400 uppercase tracking-widest block mb-1">
            🔍 Filter Kepribadian (KerjantaraScore Verified):
          </span>
          <div class="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            {#each ["Semua", "Sangat Teliti", "Sopan & Ramah", "Tepat Waktu", "Inisiatif Tinggi", "Cepat & Sigap", "Pendiam / Fokus"] as trait}
              <button
                onclick={() => selectedPersonality = trait}
                class="px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide whitespace-nowrap border shrink-0 transition-all cursor-pointer {
                  selectedPersonality === trait
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                }"
              >
                {trait === 'Semua' ? '🌟 Semua Kepribadian' : `🤝 ${trait}`}
              </button>
            {/each}
          </div>
        </div>

        <div class="space-y-4">
          {#each candidates.filter(cand => selectedPersonality === 'Semua' || cand.personalityFilters?.includes(selectedPersonality)) as cand, idx}
            {@const isSelected = selectedWorker?.name === cand.name}
            <div
              class="bg-white rounded-lg border-2 p-4 transition-all relative {
                isSelected ? 'border-[#1890ff] bg-[#e6f7ff]/20 shadow-md' : 'border-[#e8e8e8] shadow-sm'
              }"
            >
              {#if idx === 0}
                <div class="absolute -top-2.5 right-4 bg-amber-400 text-neutral-900 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider shadow-sm border border-white">
                  ⭐ REKOMENDASI TERBAIK
                </div>
              {/if}
              
              <div class="flex gap-3">
                <img src={cand.avatar} alt="Avatar" class="w-[48px] h-[48px] rounded-full object-cover border border-neutral-200" />
                <div class="flex-1">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-bold text-xs text-neutral-900 leading-none mb-1">{cand.name}</h4>
                      <div class="flex items-center gap-1.5">
                        <span class="text-warning font-extrabold flex items-center text-[10px]">⭐ {cand.rating}</span>
                        <span class="text-neutral-400">·</span>
                        <span class="text-[10px] text-neutral-500 font-semibold">{cand.completedJobs} Pesanan Selesai</span>
                      </div>
                    </div>
                    <div class="text-right">
                      <span class="text-[9px] font-bold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">{cand.distance}</span>
                    </div>
                  </div>

                  <!-- Profil Singkat -->
                  <div class="mt-2 text-[10px] text-neutral-600 bg-neutral-50/70 p-2.5 border-l-2 border-neutral-300 rounded-r-md leading-relaxed">
                    <span class="font-extrabold text-neutral-800 uppercase text-[9px] block mb-0.5">Profil Singkat:</span>
                    {cand.bio}
                  </div>

                  <!-- Verified Personality Labels -->
                  {#if cand.personalityFilters && cand.personalityFilters.length > 0}
                    <div class="flex flex-wrap gap-1 mt-2">
                      {#each cand.personalityFilters as trait}
                        <span 
                          class="bg-amber-400/10 text-amber-800 border border-amber-400/25 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider inline-flex items-center gap-0.5"
                          title="Verified via KerjantaraScore reviews"
                        >
                          ⭐ {trait}
                        </span>
                      {/each}
                    </div>
                  {/if}

                  <!-- Specs chip list -->
                  <div class="flex flex-wrap gap-1 mt-2.5">
                    {#each cand.skills as skill}
                      <span class="bg-neutral-100 text-neutral-600 border border-neutral-200 px-1.5 py-0.5 rounded text-[9px] font-semibold">{skill}</span>
                    {/each}
                  </div>

                  <div class="mt-3.5 pt-3 border-t border-[#e8e8e8] flex justify-between items-center bg-[#fafafa] -mx-4 -mb-4 px-4 py-2.5 rounded-b-lg">
                    <div>
                      <span class="text-[10px] text-neutral-400 block leading-none mb-1">Estimasi Harga</span>
                      <span class="font-bold text-xs text-neutral-950">{cand.price}</span>
                    </div>
                    <div class="flex gap-1.5">
                      {#if cand.portfolioBeforeAfter && cand.portfolioBeforeAfter.length > 0}
                        <button
                          onclick={() => portfolioWorker = cand}
                          class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-[9px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                        >
                          🖼️ Portofolio
                        </button>
                      {/if}
                      <button
                        onclick={() => handleSelectCandidate(cand)}
                        class="px-4 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer {
                          isSelected
                            ? 'bg-success text-white'
                            : 'bg-[#1890ff] text-white hover:bg-blue-600'
                        }"
                      >
                        {isSelected ? 'Terpilih ✓' : 'Pilih'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}

          {#if candidates.filter(cand => selectedPersonality === 'Semua' || cand.personalityFilters?.includes(selectedPersonality)).length === 0}
            <div class="p-8 text-center bg-neutral-50 rounded-xl border border-neutral-200 border-dashed">
              <span class="text-2xl block mb-2">🔍</span>
              <p class="text-xs font-bold text-neutral-700">Tidak ada pekerja ditemukan</p>
              <p class="text-[10px] text-neutral-400 mt-1">Belum ada pekerja di sekitarmu yang terverifikasi membawa sifat "{selectedPersonality}" saat ini.</p>
            </div>
          {/if}
        </div>

        <div class="h-24"></div>
      </div>

    {:else if transactionStep === 'proposal_sent' && selectedWorker}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-sm">
          <div class="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-4 animate-pulse">
            <Clock size={24} />
          </div>
          <h3 class="font-bold text-sm text-neutral-900 leading-none mb-1.5">Tawaranmu Telah Dikirim</h3>
          <p class="text-neutral-500 text-[11px] leading-relaxed mb-4">
            Sedang menunggu konfirmasi terima dari <strong>{selectedWorker.name}</strong>. Estimasi tersisa 02:59 detik.
          </p>

          <!-- Loader Countdown -->
          <div class="w-full bg-neutral-100 rounded-full h-1.5">
            <div class="bg-amber-400 h-1.5 rounded-full animate-pulse" style="width: 65%"></div>
          </div>

          <!-- Summary card info -->
          <div class="mt-5 border-t border-[#e8e8e8] pt-4.5 text-left space-y-2 text-[11px]">
            <div class="flex justify-between">
              <span class="text-neutral-400">Pekerja:</span>
              <span class="font-bold text-neutral-900">{selectedWorker.name}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400">Pekerjaan:</span>
              <span class="font-bold text-neutral-900">{categoryName}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-neutral-400 font-medium">Tarif Kisaran:</span>
              <span class="font-extrabold text-neutral-900">{selectedWorker.price}</span>
            </div>
          </div>

          <div class="mt-5 flex gap-2.5 justify-center">
            <button
              onclick={onOpenChat}
              class="flex-1 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 py-2 rounded-md font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageSquare size={14} /> Hubungi Chat
            </button>
            <button
              onclick={() => transactionStep = 'idle'}
              class="flex-1 bg-[#fff5f5] text-red-600 hover:bg-red-100 py-2 rounded-md font-bold text-[10px] flex items-center justify-center gap-1 border border-red-200 cursor-pointer"
            >
              Batalkan Pencarian
            </button>
          </div>
        </div>
      </div>

    {:else if (transactionStep === 'accepted' || transactionStep === 'arrived' || transactionStep === 'working' || transactionStep === 'submitting_proof' || transactionStep === 'waiting_approval') && selectedWorker}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg shadow-sm">
          <div class="px-3.5 py-2.5 bg-neutral-50 border-b border-[#e8e8e8] flex justify-between items-center rounded-t-lg">
            <div class="flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-full bg-success animate-pulse"></span>
              <span class="font-bold text-[11px] text-green-700">Pekerjaan Sedang Dipantau</span>
            </div>
            <span class="text-[10px] font-semibold text-[#1890ff] bg-[#e6f7ff] whitespace-nowrap px-1.5 py-0.5 rounded uppercase border border-[#91d5ff]">
              {#if transactionStep === 'accepted'}
                OTW Lokasi
              {:else if transactionStep === 'arrived'}
                Tiba di Lokasi
              {:else if transactionStep === 'working'}
                Sedang Mengerjakan
              {:else if transactionStep === 'submitting_proof'}
                Penyelesaian Bukti
              {:else if transactionStep === 'waiting_approval'}
                Review Hasil
              {/if}
            </span>
          </div>

          <div class="p-4 space-y-4">
            <!-- Worker headinfo -->
            <div class="flex gap-3 items-center">
              <img src={selectedWorker.avatar} alt="Selected" class="w-[44px] h-[44px] rounded-full object-cover border" />
              <div class="flex-1">
                <h4 class="font-bold text-xs text-neutral-900 leading-none mb-1">{selectedWorker.name}</h4>
                <p class="text-[10px] text-neutral-400 font-semibold">Tukang Cat Profesional Terverifikasi</p>
              </div>
              <div class="flex gap-2">
                <button onclick={onOpenChat} class="p-2 border rounded-full text-[#1890ff] bg-[#e6f7ff] border-[#1890ff]/30 hover:bg-blue-50 cursor-pointer">
                  <MessageSquare size={16} />
                </button>
                <a href="tel:0812" class="p-2 border rounded-full text-neutral-600 bg-neutral-50 hover:bg-neutral-100">
                  <Phone size={16} />
                </a>
              </div>
            </div>

            <!-- Progress bar tracking -->
            <div class="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <div class="flex items-center justify-between text-[10px] font-bold text-neutral-400 mb-1">
                <span class={transactionStep === 'accepted' ? 'text-primary' : 'text-success'}>Perjalanan</span>
                <span class={(transactionStep === 'arrived') ? 'text-primary' : (transactionStep === 'working' || transactionStep === 'waiting_approval') ? 'text-success' : ''}>Sudah Tiba</span>
                <span class={transactionStep === 'working' ? 'text-primary' : (transactionStep === 'waiting_approval') ? 'text-success' : ''}>Bekerja</span>
                <span class={transactionStep === 'waiting_approval' ? 'text-primary font-bold' : ''}>Tinjau</span>
              </div>
              <div class="grid grid-cols-4 gap-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div class="h-full rounded-l-full {transactionStep === 'accepted' ? 'bg-[#1890ff] animate-pulse' : 'bg-success'}"></div>
                <div class="h-full {(transactionStep === 'arrived') ? 'bg-[#1890ff] animate-pulse' : (transactionStep === 'working' || transactionStep === 'waiting_approval') ? 'bg-success' : 'bg-neutral-200'}"></div>
                <div class="h-full {transactionStep === 'working' ? 'bg-[#1890ff] animate-pulse' : (transactionStep === 'waiting_approval') ? 'bg-success' : 'bg-neutral-200'}"></div>
                <div class="h-full {transactionStep === 'waiting_approval' ? 'bg-[#1890ff]' : 'bg-neutral-200'}"></div>
              </div>
            </div>

            <!-- Simulated Map Navigation -->
            {#if transactionStep === 'accepted'}
              <div class="h-28 bg-[#dbeafe] rounded-lg border border-blue-200 flex flex-col justify-between p-3 overflow-hidden relative">
                <div class="absolute top-2 left-2 bg-white/80 backdrop-blur border border-blue-300 text-[10px] font-bold text-blue-800 px-2.5 py-0.5 rounded-full shadow-sm">
                  📍 Sedang OTW · estimasi tiba: 4 menit
                </div>
                <svg class="absolute inset-0 w-full h-full text-blue-300 opacity-20 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0,50 Q 25,10 50,50 T 100,50" fill="none" stroke="currentColor" stroke-width="6" />
                  <path d="M 30,0 L 30,100 M 70,0 L 70,100" fill="none" stroke="currentColor" stroke-width="2" />
                </svg>
                <div class="absolute top-1/2 left-1/4 w-3.5 h-3.5 bg-blue-600 rounded-full border-2 border-white shadow animate-bounce"></div>
                <div class="absolute top-[40%] right-1/4 w-3 h-3 bg-red-600 rounded-full border border-white shadow"></div>
                <div class="text-[10px] text-neutral-500 font-semibold mt-auto z-10 bg-white/50 px-1 py-0.5 rounded self-start">Jarak Tersisa: 450 meter</div>
              </div>
            {/if}

            <!-- WORKING & TIMER -->
            {#if transactionStep === 'working'}
              <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
                <span class="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Durasi Aktif Mengerjakan</span>
                <div class="text-2xl font-mono font-extrabold text-[#1a202c] leading-tight my-1">
                  01:14:26
                </div>
                <p class="text-[10px] text-neutral-500">Mulai bekerja sejak pukul 10:05 WIB</p>
              </div>
            {/if}

            <!-- WAITING APPROVAL -->
            {#if transactionStep === 'waiting_approval'}
              <div class="space-y-3.5 bg-green-50 border border-green-200 p-4 rounded-lg">
                <div class="text-center">
                  <h4 class="font-bold text-xs text-green-800 mb-1 mt-0">Pekerjaan Selesai & Menunggu Konfirmasimu</h4>
                  <p class="text-[10px] text-green-700 leading-relaxed">Pak {selectedWorker.name} sudah menyatakan pekerjaan selesai secara resmi.</p>
                </div>

                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-neutral-500 block uppercase">Unggulan Bukti Foto:</span>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="h-24 bg-neutral-100 rounded border overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=200&auto=format&fit=crop&q=60" alt="bukti 1" class="w-full h-full object-cover" />
                    </div>
                    <div class="h-24 bg-neutral-100 rounded border overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=200&auto=format&fit=crop&q=60" alt="bukti 2" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                <div class="p-3 bg-white rounded border text-[11px] text-neutral-600 leading-snug">
                  <strong>Catatan Pekerja:</strong> "Sudah saya cat ulang 2 lapis rapi Bu, semua sisa sampah dan cat juga sudah dibereskan kembali seperti semula. Terima kasih!"
                </div>

                <!-- TWO DECISION BUTTONS FOR EMPLOYER -->
                <div class="pt-2 flex flex-col gap-2">
                  <button
                    onclick={handleConfirmJob}
                    disabled={isConfirming}
                    class="w-full py-2.5 bg-success hover:bg-green-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {#if isConfirming}
                      <Loader2 size={14} class="animate-spin" />
                      MEMPROSES...
                    {:else}
                      <Award size={14} /> Setujui & Lepas Dana ({selectedWorker?.price})
                    {/if}
                  </button>
                  <button
                    onclick={onOpenDispute}
                    class="w-full py-2 bg-white hover:bg-neutral-50 border border-neutral-300 text-red-600 font-bold rounded-md text-[10px] uppercase tracking-wide flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShieldAlert size={14} /> Ada Masalah? Lapor Dispute
                  </button>
                </div>
              </div>
            {/if}
          </div>
        </div>
        
        <button
          onclick={onOpenDispute}
          class="w-full text-center text-red-500 font-bold hover:underline py-1 mt-4 cursor-pointer"
        >
          Laporkan Masalah Pekerjaan (Dispute Ticket)
        </button>
      </div>
    {/if}

    <!-- [PK-7] BERI RATING & SELESAI (DONE) -->
    {#if transactionStep === 'done' && selectedWorker}
      <div class="p-4 space-y-4">
        <div class="bg-white border border-[#e8e8e8] rounded-lg p-5 text-center shadow-sm">
          {#if !submittedRating}
            <div class="space-y-5">
              <div class="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h3 class="font-extrabold text-sm text-neutral-900 leading-none mb-1">Pekerjaan Selesai!</h3>
                <p class="text-neutral-500 text-[11px] leading-relaxed">Terima kasih atas kerja samamu dengan Pak {selectedWorker.name}. Pembayaran telah berhasil dikirim ke dompetnya.</p>
              </div>

              <div class="border-t border-b border-[#e8e8e8] py-4">
                <span class="text-[11px] font-bold text-neutral-500 uppercase block mb-1">Beri Ulasan Bintang Anda</span>
                <div class="flex gap-1.5 justify-center mt-1">
                  {#each [1, 2, 3, 4, 5] as starIdx}
                    <button
                      type="button"
                      onclick={() => starCount = starIdx}
                      class="text-2xl transition-transform hover:scale-110 cursor-pointer {
                        starCount >= starIdx ? 'text-amber-400' : 'text-neutral-200'
                      }"
                    >
                      <Star size={24} fill={starCount >= starIdx ? 'currentColor' : 'none'} />
                    </button>
                  {/each}
                </div>
                <span class="text-[10px] text-amber-500 font-bold mt-1 block h-4">
                  {#if starCount === 5}Luaran biasa! (Sangat Puas){/if}
                  {#if starCount === 4}Sangat Baik (Puas){/if}
                  {#if starCount === 3}Cukup Memuaskan{/if}
                  {#if starCount === 2}Mengecewakan{/if}
                  {#if starCount === 1}Sangat Buruk{/if}
                </span>
              </div>

              <!-- Multiselect Aspects -->
              <div class="space-y-1 text-left">
                <span class="text-[10px] font-bold text-neutral-600 block uppercase">Pilih Aspek Terbaik:</span>
                <div class="flex flex-wrap gap-1.5 pt-1">
                  {#each ["Tepat Waktu", "Sangat Rapi", "Ramah & Sopan", "Komunikatif", "Bersih", "Harga Sesuai"] as item}
                    {@const hasSelected = aspects.includes(item)}
                    <div
                      onclick={() => toggleAspect(item)}
                      class="px-2.5 py-1 text-[10px] font-semibold border-2 rounded-full cursor-pointer transition-all {
                        hasSelected
                          ? 'bg-primary border-primary text-white font-bold'
                          : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                      }"
                    >
                      {item}
                    </div>
                  {/each}
                </div>
              </div>

              <!-- Textarea ulasan -->
              <div class="space-y-1 text-left">
                <label class="text-[10px] font-bold text-neutral-600 uppercase">Ulasan Tertulis (Opsional)</label>
                <textarea
                  placeholder="Contoh: Pak Budi kerjanya cepat, rapi, dan bersih sekali sesudah mengecat. Sangat saya rekomendasikan!"
                  bind:value={reviewInput}
                  rows={2}
                  class="w-full text-xs p-3 border border-neutral-300 rounded focus:outline-none focus:border-[#1890ff] placeholder:text-neutral-400 text-neutral-900 leading-relaxed"
                ></textarea>
              </div>

              <button
                onclick={handleRateJob}
                disabled={isRating}
                class="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {#if isRating}
                  <Loader2 size={16} class="animate-spin" />
                  MENGIRIM...
                {:else}
                  Kirim Ulasan Bintang &rarr;
                {/if}
              </button>
            </div>
          {:else}
            <div class="space-y-6">
              <div class="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto animate-bounce">
                🎉
              </div>
              <div>
                <h3 class="font-extrabold text-sm text-neutral-900 leading-none mb-1">Matur Nuwun / Terima Kasih!</h3>
                <p class="text-neutral-500 text-[11px] leading-relaxed">Ulasan Anda membantu menjaga reputasi ekosistem Kerjantara.id & menaikkan KerjantaraScore pekerja.</p>
              </div>

              <div class="bg-[#fafafa] border border-neutral-100 rounded-lg p-3.5 space-y-2 text-left">
                <div class="flex gap-1.5 items-center">
                  <span class="font-bold text-neutral-700 text-[11px]">Ulasan Anda:</span>
                  <div class="flex text-amber-400">
                    {#each Array.from({ length: starCount }) as _}
                      <Star size={11} fill="currentColor" />
                    {/each}
                  </div>
                </div>
                <p class="text-[10px] text-neutral-600 italic">"{reviewInput || 'Bintang 5 diberikan!'}"</p>
              </div>

              <!-- Reset Transaction -->
              <div class="pt-3">
                <button
                  onclick={onRestartTransaction}
                  class="w-full py-2.5 bg-neutral-900 hover:bg-black text-white font-bold rounded-md text-[11px] uppercase tracking-wide shadow cursor-pointer"
                >
                  Buka Permintaan Baru &rarr;
                </button>
              </div>
            </div>
          {/if}
        </div>
      </div>
    {/if}

  </div>

  <!-- FLOATING ACTION BOTTOM BAR -->
  {#if transactionStep === 'kandidat_list' && selectedWorker}
    <div class="absolute bottom-4 left-4 right-4 z-45 bg-[#ffffff]/98 backdrop-blur-md rounded-xl shadow-[0_8px_32px_rgba(0,10,32,0.18)] border border-neutral-200/90 py-2.5 px-3.5 flex items-center justify-between gap-3 max-w-sm sm:max-w-xl mx-auto transition-all animate-fade-in-up">
      <div class="text-left min-w-0 flex-1">
        <span class="text-[9px] text-[#1890ff] font-bold uppercase tracking-wider block leading-none">Calon Terpilih</span>
        <p class="font-extrabold text-xs text-neutral-900 truncate leading-tight mt-1">{selectedWorker.name}</p>
        <p class="text-[9px] text-neutral-500 font-medium leading-none mt-1">
          Estimasi: <span class="font-semibold text-neutral-800">{selectedWorker.price}</span>
        </p>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button
          onclick={() => selectedWorker = null}
          class="px-2.5 py-1.5 bg-[#f5f5f5] hover:bg-neutral-200 text-neutral-600 hover:text-neutral-800 border border-neutral-300 font-bold rounded text-[9px] uppercase tracking-wide transition-all cursor-pointer whitespace-nowrap"
        >
          Batal
        </button>
        <button
          onclick={handleSendProposal}
          class="bg-[#1890ff] hover:bg-blue-600 text-white font-bold text-[9px] px-3.5 py-1.5 rounded shadow-sm uppercase tracking-wide transition-colors flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
        >
          Hubungi & Konfirmasi &rarr;
        </button>
      </div>
    </div>
  {:else}
    <div class="absolute bottom-4 left-4 right-4 z-40 bg-[#001529]/95 backdrop-blur-md text-white rounded-xl shadow-[0_8px_24px_rgba(0,10,30,0.25)] border border-white/10 py-1.5 px-3 flex items-center justify-around max-w-sm sm:max-w-md mx-auto">
      <!-- Beranda Button -->
      <button
        onclick={() => { activeMenu = 'beranda'; if (transactionStep === 'creating') transactionStep = 'idle'; }}
        class="flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative cursor-pointer {
          activeMenu === 'beranda' && transactionStep !== 'creating'
            ? 'text-[#1890ff] scale-105'
            : 'text-[#ffffffa6] hover:text-white'
        }"
      >
        <FileText size={16} />
        <span class="text-[9px] font-bold tracking-tight font-sans">Beranda</span>
        {#if activeMenu === 'beranda' && transactionStep !== 'creating'}
          <div class="absolute bottom-0 w-3 h-0.5 bg-[#1890ff] rounded-full"></div>
        {/if}
      </button>
      
      <!-- Buat Kerja Button -->
      <button
        onclick={() => { activeMenu = 'permintaan'; transactionStep = 'creating'; }}
        class="flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative cursor-pointer {
          transactionStep === 'creating'
            ? 'text-[#1890ff] scale-105'
            : 'text-[#ffffffa6] hover:text-white'
        }"
      >
        <Plus size={16} />
        <span class="text-[9px] font-bold tracking-tight font-sans">Buat Kerja</span>
        {#if transactionStep === 'creating'}
          <div class="absolute bottom-0 w-3 h-0.5 bg-[#1890ff] rounded-full"></div>
        {/if}
      </button>
      
      <!-- Pantau Kerja Button -->
      <button
        onclick={() => {
          if (transactionStep !== 'idle' && transactionStep !== 'creating') {
            activeMenu = 'pekerja';
          } else {
            alert("Belum ada pekerjaan berjalan. Buat permintaan pekerjaan dahulu!");
          }
        }}
        disabled={transactionStep === 'idle' || transactionStep === 'creating'}
        class="flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md transition-all relative cursor-pointer {
          transactionStep !== 'idle' && transactionStep !== 'creating' && activeMenu === 'pekerja'
            ? 'text-[#1890ff] scale-105'
            : (transactionStep === 'idle' || transactionStep === 'creating')
              ? 'text-[#ffffff25] cursor-not-allowed'
              : 'text-[#ffffffa6] hover:text-white'
        }"
      >
        <Play size={16} />
        <span class="text-[9px] font-bold tracking-tight font-sans">Pantau</span>
        {#if transactionStep !== 'idle' && transactionStep !== 'creating' && activeMenu === 'pekerja'}
          <div class="absolute bottom-0 w-3 h-0.5 bg-[#1890ff] rounded-full"></div>
        {/if}
      </button>

      <!-- Chat Live Button -->
      {#if transactionStep !== 'idle' && transactionStep !== 'creating'}
        <button
          onclick={onOpenChat}
          class="flex-1 max-w-[80px] flex flex-col items-center gap-1 py-1 rounded-md text-[#ffffffa6] hover:text-white transition-all cursor-pointer"
        >
          <MessageSquare size={16} />
          <span class="text-[9px] font-bold tracking-tight font-sans">Chat Live</span>
        </button>
      {/if}
    </div>
  {/if}

  <!-- VISUAL PORTFOLIO MODAL -->
  {#if portfolioWorker}
    <div class="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-all p-3">
      <div class="bg-white w-full max-w-sm sm:max-w-md rounded-t-2xl rounded-b-xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200/90 max-h-[85%] text-left">
        <header class="px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-sm">📸</span>
            <div class="text-left font-sans">
              <h4 class="font-extrabold text-xs text-white leading-none">Portofolio Pekerjaan</h4>
              <span class="text-[9px] text-amber-100 leading-none block mt-0.5">Bukti Penyelesaian Side-Gig Terverifikasi</span>
            </div>
          </div>
          <button 
            onclick={() => portfolioWorker = null}
            class="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </header>

        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div class="text-left">
            <div class="flex items-center gap-2 mb-2 p-1.5 bg-neutral-50 rounded-lg border border-neutral-150">
              <img src={portfolioWorker.avatar} alt="Worker" class="w-8 h-8 rounded-full object-cover border" />
              <div class="font-sans text-left">
                <p class="font-extrabold text-[11px] text-neutral-800 leading-none">{portfolioWorker.name}</p>
                <p class="text-[9px] text-neutral-550 leading-none mt-1">⭐ {portfolioWorker.rating} · {portfolioWorker.completedJobs} Proyek Berhasil</p>
              </div>
            </div>
            
            <p class="text-[10px] text-neutral-500 leading-relaxed mb-3">
              Berikut hasil pengerjaan nyata yang diunggah oleh <strong>{portfolioWorker.name}</strong> dan telah divalidasi oleh sistem review foto sebelum-sesudah Kerjantara.id:
            </p>

            {#if portfolioWorker.portfolioBeforeAfter}
              {#each portfolioWorker.portfolioBeforeAfter as item}
                <div class="space-y-2 bg-neutral-50/50 p-2.5 rounded-xl border border-neutral-100">
                  <span class="text-[9px] bg-amber-400/20 text-amber-900 border border-amber-400/40 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide inline-block leading-none">
                    📌 {item.title}
                  </span>

                  <div class="grid grid-cols-2 gap-2">
                    <!-- Before frame -->
                    <div class="relative rounded-lg overflow-hidden border border-red-200 shadow-sm bg-neutral-100">
                      <img src={item.before} alt="Sebelum" class="w-full h-28 object-cover" />
                      <div class="absolute top-1.5 left-1.5 bg-red-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase leading-none shadow-sm">
                        SEBELUM
                      </div>
                    </div>

                    <!-- After frame -->
                    <div class="relative rounded-lg overflow-hidden border border-green-200 shadow-sm bg-neutral-100">
                      <img src={item.after} alt="Sesudah" class="w-full h-28 object-cover" />
                      <div class="absolute top-1.5 left-1.5 bg-green-600 text-white font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase leading-none shadow-sm animate-pulse">
                        SESUDAH ✨
                      </div>
                    </div>
                  </div>

                  <div class="text-[9px] text-neutral-550 leading-relaxed bg-white border border-neutral-150 p-2 rounded-lg italic">
                    💬 <strong class="text-neutral-700 not-italic uppercase text-[8px]">Ulasan Rekan Klien:</strong> "Sangat puas dengan hasilnya. Dinding rembes tuntas diatasi dan kembali rapi seperti baru!"
                  </div>
                </div>
              {/each}
            {/if}
          </div>
        </div>

        <footer class="p-3 border-t border-neutral-100 bg-neutral-50 flex gap-2">
          <button 
            onclick={() => portfolioWorker = null}
            class="flex-1 py-2 bg-neutral-900 hover:bg-black text-white font-bold rounded-lg text-[10px] uppercase tracking-wider shadow-md transition-colors cursor-pointer"
          >
            Tutup Portofolio
          </button>
        </footer>
      </div>
    </div>
  {/if}

  <!-- ESCROW PAYMENT MODAL -->
  {#if showEscrowModal && selectedWorker}
    <div class="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs transition-all p-3 animate-fade-in">
      <div class="bg-white w-full max-w-sm sm:max-w-md rounded-t-2xl rounded-b-xl shadow-2xl overflow-hidden flex flex-col border border-neutral-200/90 text-left animate-slide-up">
        <header class="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShieldAlert size={20} class="text-[#1890ff]" />
            <h4 class="font-extrabold text-sm text-white tracking-wide">Pengaktifan Rekening Bersama</h4>
          </div>
          <button 
            onclick={() => showEscrowModal = false}
            class="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </header>

        <div class="p-5 space-y-4">
          <p class="text-[11px] text-neutral-600 leading-relaxed">
            Platform menggunakan sistem <strong>Escrow (Rekening Bersama)</strong>. Dana Anda akan diamankan oleh Kerjantara.id dan <strong>baru diteruskan ke pekerja setelah Anda menyetujui hasil pekerjaannya</strong>.
          </p>

          <div class="bg-blue-50/50 border border-blue-100 rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-center bg-white p-2 rounded border border-blue-50">
              <span class="text-[10px] text-neutral-500 font-bold uppercase">Pekerja:</span>
              <span class="text-[11px] font-extrabold text-neutral-900">{selectedWorker.name}</span>
            </div>
            <div class="flex justify-between items-center bg-white p-2 rounded border border-blue-50">
              <span class="text-[10px] text-neutral-500 font-bold uppercase">Estimasi Biaya:</span>
              <span class="text-[11px] font-extrabold text-[#1890ff]">{selectedWorker.price}</span>
            </div>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded p-3 text-[10px] text-amber-800 flex items-start gap-2">
            <AlertTriangle size={14} class="shrink-0 mt-0.5" />
            <span class="leading-relaxed">Jika pekerja batal atau Anda tidak puas dengan hasilnya, dana dapat ditarik kembali 100% melalui Dispute Resolution secara otomatis.</span>
          </div>
        </div>

        <footer class="p-4 border-t border-neutral-100 bg-neutral-50 flex flex-col gap-2">
          <button 
            onclick={confirmEscrowPayment}
            class="w-full py-2.5 bg-[#1890ff] hover:bg-blue-600 text-white font-bold rounded-lg text-xs uppercase tracking-wide shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldAlert size={14} /> Setor Dana ke Escrow
          </button>
          <button 
            onclick={() => showEscrowModal = false}
            class="w-full py-2 bg-transparent text-neutral-500 hover:text-neutral-700 font-bold rounded-lg text-[10px] uppercase tracking-wide cursor-pointer"
          >
            Kembali
          </button>
        </footer>
      </div>
    </div>
  {/if}

</div>

<style>
  /* Hide scrollbar */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
