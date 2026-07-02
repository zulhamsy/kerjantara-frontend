<script lang="ts">
  let {
    variant = 'full',
    class: className = '',
    iconSize = 24,
    textSize = 'text-sm'
  } = $props<{
    variant?: 'full' | 'icon' | 'white';
    class?: string;
    iconSize?: number;
    textSize?: string;
  }>();

  let isWhite = $derived(variant === 'white');
  let height = $derived((iconSize * 180) / 200);
</script>

{#snippet logoSvg()}
  <svg 
    width={iconSize} 
    height={height} 
    viewBox="0 0 200 180" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    class="shrink-0"
  >
    <defs>
      <!-- Premium linear gradients exactly matching the uploaded image -->
      <linearGradient id="kerjantara-main-grad" x1="20" y1="160" x2="180" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0B47A1" />
        <stop offset="50%" stop-color="#1976D2" />
        <stop offset="100%" stop-color="#29B6F6" />
      </linearGradient>
      <linearGradient id="kerjantara-back-grad" x1="30" y1="30" x2="60" y2="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#0A3E8A" />
        <stop offset="100%" stop-color="#042352" />
      </linearGradient>
    </defs>

    <!-- Network structure behind K - Top Nodes -->
    <!-- Node 1: Top-Left Circle -->
    <circle cx="34" cy="34" r="10" fill={isWhite ? "#ffffff" : "#29B6F6"} />
    <!-- Node 2: Top-Right Circle -->
    <circle cx="68" cy="34" r="10" fill={isWhite ? "#e0f7ff" : "#29B6F6"} />
    <!-- Solid linkage between node 1 and 2 -->
    <line x1="34" y1="34" x2="68" y2="34" stroke={isWhite ? "rgba(255,255,255,0.7)" : "#29B6F6"} stroke-width="6" stroke-linecap="round" />
    
    <!-- Stem of the network graph (vertical) -->
    <path d="M 30 38 L 30 110" stroke={isWhite ? "#ffffff" : "#0D47A1"} stroke-width="12" stroke-linecap="round" />
    <path d="M 30 38 L 60 74" stroke={isWhite ? "#ffffff" : "#0D47A1"} stroke-width="8" stroke-linecap="round" />

    <!-- Node 3: Bottom node linked from stem -->
    <circle cx="56" cy="154" r="12" fill={isWhite ? "#ffffff" : "#0D47A1"} />
    <line x1="56" y1="154" x2="56" y2="90" stroke={isWhite ? "rgba(255,255,255,0.8)" : "#0D47A1"} stroke-width="7" stroke-linecap="round" />

    <!-- Swooshing main body of K - Gradient color curve -->
    <path 
      d="M 34 160 C 24 135, 45 95, 80 70 C 110 50, 140 34, 172 34 C 150 56, 120 85, 90 114 C 64 140, 48 156, 34 160 Z" 
      fill={isWhite ? "#ffffff" : "url(#kerjantara-main-grad)"} 
    />
    
    <!-- Descending Wing of K -->
    <path 
      d="M 85 105 L 148 154 C 158 162, 171 162, 172 150 C 173 138, 160 120, 142 108 L 105 85 Z" 
      fill={isWhite ? "#ffffff" : "url(#kerjantara-main-grad)"} 
    />
  </svg>
{/snippet}

{#if variant === 'icon'}
  <div class="inline-flex items-center justify-center {className}">
    {@render logoSvg()}
  </div>
{:else}
  <div class="inline-flex items-center gap-1.5 font-sans {className}">
    {@render logoSvg()}
    <span class="font-black tracking-tight select-none {isWhite ? 'text-white' : 'text-[#00224f]'} {textSize}">
      Kerjantara<span class={isWhite ? "text-amber-300" : "text-[#1976D2]"}>.id</span>
    </span>
  </div>
{/if}
