<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import { jobService } from '$lib/services/jobService.svelte';
  import { supabase } from '$lib/supabaseClient';

  let { children } = $props();

  onMount(async () => {
    if (!appState.user) {
      // Re-sync if state is lost
      const { syncSupabaseWithBackend } = await import('$lib/api/auth');
      try {
        await syncSupabaseWithBackend();
      } catch (e) {
        goto('/auth/login');
        return;
      }
    }

    if (!appState.user?.active_role) {
      goto('/onboarding/role');
      return;
    }

    jobService.init();
  });

  onDestroy(() => {
    jobService.destroy();
  });
</script>

<div class="h-full w-full flex flex-col overflow-hidden">
  {@render children()}
</div>
