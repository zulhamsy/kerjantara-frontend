<script lang="ts">
  import { goto } from '$app/navigation';
  import DashboardPekerja from '$lib/screens/DashboardPekerja.svelte';
  import SharedChat from '$lib/screens/SharedChat.svelte';
  import SharedDispute from '$lib/screens/SharedDispute.svelte';
  import { jobService } from '$lib/services/jobService.svelte';
  import { appState } from '$lib/appState.svelte';
  import { supabase } from '$lib/supabaseClient';
  import type { ChatMessage } from '$lib/types';

  let isChatViewOpen = $state(false);
  let isDisputeViewOpen = $state(false);
  let chatMessages = $state<ChatMessage[]>([]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Gagal Keluar: " + error.message);
    } else {
      appState.reset();
      jobService.reset();
      goto('/', { replaceState: true });
    }
  }

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'worker',
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
  {#if isChatViewOpen}
    <SharedChat
      onBack={() => isChatViewOpen = false}
      messages={chatMessages}
      onSendMessage={handleSendMessage}
      currentUser="worker"
      otherUserName={appState.currentJob?.employer?.full_name || "Employer"}
    />
  {:else if isDisputeViewOpen}
    <SharedDispute
      onBack={() => isDisputeViewOpen = false}
      onSubmit={handleDisputeSubmit}
      currentUser="worker"
    />
  {:else}
    <DashboardPekerja
      userName={appState.user?.full_name || 'Mitra'}
      bind:transactionStep={jobService.transactionStep}
      jobRequest={jobService.jobRequest}
      selectedWorker={jobService.selectedWorker}
      onOpenChat={() => isChatViewOpen = true}
      onOpenDispute={() => isDisputeViewOpen = true}
      onRestartTransaction={() => jobService.reset()}
      onLogout={handleLogout}
    />
  {/if}
</div>
