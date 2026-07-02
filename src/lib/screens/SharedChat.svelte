<script lang="ts">
  import { ArrowLeft, Send, Camera, Paperclip, ShieldAlert, CheckCheck } from '@lucide/svelte';
  import type { ChatMessage } from '../types';

  let {
    onBack,
    messages,
    onSendMessage,
    currentUser,
    otherUserName,
  } = $props<{
    onBack: () => void;
    messages: ChatMessage[];
    onSendMessage: (text: string) => void;
    currentUser: 'client' | 'worker';
    otherUserName: string;
  }>();

  let inputText = $state('');
  let chatEndRef = $state<HTMLDivElement | null>(null);

  const quickReplies = $derived(currentUser === 'worker' 
    ? ["Saya sudah di lokasi 📍", "Saya sedang di jalan", "Estimasi pengerjaan 2 jam", "Sudah selesai ya Bu"]
    : ["Berapa estimasi harganya?", "Bisakah datang sekarang?", "Alatnya sudah lengkap?", "Terima kasih!"]
  );

  $effect(() => {
    // Trigger scroll when messages array changes
    messages;
    if (chatEndRef) {
      chatEndRef.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    onSendMessage(text);
    inputText = '';
  };
</script>

<div class="flex-1 flex flex-col bg-[#F4F3F0] h-full overflow-hidden font-sans">
  <!-- Header -->
  <header class="px-4 py-3 bg-white border-b border-neutral-200 flex items-center gap-3 shadow-sm shrink-0">
    <button onclick={onBack} class="p-1 -ml-1 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
      <ArrowLeft size={20} />
    </button>
    <div class="relative">
      <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
        {otherUserName.slice(0, 2).toUpperCase()}
      </div>
      <span class="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white"></span>
    </div>
    <div class="flex-1">
      <h2 class="text-sm font-bold text-neutral-900 leading-tight">{otherUserName}</h2>
      <p class="text-[10px] text-success font-medium">Sedang Online</p>
    </div>
  </header>

  <!-- Security Banner -->
  <div class="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-start gap-2.5 shrink-0">
    <ShieldAlert size={16} class="text-amber-500 mt-0.5 shrink-0" />
    <p class="text-[11px] text-amber-800 leading-snug">
      <strong>Transaksi dilindungi Kerjantara.id.</strong> Jagalah kerahasiaan kontak pribadimu demi keamanan bersama.
    </p>
  </div>

  <!-- Messages -->
  <div class="flex-1 overflow-y-auto px-4 py-3 space-y-3">
    {#each messages as msg (msg.id)}
      {@const isMe = msg.sender === currentUser}
      <div
        class="flex flex-col max-w-[80%] {
          isMe ? 'ml-auto items-end' : 'mr-auto items-start'
        }"
      >
        <div
          class="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm {
            isMe
              ? 'bg-primary text-white rounded-tr-none'
              : 'bg-white text-neutral-900 rounded-tl-none border border-neutral-100'
          }"
        >
          {msg.text}
        </div>
        <div class="flex items-center gap-1 mt-1 px-1">
          <span class="text-[10px] text-neutral-400">{msg.time}</span>
          {#if isMe}
            <CheckCheck size={12} class="text-primary" />
          {/if}
        </div>
      </div>
    {/each}
    <div bind:this={chatEndRef}></div>
  </div>

  <!-- Quick Replies -->
  <div class="px-4 py-2 overflow-x-auto whitespace-nowrap bg-white border-t border-neutral-100 shrink-0 flex gap-2 no-scrollbar">
    {#each quickReplies as reply, idx}
      <button
        onclick={() => handleSend(reply)}
        class="inline-block px-3.5 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full border border-neutral-200 hover:bg-neutral-200 transition-colors shrink-0 cursor-pointer"
      >
        {reply}
      </button>
    {/each}
  </div>

  <!-- Input panel -->
  <div class="p-3 bg-white border-t border-neutral-200 flex items-center gap-2.5 shrink-0">
    <button class="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-50 cursor-pointer">
      <Paperclip size={20} />
    </button>
    <button class="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-50 cursor-pointer">
      <Camera size={20} />
    </button>
    <div class="flex-1 relative">
      <input
        type="text"
        placeholder="Ketik pesan..."
        bind:value={inputText}
        onkeydown={(e) => e.key === 'Enter' && handleSend(inputText)}
        class="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:bg-white transition-all pr-10 text-neutral-900"
      />
    </div>
    <button
      onclick={() => handleSend(inputText)}
      class="p-3 bg-primary text-white rounded-xl hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
    >
      <Send size={16} />
    </button>
  </div>
</div>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>
