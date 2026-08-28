# KelanaAI

KelanaAI adalah aplikasi perencana perjalanan berbasis AI. Pada sesi 7, aplikasi Next.js menjadi multi-page dan menampilkan data perjalanan yang tersimpan melalui FastAPI dan PostgreSQL.

## Fitur sesi 7

- Dashboard riwayat perjalanan di `/trips` dan halaman detail dinamis `/trips/[id]`.
- Trip card dengan ikon destinasi, format currency, badge kategori, dan badge travel style.
- Search berdasarkan destinasi atau travel style.
- Sorting terbaru, terlama, dan budget tertinggi.
- Pagination otomatis ketika hasil berisi lebih dari 10 perjalanan.
- Empty, loading, error, dan no-results state yang jelas.

## Menjalankan frontend

```bash
cd frontend
pnpm install
copy .env.example .env.local
pnpm dev
```

Buka `http://localhost:3000`.

## Menjalankan backend

```bash
cd backend
pip install -r services/requirements.txt
copy .env.example .env
uvicorn main:app --reload
```

Backend berjalan di `http://localhost:8000`. Pastikan konfigurasi database pada `backend/.env` sudah benar.
