<script lang="ts">
  import { ArrowLeft, CheckCircle2, ShieldClose, Upload, X } from '@lucide/svelte';

  let {
    onBack,
    onSubmit,
    currentUser,
  } = $props<{
    onBack: () => void;
    onSubmit: (reason: string, details: string) => void;
    currentUser: 'client' | 'worker';
  }>();

  let step = $state(1);
  let reason = $state('');
  let details = $state('');
  let submitting = $state(false);
  let photos = $state<string[]>([]);

  const clientReasons = [
    "Pekerja tidak datang ke lokasi",
    "Hasil pekerjaan tidak sesuai deskripsi",
    "Pekerjaan dibatalkan sepihak",
    "Perilaku pekerja tidak ramah/profesional",
    "Masalah penagihan atau tarif",
    "Lainnya"
  ];

  const workerReasons = [
    "Pemberi kerja membatalkan sepihak saat sudah di jalan",
    "Lokasi pekerjaan tidak sesuai/palsu",
    "Pemberi kerja menolak membayar harga yang disetujui",
    "Deskripsi pekerjaan sangat tidak sesuai kenyataan",
    "Perlakuan tidak aman/tidak sopan di lokasi",
    "Lainnya"
  ];

  const reasons = $derived(currentUser === 'client' ? clientReasons : workerReasons);

  const handleNextStep = () => {
    if (step === 1 && reason) {
      step = 2;
    }
  };

  const handleFakeSubmit = () => {
    submitting = true;
    setTimeout(() => {
      submitting = false;
      step = 3;
    }, 1500);
  };
</script>

<div class="flex-1 flex flex-col bg-white h-full overflow-hidden font-sans">
  <header class="px-5 pt-6 pb-4 border-b border-neutral-100 flex items-center relative">
    {#if step < 3}
      <button onclick={onBack} class="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors absolute left-4 cursor-pointer">
        <ArrowLeft size={20} />
      </button>
    {/if}
    <h1 class="font-bold text-lg flex-1 text-center text-neutral-900">
      {step === 3 ? 'Laporan Terkirim' : 'Laporkan Masalah'}
    </h1>
  </header>

  <!-- Step 1: Tarik Masalah -->
  {#if step === 1}
    <div class="flex-1 flex flex-col p-5 overflow-y-auto">
      <h2 class="text-lg font-bold text-neutral-900 mb-2">Apa yang Terjadi?</h2>
      <p class="text-sm text-neutral-500 mb-6">Pilih salah satu alasan di bawah agar tim penengah kami bisa segera memeriksa permasalahan Anda.</p>

      <div class="flex flex-col gap-3 flex-1">
        {#each reasons as r, idx}
          <label
            class="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all {
              reason === r
                ? 'border-red-500 bg-red-50/30'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }"
          >
            <input
              type="radio"
              name="dispute-reason"
              checked={reason === r}
              onchange={() => reason = r}
              class="w-5 h-5 accent-red-500"
            />
            <span class="text-sm font-semibold text-neutral-900">{r}</span>
          </label>
        {/each}
      </div>

      <button
        onclick={handleNextStep}
        disabled={!reason}
        class="w-full h-[52px] rounded-xl font-bold mt-6 text-base transition-colors cursor-pointer {
          reason
            ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200'
            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
        }"
      >
        Lanjut &rarr;
      </button>
    </div>
  {:else if step === 2}
    <!-- Step 2: Detail Laporan -->
    <div class="flex-1 flex flex-col p-5 overflow-y-auto">
      <h2 class="text-lg font-bold text-neutral-900 mb-1">Ceritakan Lebih Detail</h2>
      <p class="text-sm text-neutral-500 mb-5">Berikan kronologi yang jelas untuk membantu keputusan tim kami secara adil.</p>

      <div class="space-y-5 flex-1">
        <div>
          <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">Pilihan Masalah</label>
          <div class="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-800 font-semibold">
            {reason}
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Tulis Kronologi</label>
          <textarea
            placeholder="Contoh: Saya sudah menunggu di lokasi selama 40 menit namun pekerja tidak kunjung datang dan nomor tidak bisa dihubungi..."
            bind:value={details}
            rows={4}
            class="w-full text-sm p-4 border border-neutral-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-neutral-400 text-neutral-900 leading-relaxed"
          ></textarea>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Lampirkan Bukti Foto (Opsional)</label>
          <div class="flex gap-3">
            <button
              onclick={() => {
                photos = [...photos, "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=120&auto=format&fit=crop&q=60"];
              }}
              class="w-20 h-20 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col justify-center items-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors cursor-pointer"
            >
              <Upload size={20} />
              <span class="text-[10px] mt-1">Upload</span>
            </button>
            {#each photos as photo, index}
              <div class="w-20 h-20 rounded-xl border border-neutral-200 relative overflow-hidden bg-neutral-50">
                <img src={photo} alt="Bukti" class="w-full h-full object-cover" />
                <button
                  onclick={() => photos = photos.filter((_, idx) => idx !== index)}
                  class="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black cursor-pointer"
                >
                  <X size={12} />
                </button>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <button
        onclick={() => {
          handleFakeSubmit();
          onSubmit(reason, details);
        }}
        disabled={submitting || !details.trim()}
        class="w-full h-[52px] rounded-xl font-bold mt-6 text-base transition-colors cursor-pointer {
          details.trim() && !submitting
            ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200'
            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
        }"
      >
        {submitting ? 'Sedang Mengirim...' : 'Kirim Laporan Resmi'}
      </button>
    </div>
  {:else if step === 3}
    <!-- Step 3: Success page -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div class="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 relative">
        <CheckCircle2 size={48} class="text-red-600" />
      </div>
      <h2 class="text-xl font-bold text-neutral-900 mb-1.5">Laporan Masalah Diterima</h2>
      <p class="text-neutral-600 text-sm mb-5 leading-relaxed max-w-[280px]">
        Laporan kamu telah tercatat di sistem kami dengan Kode Kasus:
      </p>
      <div class="px-5 py-2.5 bg-neutral-100 rounded-full font-mono text-xs font-bold text-neutral-800 mb-8 select-all">
        #KJT-2026-06037
      </div>
      <div class="bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-left text-xs text-neutral-500 mb-8 max-w-[320px]">
        <strong>Selanjutnya:</strong> Tim penengah Kerjantara.id akan meninjau kronologi ini dalam 1&times;24 jam dan menghubungi Anda atau memutus dana jaminan (escrow).
      </div>
      <button
        onclick={onBack}
        class="w-full h-[52px] bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm cursor-pointer"
      >
        Kembali ke Dashboard
      </button>
    </div>
  {/if}
</div>
