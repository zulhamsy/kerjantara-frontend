<script lang="ts">
  import { onMount } from 'svelte';
  import { ShieldCheck, Briefcase, Users, LayoutGrid, X } from '@lucide/svelte';
  import { fly } from 'svelte/transition';
  import KerjantaraLogo from '../components/KerjantaraLogo.svelte';

  let { onNext, onSkipToOTP, onGoogleSignIn, loggedInEmail } = $props<{ 
    onNext: () => void, 
    onSkipToOTP?: () => void,
    onGoogleSignIn?: () => void,
    loggedInEmail?: string
  }>();

  let googleState = $state<'hidden' | 'loading' | 'ready'>('hidden');

  onMount(() => {
    // Mock snackbar dinonaktifkan karena menggunakan Google One Tap asli
  });

  const handleClose = () => googleState = 'hidden';
  const handleContinue = () => {
    googleState = 'hidden';
    if (onGoogleSignIn) {
      onGoogleSignIn();
    } else if (onSkipToOTP) {
      onSkipToOTP();
    }
  };
</script>

<div class="flex-1 flex flex-col bg-neutral-100 relative h-full overflow-hidden">
  
  <!-- Scrollable Main Content -->
  <div class="flex-1 overflow-y-auto flex flex-col">
    <!-- Header -->
    <header class="px-6 pt-6 pb-2 flex items-center justify-between">
      <KerjantaraLogo iconSize={24} textSize="text-base" />
      <button class="text-sm font-semibold text-[#1976D2] border border-[#1976D2] px-4 py-1.5 rounded-full hover:bg-neutral-50 transition-colors">
        Masuk
      </button>
    </header>

    <!-- Hero Content -->
    <div class="flex-1 px-6 pb-8 flex flex-col pt-8">
      <!-- Illustration Placeholder -->
      <div class="w-full flex justify-center mb-8">
        <div class="w-[280px] h-[220px] bg-primary-light rounded-[40px] flex items-center justify-center relative overflow-hidden">
           <!-- Blob shapes for aesthetics -->
           <div class="absolute -top-10 -left-10 w-40 h-40 bg-white/40 rounded-full blur-2xl"></div>
           <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
           
           <!-- Simple flat illustration using icons -->
           <div class="flex items-center gap-4 relative z-10">
             <div class="p-4 bg-white rounded-2xl shadow-sm text-primary">
               <Briefcase size={40} />
             </div>
             <div class="flex items-center space-x-1 text-primary">
               <div class="w-2 h-2 rounded-full bg-accent"></div>
               <div class="w-2 h-2 rounded-full bg-accent"></div>
               <div class="w-2 h-2 rounded-full bg-accent"></div>
             </div>
             <div class="p-4 bg-primary text-white rounded-2xl shadow-sm">
               <LayoutGrid size={40} />
             </div>
           </div>
        </div>
      </div>

      <!-- Text -->
      <h1 class="text-[28px] leading-[1.3] font-bold text-neutral-900 text-center mb-3">
        Temukan Peluang Kerja<br />yang Tepat Untukmu
      </h1>
      <p class="text-neutral-600 text-center text-[15px] mb-8 leading-relaxed">
        Ubah keahlianmu jadi pendapatan. Dapatkan panggilan kerja terpercaya dan cairkan penghasilanmu tanpa ribet bersama Kerjantara.id.
      </p>

      <!-- Badges -->
      <div class="flex items-center justify-center gap-4 flex-wrap mb-10">
        <div class="flex justify-center items-center gap-1.5 text-xs font-medium text-neutral-600">
          <ShieldCheck size={16} class="text-success" />
          <span>Terverifikasi KTP</span>
        </div>
        <div class="flex justify-center items-center gap-1.5 text-xs font-medium text-neutral-600">
          <Briefcase size={16} class="text-warning" />
          <span>50.000+ Lowongan</span>
        </div>
        <div class="flex justify-center items-center gap-1.5 text-xs font-medium text-neutral-600">
          <Users size={16} class="text-primary" />
          <span>12.000+ Klien Aktif</span>
        </div>
      </div>

      <!-- Buttons -->
      <div class="mt-auto flex flex-col gap-4">
        <button 
          onclick={onNext}
          class="w-full bg-primary text-white h-[52px] rounded-[12px] font-semibold text-base shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800 transition-colors cursor-pointer"
        >
          Daftar Gratis Sekarang &rarr;
        </button>
        
        <div class="flex items-center gap-4 py-2">
          <div class="h-px bg-neutral-300 flex-1"></div>
          <span class="text-sm font-medium text-neutral-400">atau</span>
          <div class="h-px bg-neutral-300 flex-1"></div>
        </div>

        <button 
          onclick={onGoogleSignIn}
          class="w-full bg-white border border-neutral-300 text-neutral-900 h-[52px] rounded-[12px] font-semibold text-base flex items-center justify-center gap-3 hover:bg-neutral-50 transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" class="w-5 h-5">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Lanjutkan dengan Google
        </button>
      </div>

      <p class="text-center text-sm mt-6 text-neutral-600">
        Sudah punya akun? <button class="font-bold text-primary cursor-pointer">Masuk</button>
      </p>

      <p class="text-center text-[11px] mt-6 text-neutral-400 max-w-[280px] mx-auto leading-relaxed">
        Dengan mendaftar, kamu menyetujui Syarat & Ketentuan dan Kebijakan Privasi kami.
      </p>
    </div>
  </div>

  <!-- Persistent Gmail Sync Snackbar Overlay -->
  {#if googleState !== 'hidden'}
    <div
      transition:fly={{ y: 150, duration: 300 }}
      class="absolute bottom-6 left-4 right-4 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-neutral-100 p-4 z-50 flex flex-col gap-3"
    >
      {#if googleState === 'loading'}
        <div class="flex items-center gap-4 py-1">
          <div class="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin ml-1"></div>
          <span class="text-sm font-medium text-neutral-600">Menghubungkan ke Google...</span>
        </div>
      {:else}
        <div class="flex justify-between items-start">
          <div class="flex gap-3 items-center">
            <div class="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center p-2 border border-neutral-100">
              <svg viewBox="0 0 24 24" class="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div>
              <p class="text-xs text-neutral-500 font-medium leading-none mb-1">Lanjutkan sebagai</p>
              <p class="text-sm font-bold text-neutral-900 leading-none">{loggedInEmail}</p>
            </div>
          </div>
          <button onclick={handleClose} class="text-neutral-400 hover:text-neutral-600 p-1 -mr-1 cursor-pointer">
            <X size={18} />
          </button>
        </div>
        <button onclick={handleContinue} class="w-full bg-primary text-white h-[44px] rounded-xl text-sm font-semibold mt-1 shadow-sm hover:bg-blue-800 transition-colors cursor-pointer">
          Lanjutkan
        </button>
      {/if}
    </div>
  {/if}

</div>
