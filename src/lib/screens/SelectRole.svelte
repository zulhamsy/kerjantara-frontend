<script lang="ts">
  import { ArrowLeft, User, Building2, Check, Loader2, AlertCircle, X } from '@lucide/svelte';
  import { onMount } from 'svelte';
  import { api } from '../api/client';
  import type { SkillCategory } from '../api/types';

  let { 
    onBack, 
    onNext, 
    loading = false, 
    errorMessage = null, 
    onCloseError,
    initialRole = null,
    initialStep = 'role'
  } = $props<{ 
    onBack?: () => void, 
    onNext: (role: 'worker' | 'employer', skill_cat_ids?: number[]) => void,
    loading?: boolean,
    errorMessage?: string | null,
    onCloseError?: () => void,
    initialRole?: 'worker' | 'employer' | null,
    initialStep?: 'role' | 'skills'
  }>();

  let role = $state<'worker' | 'employer' | null>(initialRole);
  let activeSubStep = $state<'role' | 'skills'>(initialStep);
  let selectedSkills = $state<number[]>([]);
  let categories = $state<SkillCategory[]>([]);
  let isLoadingCategories = $state(false);

  const iconMap: Record<string, string> = {
    home: "🏠",
    sparkles: "✨",
    baby: "👶",
    heart: "❤️",
    paintbrush: "🎨",
    brick: "🧱",
    zap: "⚡",
    droplets: "💧",
    steering: "🚗",
    car: "🚘",
    package: "📦",
    camera: "📷",
    hammer: "🔨",
    ellipsis: "⚙️"
  };

  onMount(async () => {
    isLoadingCategories = true;
    try {
      const response = await api.get<{ categories: SkillCategory[] }>('/ref/skill-categories');
      // Flatten children for selection grid
      categories = response.categories.flatMap(parent => parent.children || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Fallback
      categories = [
        { id: 2, label: "ART Harian", code: "ART_HARIAN", icon_key: "home" },
        { id: 3, label: "Cleaning Service", code: "CLEANING_SERVICE", icon_key: "sparkles" },
        { id: 11, label: "Tukang Cat", code: "TUKANG_CAT", icon_key: "paintbrush" },
        { id: 14, label: "Tukang Ledeng", code: "TUKANG_LEDENG", icon_key: "droplets" },
        { id: 31, label: "Kurir Lokal", code: "KURIR_LOKAL", icon_key: "package" },
        { id: 7, label: "Lainnya", code: "OTHER", icon_key: "ellipsis" }
      ];
    } finally {
      isLoadingCategories = false;
    }
  });

  const handleBack = () => {
    if (activeSubStep === 'skills') {
      activeSubStep = 'role';
    } else {
      if (onBack) onBack();
    }
  };

  const handleNext = () => {
    if (!role || loading) return;

    if (role === 'worker' && activeSubStep === 'role') {
      activeSubStep = 'skills';
    } else {
      onNext(role, role === 'worker' ? selectedSkills : undefined);
    }
  };

  let isNextDisabled = $derived(
    !role || 
    loading || 
    (role === 'worker' && activeSubStep === 'skills' && selectedSkills.length === 0)
  );
</script>

<div class="flex-1 flex flex-col bg-white overflow-hidden relative">
  <!-- Toast Error -->
  {#if errorMessage}
    <div class="absolute top-4 right-4 z-50 animate-slide-down">
      <div class="bg-red-50 border border-red-100 rounded-xl p-3.5 shadow-lg flex items-center gap-3 min-w-[280px]">
        <div class="bg-danger rounded-full p-1 text-white shrink-0">
          <AlertCircle size={16} />
        </div>
        <div class="flex-1">
          <p class="text-xs font-bold text-danger leading-tight">{errorMessage}</p>
        </div>
        {#if onCloseError}
          <button onclick={onCloseError} class="text-neutral-400 hover:text-neutral-600 p-1">
            <X size={14} />
          </button>
        {/if}
      </div>
    </div>
  {/if}

  <!-- Header -->
  <header class="px-5 pt-6 pb-4 flex flex-col gap-4">
    <div class="flex items-center relative">
      {#if onBack || activeSubStep === 'skills'}
        <button onclick={handleBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
          <ArrowLeft size={24} />
        </button>
      {/if}
      <h1 class="font-bold text-lg flex-1 text-center {onBack || activeSubStep === 'skills' ? 'pr-8' : ''} text-neutral-900">
        {activeSubStep === 'role' ? 'Pilih Peran' : 'Pilih Keahlian'}
      </h1>
    </div>
    
    <!-- Progress Stepper -->
    <div class="flex flex-col gap-1.5">
      <div class="flex gap-2">
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 rounded-full transition-all duration-300 {activeSubStep === 'skills' ? 'bg-primary' : 'bg-neutral-200'}"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
      </div>
    </div>
  </header>

  <!-- Content -->
  <div class="flex-1 overflow-y-auto px-5">
    <div class="flex flex-col items-center pt-4 pb-6">
      {#if activeSubStep === 'role'}
        <h2 class="text-[24px] font-bold text-neutral-900 mb-2 text-center leading-[1.3]">
          Kamu Bergabung<br/>Sebagai Apa?
        </h2>
        <p class="text-neutral-600 text-center text-sm mb-8 leading-relaxed px-4">
          Pilih peranmu agar kami bisa menyesuaikan pengalamanmu di Kerjantara.id
        </p>

        <!-- Role Cards -->
        <div class="w-full flex flex-col gap-4">
          <!-- Card A: Pencari Kerja -->
          <div 
            onclick={() => !loading && (role = 'worker')}
            class="relative p-5 rounded-[16px] border-2 cursor-pointer transition-all {
              role === 'worker' 
                ? 'border-primary bg-primary-light' 
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            } {loading ? 'opacity-50 cursor-not-allowed' : ''}"
          >
            {#if role === 'worker'}
              <div class="absolute top-4 right-4 text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                </svg>
              </div>
            {/if}
            <div class="absolute top-0 right-4 -translate-y-1/2 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              Paling Banyak
            </div>
            
            <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4 {role === 'worker' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}">
              <User size={24} />
            </div>
            <h3 class="font-bold text-lg text-neutral-900 mb-1">Pencari Kerja</h3>
            <p class="text-sm text-neutral-600 leading-relaxed pr-6">
              Saya ingin melamar kerja, freelance, atau mengerjakan proyek
            </p>
          </div>

          <!-- Card B: Klien -->
          <div 
            onclick={() => !loading && (role = 'employer')}
            class="relative p-5 rounded-[16px] border-2 cursor-pointer transition-all {
              role === 'employer' 
                ? 'border-primary bg-primary-light' 
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            } {loading ? 'opacity-50 cursor-not-allowed' : ''}"
          >
            {#if role === 'employer'}
              <div class="absolute top-4 right-4 text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
                </svg>
              </div>
            {/if}
            <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4 {role === 'employer' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}">
              <Building2 size={24} />
            </div>
            <h3 class="font-bold text-lg text-neutral-900 mb-1">Klien / Perusahaan</h3>
            <p class="text-sm text-neutral-600 leading-relaxed pr-6">
              Saya ingin merekrut talenta atau membuka lowongan
            </p>
          </div>
        </div>

        <p class="text-neutral-400 text-xs text-center mt-6">
          Peran bisa ditambah atau diubah kapan saja dari Pengaturan.
        </p>
      {:else}
        <h2 class="text-[24px] font-bold text-neutral-900 mb-2 text-center leading-[1.3]">
          Apa Saja Keahlianmu?
        </h2>
        <p class="text-neutral-600 text-center text-sm mb-6 leading-relaxed px-4">
          Pilih kategori pekerjaan yang sesuai dengan keahlianmu.
        </p>

        <!-- Categories Grid Selection -->
        <div class="w-full grid grid-cols-2 gap-3 max-w-sm mx-auto pb-4 relative min-h-[200px]">
          {#if isLoadingCategories}
            <div class="absolute inset-0 flex items-center justify-center">
              <Loader2 class="animate-spin text-primary" size={32} />
            </div>
          {:else}
            {#each categories as cat}
              {@const isSelected = selectedSkills.includes(cat.id)}
              {@const isLainnya = cat.code === 'LAINNYA' || cat.label.toLowerCase() === 'lainnya'}
              <div
                onclick={() => {
                  if (isSelected) {
                    selectedSkills = selectedSkills.filter(s => s !== cat.id);
                  } else {
                    selectedSkills = [...selectedSkills, cat.id];
                  }
                }}
                class="p-4 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center justify-center relative select-none {
                  isLainnya ? 'col-span-2 py-3 flex-row gap-2' : ''
                } {
                  isSelected
                    ? 'border-primary bg-primary-light ring-1 ring-primary'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }"
              >
                {#if isSelected}
                  <div class="absolute top-2 right-2 text-primary">
                    <Check size={16} strokeWidth={3} />
                  </div>
                {/if}
                <div class={isLainnya ? 'text-lg' : 'text-2xl mb-1.5'}>{iconMap[cat.icon_key || ''] || '🛠️'}</div>
                <span class="font-extrabold text-[10px] text-neutral-800 leading-tight">{cat.label}</span>
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Action Button Footer -->
  <div class="px-5 pb-8 pt-4 bg-white border-t border-neutral-100 z-10">
    <button 
      onclick={handleNext}
      disabled={isNextDisabled}
      class="w-full h-[52px] rounded-[12px] font-semibold text-base transition-all cursor-pointer flex items-center justify-center gap-2 {
        !isNextDisabled 
          ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' 
          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
      }"
    >
      {#if loading}
        <Loader2 class="animate-spin" size={20} />
        Memproses...
      {:else}
        {activeSubStep === 'role' && role === 'worker' ? 'Pilih Keahlian' : 'Lanjut'} &rarr;
      {/if}
    </button>
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
