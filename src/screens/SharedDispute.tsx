import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, ShieldClose, Upload, X } from 'lucide-react';

interface SharedDisputeProps {
  onBack: () => void;
  onSubmit: (reason: string, details: string) => void;
  currentUser: 'client' | 'worker';
}

export default function SharedDispute({
  onBack,
  onSubmit,
  currentUser,
}: SharedDisputeProps) {
  const [step, setStep] = useState(1);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

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

  const reasons = currentUser === 'client' ? clientReasons : workerReasons;

  const handleNextStep = () => {
    if (step === 1 && reason) {
      setStep(2);
    }
  };

  const handleFakeSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden font-sans">
      <header className="px-5 pt-6 pb-4 border-b border-neutral-100 flex items-center relative">
        {step < 3 && (
          <button onClick={onBack} className="p-2 -ml-2 text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors absolute left-4">
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="font-bold text-lg flex-1 text-center text-neutral-900">
          {step === 3 ? 'Laporan Terkirim' : 'Laporkan Masalah'}
        </h1>
      </header>

      {/* Step 1: Tarik Masalah */}
      {step === 1 && (
        <div className="flex-1 flex flex-col p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-neutral-900 mb-2">Apa yang Terjadi?</h2>
          <p className="text-sm text-neutral-500 mb-6">Pilih salah satu alasan di bawah agar tim penengah kami bisa segera memeriksa permasalahan Anda.</p>

          <div className="flex flex-col gap-3 flex-1">
            {reasons.map((r, idx) => (
              <label
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  reason === r
                    ? 'border-red-500 bg-red-50/30'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <input
                  type="radio"
                  name="dispute-reason"
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="w-5 h-5 accent-red-500"
                />
                <span className="text-sm font-semibold text-neutral-900">{r}</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleNextStep}
            disabled={!reason}
            className={`w-full h-[52px] rounded-xl font-bold mt-6 text-base transition-colors ${
              reason
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Lanjut &rarr;
          </button>
        </div>
      )}

      {/* Step 2: Detail Laporan */}
      {step === 2 && (
        <div className="flex-1 flex flex-col p-5 overflow-y-auto">
          <h2 className="text-lg font-bold text-neutral-900 mb-1">Ceritakan Lebih Detail</h2>
          <p className="text-sm text-neutral-500 mb-5">Berikan kronologi yang jelas untuk membantu keputusan tim kami secara adil.</p>

          <div className="space-y-5 flex-1">
            <div>
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider mb-2">Pilihan Masalah</label>
              <div className="px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-800 font-semibold">
                {reason}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Tulis Kronologi</label>
              <textarea
                placeholder="Contoh: Saya sudah menunggu di lokasi selama 40 menit namun pekerja tidak kunjung datang dan nomor tidak bisa dihubungi..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="w-full text-sm p-4 border border-neutral-300 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder:text-neutral-400 text-neutral-900 leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-600 uppercase tracking-wider">Lampirkan Bukti Foto (Opsional)</label>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setPhotos([...photos, "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=120&auto=format&fit=crop&q=60"]);
                  }}
                  className="w-20 h-20 border-2 border-dashed border-neutral-300 rounded-xl flex flex-col justify-center items-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-400 transition-colors"
                >
                  <Upload size={20} />
                  <span className="text-[10px] mt-1">Upload</span>
                </button>
                {photos.map((photo, index) => (
                  <div key={index} className="w-20 h-20 rounded-xl border border-neutral-200 relative overflow-hidden bg-neutral-50">
                    <img src={photo} alt="Bukti" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPhotos(photos.filter((_, idx) => idx !== index))}
                      className="absolute top-1 right-1 p-0.5 bg-black/60 rounded-full text-white hover:bg-black"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              handleFakeSubmit();
              onSubmit(reason, details);
            }}
            disabled={submitting || !details.trim()}
            className={`w-full h-[52px] rounded-xl font-bold mt-6 text-base transition-colors ${
              details.trim() && !submitting
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200'
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Sedang Mengirim...' : 'Kirim Laporan Resmi'}
          </button>
        </div>
      )}

      {/* Step 3: Success page */}
      {step === 3 && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-6 relative">
            <CheckCircle2 size={48} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 mb-1.5">Laporan Masalah Diterima</h2>
          <p className="text-neutral-600 text-sm mb-5 leading-relaxed max-w-[280px]">
            Laporan kamu telah tercatat di sistem kami dengan Kode Kasus:
          </p>
          <div className="px-5 py-2.5 bg-neutral-100 rounded-full font-mono text-xs font-bold text-neutral-800 mb-8 select-all">
            #KJT-2026-06037
          </div>
          <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-left text-xs text-neutral-500 mb-8 max-w-[320px]">
            <strong>Selanjutnya:</strong> Tim penengah Kerjantara.id akan meninjau kronologi ini dalam 1&times;24 jam dan menghubungi Anda atau memutus dana jaminan (escrow).
          </div>
          <button
            onClick={onBack}
            className="w-full h-[52px] bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-colors shadow-sm"
          >
            Kembali ke Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
