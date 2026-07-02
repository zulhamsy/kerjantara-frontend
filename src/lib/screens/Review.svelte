<script lang="ts">
  import { ArrowLeft, Clock } from '@lucide/svelte';

  let { onBack, onNext } = $props<{ onBack: () => void, onNext: () => void }>();

  let agreed = $state(false);
</script>

<div class="flex-1 flex flex-col bg-neutral-50 overflow-hidden h-full relative">
  <!-- Header -->
  <header class="px-5 pt-6 pb-4 flex flex-col gap-4 bg-white z-10 border-b border-neutral-100">
    <div class="flex items-center relative">
      <button onclick={onBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
        <ArrowLeft size={24} />
      </button>
      <h1 class="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">Periksa Datamu</h1>
    </div>
    
    <!-- Progress Stepper (Almost Done) -->
    <div class="flex flex-col gap-1.5">
      <div class="flex gap-2">
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-primary rounded-full w-3/4"></div>
      </div>
    </div>
  </header>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto px-5 pt-6 pb-28">
    <h2 class="text-[24px] font-bold text-neutral-900 mb-2 leading-[1.3]">
      Periksa Sebelum<br/>Mengirim
    </h2>
    <p class="text-neutral-600 text-sm mb-6 leading-relaxed">
      Pastikan semua data sudah benar. Kamu masih bisa mengubah sebelum mengirim.
    </p>

    <!-- 1. Data Akun -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 mb-4">
       <div class="flex justify-between items-center mb-4">
         <h3 class="font-bold text-neutral-900 text-base">Data Akun</h3>
         <button class="text-primary font-semibold text-xs hover:underline cursor-pointer">Ubah</button>
       </div>
       
       <div class="flex flex-col gap-3">
         <div class="flex justify-between border-b border-neutral-50 pb-3">
           <span class="text-neutral-500 text-sm">Nama Lengkap</span>
           <span class="text-neutral-900 font-medium text-sm">Budi Santoso</span>
         </div>
         <div class="flex justify-between border-b border-neutral-50 pb-3">
           <span class="text-neutral-500 text-sm">Email</span>
           <span class="text-neutral-900 font-medium text-sm">budi@email.com</span>
         </div>
         <div class="flex justify-between">
           <span class="text-neutral-500 text-sm">Nomor HP</span>
           <span class="text-neutral-900 font-medium text-sm">+62 812 3456 7890</span>
         </div>
       </div>
    </div>

    <!-- 2. Dokumen Identitas -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 mb-4">
       <div class="flex justify-between items-center mb-4">
         <h3 class="font-bold text-neutral-900 text-base">Dokumen Identitas</h3>
       </div>
       
       <div class="flex items-center gap-4 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
         <div class="w-[80px] h-[55px] bg-neutral-200 rounded-lg overflow-hidden relative">
            <!-- Fake image preview -->
            <div class="absolute inset-0 bg-blue-100/50"></div>
         </div>
         <div class="flex-1">
           <span class="block font-bold text-neutral-900 text-sm">KTP</span>
           <span class="text-success text-xs font-semibold">Diunggah ✓</span>
         </div>
         <button class="text-primary font-semibold text-xs hover:underline cursor-pointer">Ubah</button>
       </div>
    </div>

    <!-- 3. Foto Selfie -->
    <div class="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 mb-6">
       <div class="flex justify-between items-center mb-4">
         <h3 class="font-bold text-neutral-900 text-base">Foto Selfie</h3>
       </div>
       
       <div class="flex items-center gap-4 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
         <div class="w-[56px] h-[56px] bg-neutral-200 rounded-full overflow-hidden relative border-2 border-white shadow-sm">
            <!-- Fake face preview -->
            <div class="absolute inset-x-2 bottom-0 h-8 bg-neutral-400 rounded-t-full"></div>
            <div class="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-neutral-300 rounded-full"></div>
         </div>
         <div class="flex-1">
           <span class="text-success text-xs font-semibold">Terdeteksi ✓</span>
         </div>
         <button class="text-primary font-semibold text-xs hover:underline cursor-pointer">Ubah</button>
       </div>
    </div>

    <!-- SLA Banner -->
    <div class="bg-primary-light border-l-4 border-primary p-4 rounded-r-xl mb-6 flex gap-3 items-start">
      <Clock size={20} class="text-primary shrink-0 mt-0.5" />
      <p class="text-sm text-neutral-900 font-medium">
        Proses verifikasi biasanya hanya 1–5 menit. Kami akan memberitahumu segera.
      </p>
    </div>

    <!-- Checkbox Persetujuan -->
    <label class="flex items-start gap-3 cursor-pointer group mb-4">
      <div class="relative flex items-center justify-center mt-0.5">
        <input 
          type="checkbox" 
          bind:checked={agreed}
          class="peer shrink-0 appearance-none w-5 h-5 border-2 border-neutral-300 rounded-[6px] checked:bg-primary checked:border-primary focus:outline-none transition-all"
        />
         <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 12 10" fill="none">
          <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="text-sm text-neutral-600 leading-snug">
        Saya menyatakan seluruh data yang diberikan adalah benar dan dapat dipertanggungjawabkan.
      </span>
    </label>
  </div>

  <!-- FIXED Bottom Action CTA -->
  <div class="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-neutral-100 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-10">
    <button 
      onclick={onNext}
      disabled={!agreed}
      class="w-full h-[52px] rounded-[12px] font-semibold text-base transition-all cursor-pointer {
        agreed ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
      }"
    >
      Kirim untuk Diverifikasi &rarr;
    </button>
  </div>
</div>
