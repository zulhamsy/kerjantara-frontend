<script lang="ts">
  import { ArrowLeft, User, Building2, Check } from '@lucide/svelte';

  let { onBack, onNext } = $props<{ onBack: () => void, onNext: (role: 'jobseeker' | 'client') => void }>();

  let role = $state<'jobseeker' | 'client' | null>(null);
  let activeSubStep = $state<'role' | 'skills'>('role');
  let selectedSkills = $state<string[]>([]);

  const categories = [
    { name: "Tukang Cat", icon: "🎨" },
    { name: "Tukang Ledeng", icon: "🔧" },
    { name: "Teknisi Listrik", icon: "⚡" },
    { name: "Tukang Kayu", icon: "🪵" },
    { name: "Bersih-bersih", icon: "🧹" },
    { name: "Taman & Kebun", icon: "🌿" },
    { name: "Lainnya", icon: "⚙️" }
  ];

  const handleBack = () => {
    if (activeSubStep === 'skills') {
      activeSubStep = 'role';
    } else {
      onBack();
    }
  };

  const handleNext = () => {
    if (role === 'client') {
      onNext('client');
    } else if (role === 'jobseeker') {
      if (activeSubStep === 'role') {
        activeSubStep = 'skills';
      } else {
        // Save to localStorage for demo persistence if needed
        localStorage.setItem('selectedWorkerSkills', JSON.stringify(selectedSkills));
        onNext('jobseeker');
      }
    }
  };

  let isNextDisabled = $derived(
    !role || 
    (role === 'jobseeker' && activeSubStep === 'skills' && selectedSkills.length === 0)
  );
</script>

<div class="flex-1 flex flex-col bg-white overflow-hidden">
  <!-- Header -->
  <header class="px-5 pt-6 pb-4 flex flex-col gap-4">
    <div class="flex items-center relative">
      <button onclick={handleBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer">
        <ArrowLeft size={24} />
      </button>
      <h1 class="font-bold text-lg flex-1 text-center pr-8 text-neutral-900">
        {activeSubStep === 'role' ? 'Kamu siapa?' : 'Keahlianmu'}
      </h1>
    </div>
    
    <!-- Progress Stepper -->
    <div class="flex flex-col gap-1.5">
      <div class="flex gap-2">
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 bg-primary rounded-full"></div>
        <div class="h-1 flex-1 rounded-full transition-all duration-300 {activeSubStep === 'skills' ? 'bg-primary' : 'bg-primary w-1/2'}"></div>
        <div class="h-1 flex-1 bg-neutral-200 rounded-full"></div>
      </div>
    </div>
  </header>

  <!-- Content -->
  <div class="flex-1 px-5 flex flex-col items-center pt-4 overflow-y-auto">
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
          onclick={() => role = 'jobseeker'}
          class="relative p-5 rounded-[16px] border-2 cursor-pointer transition-all {
            role === 'jobseeker' 
              ? 'border-primary bg-primary-light' 
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }"
        >
          {#if role === 'jobseeker'}
            <div class="absolute top-4 right-4 text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
            </div>
          {/if}
          <div class="absolute top-0 right-4 -translate-y-1/2 bg-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Paling Banyak
          </div>
          
          <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4 {role === 'jobseeker' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}">
            <User size={24} />
          </div>
          <h3 class="font-bold text-lg text-neutral-900 mb-1">Pencari Kerja</h3>
          <p class="text-sm text-neutral-600 leading-relaxed pr-6">
            Saya ingin melamar kerja, freelance, atau mengerjakan proyek
          </p>
        </div>

        <!-- Card B: Klien -->
        <div 
          onclick={() => role = 'client'}
          class="relative p-5 rounded-[16px] border-2 cursor-pointer transition-all {
            role === 'client' 
              ? 'border-primary bg-primary-light' 
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }"
        >
          {#if role === 'client'}
            <div class="absolute top-4 right-4 text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
              </svg>
            </div>
          {/if}
          <div class="w-12 h-12 rounded-full flex items-center justify-center mb-4 {role === 'client' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600'}">
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
        Pilih satu atau beberapa kategori pekerjaan yang sesuai dengan keahlian yang kamu kuasai.
      </p>

      <!-- Categories Grid Selection -->
      <div class="w-full grid grid-cols-2 gap-3 max-w-sm mx-auto pb-4">
        {#each categories as cat}
          {@const isSelected = selectedSkills.includes(cat.name)}
          {@const isLainnya = cat.name === 'Lainnya'}
          <div
            onclick={() => {
              if (isSelected) {
                selectedSkills = selectedSkills.filter(s => s !== cat.name);
              } else {
                selectedSkills = [...selectedSkills, cat.name];
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
            <div class={isLainnya ? 'text-lg' : 'text-2xl mb-1.5'}>{cat.icon}</div>
            <span class="font-extrabold text-xs text-neutral-800">{cat.name}</span>
          </div>
        {/each}
      </div>
    {/if}

    <!-- Action Button -->
    <div class="mt-auto mb-8 w-full pt-6 bg-white z-10">
      <button 
        onclick={handleNext}
        disabled={isNextDisabled}
        class="w-full h-[52px] rounded-[12px] font-semibold text-base transition-all cursor-pointer {
          !isNextDisabled 
            ? 'bg-primary text-white shadow-[0_2px_12px_rgba(26,79,191,0.2)] hover:bg-blue-800' 
            : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
        }"
      >
        {activeSubStep === 'skills' ? 'Selesai & Lanjut' : 'Lanjut'} &rarr;
      </button>
    </div>
  </div>
</div>
