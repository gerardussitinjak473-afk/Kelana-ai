# KelanaAI

KelanaAI adalah aplikasi perencana perjalanan berbasis AI dengan Next.js, FastAPI, PostgreSQL, dan Amazon Bedrock. Aplikasi mendukung itinerary personal serta percakapan multi-turn yang menyimpan riwayat di database dan mengirimkan konteks tersebut kembali ke Amazon Bedrock.

## Fitur sesi 10

- Conversation dan message tersimpan per pengguna dengan proteksi ownership JWT.
- Riwayat percakapan disusun ulang oleh backend sebagai konteks Amazon Bedrock.
- Chat Next.js di `/chat` dengan daftar percakapan dan judul aktif.
- Auto-scroll ke pesan terbaru saat membuka, berpindah, mengirim, dan menerima pesan.
- Typing indicator selama KelanaAI memproses jawaban.
- Timestamp server pada setiap bubble pesan.

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
pytest -q
```

Tes mencakup registrasi, login, endpoint `/auth/me`, kewajiban token pada seluruh endpoint trip, filter daftar berdasarkan pemilik, serta penolakan update/delete/generate lintas pengguna.
