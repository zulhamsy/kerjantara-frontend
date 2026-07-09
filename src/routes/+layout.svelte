<script lang="ts">
  import { onMount } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import { appState } from '$lib/appState.svelte';
  import './layout.css';

  let { children } = $props();

  onMount(() => {
    // Listen to Supabase authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        appState.userName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
        appState.userEmail = session.user.email || '';
        appState.otpVerified = true;
      } else {
        appState.reset();
      }
      invalidateAll();
    });

    return () => subscription.unsubscribe();
  });
</script>

<div class="flex items-center justify-center min-h-screen font-sans text-neutral-900 bg-gray-100 sm:p-4">
  <!-- Centered mobile container without black border bezel -->
  <div class="relative w-full max-w-[430px] h-[100dvh] sm:h-[850px] sm:max-h-[90vh] bg-neutral-100 sm:rounded-[40px] sm:shadow-2xl overflow-hidden flex flex-col">
    {@render children()}
  </div>
</div>
