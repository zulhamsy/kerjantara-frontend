<script lang="ts">
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import Splash from '$lib/screens/Splash.svelte';
  import Landing from '$lib/screens/Landing.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { appState } from '$lib/appState.svelte';
  import { env } from '$env/dynamic/public';

  let showLanding = $state(false);

  onMount(() => {
    const googleClientId = env.PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn("PUBLIC_GOOGLE_CLIENT_ID belum dikonfigurasi di file .env. Google One Tap tidak akan dimuat.");
      return;
    }

    // Memuat SDK Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const anyWindow = window as any;
      if (anyWindow.google?.accounts?.id) {
        anyWindow.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleCredentialResponse,
          auto_select: false
        });
        anyWindow.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            console.log("One Tap not displayed:", notification.getNotDisplayedReason());
          }
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  });

  async function handleCredentialResponse(response: any) {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        alert("Gagal masuk dengan Google One Tap: " + error.message);
      } else {
        // Redirect setelah login sukses ke onboarding role
        goto('/onboarding/role');
      }
    } catch (err: any) {
      alert("Terjadi kesalahan sistem: " + (err.message || err));
    }
  }

  function handleSplashFinish() {
    showLanding = true;
  }

  function handleNext() {
    goto('/auth/register');
  }

  function handleSkip() {
    goto('/auth/otp');
  }

  async function handleGoogleSignIn() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding/role`
        }
      });
      if (error) {
        alert("Gagal masuk dengan Google: " + error.message);
      }
    } catch (err: any) {
      alert("Terjadi kesalahan sistem: " + (err.message || err));
    }
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
      <Landing 
        onNext={handleNext} 
        onSkipToOTP={handleSkip} 
        onGoogleSignIn={handleGoogleSignIn} 
        loggedInEmail={appState.userEmail}
      />
    </div>
  {/if}
</div>
