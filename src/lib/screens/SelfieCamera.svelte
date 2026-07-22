<script lang="ts">
  import { ArrowLeft, Check, Loader2, AlertCircle } from '@lucide/svelte';
  import { fly, fade } from 'svelte/transition';
  import { onMount, onDestroy } from 'svelte';
  import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

  const INSTRUCTIONS = [
    "Posisikan wajahmu dalam bingkai oval",
    "Berkedip pelan sekali",
    "Sempurna! Mengambil foto..."
  ];

  let { onCancel, onNext } = $props<{ onCancel: () => void, onNext: (dataUrl: string) => void }>();

  let videoElement = $state<HTMLVideoElement | null>(null);
  let canvasElement = $state<HTMLCanvasElement | null>(null);
  let stream = $state<MediaStream | null>(null);

  let step = $state(0);
  let status = $state<'initializing' | 'detecting' | 'detected' | 'blinked' | 'success'>('initializing');
  let isStarting = $state(true);
  
  let faceLandmarker: FaceLandmarker | null = null;
  let animationId: number | null = null;
  let lastVideoTime = -1;
  let blinkDetected = false;

  async function initAI() {
    try {
      const vision = await FilesetResolver.forVisionTasks("/models/face");
      faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `/models/face/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      });
      status = 'detecting';
    } catch (err) {
      console.error("AI Init error:", err);
      alert("Gagal memuat sistem verifikasi AI.");
      onCancel();
    }
  }

  async function startCamera() {
    try {
      isStarting = true;
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 1280 }
        } 
      });
      if (videoElement) {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = () => {
          videoElement?.play();
          startDetectionLoop();
        };
      }
      isStarting = false;
    } catch (err) {
      console.error("Selfie camera error:", err);
      alert("Gagal mengakses kamera depan.");
      onCancel();
    }
  }

  function startDetectionLoop() {
    if (!faceLandmarker || !videoElement) return;

    const processFrame = () => {
      if (!videoElement || !faceLandmarker) return;

      let startTimeMs = performance.now();
      if (videoElement.currentTime !== lastVideoTime) {
        lastVideoTime = videoElement.currentTime;
        const results = faceLandmarker.detectForVideo(videoElement, startTimeMs);

        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          // Face detected
          if (step === 0) {
             status = 'detected';
             // Check if face is centered (lenient)
             const landmarks = results.faceLandmarks[0];
             const noseTip = landmarks[1]; // approximate nose tip
             if (noseTip.x > 0.3 && noseTip.x < 0.7 && noseTip.y > 0.3 && noseTip.y < 0.7) {
                step = 1;
             }
          } else if (step === 1) {
             // Check for blink using blendshapes
             if (results.faceBlendshapes && results.faceBlendshapes.length > 0) {
                const blendshapes = results.faceBlendshapes[0].categories;
                const eyeBlinkLeft = blendshapes.find(c => c.categoryName === 'eyeBlinkLeft')?.score || 0;
                const eyeBlinkRight = blendshapes.find(c => c.categoryName === 'eyeBlinkRight')?.score || 0;

                // Lenient threshold: 0.4 instead of 0.6
                if (eyeBlinkLeft > 0.4 && eyeBlinkRight > 0.4) {
                   blinkDetected = true;
                   status = 'blinked';
                   step = 2;
                   setTimeout(() => {
                      status = 'success';
                      captureAndFinish();
                   }, 800);
                }
             }
          }
        } else {
          if (status !== 'success') {
            status = 'detecting';
            if (step < 2) step = 0;
          }
        }
      }

      if (status !== 'success') {
        animationId = requestAnimationFrame(processFrame);
      }
    };

    animationId = requestAnimationFrame(processFrame);
  }

  function captureAndFinish() {
    if (videoElement && canvasElement) {
      const context = canvasElement.getContext('2d');
      if (context) {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const dataUrl = canvasElement.toDataURL('image/jpeg', 0.8);
        setTimeout(() => onNext(dataUrl), 1000);
      }
    }
  }

  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }

  onMount(async () => {
    await initAI();
    await startCamera();
  });

  onDestroy(() => {
    stopCamera();
  });
</script>

<div class="flex-1 bg-black flex flex-col relative overflow-hidden h-full">
  <video
    bind:this={videoElement}
    autoplay
    playsinline
    muted
    class="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-110"
  ></video>

  <canvas bind:this={canvasElement} class="hidden"></canvas>

  <!-- Header -->
  <header class="absolute top-0 left-0 right-0 z-20 px-5 pt-8 pb-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
    <button onclick={onCancel} class="text-white flex items-center gap-1 font-medium hover:text-neutral-200 cursor-pointer">
      <ArrowLeft size={20} /> Kembali
    </button>
    <h1 class="font-semibold text-white">Verifikasi Wajah</h1>
    <div class="w-[70px]"></div>
  </header>

  <!-- Main Overlay -->
  <div class="flex-1 relative z-10 flex flex-col bg-black/40">
    <!-- Top Text Area -->
    <div class="pt-24 px-6 flex flex-col items-center">
        <h2 class="text-xl font-bold text-white text-center drop-shadow-lg">
          {status === 'success' ? 'Verifikasi Berhasil!' : 'Verifikasi Wajahmu'}
        </h2>
        {#if isStarting || status === 'initializing'}
           <div class="flex items-center gap-2 mt-2 bg-black/40 px-3 py-1 rounded-full text-xs text-white/80">
              <Loader2 class="animate-spin" size={14} />
              <span>{status === 'initializing' ? 'Menyiapkan AI...' : 'Menyiapkan Kamera...'}</span>
           </div>
        {/if}
    </div>

    <!-- Center Oval & Instructions -->
    <div class="flex-1 flex flex-col items-center justify-center -mt-10">
      
      <!-- Active Instruction Tooltip -->
      {#if status !== 'success' && !isStarting && status !== 'initializing'}
        {#key step}
          <div 
            in:fly={{ y: 10, duration: 200 }}
            out:fly={{ y: -10, duration: 200 }}
            class="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold mb-8 text-center shadow-xl animate-pulse"
          >
            {INSTRUCTIONS[step]}
          </div>
        {/key}
      {/if}

      <!-- Oval Guide -->
      <div class="relative">
         <div class="w-[260px] h-[340px] rounded-[130px] border-[4px] border-dashed border-white/60 overflow-hidden relative">
           {#if status === 'success'}
             <div 
               transition:fade={{ duration: 200 }}
               class="absolute inset-0 bg-success/60 flex items-center justify-center backdrop-blur-sm"
             >
                <div in:fly={{ y: 20, duration: 300 }}>
                  <Check size={100} class="text-white" strokeWidth={4} />
                </div>
             </div>
           {/if}
         </div>
         
         <!-- Dynamic Border based on status -->
         <div class="absolute -inset-1 rounded-[130px] border-[6px] opacity-80 transition-colors duration-300 {
           status === 'detected' || status === 'blinked' ? 'border-success shadow-[0_0_20px_rgba(34,197,94,0.5)]' :
           'border-transparent'
         }"></div>
      </div>
      
      <!-- Status Text Indicator -->
      <div class="h-6 mt-8">
        {#if status === 'detecting' && !isStarting && status !== 'initializing'}
          <span class="text-white bg-black/40 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Mencari Wajah...</span>
        {:else if status === 'detected' || status === 'blinked'}
          <span class="text-success font-black text-xs uppercase tracking-widest bg-white/10 px-4 py-1 rounded-full backdrop-blur-md">
            {status === 'blinked' ? 'Kedipan Terdeteksi ✓' : 'Wajah Terdeteksi ✓'}
          </span>
        {/if}
      </div>
    </div>

    <!-- Bottom Area: Progress & Cancel -->
    <div class="pb-12 px-8 flex flex-col items-center">
      <!-- Progress Bar (Liveness steps) -->
      <div class="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-6">
        <div 
          class="h-full bg-primary transition-all duration-700 shadow-[0_0_10px_rgba(24,144,255,0.8)]" 
          style="width: {((step + 1) / 3) * 100}%"
        ></div>
      </div>

      <button onclick={onCancel} class="text-white/60 font-bold text-xs uppercase tracking-widest py-3 px-6 hover:text-white transition-colors cursor-pointer">
        Batalkan Verifikasi
      </button>
    </div>
  </div>
</div>
