<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { appState } from '$lib/appState.svelte';
  import Register from '$lib/screens/Register.svelte';
  import { supabase } from '$lib/supabaseClient';

  let loading = $state(false);

  async function handleNext(data: { name: string; email: string; phone: string; password?: string }) {
    if (loading) return;
    loading = true;

    // Bersihkan karakter non-digit dan pastikan berformat +62
    const cleanPhone = data.phone.replace(/\D/g, '');
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith('0')) {
      formattedPhone = '+62' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('62') && !cleanPhone.startsWith('+62')) {
      formattedPhone = '+' + cleanPhone;
    } else if (!cleanPhone.startsWith('62') && !cleanPhone.startsWith('+62')) {
      formattedPhone = '+62' + cleanPhone;
    }

    appState.userEmail = data.email;
    appState.userName = data.name;

    try {
      // Sign up dengan Email & Password di Supabase
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password || 'password123',
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/role`,
          data: {
            full_name: data.name,
            phone_number: formattedPhone, // formatted dengan +62
          }
        }
      });

      if (error) {
        alert("Eror registrasi Supabase: " + error.message);
      } else {
        goto('/auth/otp?flow=register');
      }
    } catch (err: any) {
      alert("Terjadi kesalahan sistem: " + (err.message || err));
    } finally {
      loading = false;
    }
  }

  function handleBack() {
    goto('/');
  }

  function handleLogin() {
    goto('/auth/login');
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
  <title>Daftar - Kerjantara</title>
</svelte:head>

<!-- Overlay loading spinner if authentication is processing -->
<div class="relative w-full h-full flex flex-col">
  <Register onBack={handleBack} onNext={handleNext} onGoogleSignIn={handleGoogleSignIn} onLogin={handleLogin} initialEmail={$page.url.searchParams.get('email') || ''} />

  {#if loading}
    <div class="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-50">
      <div class="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-xs font-semibold text-neutral-600 mt-3">Mengirim Kode OTP...</p>
    </div>
  {/if}
</div>
