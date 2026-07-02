<script lang="ts">
  import { X, Camera, Image as ImageIcon, Zap, CheckCircle2 } from '@lucide/svelte';

  let { onCancel, onNext } = $props<{ onCancel: () => void, onNext: () => void }>();

  let hasPhoto = $state(false);
  let quality = $state<'analyzing' | 'good' | 'bad'>('analyzing');

  $effect(() => {
    if (!hasPhoto) {
      quality = 'analyzing';
      const timer1 = setTimeout(() => quality = 'bad', 1500); // simulate bad positioning initially
      const timer2 = setTimeout(() => quality = 'good', 3000); // simulate good positioning
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }
  });
</script>

{#if hasPhoto}
  <div class="flex-1 bg-black flex flex-col relative overflow-hidden h-full">
    <!-- Header -->
    <header class="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between">
      <button onclick={() => hasPhoto = false} class="text-white flex items-center gap-1 font-medium hover:text-neutral-200 cursor-pointer">
        <X size={20} /> Batal
      </button>
      <h1 class="font-semibold text-white">Preview Foto</h1>
      <div class="w-[60px]"></div> <!-- Spacer -->
    </header>

    <!-- Captured Photo (Simulation) -->
    <div class="flex-1 flex items-center justify-center p-6 mt-12 mb-28">
       <div class="w-full aspect-[16/10] bg-neutral-800 rounded-xl border border-neutral-700 relative overflow-hidden">
          <div class="absolute inset-0 bg-neutral-600 flex items-center justify-center">
             <!-- Fake Document Mockup -->
             <div class="w-[80%] h-[70%] bg-[#f4ebd0]/80 rounded relative flex gap-4 p-4 blur-[1px]">
               <div class="w-16 h-20 bg-neutral-400 rounded-sm"></div>
               <div class="flex-1 flex flex-col gap-2">
                 <div class="w-full h-3 bg-neutral-800/40 rounded-sm"></div>
                 <div class="w-3/4 h-2 bg-neutral-800/20 rounded-sm"></div>
                 <div class="w-1/2 h-2 bg-neutral-800/20 rounded-sm"></div>
                 <div class="w-full h-2 bg-neutral-800/20 rounded-sm mt-auto"></div>
               </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Bottom Actions -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-black z-20 flex gap-4">
       <button 
         onclick={() => hasPhoto = false}
         class="flex-1 h-[52px] border border-white text-white rounded-[12px] font-semibold text-base hover:bg-white/10 cursor-pointer"
       >
         Ambil Ulang
       </button>
       <button 
         onclick={onNext}
         class="flex-1 h-[52px] bg-primary text-white rounded-[12px] font-semibold text-base shadow-lg cursor-pointer"
       >
         Gunakan Foto Ini &rarr;
       </button>
    </div>
  </div>
{:else}
  <!-- Camera View -->
  <div class="flex-1 bg-neutral-900 flex flex-col relative overflow-hidden h-full">
    <!-- Fake Camera Feed Background -->
    <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
      <div class="w-full h-[60%] bg-gradient-to-b from-neutral-800 to-neutral-700 blur-xl"></div>
    </div>

    <!-- Header -->
    <header class="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between">
      <button onclick={onCancel} class="text-white flex items-center gap-1 font-medium hover:text-neutral-200 cursor-pointer">
        <X size={20} /> Batal
      </button>
      <h1 class="font-semibold text-white">Foto Dokumen</h1>
      <button class="text-white p-2 cursor-pointer">
        <Zap size={20} />
      </button>
    </header>

    <!-- Overlay with Cutout -->
    <div class="flex-1 relative z-10 flex flex-col">
      <!-- Top Dark Cover -->
      <div class="flex-1 bg-black/60 pt-24 px-6 flex flex-col items-center">
          {#if quality === 'analyzing'}
            <span class="bg-black/50 text-white text-sm px-4 py-1.5 rounded-full animate-pulse">Menganalisis...</span>
          {:else if quality === 'bad'}
            <span class="bg-danger/80 text-white text-sm px-4 py-1.5 rounded-full flex gap-1.5 items-center backdrop-blur-sm"><X size={16}/> Terlalu gelap atau buram</span>
          {:else if quality === 'good'}
            <span class="bg-success text-white text-sm px-4 py-1.5 rounded-full flex gap-1.5 items-center shadow-lg"><CheckCircle2 size={16}/> Posisi bagus! Siap diambil.</span>
          {/if}
      </div>

      <!-- Viewfinder Frame Row -->
      <div class="flex bg-black/60 items-stretch">
        <div class="w-6 bg-black/60 shrink-0"></div>
        
        <!-- Transparent Frame Area -->
        <div class="flex-1 aspect-[16/10] relative">
           <div class="absolute inset-0 border border-white/30 rounded-xl"></div>
           
           <!-- Corner Guides -->
           <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl"></div>
           <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl"></div>
           <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl"></div>
           <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl"></div>
           
           <!-- Crosshair / Label -->
           <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-50">
              <Camera size={24} class="text-white mb-2" />
              <span class="text-white text-xs tracking-wider">Posisikan dokumen di dalam bingkai</span>
           </div>
        </div>
        
        <div class="w-6 bg-black/60 shrink-0"></div>
      </div>

      <!-- Bottom Dark Cover & Controls -->
      <div class="flex-[1.5] bg-black/60 flex flex-col pb-8 relative">
         
         <!-- Guidelines text -->
         <div class="flex justify-center gap-4 mt-6 px-4">
            <span class="text-[11px] text-white/80">Cahaya cukup</span>
            <span class="text-[11px] text-white/80">&bull;</span>
            <span class="text-[11px] text-white/80">Dokumen rata</span>
            <span class="text-[11px] text-white/80">&bull;</span>
            <span class="text-[11px] text-white/80">Sisi terlihat</span>
         </div>

         <!-- Camera Controls -->
         <div class="mt-auto px-8 flex justify-between items-center relative h-24">
           <button class="flex flex-col items-center gap-1 text-white/80 hover:text-white cursor-pointer">
              <div class="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                <ImageIcon size={20} />
              </div>
              <span class="text-[10px] font-medium">Dari Galeri</span>
           </button>
           
           <!-- Shutter Button -->
           <button 
             onclick={() => hasPhoto = true}
             disabled={quality !== 'good'}
             class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full border-[4px] flex items-center justify-center transition-all cursor-pointer {
               quality === 'good' ? 'border-primary ring-4 ring-primary/30' : 'border-white'
             }"
           >
              <div class="w-[60px] h-[60px] rounded-full {quality === 'good' ? 'bg-white' : 'bg-white/80'}"></div>
           </button>

           <div class="w-10"></div> <!-- Spacer for symmetry -->
         </div>
      </div>
    </div>
  </div>
{/if}
