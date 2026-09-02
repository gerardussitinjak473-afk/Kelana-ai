# Perbandingan KelanaAI — RAG vs Base Model

## Metode

Empat dokumen demo berisi kode produk dan ketentuan internal yang sengaja tidak tersedia dalam pengetahuan umum. Lima pertanyaan berikut telah diuji ke Amazon Nova Lite sebagai base model dengan temperature 0. Semua jawaban base model di bawah adalah hasil aktual. Kolom RAG berisi jawaban acuan yang harus dikonfirmasi oleh `scripts/compare_answers.py` setelah S3 data source selesai disinkronkan.

## 1. Harga, pickup, dan reservasi KSC-72

**Pertanyaan:** Berapa harga KSC-72 untuk anak, di mana lokasi pengambilannya, dan kapan cruise harus dipesan?

**Base model aktual:** Tidak tahu.

**Jawaban grounded yang diharapkan:** Harga anak usia 6–12 adalah KRW 54,000. Pass diambil di Hongik University Station Exit 3, pada konter KelanaAI berwarna oranye. Han River cruise harus dipesan minimal 24 jam sebelum keberangkatan.

**Sumber:** `south-korea-culture-pass.md`

## 2. Batas pemesanan dan waktu tunggu KFS-24

**Pertanyaan:** Untuk KFS-24, kapan batas pemesanan dan berapa menit waktu tunggu gratis setelah pesawat mendarat?

**Base model aktual:** Tidak tahu.

**Jawaban grounded yang diharapkan:** Batas pemesanan adalah pukul 18:00 waktu Singapura pada hari kalender sebelum kedatangan. Waktu tunggu gratis adalah 75 menit setelah waktu pendaratan aktual.

**Sumber:** `singapore-family-transfer.md`

## 3. Manfaat keterlambatan dan dokumen klaim NS-2026

**Pertanyaan:** Berapa manfaat keterlambatan perjalanan NS-2026 dan dokumen apa yang wajib disertakan saat klaim?

**Base model aktual:** Tidak tahu.

**Jawaban grounded yang diharapkan:** Setelah keterlambatan 6 jam berturut-turut, makanan dan transportasi lokal yang memenuhi syarat diganti hingga USD 180 per tertanggung. Klaim wajib memuat konfirmasi pemesanan, laporan keterlambatan/kehilangan dari maskapai, kuitansi asli, dan formulir klaim.

**Sumber:** `nusantara-shield-insurance.md`

## 4. Isi Yellow Packet

**Pertanyaan:** Apa saja empat dokumen Yellow Packet dan apa nama file PDF yang harus diunggah?

**Base model aktual:** Tidak tahu.

**Jawaban grounded yang diharapkan:** Yellow Packet berisi salinan resep dengan nama generik obat, surat dokter bertanda tangan, salinan halaman identitas paspor, dan formulir inventaris JP-MED-4. Keempatnya diunggah sebagai `JP-MED-4-lastname.pdf`.

**Sumber:** `japan-medication-checklist.md`

## 5. Batas per barang NS-2026

**Pertanyaan:** Apakah kehilangan satu barang senilai USD 400 diganti penuh oleh NS-2026? Jelaskan batas yang berlaku.

**Base model aktual:** Tidak tahu. Saya tidak memiliki informasi mengenai kebijakan NS-2026 terkait batas ganti rugi untuk kehilangan barang senilai USD 400.

**Jawaban grounded yang diharapkan:** Tidak. Walaupun batas total kehilangan bagasi USD 600, batas per barang adalah USD 150, sehingga satu barang senilai USD 400 maksimal diganti USD 150 jika klaim memenuhi syarat.

**Sumber:** `nusantara-shield-insurance.md`

## Kesimpulan sementara

Base model secara tepat mengakui tidak memiliki fakta internal. Setelah Knowledge Base disinkronkan, RAG diharapkan meningkatkan jawaban dengan mengambil angka, tenggat, kode, dan nama dokumen yang spesifik. Jalankan skrip perbandingan untuk mengganti jawaban acuan ini dengan keluaran RAG aktual sebelum pengumpulan akhir.
