<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import VerifyOTP from '$lib/screens/VerifyOTP.svelte';

  function handleNext() {
    appState.otpVerified = true;
    goto('/onboarding/role');
  }

  function handleBack() {
    goto('/auth/register');
  }
</script>

<svelte:head>
  <title>Verifikasi OTP - Kerjantara</title>
</svelte:head>

<VerifyOTP onBack={handleBack} onNext={handleNext} />
