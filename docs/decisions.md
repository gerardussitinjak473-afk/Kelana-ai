# Keputusan teknis

FastAPI menyediakan validasi Pydantic dan Swagger otomatis. Route sinkron cocok dengan SQLAlchemy/boto3 sinkron yang sudah dipakai. Pemisahan service meliputi autentikasi, hitungan trip, inference dan retrieval; beberapa orkestrasi database masih berada di main.py. Refactor router dapat dilakukan setelah baseline stabil.

Next.js mempertahankan App Router serta React agar halaman auth, trip, chat dan assistant tetap terintegrasi. Tailwind menangani halaman lama, design.css mengatur landing dan branding baru. Font sistem dan Georgia menghapus kebutuhan download Google Font saat build.

PostgreSQL mendukung relasi kepemilikan trip dan percakapan. Migrasi mempertahankan fungsi init_db yang sudah ada, dengan entrypoint eksplisit. pool_pre_ping mengecek koneksi pool sebelum penggunaan. Migrasi berversi Alembic masih pengembangan lanjutan.

JWT menjaga API stateless, password memakai bcrypt. Middleware frontend hanya pengarah navigasi; otorisasi sebenarnya di backend. Token saat ini disimpan localStorage dan cookie yang dapat diakses JS. CSP dan migrasi ke sesi httpOnly melalui BFF layak direncanakan sebelum perluasan penggunaan.

Amazon Bedrock menyusun itinerary dan balasan chat. BEDROCK_MODEL_ID menjadi nama environment utama; MODEL_ID lama tetap didukung. Model tidak menyimpan memori sendiri, aplikasi membaca history dari database tiap giliran.

Bedrock Knowledge Base melakukan retrieve lalu converse untuk jawaban bersumber pada /ask. Chat dan RAG belum digabung. Panduan latihan harus dikurasi sebelum dipakai sebagai informasi perjalanan nyata.

Vercel, Render dan Neon dipertahankan sebagai target sesuai prompt. Cloudflare Sites tidak menggantikan stack atau memindahkan autentikasi pengguna. Deployment publik menunggu akun/domain produksi yang belum ada dalam env.

Animasi pesawat memakai CSS transform, berjalan pada perubahan pathname dan pilihan destinasi. Overlay tidak menerima pointer sehingga tidak menghalangi tindakan. prefers-reduced-motion mematikan animasi. Filter destinasi dan kalkulasi budget berjalan lokal tanpa API.
