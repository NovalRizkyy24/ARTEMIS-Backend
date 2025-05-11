const express = require('express');
const multer = require('multer');
const path = require('path');
require('dotenv').config();  // Untuk membaca file .env
const { uploadToGCS } = require('./package/gcs/upload'); // Mengimpor fungsi uploadToGCS
const { createDataHewan } = require('./package/datahewan/create'); // Mengimpor fungsi createDataHewan
const { getAllDataHewan } = require('./package/datahewan/read');  // Mengimpor fungsi getAllDataHewan
const client = require('./package/db/connect');  // Mengimpor koneksi ke PostgreSQL

const app = express();
const upload = multer({ dest: 'uploads/' }); // Menggunakan multer untuk menangani upload file

// Middleware untuk memparsing body request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menambahkan rute untuk folder 'public' yang berisi frontend
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));

// Menambahkan rute untuk halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Frontend', 'public', 'index.html'));  // Path ke frontend/index.html
});

// Rute untuk mengambil data hewan dari database
app.get('/api/data-hewan', async (req, res) => {
  try {
    const dataHewan = await getAllDataHewan();  // Memanggil fungsi dari read.js
    res.json(dataHewan);  // Mengirimkan data hewan ke frontend dalam bentuk JSON
  } catch (error) {
    console.error('❌ Gagal mengambil data hewan:', error);
    res.status(500).send('❌ Gagal mengambil data hewan');
  }
});

// Rute untuk upload file ke Google Cloud Storage (GCS) dan simpan data hewan ke database
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi } = req.body;
    const localPath = req.file.path;
    const gcsFileName = req.file.originalname;

    // Mengunggah foto ke GCS
    const fileUrl = await uploadToGCS(localPath, gcsFileName);
    
    // Menyimpan data hewan ke database PostgreSQL, termasuk URL foto dari GCS
    await createDataHewan(nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, fileUrl);

    // Menampilkan pesan sukses di halaman upload-satwa.html dan tetap di halaman tersebut
    res.redirect('/upload-satwa.html?message=upload-success');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Gagal upload ke GCS atau simpan data ke database.');
  }
});

// Menjalankan server di port 3000
app.listen(3000, () => {
  console.log('🌐 Server berjalan di http://localhost:3000');
});
