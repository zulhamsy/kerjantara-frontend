<script lang="ts">
  import { ArrowLeft, Check } from '@lucide/svelte';
  import { fly, fade } from 'svelte/transition';

  const INSTRUCTIONS = [
    "Posisikan wajahmu dalam bingkai oval",
    "Kedipkan mata 2 kali",
    "Gelengkan kepala pelan ke kanan, lalu ke kiri"
  ];

  let { onCancel, onNext } = $props<{ onCancel: () => void, onNext: () => void }>();

  let step = $state(0);
  let status = $state<'detecting' | 'detected' | 'too_far' | 'success'>('detecting');

  $effect(() => {
    // Fake liveness flow
    if (step === 0) {
      const t1 = setTimeout(() => status = 'too_far', 1000);
      const t2 = setTimeout(() => status = 'detected', 2500);
      const t3 = setTimeout(() => step = 1, 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else if (step === 1) {
      status = 'detecting';
      const t1 = setTimeout(() => status = 'detected', 1500);
      const t2 = setTimeout(() => step = 2, 2500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else if (step === 2) {
      status = 'detecting';
      const t1 = setTimeout(() => status = 'detected', 2000);
      const t2 = setTimeout(() => {
        status = 'success';
        setTimeout(() => onNext(), 1500);
      }, 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  });
</script>

<div class="flex-1 bg-neutral-900 flex flex-col relative overflow-hidden h-full">
  <!-- Fake Camera Feed Background -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
     <!-- Simulate blur around face -->
     <div class="w-[80%] h-[60%] bg-orange-200/20 rounded-full blur-3xl"></div>
  </div>

  <!-- Header -->
  <header class="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between">
    <button onclick={onCancel} class="text-white flex items-center gap-1 font-medium hover:text-neutral-200 cursor-pointer">
      <ArrowLeft size={20} /> Kembali
    </button>
    <h1 class="font-semibold text-white">Verifikasi Wajah</h1>
    <div class="w-[70px]"></div>
  </header>

  <!-- Main Overlay -->
  <div class="flex-1 relative z-10 flex flex-col">
    <!-- Top Text Area -->
    <div class="pt-24 px-6 flex flex-col items-center">
        <h2 class="text-xl font-bold text-white text-center drop-shadow-md">
          {status === 'success' ? 'Verifikasi Berhasil!' : 'Verifikasi Wajahmu'}
        </h2>
        <p class="text-white/80 text-sm text-center mt-1 w-64">
          Ikuti petunjuk berikut untuk membuktikan bahwa kamu benar-benar hadir
        </p>
    </div>

    <!-- Center Oval & Instructions -->
    <div class="flex-1 flex flex-col items-center justify-center -mt-10">
      
      <!-- Active Instruction Tooltip -->
      {#if status !== 'success'}
        {#key step}
          <div 
            in:fly={{ y: 10, duration: 200 }}
            out:fly={{ y: -10, duration: 200 }}
            class="bg-black/60 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium mb-6 text-center max-w-[280px]"
          >
            {INSTRUCTIONS[step]}
          </div>
        {/key}
      {/if}

      <!-- Oval Guide -->
      <div class="relative">
         <div class="w-[240px] h-[320px] rounded-[120px] border-[4px] border-dashed border-white/40 overflow-hidden relative">
           <!-- When success, fill with green tint -->
           {#if status === 'success'}
             <div 
               transition:fade={{ duration: 200 }}
               class="absolute inset-0 bg-success/80 flex items-center justify-center backdrop-blur-md"
             >
                <div in:fly={{ y: 20, duration: 300 }}>
                  <Check size={80} class="text-white" strokeWidth={3} />
                </div>
             </div>
           {/if}
         </div>
         
         <!-- Dynamic Border based on status -->
         <div class="absolute -inset-1 rounded-[120px] border-[4px] opacity-70 transition-colors duration-300 {
           status === 'too_far' ? 'border-warning' :
           status === 'detected' ? 'border-primary' :
           'border-transparent'
         }"></div>
      </div>
      
      <!-- Status Text Indicator -->
      <div class="h-6 mt-6">
        {#if status === 'detecting'}
          <span class="text-white/70 text-sm">Mendeteksi wajah...</span>
        {:else if status === 'detected'}
          <span class="text-success font-medium text-sm drop-shadow">Wajah terdeteksi ✓</span>
        {:else if status === 'too_far'}
          <span class="text-warning font-medium text-sm drop-shadow">Terlalu jauh — mendekat sedikit</span>
        {/if}
      </div>
    </div>

    <!-- Bottom Area: Progress & Cancel -->
    <div class="pb-8 px-6 flex flex-col items-center">
      <!-- Progress Bar (Liveness steps) -->
      <div class="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-6">
        <div 
          class="h-full bg-primary transition-all duration-500" 
          style="width: {((step) / 3) * 100}%"
        ></div>
      </div>

      <button onclick={onCancel} class="text-white/80 font-medium py-3 px-6 hover:text-white transition-colors cursor-pointer">
        Batalkan
      </button>
    </div>
  </div>
</div>
