<script lang="ts">
  import DashboardPemberiKerja from './DashboardPemberiKerja.svelte';
  import DashboardPekerja from './DashboardPekerja.svelte';
  import SharedChat from './SharedChat.svelte';
  import SharedDispute from './SharedDispute.svelte';
  import type { JobRequest, WorkerProfile, TransactionStep, ChatMessage } from '../types';

  let {
    initialRole = 'jobseeker',
    userName = 'Budi Santoso',
    userEmail = 'kerjantara@example.com'
  } = $props<{
    initialRole?: 'jobseeker' | 'client';
    userName?: string;
    userEmail?: string;
  }>();

  let currentViewRole = $state<'client' | 'worker'>(
    initialRole === 'client' ? 'client' : 'worker'
  );

  let transactionStep = $state<TransactionStep>('idle');
  let jobRequest = $state<JobRequest>({
    category: 'Tukang Cat',
    description: 'Mengecat kamar tidur utama ukuran 4x3m dengan cat putih minimalis.',
    location: 'Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan',
    duration: 'Setengah hari',
    budget: 'Rp 180.000'
  });

  let selectedWorker = $state<WorkerProfile | null>(null);
  let isChatViewOpen = $state(false);
  let chatMessages = $state<ChatMessage[]>([
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

  let isDisputeViewOpen = $state(false);
  let agreeTerms = $state(false);

  const handleRestartTransaction = () => {
    transactionStep = 'idle';
    selectedWorker = null;
    agreeTerms = false;
    isChatViewOpen = false;
    isDisputeViewOpen = false;
    chatMessages = [
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
    ];
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentViewRole === 'client' ? 'client' : 'worker',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    chatMessages = [...chatMessages, newMsg];

    // Simulated reply
    if (text.toLowerCase().includes('tiba') || text.toLowerCase().includes('jalan')) {
      setTimeout(() => {
        chatMessages = [
          ...chatMessages,
          {
            id: (Date.now() + 1).toString(),
            sender: currentViewRole === 'client' ? 'worker' : 'client',
            text: 'Baik, terima kasih atas informasinya. Saya standby ya.',
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }
        ];
      }, 1500);
    }
  };

  const handleDisputeSubmit = (reason: string, details: string) => {
    console.log("Dispute reported:", { reason, details });
  };

  $effect(() => {
    if (transactionStep === 'matching') {
      const matchTimer = setTimeout(() => {
        transactionStep = 'kandidat_list';
      }, 3500);
      return () => clearTimeout(matchTimer);
    }
  });
</script>

<div class="flex-1 flex flex-col h-full bg-[#f0f2f5] overflow-hidden select-none relative">
  
  <!-- SIMULATOR ROLE PANEL CHOICE -->
  {#if !isChatViewOpen && !isDisputeViewOpen}
    <div class="bg-[#001529] border-b border-[#ffffff10] px-3 py-2 flex items-center justify-between z-30 shrink-0">
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span class="text-[9px] text-[#f5a623] font-mono font-bold uppercase tracking-wider">
          SIMULASI AKUN
        </span>
      </div>
      <div class="flex bg-[#ffffff10] p-0.5 rounded border border-[#ffffff1a] shadow-inner">
        <button
          onclick={() => currentViewRole = 'client'}
          class="px-2.5 py-1 text-[9px] font-semibold rounded-sm transition-all focus:outline-none uppercase flex items-center gap-1 cursor-pointer {
            currentViewRole === 'client'
              ? 'bg-[#1890ff] text-white font-bold shadow-sm'
              : 'text-[#ffffffb3] hover:text-white'
          }"
        >
          <span>💼 Pemberi Kerja</span>
        </button>
        <button
          onclick={() => {
            currentViewRole = 'worker';
            if (!selectedWorker) {
              selectedWorker = {
                name: "Pak Budi Santoso",
                avatar: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=120&auto=format&fit=crop&q=60",
                rating: 4.9,
                completedJobs: 142,
                distance: "1.2 km",
                status: "Tersedia sekarang",
                skills: ["Cat Dinding", "Cat Plafon", "Plester"],
                price: "Rp 150.000 - 200.000"
              };
            }
          }}
          class="px-2.5 py-1 text-[9px] font-semibold rounded-sm transition-all focus:outline-none uppercase flex items-center gap-1 cursor-pointer {
            currentViewRole === 'worker'
              ? 'bg-[#f5a623] text-neutral-900 font-extrabold shadow-sm'
              : 'text-[#ffffffb3] hover:text-white'
          }"
        >
          <span>🛠️ Pekerja</span>
        </button>
      </div>
    </div>
  {/if}

  <!-- RENDER IN-APP CHAT VIEW -->
  {#if isChatViewOpen}
    <SharedChat
      onBack={() => isChatViewOpen = false}
      messages={chatMessages}
      onSendMessage={handleSendMessage}
      currentUser={currentViewRole === 'client' ? 'client' : 'worker'}
      otherUserName={currentViewRole === 'client' ? (selectedWorker?.name || "Pak Budi Santoso") : (userName || "Ibu Sari")}
    />
  {/if}

  <!-- RENDER DISPUTE VIEW -->
  {#if isDisputeViewOpen}
    <SharedDispute
      onBack={() => isDisputeViewOpen = false}
      onSubmit={handleDisputeSubmit}
      currentUser={currentViewRole === 'client' ? 'client' : 'worker'}
    />
  {/if}

  <!-- RENDER CURRENT VIEW DASHBOARD -->
  {#if !isChatViewOpen && !isDisputeViewOpen}
    {#if currentViewRole === 'client'}
      <DashboardPemberiKerja
        userName={userName || 'Ibu Sari'}
        bind:transactionStep={transactionStep}
        bind:jobRequest={jobRequest}
        bind:selectedWorker={selectedWorker}
        onOpenChat={() => isChatViewOpen = true}
        onOpenDispute={() => isDisputeViewOpen = true}
        onRestartTransaction={handleRestartTransaction}
      />
    {:else if currentViewRole === 'worker'}
      <DashboardPekerja
        userName="Pak Budi Santoso"
        bind:transactionStep={transactionStep}
        jobRequest={jobRequest}
        selectedWorker={selectedWorker}
        onOpenChat={() => isChatViewOpen = true}
        onOpenDispute={() => isDisputeViewOpen = true}
        onRestartTransaction={handleRestartTransaction}
      />
    {/if}
  {/if}

</div>
