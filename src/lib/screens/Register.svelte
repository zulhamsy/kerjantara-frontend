<script lang="ts">
  import { ArrowLeft, Mail, Eye, EyeOff, CheckCircle2 } from '@lucide/svelte';

  let { onBack, onNext, onGoogleSignIn } = $props<{ 
    onBack: () => void, 
    onNext: (data: { name: string, email: string, phone: string }) => void,
    onGoogleSignIn?: () => void 
  }>();

  let showPassword = $state(false);
  let formData = $state({ name: '', email: '', phone: '', password: '', terms: false });

  // Simple validation state for visual mockup - enabled if name is filled
  let isValid = $derived(formData.name.trim().length > 0);
</script>

<div class="flex-1 flex flex-col bg-white overflow-hidden">
  <!-- Header -->
  <header class="px-5 pt-6 pb-4 flex flex-col gap-4">
    <div class="flex items-center relative">
      <button onclick={onBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
        <ArrowLeft size={24} />
      </button>
      <h1 class="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">Buat Akun</h1>
    </div>
    
    <!-- Progress Stepper -->
    <div class="flex flex-col gap-1.5">
      <div class="flex gap-2">
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
      </div>
      <div class="flex justify-between text-[10px] font-medium text-neutral-400">
        <span class="text-primary">Akun</span>
        <span>Verifikasi</span>
        <span>Identitas</span>
        <span>Selesai</span>
      </div>
    </div>
  </header>

  <!-- Form Content -->
  <div class="flex-1 overflow-y-auto px-5 pb-8">
    <h2 class="text-[22px] font-bold text-neutral-900 mb-1 mt-2">Buat Akunmu</h2>
    <p class="text-sm text-neutral-600 mb-6">Isi data berikut untuk memulai. Prosesnya hanya 2 menit!</p>

    <div class="flex flex-col gap-5">
      <!-- Name -->
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-neutral-900">Nama Lengkap</label>
        <div class="relative">
          <input 
            type="text" 
            placeholder="Contoh: Budi Santoso"
            bind:value={formData.name}
            class="w-full h-[52px] px-4 rounded-[10px] border border-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-neutral-400"
          />
          {#if formData.name.length > 3}
            <CheckCircle2 size={20} class="absolute right-4 top-1/2 -translate-y-1/2 text-success" />
          {/if}
        </div>
      </div>

      <!-- Email -->
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-neutral-900">Email</label>
        <div class="relative">
          <input 
            type="email" 
            placeholder="email@kamu.com"
            bind:value={formData.email}
            class="w-full h-[52px] pl-4 pr-11 rounded-[10px] border border-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-neutral-400"
          />
          <Mail size={20} class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      <!-- Phone -->
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-neutral-900">Nomor HP</label>
        <div class="flex gap-2">
          <div class="h-[52px] px-3 flex items-center justify-center bg-neutral-100 border border-neutral-300 rounded-[10px] font-medium text-neutral-600 text-sm">
            +62
          </div>
          <input 
            type="tel" 
            placeholder="812 3456 7890"
            bind:value={formData.phone}
            class="flex-1 h-[52px] px-4 rounded-[10px] border border-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-neutral-400"
          />
        </div>
      </div>

      <!-- Password -->
      <div class="space-y-1.5">
        <label class="text-sm font-medium text-neutral-900">Buat Password</label>
        <div class="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Min. 8 karakter"
            bind:value={formData.password}
            class="w-full h-[52px] pl-4 pr-11 rounded-[10px] border border-neutral-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-base placeholder:text-neutral-400"
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
        
        <!-- Password Strength -->
        {#if formData.password.length > 0}
          <div class="flex items-center gap-2 mt-2">
            <div class="flex gap-1 flex-1">
              <div class="h-1.5 flex-1 rounded-full {formData.password.length > 0 ? 'bg-danger' : 'bg-neutral-200'}"></div>
              <div class="h-1.5 flex-1 rounded-full {formData.password.length > 4 ? 'bg-warning' : 'bg-neutral-200'}"></div>
              <div class="h-1.5 flex-1 rounded-full {formData.password.length >= 8 ? 'bg-success' : 'bg-neutral-200'}"></div>
              <div class="h-1.5 flex-1 rounded-full {formData.password.length > 10 ? 'bg-success' : 'bg-neutral-200'}"></div>
            </div>
            <span class="text-[10px] font-medium text-neutral-500 w-24 text-right">
              Kekuatan: {formData.password.length >= 8 ? 'Kuat' : formData.password.length > 4 ? 'Sedang' : 'Lemah'}
            </span>
          </div>
        {/if}
      </div>

      <!-- Terms Checkbox -->
      <label class="flex items-start gap-3 mt-2 cursor-pointer group">
        <div class="relative flex items-center justify-center mt-0.5">
          <input 
            type="checkbox" 
            bind:checked={formData.terms}
            class="peer shrink-0 appearance-none w-5 h-5 border-2 border-neutral-300 rounded-[6px] checked:bg-primary checked:border-primary focus:outline-none transition-all"
          />
          <svg class="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 12 10" fill="none">
            <path d="M1 4.5L4.5 8L11 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="text-sm text-neutral-600 leading-snug">
          Saya setuju dengan <button class="font-semibold text-primary cursor-pointer">Syarat & Ketentuan</button> dan <button class="font-semibold text-primary cursor-pointer">Kebijakan Privasi</button>
        </span>
      </label>
    </div>

    <!-- Action Buttons -->
    <div class="mt-8">
      <button 
        onclick={() => onNext({ name: formData.name, email: formData.email, phone: formData.phone })}
        disabled={!isValid}
        class="w-full h-[52px] rounded-[12px] font-semibold text-base transition-all cursor-pointer {
          isValid ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
        }"
      >
        Lanjut &rarr;
      </button>
      
      <div class="flex items-center gap-4 py-6">
        <div class="h-px bg-neutral-200 flex-1"></div>
        <span class="text-xs font-medium text-neutral-500">Atau daftar lebih cepat</span>
        <div class="h-px bg-neutral-200 flex-1"></div>
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
        Google
      </button>
    </div>
  </div>
</div>
