# KelanaAI

KelanaAI adalah aplikasi perencanaan perjalanan dengan itinerary Amazon Bedrock, dashboard pribadi, asisten pengetahuan dengan sumber RAG, dan chat yang menyimpan riwayat percakapan. Antarmuka memakai Next.js 14, React, dan Tailwind. Pembaruan September 2026 menambahkan desain perjalanan tropis, aset SVG dari starter pack, filter destinasi, draft form saat login, dan animasi pesawat antarlayar.

## Status

Versi lokal telah dikembangkan. URL produksi belum tersedia dalam konfigurasi yang diperiksa: database dan API masih memakai localhost. Jangan menyebut aplikasi sudah terdeploy sebelum checklist publik di deployment/VERIFICATION.md lulus. Lihat reports/IMPLEMENTATION.md untuk hasil pengujian.

## Arsitektur

Browser memanggil Next.js, lalu REST API FastAPI melalui NEXT_PUBLIC_API_URL. Backend memverifikasi JWT untuk akun, trip, dan chat. SQLAlchemy menyimpan users, trips, conversations, dan messages di PostgreSQL. Layanan Bedrock menyusun itinerary dan balasan chat dari riwayat tersimpan. Endpoint /ask mengambil dokumen dari Bedrock Knowledge Base sebelum menyusun jawaban bersumber. RAG dan chat saat ini adalah dua alur terpisah. Handler memakai fungsi sinkron dan threadpool FastAPI, bukan klaim seluruh pipeline async.

Target hosting: Next.js di Vercel, FastAPI di Render, PostgreSQL di Neon. Tidak ada koneksi browser langsung ke AWS atau database.

## Jalankan lokal

1. Siapkan Python 3.11+ dan Node.js 20+ dengan pnpm.
2. Dalam backend, buat virtual environment: `python -m venv .venv`. Aktifkan dengan `.venv\Scripts\Activate.ps1` pada PowerShell.
3. Instal `python -m pip install -r requirements-dev.txt`.
4. Salin backend/.env.example ke backend/.env, isi DATABASE_URL PostgreSQL lokal, JWT_SECRET_KEY acak minimal 32 karakter, AWS_REGION, BEDROCK_MODEL_ID dan metode autentikasi AWS yang sesuai. Hapus baris opsional kosong bila memakai default. Isi KNOWLEDGE_BASE_ID untuk RAG. FRONTEND_URL lokal: http://localhost:3000.
5. Dari root, jalankan `python database/migrate.py`. Untuk database lama, backup dahulu karena migrasi menambah ownership trip lama.
6. Dari backend, jalankan `uvicorn main:app --host 0.0.0.0 --port 8000`.
7. Dalam frontend, jalankan `pnpm install --frozen-lockfile`. Salin .env.local.example menjadi .env.local. Untuk lokal set NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 dan NEXT_PUBLIC_SITE_URL=http://localhost:3000.
8. Jalankan `pnpm dev`, lalu buka http://localhost:3000.

## Verifikasi dan deployment

Backend: `python -m pytest tests -q` dari backend. Tes menggunakan SQLite sementara dan mock Bedrock, tidak membuktikan akses AWS/Neon langsung. Frontend: `pnpm build`. Ikuti deployment/README.md untuk Neon, Render, Vercel dan deployment/VERIFICATION.md untuk demo publik. /health adalah pemeriksaan proses, bukan koneksi AWS atau database.

## Struktur

- frontend/: halaman, komponen, auth context, dan API client.
- backend/: API, model SQLAlchemy, service autentikasi/AI/RAG.
- database/: entrypoint migrasi schema yang sudah ada.
- travel-guides/: sumber pengetahuan asli untuk ingestion.
- knowledge/: penjelasan alur ingestion dan batas data.
- deployment/: konfigurasi, runbook, troubleshooting, checklist.
- docs/: keputusan teknis dan skenario presentasi.
- reports/: hasil audit dan verifikasi.

Secret tetap di environment. Jangan memasukkan .env ke Git. Tag v1.0-bootcamp dan commit final hanya sesudah verifikasi produksi lengkap. Repository asal sedang memiliki merge yang belum selesai saat pekerjaan dimulai.
