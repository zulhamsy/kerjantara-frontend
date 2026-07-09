<script lang="ts">
  import { goto } from '$app/navigation';
  import Login from '$lib/screens/Login.svelte';
  import { supabase } from '$lib/supabaseClient';
  import { appState } from '$lib/appState.svelte';

  let loading = $state(false);
  let errorMessage = $state<string | null>(null);

  // Fungsi untuk menampilkan pesan error di toast kustom bagian atas
  function showErrorMessage(msg: string) {
    errorMessage = msg;
    // Otomatis hilangkan pesan setelah 6 detik
    setTimeout(() => {
      if (errorMessage === msg) {
        errorMessage = null;
      }
    }, 6000);
  }

  function handleCloseError() {
    errorMessage = null;
  }

  async function handleLogin(data: { email: string; password: string }) {
    if (loading) return;
    loading = true;
    errorMessage = null;

    try {
      // Login secara resmi dengan email & password di Supabase Auth
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        // Terjemahkan error umum Supabase Auth ke Bahasa Indonesia agar lebih bersahabat
        const errMsg = error.message.toLowerCase();
        if (errMsg.includes('invalid login credentials') || errMsg.includes('invalid_grant')) {
          showErrorMessage("Gagal Masuk: Email atau kata sandi Anda salah.");
        } else if (errMsg.includes('email not confirmed')) {
          showErrorMessage("Gagal Masuk: Email belum dikonfirmasi. Harap verifikasi email Anda.");
        } else {
          showErrorMessage("Gagal Masuk: " + error.message);
        }
      } else {
        // Setelah masuk sukses, sinkronkan data profil pengguna ke appState
        if (authData.user) {
          appState.userName = authData.user.user_metadata?.full_name || authData.user.email?.split('@')[0] || 'User';
          appState.userEmail = authData.user.email || '';
          appState.otpVerified = true;
        }
        // Masuk langsung ke dashboard
        goto('/dashboard');
      }
    } catch (err: any) {
      showErrorMessage("Terjadi kesalahan sistem: " + (err.message || err));
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
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`
        }
      });
      if (error) {
        showErrorMessage("Gagal masuk dengan Google: " + error.message);
      }
    } catch (err: any) {
      showErrorMessage("Terjadi kesalahan sistem: " + (err.message || err));
    }
  }
</script>

<svelte:head>
  <title>Masuk - Kerjantara</title>
</svelte:head>

<!-- Overlay loading spinner if authentication is processing -->
<div class="relative w-full h-full flex flex-col">
  <Login 
    onBack={handleBack} 
    onLogin={handleLogin} 
    onGoogleSignIn={handleGoogleSignIn} 
    errorMessage={errorMessage}
    onCloseError={handleCloseError}
    loading={loading}
  />

  {#if loading}
    <div class="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center z-50">
      <div class="w-10 h-10 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-xs font-semibold text-neutral-600 mt-3">Memproses masuk...</p>
    </div>
  {/if}
</div>
