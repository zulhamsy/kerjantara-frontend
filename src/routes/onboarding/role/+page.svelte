<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import SelectRole from '$lib/screens/SelectRole.svelte';

  function handleNext(role: 'jobseeker' | 'client') {
    appState.userRole = role;
    goto('/onboarding/document');
  }

  function handleBack() {
    goto('/auth/otp');
  }
</script>

<svelte:head>
  <title>Pilih Peran - Onboarding</title>
</svelte:head>

<SelectRole onBack={handleBack} onNext={handleNext} />
