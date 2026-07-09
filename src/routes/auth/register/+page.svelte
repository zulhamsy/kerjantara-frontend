<script lang="ts">
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import Register from '$lib/screens/Register.svelte';
  import { supabase } from '$lib/supabaseClient';

  let loading = $state(false);

  async function handleNext(data: { name: string, email: string, phone: string }) {
    if (loading) return;
    loading = true;

    appState.userName = data.name;
    appState.userEmail = data.email;

    // Bersihkan karakter non-digit dan format nomor ke standar internasional (+62) jika ada
    let formattedPhone = '';
    const rawPhone = data.phone.trim().replace(/[- \s()]/g, '');
    if (rawPhone) {
      if (rawPhone.startsWith('0')) {
        formattedPhone = '+62' + rawPhone.slice(1);
      } else if (rawPhone.startsWith('62')) {
        formattedPhone = '+' + rawPhone;
      } else if (!rawPhone.startsWith('+')) {
        formattedPhone = '+62' + rawPhone;
      } else {
        formattedPhone = rawPhone;
      }
    }

    try {
      // Trigger Passwordless Email OTP in Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: data.name,
            phone_number: formattedPhone || null
          }
        }
      });

      if (error) {
        alert("Eror registrasi Supabase: " + error.message);
      } else {
        goto('/auth/otp');
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
  <Register onBack={handleBack} onNext={handleNext} onGoogleSignIn={handleGoogleSignIn} />

  {#if loading}
    <div class="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-50">
      <div class="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-xs font-semibold text-neutral-600 mt-3">Mengirim Kode OTP...</p>
    </div>
  {/if}
</div>
