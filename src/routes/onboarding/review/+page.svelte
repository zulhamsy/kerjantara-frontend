<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import Review from '$lib/screens/Review.svelte';

  function handleNext() {
    appState.termsAgreed = true;
    goto('/dashboard');
  }

  function handleBack() {
    goto('/onboarding/selfie-camera');
  }
</script>

<svelte:head>
  <title>Review & Syarat Ketentuan - Onboarding</title>
</svelte:head>

<Review onBack={handleBack} onNext={handleNext} />
