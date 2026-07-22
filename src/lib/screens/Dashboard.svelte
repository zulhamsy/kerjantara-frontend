<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import DashboardPemberiKerja from './DashboardPemberiKerja.svelte';
  import DashboardPekerja from './DashboardPekerja.svelte';
  import SharedChat from './SharedChat.svelte';
  import SharedDispute from './SharedDispute.svelte';
  import { appState } from '../appState.svelte';
  import { connectWS, disconnectWS } from '../ws/socket';
  import type { JobRequest, WorkerProfile, TransactionStep, ChatMessage } from '../types';

  import { api } from '../api/client';
  import type { Job } from '../api/types';

  let {
    userName = 'User',
    userEmail = '',
    onLogout
  } = $props<{
    userName?: string;
    userEmail?: string;
    onLogout?: () => void;
  }>();

  const currentViewRole = $derived<'employer' | 'worker' | null>(
    appState.user?.active_role || null
  );

  let transactionStep = $state<TransactionStep>('idle');
  
  // Logic to fetch active job and resume state
  async function resumeActiveJob() {
    if (!currentViewRole) return;
    
    try {
      const endpoint = currentViewRole === 'employer' ? '/jobs/employer' : '/jobs/worker';
      // Filter for non-terminal statuses
      const activeJobs = await api.get<Job[]>(`${endpoint}?status=matched,accepted,arrived,working,waiting_approval`);
      
      if (activeJobs && activeJobs.length > 0) {
        const job = activeJobs[0];
        appState.currentJob = job;
        
        // Map backend status to transactionStep
        switch(job.status) {
          case 'matched': 
            transactionStep = currentViewRole === 'employer' ? 'kandidat_list' : 'proposal_sent';
            break;
          case 'accepted': transactionStep = 'accepted'; break;
          case 'arrived': transactionStep = 'arrived'; break;
          // Note: Backend might use 'working' as a state, we map it accordingly
          case 'working' as any: transactionStep = 'working'; break;
          case 'waiting_approval' as any: transactionStep = 'waiting_approval'; break;
        }

        // Fill jobRequest for UI consistency
        jobRequest = {
          category: job.skill_category?.label || 'Pekerjaan',
          description: job.description,
          location: 'Lokasi Aktif',
          duration: 'Disesuaikan',
          budget: `Rp ${job.budget.toLocaleString('id-ID')}`
        };

        if (job.worker) {
          selectedWorker = {
            name: job.worker.full_name,
            avatar: job.worker.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.worker.full_name)}`,
            rating: 4.8, // Mock if not in User object
            completedJobs: 10,
            distance: '0 km',
            status: 'Aktif',
            skills: [job.skill_category?.label || 'Umum'],
            price: `Rp ${job.budget.toLocaleString('id-ID')}`,
            worker_id: job.worker.id
          };
        }
      }
    } catch (err) {
      console.error("Failed to resume job session:", err);
    }
  }

  let jobRequest = $state<JobRequest>({
    category: 'Tukang Cat',
    description: 'Mengecat kamar tidur utama ukuran 4x3m dengan cat putih minimalis.',
    location: 'Jl. Mawar No. 12, Kebayoran Baru, Jakarta Selatan',
    duration: 'Setengah hari',
    budget: 'Rp 180.000'
  });

  let selectedWorker = $state<WorkerProfile | null>(null);
  let isChatViewOpen = $state(false);
  let chatMessages = $state<ChatMessage[]>([]);

  let isDisputeViewOpen = $state(false);

  // WS Event Handler
  function handleWSMessage(msg: any) {
    console.log("WS Received:", msg);
    
    if (msg.type === 'job.matched' && currentViewRole === 'worker') {
      transactionStep = 'proposal_sent';
      alert("Ada pekerjaan baru yang cocok!");
    }
    
    if (msg.type === 'job.accepted' && currentViewRole === 'employer') {
      transactionStep = 'accepted';
      alert("Pekerjaan telah diterima oleh pekerja!");
    }

    if (msg.type === 'job.completed') {
       transactionStep = 'waiting_approval';
    }
  }

  onMount(async () => {
    // Redirect if no active_role exists
    if (appState.user && (!appState.user.active_role || appState.user.active_role === '')) {
      goto('/onboarding/role', { replaceState: true });
      return;
    }
    
    await resumeActiveJob();
    connectWS(handleWSMessage);
  });

  onDestroy(() => {
    disconnectWS();
  });

  const handleRestartTransaction = () => {
    transactionStep = 'idle';
    selectedWorker = null;
    isChatViewOpen = false;
    isDisputeViewOpen = false;
    appState.currentJob = null;
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: currentViewRole === 'employer' ? 'client' : 'worker',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    chatMessages = [...chatMessages, newMsg];
  };

  const handleDisputeSubmit = (reason: string, details: string) => {
    console.log("Dispute reported:", { reason, details });
  };
</script>

<div class="flex-1 flex flex-col h-full bg-[#f0f2f5] overflow-hidden select-none relative">
  <!-- RENDER IN-APP CHAT VIEW -->
  {#if isChatViewOpen}
    <SharedChat
      onBack={() => isChatViewOpen = false}
      messages={chatMessages}
      onSendMessage={handleSendMessage}
      currentUser={currentViewRole === 'employer' ? 'client' : 'worker'}
      otherUserName={currentViewRole === 'employer' ? (selectedWorker?.name || "Pekerja") : (appState.user?.full_name || userName)}
    />
  {/if}

  <!-- RENDER DISPUTE VIEW -->
  {#if isDisputeViewOpen}
    <SharedDispute
      onBack={() => isDisputeViewOpen = false}
      onSubmit={handleDisputeSubmit}
      currentUser={currentViewRole === 'employer' ? 'client' : 'worker'}
    />
  {/if}

  <!-- RENDER CURRENT VIEW DASHBOARD -->
  {#if !isChatViewOpen && !isDisputeViewOpen}
    {#if currentViewRole === 'employer'}
      <DashboardPemberiKerja
        userName={appState.user?.full_name || userName || 'Ibu Sari'}
        bind:transactionStep={transactionStep}
        bind:jobRequest={jobRequest}
        bind:selectedWorker={selectedWorker}
        onOpenChat={() => isChatViewOpen = true}
        onOpenDispute={() => isDisputeViewOpen = true}
        onRestartTransaction={handleRestartTransaction}
        onLogout={onLogout}
      />
    {:else if currentViewRole === 'worker'}
      <DashboardPekerja
        userName={appState.user?.full_name || userName || 'Pak Budi'}
        bind:transactionStep={transactionStep}
        jobRequest={jobRequest}
        selectedWorker={selectedWorker}
        onOpenChat={() => isChatViewOpen = true}
        onOpenDispute={() => isDisputeViewOpen = true}
        onRestartTransaction={handleRestartTransaction}
        onLogout={onLogout}
      />
    {/if}
  {/if}
</div>
