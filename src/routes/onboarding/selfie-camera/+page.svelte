<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import SelfieCamera from '$lib/screens/SelfieCamera.svelte';

  function handleNext(dataUrl: string) {
    appState.selfiePhoto = dataUrl;
    goto('/onboarding/review');
  }

  function handleCancel() {
    goto('/onboarding/doc-camera');
  }
</script>

<svelte:head>
  <title>Ambil Foto Selfie - Onboarding</title>
</svelte:head>

<SelfieCamera onCancel={handleCancel} onNext={handleNext} />
