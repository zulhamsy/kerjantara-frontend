<script lang="ts">
  import { appState } from '$lib/appState.svelte';
  import Dashboard from '$lib/screens/Dashboard.svelte';
</script>

<svelte:head>
  <title>Dashboard - Kerjantara</title>
</svelte:head>

<Dashboard
  initialRole={appState.userRole}
  userName={appState.userName}
  userEmail={appState.userEmail}
/>
