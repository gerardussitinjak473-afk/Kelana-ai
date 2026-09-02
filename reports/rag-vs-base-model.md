# Perbandingan Jawaban KelanaAI — RAG vs Base Model

Dijalankan: 2026-09-02T16:42:50.364902+00:00

Kelima pertanyaan secara eksplisit membutuhkan informasi dari dokumen yang telah berstatus INDEXED di Amazon Bedrock Knowledge Base. Jawaban dan nama sumber di bawah merupakan keluaran aktual dari masing-masing arsitektur.

## 1. Menurut indonesia-customs-and-imei-guide.md, apa yang harus dilakukan wisatawan agar IMEI ponsel dari luar negeri dapat digunakan di Indonesia?

### Base model

Tidak tahu.

### RAG

Wisatawan yang membawa ponsel baru yang dibeli di luar negeri ke Indonesia harus mendaftarkan nomor IMEI perangkat tersebut untuk dapat mengakses jaringan seluler domestik Indonesia (Telkomsel, Indosat, XL, Smartfren). Setiap wisatawan diperbolehkan mendaftarkan maksimal dua (2) perangkat per kedatangan. Pendaftaran dilakukan dengan mengisi Electronic Customs Declaration (e-CD) atau formulir pendaftaran IMEI khusus di portal resmi (beacukai.go.id/register-imei.html) atau melalui aplikasi Mobile Bea Cukai sebelum kedatangan, yang menghasilkan QR Code dan ID Pendaftaran.

[Sumber: indonesia-customs-and-imei-guide.md]

**Sumber:** indonesia-customs-and-imei-guide.md, indonesian-traveler-payment-guide.md

**Peningkatan:** RAG dapat merujuk fakta internal yang spesifik dan menunjukkan dokumen pendukung; base model tidak memiliki akses ke dokumen tersebut.

## 2. Menurut indonesian-traveler-payment-guide.md, metode pembayaran dan cara memperoleh uang tunai apa yang disarankan untuk wisatawan Indonesia?

### Base model

Saya tidak tahu.

### RAG

Menurut indonesian-traveler-payment-guide.md, untuk wisatawan Indonesia yang bepergian ke destinasi di mana QRIS belum aktif (atau untuk penarikan uang tunai di ATM), disarankan untuk menggunakan kartu debit multi-mata uang atau kartu internasional. Spesifiknya:

1. **Kartu Debit dengan Logo Visa / Mastercard**: Pastikan kartu memiliki aktifasi transaksi internasional (transaksi luar negeri) di aplikasi mobile banking sebelum berangkat dari Indonesia.
2. **Rekening Multi-Mata Uang**: Layanan seperti Jenius (BTPN), Bank Jago, dan Wise memungkinkan wisatawan untuk menukarkan IDR menjadi JPY, USD, SGD, atau EUR sebelumnya pada kurs pasar, memungkinkan debit langsung dalam mata uang lokal tanpa biaya pertukaran mata uang asing.

(Sumber: indonesian-traveler-payment-guide.md)

**Sumber:** indonesian-traveler-payment-guide.md, indonesia-customs-and-imei-guide.md

**Peningkatan:** RAG dapat merujuk fakta internal yang spesifik dan menunjukkan dokumen pendukung; base model tidak memiliki akses ke dokumen tersebut.

## 3. Menurut japan-halal-dining-guide.md, bagaimana wisatawan Muslim dapat memilih makanan dan restoran halal di Jepang?

### Base model

Tidak tahu.

### RAG

Wisatawan Muslim dapat memilih makanan dan restoran halal di Jepang dengan memperhatikan beberapa hal berikut:

1. **Membaca Label Bahan (原材料名)**: Pastikan untuk memeriksa label bahan pada kemasan makanan untuk menghindari bahan-bahan terlarang seperti babi (豚, 豚肉, ポーク), lemak babi (ラード, 豚脂, 動物性油脂), ekstrak daging (肉エキス, ポークエキス), dan alkohol (酒, 清酒, アルコール, 酒精).

2. **Mencari Sertifikasi Halal**: Pilih restoran dan produk makanan yang memiliki logo sertifikasi halal dari badan resmi seperti Japan Halal Association (JHA), Nippon Asia Halal Association (NAHA), Japan Islamic Trust (JIT), atau Kyoto Council for Sharia and Halal Affairs.

3. **Mengunjungi Restoran Muslim-Friendly**: Meskipun tidak selalu 100% halal, restoran yang mengklaim Muslim-Friendly akan menyediakan menu tanpa babi dan alkohol, serta memisahkan peralatan masak untuk umat Islam.

4. **Menggunakan Frasa Penting**: Gunakan frasa-frasa penting dalam bahasa Jepang untuk menanyakan tentang keberadaan babi dan alkohol dalam makanan, seperti "Apakah ini mengandung babi?" (これに豚肉は入っていますか？) dan "Apakah ini mengandung alkohol atau mirin?" (これにお酒やみりんは入っていますか？).

5. **Strategi Makanan Aman di Konbini**: Di konbini seperti 7-Eleven, Lawson, dan FamilyMart, pilih makanan yang rendah risiko seperti onigiri garam (塩むすび), onigiri salmon atau tuna (tanpa saus teriyaki), telur rebus (ゆで卵), edamame, buah mentah, dan ubi jalar (yakiimo).

[Sumber: japan-halal-dining-guide.md]

**Sumber:** japan-halal-dining-guide.md

**Peningkatan:** RAG dapat merujuk fakta internal yang spesifik dan menunjukkan dokumen pendukung; base model tidak memiliki akses ke dokumen tersebut.

## 4. Menurut Kyoto_Travel_Guide_EN.md, tempat dan pengalaman utama apa yang direkomendasikan untuk kunjungan ke Kyoto?

### Base model

Tidak tahu.

### RAG

**Tempat dan Pengalaman Utama yang Direkomendasikan untuk Kunjungan ke Kyoto:**

1.  **Fushimi Inari Taisha:** Kuil terkenal dengan ribuan gerbang torii merah cerah yang melingkar di atas Gunung Inari. (Tip: Kunjungi sebelum 7 pagi untuk menghindari kerumunan).
2.  **Kiyomizu-dera:** Kuil kayu spektakuler yang dibangun di sisi gunung, menawarkan pemandangan kota yang indah. Jalan melalui jalan Ninenzaka dan Sannenzaka yang bersejarah sangat magis.
3.  **Kinkaku-ji (Pavilion Emas):** Kuil Zen yang menakjubkan yang lantai atasnya dua sepenuhnya dilapisi emas, yang tercermin indah di kolam di depannya.
4.  **Arashiyama Bamboo Grove:** Berjalan melalui batang bambu raksasa yang menjulang tinggi. Jangan lewatkan Kuil Tenryu-ji yang terdekat dan Jembatan Togetsukyo yang indah.
5.  **Gion District:** Distrik Geisha terkenal Kyoto. Berjalan di jalan Hanami-koji di malam hari untuk kesempatan melihat Geiko atau Maiko dalam perjalanan ke janji temu.
6.  **Nijo Castle:** Bekas tempat tinggal Kyoto dari shogun Tokugawa, yang menampilkan taman-taman indah dan "lantai nightingale" yang berdenging untuk memperingatkan intrusi.

[Sumber: Kyoto_Travel_Guide_EN.md]

**Sumber:** Kyoto_Travel_Guide_EN.md

**Peningkatan:** RAG dapat merujuk fakta internal yang spesifik dan menunjukkan dokumen pendukung; base model tidak memiliki akses ke dokumen tersebut.

## 5. Menurut Japan-Packing-List.pdf, barang penting apa saja yang perlu dipersiapkan sebelum perjalanan ke Jepang?

### Base model

Tidak tahu.

### RAG

Menurut Japan-Packing-List.pdf, barang penting yang perlu dipersiapkan sebelum perjalanan ke Jepang meliputi:

1. **Clothing**:
   - Casual Shirts / T-Shirts
   - Casual Pants / Shorts
   - Pajamas / Slippers
   - Sweater(s)
   - Undergarments
   - Socks
   - Shoes / Sandals
   - Belt
   - Hats / Scarves / Gloves
   - Jacket / Coat
   - Swimwear
   - Workout Clothes / Shoes
   - Smart-Casual Clothing
   - Nylons (dapat dibeli di Jepang)

2. **Personal Hygiene**:
   - Deodorant
   - Hairbrush
   - Cologne / Perfume
   - Cosmetics
   - Skincare Products (dapat dibeli di Jepang)
   - Feminine Products (dapat dibeli di Jepang)
   - Glasses / Case / Contacts / Solution
   - Hand Towels (dapat dibeli di Jepang)

3. **Documentation**:
   - Travel Itinerary
   - Visa / Passport
   - Attraction Tickets
   - Plane Ticket Reservation
   - International License
   - Sakura Mobile SIM / WiFi Reservation

4. **Medication**:
   - Prescription Medications (dengan catatan "research restrictions")

5. **Miscellaneous**:
   - Cultural items (2 item)

6. **Baby/Child Items** (jika bepergian dengan bayi/anak):
   - 19 item khusus

Sumber: Japan-Packing-List.pdf

**Sumber:** Japan-Packing-List.pdf

**Peningkatan:** RAG dapat merujuk fakta internal yang spesifik dan menunjukkan dokumen pendukung; base model tidak memiliki akses ke dokumen tersebut.
