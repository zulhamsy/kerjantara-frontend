<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { appState } from '$lib/appState.svelte';
  import SelectRole from '$lib/screens/SelectRole.svelte';
  import { syncSupabaseWithBackend, activateRole } from '$lib/api/auth';
  import { AlertTriangle, RefreshCcw } from '@lucide/svelte';

  let loading = $state(false);
  let errorMessage = $state<string | null>(null);
  let retryCount = $state(0);
  let maxRetries = 3;
  let isBlockingError = $state(false);

  onMount(async () => {
    // Pastikan sync dengan backend jika belum (handle redirect dari OAuth)
    if (!appState.user) {
      try {
        await syncSupabaseWithBackend();
      } catch (err) {
        console.error("Failed to sync onboarding session:", err);
      }
    }

    // Redirect berdasarkan role dan verif_status
    // Hanya redirect ke dashboard jika sudah approved/pending.
    // JANGAN redirect ke /onboarding/document di sini agar button BACK bisa berfungsi.
    if (appState.user?.role && appState.user.role !== '') {
      if (appState.user.verif_status === 'approved' || appState.user.verif_status === 'pending') {
        goto('/dashboard', { replaceState: true });
      }
    }
  });

  async function handleNext(role: 'worker' | 'employer', skill_cat_ids?: number[]) {
    loading = true;
    errorMessage = null;
    appState.userRole = role;

    try {
      await performActivation(role, skill_cat_ids);
      // Jika sukses, lanjut ke dokumen
      goto('/onboarding/document');
    } catch (err) {
      // Logic retry ditangani di performActivation
    } finally {
      loading = false;
    }
  }

  async function performActivation(role: 'worker' | 'employer', skill_cat_ids?: number[]) {
    try {
      await activateRole(role, skill_cat_ids);
      return true;
    } catch (err) {
      if (retryCount < maxRetries) {
        retryCount++;
        errorMessage = `Gagal mengaktifkan peran. Mencoba kembali... (${retryCount}/${maxRetries})`;
        
        // Retry delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        return performActivation(role, skill_cat_ids);
      } else {
        isBlockingError = true;
        throw err;
      }
    }
  }

  function handleRetry() {
    isBlockingError = false;
    retryCount = 0;
    errorMessage = null;
    if (appState.userRole) {
      handleNext(appState.userRole);
    }
  }

  function handleCloseError() {
    errorMessage = null;
  }
</script>

<svelte:head>
  <title>Pilih Peran - Onboarding</title>
</svelte:head>

{#if isBlockingError}
  <div class="flex-1 flex flex-col items-center justify-center p-6 bg-white text-center">
    <div class="w-16 h-16 bg-red-50 text-danger rounded-full flex items-center justify-center mb-6">
      <AlertTriangle size={32} />
    </div>
    <h2 class="text-xl font-bold text-neutral-900 mb-2">Gagal Menghubungkan Akun</h2>
    <p class="text-sm text-neutral-500 mb-8 max-w-xs">
      Kami mengalami kendala teknis saat mendaftarkan peran Anda ke server. Silakan coba lagi atau muat ulang halaman.
    </p>
    
    <div class="w-full space-y-3">
      <button 
        onclick={handleRetry}
        class="w-full h-[52px] bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2"
      >
        <RefreshCcw size={18} />
        Coba Lagi
      </button>
      <button 
        onclick={() => window.location.reload()}
        class="w-full h-[52px] bg-white border border-neutral-200 text-neutral-600 rounded-xl font-bold"
      >
        Muat Ulang Halaman
      </button>
    </div>
  </div>
{:else}
  <SelectRole 
    onNext={handleNext} 
    loading={loading} 
    errorMessage={errorMessage}
    onCloseError={handleCloseError}
    initialRole={appState.user?.role as any}
    initialStep={appState.user?.role === 'worker' ? 'skills' : 'role'}
  />
{/if}
