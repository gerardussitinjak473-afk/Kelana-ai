# KelanaAI

KelanaAI adalah aplikasi perencana perjalanan berbasis AI dengan Next.js, FastAPI, PostgreSQL, dan Amazon Bedrock. Sesi 9 menambahkan travel assistant berbasis Retrieval-Augmented Generation (RAG) dengan jawaban dan referensi dokumen dari Amazon Bedrock Knowledge Bases.

## Fitur sesi 9

- Endpoint `POST /api/v1/ask` mengambil konteks dengan `Retrieve` lalu menghasilkan jawaban grounded melalui Nova Lite (alias kompatibilitas: `/api/v1/assistant`).
- Halaman Next.js `/assistant` menampilkan jawaban dan nama dokumen sumber.
- Empat dokumen demo berada di `travel-guides/`.
- `scripts/sync_knowledge_base.py` mengunggah dokumen ke S3 dan menunggu ingestion selesai.
- `scripts/compare_answers.py` menguji lima pertanyaan yang sama pada base model dan RAG, lalu membuat `reports/rag-vs-base-model.md`.

## Fitur sesi 8

- Registrasi akun dengan password yang di-hash menggunakan bcrypt.
- Login JWT dan endpoint profil `GET /api/v1/auth/me`.
- Homepage tetap publik, tetapi pembuatan itinerary AI meminta pengguna login.
- Proteksi `/trips`, `/trips/[id]`, dan `/profile` menggunakan middleware serta validasi sesi.
- `GET /trips` hanya mengembalikan perjalanan pengguna yang sedang login.
- Create menetapkan `user_id` dari JWT, bukan dari input frontend.
- Update, delete, dan generate menolak akses ke trip milik pengguna lain dengan `403 Forbidden`.
- Trip lama dipertahankan di bawah akun sistem yang tidak dapat login.
- Halaman login, register, profile, sapaan personal, dan logout.

## Menjalankan backend

```bash
cd backend
pip install -r services/requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Isi `DATABASE_URL`, konfigurasi Bedrock, dan `JWT_SECRET_KEY` acak sepanjang minimal 32 karakter di `backend/.env`. Backend berjalan di `http://localhost:8000`.

Untuk RAG, isi juga `KNOWLEDGE_BASE_ID`, `KNOWLEDGE_BASE_DATA_SOURCE_ID`, `KNOWLEDGE_BASE_MODEL_ARN`, dan `KNOWLEDGE_BASE_S3_URI`. Setelah Knowledge Base dan S3 data source dibuat di AWS:

```bash
python scripts/sync_knowledge_base.py
python scripts/compare_answers.py
```

## Menjalankan frontend

```bash
cd frontend
pnpm install
copy .env.example .env.local
pnpm dev
```

Buka `http://localhost:3000`. Nilai default frontend mengakses API pada `http://localhost:8000/api/v1`.

## Menjalankan tes keamanan

```bash
cd backend
pip install -r services/requirements-dev.txt
pytest -q
```

Tes mencakup registrasi, login, endpoint `/auth/me`, kewajiban token pada seluruh endpoint trip, filter daftar berdasarkan pemilik, serta penolakan update/delete/generate lintas pengguna.
