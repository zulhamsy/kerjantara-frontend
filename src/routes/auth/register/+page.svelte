<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import Register from '$lib/screens/Register.svelte';

  function handleNext(name: string) {
    appState.userName = name;
    goto('/auth/otp');
  }

  function handleBack() {
    goto('/');
  }
</script>

<svelte:head>
  <title>Daftar - Kerjantara</title>
</svelte:head>

<Register onBack={handleBack} onNext={handleNext} />
