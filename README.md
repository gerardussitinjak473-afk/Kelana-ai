# KelanaAI

KelanaAI adalah aplikasi perencana perjalanan berbasis AI. Homepage sesi 6 dibangun dengan Next.js dan Tailwind CSS, terhubung ke FastAPI untuk menyimpan rencana perjalanan.

## Menjalankan frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Buka `http://localhost:3000`.

## Menjalankan backend

```bash
cd backend
pip install -r services/requirements.txt
uvicorn main:app --reload
```

Backend berjalan di `http://localhost:8000`. Pastikan konfigurasi database pada `backend/.env` sudah benar.
