<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';

  onMount(() => {
    if (appState.user?.active_role === 'employer') {
      goto('/dashboard/employer', { replaceState: true });
    } else if (appState.user?.active_role === 'worker') {
      goto('/dashboard/worker', { replaceState: true });
    } else {
      goto('/onboarding/role');
    }
  });
</script>

<div class="flex-1 flex items-center justify-center bg-white">
  <div class="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
</div>
