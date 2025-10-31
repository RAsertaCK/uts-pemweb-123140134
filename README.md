# 📰 News4U - Portal Berita Harian

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-blueviolet?logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-yellow?logo=javascript)
![CSS](https://img.shields.io/badge/CSS3-Responsive-orange?logo=css3)

Repositori ini dibuat untuk memenuhi Ujian Tengah Semester (UTS) mata kuliah Pemrograman Web.

- **Nama:** Rafael Abimanyu Ratmoko
- **NIM:** 123140134

## 🚀 Live Demo

Aplikasi ini telah di-deploy menggunakan Vercel.

![Live Demo]([MASUKKAN LINK DEPLOYMENT VERCEL ANDA DI SINI])

---

## 📸 Tampilan

| Tampilan Desktop | Tampilan Mobile (Responsif) |
| :---: | :---: |
| ![Tampilan Desktop News4U]([GANTI DENGAN PATH SCREENSHOT DESKTOP ANDA]) | ![Tampilan Mobile News4U]([GANTI DENGAN PATH SCREENSHOT MOBILE ANDA]) |

*(Catatan: Ganti path screenshot di atas dengan path ke screenshot Anda yang sebenarnya, misalnya `public/screenshot-desktop.png`)*

## 📚 Deskripsi Proyek

**News4U** adalah aplikasi web portal berita satu halaman (Single Page Application) yang dinamis, dibuat menggunakan React.js dan Vite. Aplikasi ini mengambil data berita secara *real-time* dari [NewsAPI](https://newsapi.org/), memungkinkan pengguna untuk menjelajahi, mencari, dan memfilter artikel berita terkini.

Aplikasi ini dirancang dengan fokus pada *state management* modern, *error handling* yang tangguh, dan desain yang responsif (termasuk *dark mode*).

## ✨ Fitur Utama

- **Berita Terkini:** Menampilkan berita *top-headlines* dari NewsAPI berdasarkan kategori.
- **Pencarian Artikel:** Form pencarian untuk mencari artikel berita spesifik di seluruh database API.
- **Filter Kategori:** Navigasi untuk memfilter berita berdasarkan kategori (Teknologi, Bisnis, Olahraga).
- **Filter Tanggal:** Memungkinkan pengguna memilih rentang tanggal (`From` dan `To`). Logika ini secara cerdas beralih ke endpoint `/everything` untuk memastikan pemfilteran tanggal berfungsi.
- **Infinite Scroll:** Memuat lebih banyak artikel secara otomatis saat pengguna *scroll* ke bagian bawah halaman (dibatasi 100 artikel oleh API).
- **Error Handling & Mode Demo:**
    - Menampilkan pesan error yang jelas jika API key limit (429) atau 100 artikel tercapai.
    - Secara otomatis beralih ke **data demo** (`newsData.js`) jika API gagal dimuat, memastikan aplikasi tetap fungsional.
- **Penanganan Gambar (CORS):** Mendeteksi gambar yang gagal dimuat (karena `null` dari API atau error CORS/`ERR_BLOCKED_BY_RESPONSE`) dan secara otomatis menyembunyikan kotak gambar.
- **Desain Responsif:** Tampilan beradaptasi dengan baik di perangkat desktop, tablet, dan mobile menggunakan CSS Grid dan Media Queries.
- **Dark Mode:** Mendukung *dark mode* sistem operasi pengguna secara otomatis.

## 🛠️ Teknologi yang Digunakan

- **React 19** (Functional Components, Hooks: `useState`, `useEffect`, `useCallback`)
- **Vite** (Sebagai *build tool* dan *dev server*)
- **Modern JavaScript (ES6+)** (Async/Await, Destructuring, Spread Operators)
- **CSS3** (Flexbox, Grid, Media Queries, Dark Mode)
- **NewsAPI** (Sebagai sumber data eksternal)
- **Vite Proxy** (Untuk menangani *request* API di *development*)

## 📂 Struktur Folder Proyek

Struktur folder proyek ini diorganisir untuk skalabilitas dan kemudahan pemeliharaan:

```

news4u-portal/
├── public/                 \# Aset statis (favicon, gambar)
│   ├── newspaper.png
│   └── Newspaper-Free-Download-PNG.jpg
├── src/
│   ├── components/         \# Komponen React yang dapat digunakan kembali
│   │   ├── Header.jsx
│   │   ├── SearchForm.jsx
│   │   ├── DateFilter.jsx
│   │   ├── NewsGrid.jsx
│   │   └── NewsCard.jsx
│   ├── hooks/              \# Custom Hooks untuk logika
│   │   └── useNews.js
│   ├── utils/              \# Helper, konstanta, dan data demo
│   │   ├── constants.js
│   │   └── newsData.js
│   ├── App.css
│   ├── App.jsx             \# Komponen utama
│   └── main.jsx            \# Titik masuk aplikasi
├── .env                    \# Penyimpanan API Key (WAJIB DIBUAT)
├── .gitignore
├── index.html
├── package.json
└── vite.config.js

````

## ⚙️ Cara Instalasi & Menjalankan

1.  **Clone repository ini:**
    ```bash
    git clone [https://github.com/](https://github.com/)[USERNAME_ANDA]/[NAMA_REPO_ANDA].git
    cd [NAMA_REPO_ANDA]
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Buat file `.env`**
    Buat file bernama `.env` di *root* proyek (sejajar dengan `package.json`) dan tambahkan API Key Anda dari [NewsAPI](https://newsapi.org/):

    ```.env
    VITE_NEWS_API_KEY=MASUKKAN_API_KEY_ANDA_DI_SINI
    ```

4.  **Jalankan server development:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.

## 🎨 Atribusi

- Ikon Favicon: [Newspaper icons created by smalllikeart - Flaticon](https://www.flaticon.com/free-icons/newspaper)
````