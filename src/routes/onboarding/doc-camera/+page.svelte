<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import DocCamera from '$lib/screens/DocCamera.svelte';

  function handleNext(dataUrl: string) {
    appState.docPhoto = dataUrl;
    goto('/onboarding/selfie-camera');
  }

  function handleCancel() {
    goto('/onboarding/document');
  }
</script>

<svelte:head>
  <title>Ambil Foto Dokumen - Onboarding</title>
</svelte:head>

<DocCamera onCancel={handleCancel} onNext={handleNext} />
