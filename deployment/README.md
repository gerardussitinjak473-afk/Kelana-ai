# Deployment KelanaAI

Runbook ini menargetkan stack pada prompt pengguna: Neon, Render, dan Vercel. Konfigurasi lokal yang diperiksa belum berisi domain produksi. Jangan memakai URL contoh sebagai URL live.

## 1. Neon

1. Masuk dashboard Neon, buat project KelanaAI atau pilih project milik Anda yang sudah ada. Pilih region yang dekat dengan backend.
2. Pilih branch dan database tujuan. Buka Connect, pilih role aplikasi dan salin connection string PostgreSQL yang berisi pengaturan SSL dari dashboard.
3. Masukkan nilainya sebagai DATABASE_URL ke dashboard Render. Untuk menjalankan migrasi dari lokal, set environment proses secara privat. Jangan menempelkan string ke kode atau chat.
4. Backup database lama. Jalankan `python database/migrate.py` dari root memakai environment target dan dependency backend.
5. Script memanggil backend/database.py: create_all membuat users, trips, conversations, messages. Upgrade kompatibilitas menambah travel_style, user_id, memindahkan trip tanpa pemilik ke akun legacy yang tidak bisa login, menambah foreign key dan indeks.
6. Verifikasi dari SQL editor: `SELECT id, destination, user_id FROM trips ORDER BY id DESC LIMIT 5;` setelah membuat perjalanan lewat aplikasi.

## 2. Render

1. Pilih New Web Service dan hubungkan repository GitHub KelanaAI yang benar. Pilih branch rilis yang sudah direview.
2. Set runtime Python dan Root Directory `backend`. Build command `pip install -r requirements.txt`. Start command `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Set DATABASE_URL, FRONTEND_URL, JWT_SECRET_KEY, AWS_REGION, BEDROCK_MODEL_ID, KNOWLEDGE_BASE_ID. JWT secret harus acak minimal 32 karakter. Untuk AWS, pilih IAM role/key sesuai lingkungan. Jika memakai temporary credentials isi AWS_SESSION_TOKEN juga. API key AWS_BEARER_TOKEN_BEDROCK yang ditemukan lokal bukan bukti izin retrieval Knowledge Base atau S3.
4. Set JWT_ALGORITHM=HS256 dan ACCESS_TOKEN_EXPIRE_MINUTES=60, atau hapus variabel opsional ini untuk memakai default. Jangan set angka kosong.
5. FRONTEND_URL harus origin frontend sebenarnya tanpa path/trailing slash. Beberapa origin dapat dipisah koma, bukan wildcard.
6. Set health path `/health`. Deploy. Catat URL dari dashboard, cek URL/health dan URL/docs. /health hanya liveness; bukti database dan AI membutuhkan uji alur.
7. Alternatif Blueprint memakai deployment/render.yaml. Pilih lokasi Blueprint tersebut, dan isi semua env pada dashboard. Konfigurasi ini tidak otomatis membuat akun/provider.

## 3. Vercel

1. Add New Project, import repository yang sama, set Root Directory `frontend`, framework Next.js.
2. Set NEXT_PUBLIC_API_URL ke origin Render yang benar DITAMBAH `/api/v1`. Semua service frontend memakai base ini.
3. Set NEXT_PUBLIC_SITE_URL ke origin frontend publik untuk metadata social preview. Setelah perubahan NEXT_PUBLIC_, redeploy karena nilainya masuk bundle saat build.
4. Deploy, buka URL dari dashboard. Periksa Git settings dan production branch untuk memastikan auto-deploy push main aktif. Ini belum dapat dikonfirmasi tanpa dashboard.
5. Kembali ke Render, set FRONTEND_URL ke origin Vercel yang tepat lalu redeploy backend. Uji login dari Vercel dan cek CORS di console.

## 4. Knowledge Base

Di backend environment untuk script ingestion, isi KNOWLEDGE_BASE_S3_URI dan KNOWLEDGE_BASE_DATA_SOURCE_ID bersama KNOWLEDGE_BASE_ID. Dengan IAM yang sesuai, jalankan `python scripts/sync_knowledge_base.py` dari root. Script mengunggah travel-guides ke S3 dan memulai ingestion. Pastikan data ini sesuai kebutuhan nyata: beberapa panduan adalah contoh latihan, bukan informasi perjalanan terkini.

## 5. Finalisasi

Isi VERIFICATION.md dengan bukti setiap langkah dan tanggal. Bila seluruh tes publik lulus, selesaikan merge repository dengan meninjau `git status`, stage hanya file yang diinginkan, commit `Deploy KelanaAI to production and complete demo-day polish`, lalu tag v1.0-bootcamp. Jangan menjalankan git add . tanpa memeriksa file lokal.

Sumber resmi yang diperiksa 9 September 2026: [Render FastAPI](https://render.com/docs/deploy-fastapi), [Neon Python](https://neon.com/docs/guides/python), [Vercel environment variables](https://vercel.com/docs/environment-variables).
