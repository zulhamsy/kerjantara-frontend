<script lang="ts">
  import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle2 } from '@lucide/svelte';

  let { 
    onBack, 
    onLogin, 
    onGoogleSignIn,
    errorMessage = null,
    onCloseError,
    loading = false
  } = $props<{ 
    onBack: () => void, 
    onLogin: (data: { email: string, password: string }) => void,
    onGoogleSignIn?: () => void,
    errorMessage?: string | null,
    onCloseError?: () => void,
    loading?: boolean
  }>();

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);

  // Validation helpers
  let isEmailValid = $derived(email.trim().length > 0 && email.includes('@'));
  let isPasswordValid = $derived(password.length >= 6);
  let isValid = $derived(isEmailValid && isPasswordValid);

  function handleEmailInput(e: Event) {
    email = (e.target as HTMLInputElement).value;
    if (errorMessage && onCloseError) {
      onCloseError();
    }
  }

  function handlePasswordInput(e: Event) {
    password = (e.target as HTMLInputElement).value;
    if (errorMessage && onCloseError) {
      onCloseError();
    }
  }
</script>

<div class="flex-1 flex flex-col bg-white overflow-hidden">
  <!-- Header -->
  <header class="px-5 pt-6 pb-4 flex flex-col gap-4">
    <div class="flex items-center relative">
      <button onclick={onBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
        <ArrowLeft size={24} />
      </button>
      <h1 class="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">Masuk Akun</h1>
    </div>
  </header>

  <!-- Error Notification Toast (top-placed toast) -->
  {#if errorMessage}
    <div class="mx-5 mt-2 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between gap-3 animate-slide-down">
      <div class="flex items-center gap-2.5">
        <div class="bg-danger rounded-full p-0.5 text-white shrink-0">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <span class="text-xs font-semibold text-danger leading-tight">{errorMessage}</span>
      </div>
      {#if onCloseError}
        <button onclick={onCloseError} class="text-neutral-400 hover:text-neutral-650 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer shrink-0">
          Tutup
        </button>
      {/if}
    </div>
  {/if}

  <!-- Form Content -->
  <div class="flex-1 overflow-y-auto px-5 pb-8">
    <h2 class="text-[22px] font-bold text-neutral-900 mb-1 mt-2">Selamat Datang Kembali</h2>
    <p class="text-sm text-neutral-600 mb-6">Masukkan email dan kata sandi Anda untuk mengakses dashboard Kerjantara.</p>

    <form 
      onsubmit={(e) => {
        e.preventDefault();
        if (isValid && !loading) {
          onLogin({ email, password });
        }
      }}
      class="flex flex-col gap-5"
    >
      <!-- Email Input -->
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-neutral-900">Alamat Email</label>
        <div class="relative">
          <input 
            type="email" 
            placeholder="email@kamu.com"
            value={email}
            oninput={handleEmailInput}
            disabled={loading}
            class="w-full h-[52px] pl-4 pr-11 rounded-[10px] border border-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
            required
          />
          {#if isEmailValid}
            <CheckCircle2 size={20} class="absolute right-4 top-1/2 -translate-y-1/2 text-success" />
          {:else}
            <Mail size={20} class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          {/if}
        </div>
      </div>

      <!-- Password Input -->
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-neutral-900">Kata Sandi</label>
        <div class="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Masukkan kata sandi Anda"
            value={password}
            oninput={handlePasswordInput}
            disabled={loading}
            class="w-full h-[52px] pl-4 pr-11 rounded-[10px] border border-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500"
            required
          />
          <button 
            type="button"
            onclick={() => showPassword = !showPassword}
            class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 p-1 cursor-pointer"
          >
            {#if showPassword}
              <EyeOff size={20} />
            {:else}
              <Eye size={20} />
            {/if}
          </button>
        </div>
      </div>

      <!-- Action Buttons inside Form -->
      <div class="mt-4">
        <button 
          type="submit"
          disabled={!isValid || loading}
          class="w-full h-[52px] rounded-[12px] font-semibold text-base transition-all cursor-pointer {
            isValid && !loading ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
          }"
        >
          Masuk &rarr;
        </button>
      </div>
    </form>

    <div class="mt-4">
      <div class="flex items-center gap-4 py-6">
        <div class="h-px bg-neutral-200 flex-1"></div>
        <span class="text-xs font-medium text-neutral-500">Atau masuk dengan</span>
        <div class="h-px bg-neutral-200 flex-1"></div>
      </div>

      <button 
        onclick={onGoogleSignIn}
        disabled={loading}
        class="w-full bg-white border border-neutral-300 text-neutral-900 h-[52px] rounded-[12px] font-semibold text-base flex items-center justify-center gap-3 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" class="w-5 h-5">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p class="text-center text-sm mt-8 text-neutral-600">
        Belum punya akun? <a href="/auth/register" class="font-bold text-primary hover:underline">Daftar Gratis</a>
      </p>
    </div>
  </div>
</div>

<style>
  @keyframes slide-down {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-down {
    animation: slide-down 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
