<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import Dashboard from '$lib/screens/Dashboard.svelte';
  import { supabase } from '$lib/supabaseClient';

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Gagal Keluar: " + error.message);
    } else {
      appState.reset();
      goto('/');
    }
  }
</script>

<svelte:head>
  <title>Dashboard - Kerjantara</title>
</svelte:head>

<Dashboard
  initialRole={appState.userRole}
  userName={appState.userName}
  userEmail={appState.userEmail}
  onLogout={handleLogout}
/>
