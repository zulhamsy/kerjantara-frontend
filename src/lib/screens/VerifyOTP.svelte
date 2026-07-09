<script lang="ts">
  import { onMount } from 'svelte';
  import { ArrowLeft, MailOpen } from '@lucide/svelte';
  import { fly } from 'svelte/transition';

  let { 
    onBack, 
    onNext, 
    email = 'kerjantara@example.com',
    onVerify,
    onResend
  } = $props<{ 
    onBack: () => void, 
    onNext: () => void,
    email?: string,
    onVerify?: (code: string) => Promise<{ success: boolean, message?: string }>,
    onResend?: () => Promise<{ success: boolean, message?: string }>
  }>();

  let otp = $state(['', '', '', '', '', '']);
  let timer = $state(47);
  let error = $state(false);
  let toast = $state(false);
  
  let inputRefs: (HTMLInputElement | null)[] = [];

  onMount(() => {
    inputRefs[0]?.focus();
  });

  $effect(() => {
    if (timer > 0) {
      const interval = setInterval(() => timer -= 1, 1000);
      return () => clearInterval(interval);
    }
  });

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    error = false;
    otp[index] = value;

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1]?.focus();
    }
    
    // Auto-submit verification
    if (index === 5 && value && otp.join('').length === 6) {
      const code = otp.join('');
      if (onVerify) {
        onVerify(code).then(({ success, message }: { success: boolean, message?: string }) => {
          if (success) {
            onNext();
          } else {
            error = true;
          }
        });
      } else {
        if (code === '123456') {
          setTimeout(onNext, 500);
        } else {
          error = true;
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  };

  let isComplete = $derived(otp.join('').length === 6);

  const handleResend = () => {
    timer = 60;
    otp = ['', '', '', '', '', ''];
    error = false;
    
    if (onResend) {
      onResend().then(({ success, message }: { success: boolean, message?: string }) => {
        if (success) {
          toast = true;
          setTimeout(() => toast = false, 3000);
        } else {
          alert("Gagal kirim ulang OTP: " + message);
        }
      });
    } else {
      toast = true;
      setTimeout(() => toast = false, 3000);
    }
    inputRefs[0]?.focus();
  };
</script>

<div class="flex-1 flex flex-col bg-white overflow-hidden relative">
  <!-- Toast Notification (C2) -->
  {#if toast}
    <div 
      transition:fly={{ y: 50, duration: 300 }}
      class="absolute bottom-24 left-1/2 -translate-x-1/2 w-max bg-neutral-900 text-white px-4 py-3 rounded-xl flex items-center gap-3 z-50 shadow-lg"
    >
      <div class="bg-success rounded-full p-0.5">
        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <span class="text-sm font-medium">Kode baru telah dikirim! Cek email.</span>
    </div>
  {/if}

  <!-- Header -->
  <header class="px-5 pt-6 pb-4 flex flex-col gap-4">
    <div class="flex items-center relative">
      <button onclick={onBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
        <ArrowLeft size={24} />
      </button>
      <h1 class="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">Verifikasi</h1>
    </div>
    
    <!-- Progress Stepper -->
    <div class="flex flex-col gap-1.5">
      <div class="flex gap-2">
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
      </div>
    </div>
  </header>

  <!-- Content -->
  <div class="flex-1 px-5 flex flex-col items-center pt-8">
    <div class="w-[120px] h-[120px] bg-primary-light rounded-full flex items-center justify-center mb-6 text-primary relative">
      <MailOpen size={56} strokeWidth={1.5} />
      <div class="absolute top-2 right-2 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
    </div>

    <h2 class="text-[22px] font-bold text-neutral-900 mb-2 text-center">Cek Kode Verifikasimu</h2>
    <p class="text-neutral-600 text-center text-[15px] mb-1">
      Kami sudah mengirimkan kode 6 digit ke
    </p>
    <p class="font-bold text-primary mb-1">{email}</p>
    <p class="text-neutral-500 text-sm text-center mb-8">Kode berlaku selama 10 menit.</p>

    <!-- OTP Inputs -->
    <div class="flex gap-2 mb-2 {error ? 'animate-shake' : ''}">
      {#each otp as digit, index}
        <input
          bind:this={inputRefs[index]}
          type="text"
          inputmode="numeric"
          maxlength={1}
          value={digit}
          oninput={e => handleChange(index, (e.target as HTMLInputElement).value)}
          onkeydown={e => handleKeyDown(index, e)}
          class="w-11 h-14 sm:w-[48px] sm:h-[56px] text-center text-xl font-bold rounded-[10px] border-2 focus:outline-none transition-colors {
            error 
              ? 'border-danger text-danger bg-danger/5' 
              : digit 
                ? 'border-primary text-neutral-900' 
                : 'border-neutral-200 text-neutral-900 focus:border-primary'
          }"
        />
      {/each}
    </div>
    
    {#if error}
      <p class="text-danger text-sm font-medium mt-2">Kode tidak valid. Coba lagi (2 kesempatan tersisa).</p>
    {/if}

    <!-- Timer / Resend -->
    <div class="mt-8 text-center flex flex-col items-center">
      {#if timer > 0}
        <p class="text-neutral-400 font-medium text-sm">
          Kirim ulang dalam 00:{timer.toString().padStart(2, '0')}
        </p>
      {:else}
        <button onclick={handleResend} class="text-primary font-bold text-sm hover:underline cursor-pointer">
          Kirim ulang kode
        </button>
      {/if}

      <div class="mt-4 px-3 py-1.5 bg-blue-500/50 text-blue-950 font-semibold rounded-lg text-xs inline-block">
        Mockup: OTP 123456
      </div>
    </div>

    <button class="text-neutral-500 font-medium text-xs mt-6 underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 cursor-pointer">
      Salah alamat? Ubah di sini
    </button>

    <!-- Action Button -->
    <div class="mt-auto mb-8 w-full">
      <button 
        onclick={onNext}
        disabled={!isComplete}
        class="w-full h-[52px] rounded-[12px] font-semibold text-base transition-all cursor-pointer {
          isComplete && !error ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)]' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
        }"
      >
        Verifikasi &rarr;
      </button>
    </div>
  </div>
</div>

<style>
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
  }
  .animate-shake {
    animation: shake 0.3s ease-in-out;
  }
</style>
