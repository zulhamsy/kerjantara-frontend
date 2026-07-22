<script lang="ts">
  import { X, Camera, Image as ImageIcon, Zap, CheckCircle2, Loader2 } from '@lucide/svelte';
  import { onMount, onDestroy } from 'svelte';

  let { onCancel, onNext } = $props<{ onCancel: () => void, onNext: (dataUrl: string) => void }>();

  let videoElement = $state<HTMLVideoElement | null>(null);
  let canvasElement = $state<HTMLCanvasElement | null>(null);
  let stream = $state<MediaStream | null>(null);
  
  let hasPhoto = $state(false);
  let capturedImage = $state<string | null>(null);
  let quality = $state<'analyzing' | 'good' | 'bad'>('analyzing');
  let isStarting = $state(true);

  async function startCamera() {
    try {
      isStarting = true;
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      if (videoElement) {
        videoElement.srcObject = stream;
      }
      isStarting = false;
      quality = 'good'; // Assume good for now once camera starts
    } catch (err) {
      console.error("Camera error:", err);
      alert("Gagal mengakses kamera. Pastikan izin kamera telah diberikan.");
      onCancel();
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }

  function takePhoto() {
    if (videoElement && canvasElement) {
      const context = canvasElement.getContext('2d');
      if (context) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        capturedImage = canvasElement.toDataURL('image/jpeg', 0.85);
        hasPhoto = true;
        stopCamera();
      }
    }
  }

  function retake() {
    hasPhoto = false;
    capturedImage = null;
    startCamera();
  }

  onMount(() => {
    startCamera();
  });

  onDestroy(() => {
    stopCamera();
  });
</script>

{#if hasPhoto && capturedImage}
  <div class="flex-1 bg-black flex flex-col relative overflow-hidden h-full">
    <!-- Header -->
    <header class="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between">
      <button onclick={retake} class="text-white flex items-center gap-1 font-medium hover:text-neutral-200 cursor-pointer">
        <X size={20} /> Batal
      </button>
      <h1 class="font-semibold text-white text-sm">Preview Foto</h1>
      <div class="w-[60px]"></div>
    </header>

    <div class="flex-1 flex items-center justify-center p-4 mt-12 mb-28">
       <img src={capturedImage} alt="Captured" class="max-w-full max-h-full rounded-xl object-contain border border-neutral-800" />
    </div>

    <!-- Bottom Actions -->
    <div class="absolute bottom-0 left-0 right-0 p-6 bg-black/80 backdrop-blur-md z-20 flex gap-4">
       <button 
         onclick={retake}
         class="flex-1 h-[52px] border border-white/30 text-white rounded-[12px] font-semibold text-base hover:bg-white/10 cursor-pointer"
       >
         Ambil Ulang
       </button>
       <button 
         onclick={() => onNext(capturedImage!)}
         class="flex-1 h-[52px] bg-primary text-white rounded-[12px] font-semibold text-base shadow-lg cursor-pointer"
       >
         Gunakan &rarr;
       </button>
    </div>
  </div>
{:else}
  <!-- Camera View -->
  <div class="flex-1 bg-black flex flex-col relative overflow-hidden h-full">
    <video
      bind:this={videoElement}
      autoplay
      playsinline
      class="absolute inset-0 w-full h-full object-cover"
    ></video>

    <canvas bind:this={canvasElement} class="hidden"></canvas>

    <!-- Header -->
    <header class="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent text-sm">
      <button onclick={onCancel} class="text-white flex items-center gap-1 font-medium hover:text-neutral-200 cursor-pointer">
        <X size={20} /> Batal
      </button>
      <h1 class="font-semibold text-white">Foto KTP / Dokumen</h1>
      <div class="w-10"></div>
    </header>

    <!-- Overlay with Cutout -->
    <div class="flex-1 relative z-10 flex flex-col">
      <div class="flex-1 bg-black/60 pt-24 px-6 flex flex-col items-center">
          {#if isStarting}
            <div class="flex items-center gap-2 bg-black/50 text-white text-xs px-4 py-2 rounded-full">
              <Loader2 class="animate-spin" size={14} />
              <span>Menyiapkan Kamera...</span>
            </div>
          {:else}
            <span class="bg-success text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full flex gap-1.5 items-center shadow-lg border border-white/20">
              <CheckCircle2 size={14}/> Kamera Aktif
            </span>
          {/if}
      </div>

      <!-- Viewfinder Frame Row -->
      <div class="flex items-stretch">
        <div class="w-8 bg-black/60 shrink-0"></div>
        <div class="flex-1 aspect-[16/10] relative">
           <div class="absolute inset-0 border-2 border-white/30 rounded-xl"></div>
           <div class="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
           <div class="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
           <div class="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
           <div class="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
           
           <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-40">
              <Camera size={32} class="text-white mb-2" />
              <span class="text-white text-[10px] font-bold uppercase tracking-widest">Posisikan KTP di sini</span>
           </div>
        </div>
        <div class="w-8 bg-black/60 shrink-0"></div>
      </div>

      <!-- Bottom Dark Cover & Controls -->
      <div class="flex-[1.5] bg-black/60 flex flex-col pb-8 relative">
          <div class="flex justify-center gap-4 mt-6 px-4">
            <span class="text-[10px] font-bold text-white/70 uppercase">Cahaya Cukup</span>
            <span class="text-[10px] text-white/30">&bull;</span>
            <span class="text-[10px] font-bold text-white/70 uppercase">Teks Jelas</span>
          </div>

          <!-- Camera Controls -->
          <div class="mt-auto px-8 flex justify-center items-center relative h-24">
            <button 
              onclick={takePhoto}
              disabled={isStarting}
              class="w-[76px] h-[72px] rounded-full border-[6px] border-white/30 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            >
               <div class="w-[52px] h-[52px] rounded-full bg-white shadow-xl"></div>
            </button>
          </div>
      </div>
    </div>
  </div>
{/if}
