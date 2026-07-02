<script lang="ts">
  import { fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Splash from '$lib/screens/Splash.svelte';
  import Landing from '$lib/screens/Landing.svelte';

  let showLanding = $state(false);

  function handleSplashFinish() {
    showLanding = true;
  }

  function handleNext() {
    goto('/auth/register');
  }

  function handleSkip() {
    goto('/auth/otp');
  }
</script>

<svelte:head>
  <title>Kerjantara - Selamat Datang</title>
</svelte:head>

<div class="relative w-full h-full flex flex-col">
  {#if !showLanding}
    <Splash onFinish={handleSplashFinish} />
  {:else}
    <div in:fly={{ y: 200, duration: 400 }} class="absolute inset-0 w-full h-full">
      <Landing onNext={handleNext} onSkipToOTP={handleSkip} />
    </div>
  {/if}
</div>
