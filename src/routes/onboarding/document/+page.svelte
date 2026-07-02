<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import DocType from '$lib/screens/DocType.svelte';

  function handleNext() {
    goto('/onboarding/doc-camera');
  }

  function handleBack() {
    goto('/onboarding/role');
  }
</script>

<svelte:head>
  <title>Pilih Tipe Dokumen - Onboarding</title>
</svelte:head>

<DocType onBack={handleBack} onNext={handleNext} />
