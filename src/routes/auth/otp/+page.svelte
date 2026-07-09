<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { appState } from '$lib/appState.svelte';
  import VerifyOTP from '$lib/screens/VerifyOTP.svelte';
  import { supabase } from '$lib/supabaseClient';

  let loading = $state(false);

  onMount(() => {
    // Redirect back if userEmail is not set (e.g., on page refresh)
    if (!appState.userEmail) {
      alert("Sesi tidak ditemukan. Harap masukkan email Anda terlebih dahulu.");
      const flow = $page.url.searchParams.get('flow');
      if (flow === 'login') {
        goto('/auth/login');
      } else {
        goto('/auth/register');
      }
    }
  });

  async function handleVerify(code: string): Promise<{ success: boolean, message?: string }> {
    if (loading) return { success: false };
    loading = true;

    try {
      const flow = $page.url.searchParams.get('flow');
      const otpType = flow === 'register' ? 'signup' : 'email';

      const { data, error } = await supabase.auth.verifyOtp({
        email: appState.userEmail,
        token: code,
        type: otpType
      });

      if (error) {
        return { success: false, message: error.message };
      }

      appState.otpVerified = true;
      if (data.user) {
        appState.userName = data.user.user_metadata?.full_name || appState.userName;
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Terjadi kesalahan verifikasi" };
    } finally {
      loading = false;
    }
  }

  async function handleResend(): Promise<{ success: boolean, message?: string }> {
    try {
      const flow = $page.url.searchParams.get('flow');
      let error;

      if (flow === 'register') {
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: appState.userEmail,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/role`
          }
        });
        error = resendError;
      } else {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: appState.userEmail,
          options: {
            shouldCreateUser: false
          }
        });
        error = otpError;
      }

      if (error) {
        return { success: false, message: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || "Gagal mengirim ulang OTP" };
    }
  }

  function handleNext() {
    const flow = $page.url.searchParams.get('flow');
    if (flow === 'login') {
      goto('/dashboard');
    } else {
      goto('/onboarding/role');
    }
  }

  function handleBack() {
    const flow = $page.url.searchParams.get('flow');
    if (flow === 'login') {
      goto('/auth/login');
    } else {
      goto('/auth/register');
    }
  }
</script>

<svelte:head>
  <title>Verifikasi OTP - Kerjantara</title>
</svelte:head>

<div class="relative w-full h-full flex flex-col">
  <VerifyOTP 
    onBack={handleBack} 
    onNext={handleNext} 
    email={appState.userEmail}
    onVerify={handleVerify}
    onResend={handleResend}
  />

  {#if loading}
    <div class="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-50">
      <div class="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-xs font-semibold text-neutral-600 mt-3">Memverifikasi OTP...</p>
    </div>
  {/if}
</div>
