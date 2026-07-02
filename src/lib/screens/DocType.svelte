<script lang="ts">
  import { ArrowLeft, Lock, CreditCard, CarFront, Book, Lightbulb, CheckCircle2 } from '@lucide/svelte';

  let { onBack, onNext } = $props<{ onBack: () => void, onNext: () => void }>();

  let docType = $state<string | null>(null);
  let showTips = $state(true);
</script>

<div class="flex-1 flex flex-col bg-white overflow-hidden relative h-full">
  <!-- Header -->
  <header class="px-5 pt-6 pb-4 flex flex-col gap-4">
    <div class="flex items-center relative">
      <button onclick={onBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
        <ArrowLeft size={24} />
      </button>
      <h1 class="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">Verifikasi Identitas</h1>
    </div>
    
    <!-- Progress Stepper (3) -->
    <div class="flex flex-col gap-1.5">
      <div class="flex gap-2">
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
      </div>
    </div>
  </header>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto px-5 pt-4 pb-28">
    <!-- Context Banner -->
    <div class="bg-primary-light border-l-4 border-primary p-4 rounded-r-xl mb-6 flex gap-3 items-start">
      <Lock size={20} class="text-primary shrink-0 mt-0.5" />
      <div>
        <p class="text-sm text-neutral-900 font-medium">Data kamu dienkripsi dan hanya digunakan untuk verifikasi. Tidak dibagikan ke pihak ketiga.</p>
      </div>
    </div>

    <h2 class="text-[24px] font-bold text-neutral-900 mb-2 leading-[1.3]">
      Pilih Dokumen<br/>Identitasmu
    </h2>
    <p class="text-neutral-600 text-sm mb-6 leading-relaxed">
      Dokumen digunakan untuk memverifikasi identitasmu dan meningkatkan kepercayaan klien.
    </p>

    <!-- Document Selection List -->
    <div class="flex flex-col gap-3 mb-8">
      <!-- Option 1: KTP -->
      <div 
        onclick={() => docType = 'ktp'}
        class="flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all {
          docType === 'ktp' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
        }"
      >
        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 {docType === 'ktp' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}">
          <CreditCard size={20} />
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1">
            <span class="font-bold text-neutral-900 text-base">KTP</span>
            <span class="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded-full">Direkomendasikan</span>
          </div>
          <p class="text-xs text-neutral-500">Proses verifikasi lebih cepat</p>
        </div>
        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {docType === 'ktp' ? 'border-primary bg-primary text-white' : 'border-neutral-300'}">
          {#if docType === 'ktp'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {/if}
        </div>
      </div>

      <!-- Option 2: SIM -->
      <div 
        onclick={() => docType = 'sim'}
        class="flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all {
          docType === 'sim' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
        }"
      >
       <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 {docType === 'sim' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}">
          <CarFront size={20} />
        </div>
        <div class="flex-1">
          <span class="block font-bold text-neutral-900 text-base mb-1">SIM</span>
          <p class="text-xs text-neutral-500">SIM A atau SIM C masih berlaku</p>
        </div>
        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {docType === 'sim' ? 'border-primary bg-primary text-white' : 'border-neutral-300'}">
          {#if docType === 'sim'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {/if}
        </div>
      </div>

      <!-- Option 3: Paspor -->
      <div 
        onclick={() => docType = 'paspor'}
        class="flex items-center p-4 rounded-[12px] border-2 cursor-pointer transition-all {
          docType === 'paspor' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-neutral-300'
        }"
      >
        <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mr-4 {docType === 'paspor' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}">
          <Book size={20} />
        </div>
        <div class="flex-1">
          <span class="block font-bold text-neutral-900 text-base mb-1">Paspor</span>
          <p class="text-xs text-neutral-500">Paspor yang masih berlaku</p>
        </div>
        <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center {docType === 'paspor' ? 'border-primary bg-primary text-white' : 'border-neutral-300'}">
           {#if docType === 'paspor'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
           {/if}
        </div>
      </div>
    </div>

    <!-- Tips Collapsible -->
    <div class="bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
      <button 
        onclick={() => showTips = !showTips}
        class="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <Lightbulb size={18} class="text-accent" />
          <span class="font-semibold text-neutral-900 text-sm">Tips Foto yang Baik</span>
        </div>
        <svg class="w-5 h-5 text-neutral-400 transition-transform {showTips ? 'rotate-180' : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      
      {#if showTips}
        <div class="p-4 pt-0 text-sm text-neutral-600 space-y-3">
          <div class="flex gap-2">
            <CheckCircle2 size={16} class="text-success shrink-0 mt-0.5" />
            <p>Pastikan foto tidak buram atau terpotong</p>
          </div>
          <div class="flex gap-2">
            <CheckCircle2 size={16} class="text-success shrink-0 mt-0.5" />
            <p>Ambil di tempat dengan pencahayaan cukup</p>
          </div>
          <div class="flex gap-2">
            <CheckCircle2 size={16} class="text-success shrink-0 mt-0.5" />
            <p>Semua teks di dokumen harus terbaca jelas</p>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- FIXED Bottom Action CTA -->
  <div class="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 z-10">
    <button 
      onclick={onNext}
      disabled={!docType}
      class="w-full h-[52px] rounded-[12px] font-semibold text-base transition-all cursor-pointer {
        docType ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
      }"
    >
      Pilih &amp; Ambil Foto &rarr;
    </button>
  </div>
</div>
