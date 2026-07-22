<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import Review from '$lib/screens/Review.svelte';
  import { uploadVerification, syncSupabaseWithBackend } from '$lib/api/auth';
  import { dataURLtoBlob } from '$lib/utils';

  let loading = $state(false);
  let errorMessage = $state<string | null>(null);

  onMount(async () => {
    if (!appState.user) {
      try {
        await syncSupabaseWithBackend();
      } catch (err) {
        console.error("Failed to sync user data in review page:", err);
      }
    }
  });

  async function handleNext() {
    if (!appState.docPhoto || !appState.selfiePhoto) {
      errorMessage = "Harap ambil foto KTP dan Selfie terlebih dahulu.";
      return;
    }

    loading = true;
    errorMessage = null;
    appState.termsAgreed = true;

    try {
      const ktpBlob = dataURLtoBlob(appState.docPhoto);
      const selfieBlob = dataURLtoBlob(appState.selfiePhoto);
      
      await uploadVerification(ktpBlob, selfieBlob);
      
      // Redirect ke dashboard
      goto('/dashboard', { replaceState: true });
    } catch (err: any) {
      console.error("Verification upload failed:", err);
      errorMessage = err.message || "Gagal mengirim dokumen. Silakan coba lagi.";
    } finally {
      loading = false;
    }
  }

  function handleBack() {
    goto('/onboarding/selfie-camera');
  }
</script>

<svelte:head>
  <title>Review & Syarat Ketentuan - Onboarding</title>
</svelte:head>

<Review 
  onBack={handleBack} 
  onNext={handleNext} 
  loading={loading}
  errorMessage={errorMessage}
/>
