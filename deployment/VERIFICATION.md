# Verifikasi end-to-end produksi

Status 9 September 2026: belum dijalankan pada URL publik. Konfigurasi yang tersedia masih localhost. Pengujian mock/lokal tidak menggantikan checklist ini.

Frontend URL: belum tersedia. Backend docs URL: belum tersedia. Backend health URL: belum tersedia.

| Langkah | Bukti yang harus dicatat | Status publik |
|---|---|---|
| Register akun baru | Screenshot form dan response 201 | BELUM DIUJI |
| Login | Masuk dashboard, token issued tanpa mencatat token | BELUM DIUJI |
| Generate itinerary AI | Itinerary baru hasil round-trip Bedrock | BELUM DIUJI |
| Lihat dashboard | Trip muncul dan row terkait ada di Neon | BELUM DIUJI |
| Pertanyaan RAG | Jawaban bersumber pada Asisten pengetahuan | BELUM DIUJI |
| Buka ulang percakapan | Reload chat lalu follow-up memakai history | BELUM DIUJI |
| Console bersih | Periksa console dan network pada sesi browser baru | BELUM DIUJI |

Gunakan browser incognito, buka URL Vercel, jalankan urutan di atas, lalu ulangi alur inti di perangkat mobile. Bedakan AI Chat (riwayat) dari Asisten pengetahuan (RAG). Jangan menyebut chat sudah melakukan RAG otomatis.
