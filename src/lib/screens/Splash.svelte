<script lang="ts">
  import { onMount } from 'svelte';
  import KerjantaraLogo from '../components/KerjantaraLogo.svelte';

  let { onFinish } = $props<{ onFinish: () => void }>();

  onMount(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  });
</script>

<div class="flex-1 bg-primary flex flex-col items-center justify-center relative">
  <div class="flex flex-col items-center">
    <KerjantaraLogo variant="white" iconSize={64} textSize="text-3xl" />
    <p class="text-white/70 mt-4 text-xs tracking-wider uppercase font-semibold">Karirmu, Mulai di Sini.</p>
  </div>
  
  <!-- Loading bar -->
  <div class="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
    <div class="h-full bg-white rounded-full animate-progress"></div>
  </div>
</div>

<style>
  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  .animate-progress {
    animation: progress 2s ease-in-out forwards;
  }
</style>
