<script lang="ts">
  import './layout.css';
  let { children } = $props();
</script>

<div class="flex items-center justify-center min-h-screen font-sans text-neutral-900 bg-gray-100 sm:p-4">
  <!-- Centered mobile container without black border bezel -->
  <div class="relative w-full max-w-[430px] h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-neutral-100 sm:rounded-[40px] sm:shadow-2xl overflow-hidden flex flex-col">
    {@render children()}
  </div>
</div>
