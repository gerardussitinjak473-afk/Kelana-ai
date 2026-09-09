# Troubleshooting

| Gejala | Pemeriksaan | Tindakan |
|---|---|---|
| Browser melaporkan CORS | FRONTEND_URL di backend | Isi origin frontend tepat, tanpa path, lalu restart/redeploy. |
| DATABASE_URL is not configured | Environment proses backend | Isi DATABASE_URL, jangan hanya environment frontend. |
| JWT_SECRET_KEY must be configured with at least 32 characters | JWT_SECRET_KEY | Generate nilai acak kuat, isi di Render, restart. Token lama tidak valid setelah rotasi. |
| Layanan perjalanan belum tersedia | NEXT_PUBLIC_API_URL kosong pada build produksi | Set base URL lengkap dengan /api/v1 pada Vercel, lalu rebuild. |
| Layanan belum dapat dihubungi | Network, DNS, server stop | Cek /health dari origin backend dan koneksi pengguna. |
| Permintaan terlalu lama | Backend atau Bedrock melambat | Batas tunggu client 120 detik. Coba lagi. Form mempertahankan trip ID jika pembuatan dasar sudah berhasil. |
| Connection refused atau authentication failed | DATABASE_URL dan PostgreSQL | Periksa host, role, password melalui dashboard, SSL, dan network restrictions. Jangan log string koneksi. |
| Bedrock 403 / layanan AI 502 | Model/region, IAM permission, API key expiry | Pastikan model tersedia di region, izin invoke/converse, lalu rotasi credential bila kedaluwarsa. 403 tidak selalu berarti key expired. |
| KNOWLEDGE_BASE_ID belum dikonfigurasi | KNOWLEDGE_BASE_ID | Isi ID yang benar. Pastikan ingestion selesai dan role boleh retrieve. |
| Tidak menemukan informasi relevan | Isi dokumen dan query | Periksa sumber dan status ingestion. Jangan mengganti kegagalan retrieval dengan jawaban rekaan. |
| Form error berisi data tidak sesuai | Validasi 422 | Periksa email, password, hari dan budget. Client menyederhanakan detail validasi untuk pengguna. |
| Trip tersimpan tetapi AI gagal | Generate endpoint 502 | Tekan Rencanakan lagi dengan input sama, atau buka trip tersimpan. Tidak perlu membuat trip baru. |
| Syntax error dengan <<<<<<< | Konflik merge | Selesaikan kedua sisi dengan mempertahankan kemampuan chat dan RAG. Jalankan test dan build sebelum commit. |

Pesan 5xx di browser sengaja sederhana. Detail konfigurasi dicek pengembang pada backend; jangan menampilkan stack trace atau secret kepada pengguna.
