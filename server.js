// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
require('dotenv').config();  // Untuk membaca file .env
const { uploadToGCS } = require('./package/gcs/upload');  // Mengimpor fungsi uploadToGCS
const { createDataHewan } = require('./package/datahewan/create');  // Mengimpor fungsi createDataHewan
const { getAllDataHewan } = require('./package/datahewan/read');  // Mengimpor fungsi getAllDataHewan
const { loginUser } = require('./package/users/login');  // Mengimpor fungsi loginUser
const { handleLaporanUpload } = require('./package/gcs/laporan');
const client = require('./package/db/connect');  // Mengimpor koneksi ke PostgreSQL

const app = express();
const upload = multer({ dest: 'uploads/' }); // Menggunakan multer untuk menangani upload file

// Middleware untuk memparsing body request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Menambahkan rute untuk folder 'public' yang berisi frontend
app.use(express.static(path.join(__dirname, '..', 'Frontend', 'public')));

// Menambahkan rute untuk halaman utama
app.get('/', (req, res) => {
  res.send('Backend API running. Please access frontend via VM frontend.');
 //res.sendFile(path.join(__dirname, '..', 'Frontend', 'public', 'index.html'));  // Path ke frontend/index.html
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi } = req.body;
    const localPath = req.file.path;
    const gcsFileName = req.file.originalname;

    // Mengunggah foto ke GCS
    const fileUrl = await uploadToGCS(localPath, gcsFileName);

    // Menyimpan data hewan ke database PostgreSQL, termasuk URL foto dari GCS
    await createDataHewan(nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, fileUrl);

    // Redirect dengan pesan sukses
    res.redirect('/upload-satwa.html?message=upload-success');
  } catch (error) {
    console.error(error);
    res.redirect('/upload-satwa.html?message=upload-failed');  // Redirect dengan pesan gagal jika terjadi error
  }
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

// Rute untuk login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const loginResult = await loginUser(username, password);

    if (loginResult.success) {
      req.session.userId = loginResult.user.id;
      req.session.role = loginResult.user.role;
      return res.json({ success: true, redirect: '/admin-dashboard.html' });
    } else {
      return res.json({ success: false, message: loginResult.message });
    }
  } catch (err) {
    console.error('Login Error:', err);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
  }
});

// Rute untuk dashboard admin
app.get('/dashboard-admin.html', (req, res) => {
  if (req.session.userId && req.session.role === 'admin') {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'public', 'dashboard-admin.html'));
  } else {
    res.redirect('/login.html');
  }
});

app.post('/laporkan', upload.single('foto_bukti'), async (req, res) => {
  try {
    // Menangani upload dan penyimpanan laporan
    await handleLaporanUpload(req);

    // Mengirimkan pesan sukses kembali ke halaman laporkan.html
    res.redirect('/laporkan.html?message=laporan-berhasil');
  } catch (error) {
    console.error(error);
    res.status(500).send('❌ Gagal upload ke GCS atau simpan data ke database.');
  }
});


// Rute untuk mengambil laporan dari database
app.get('/api/laporan', async (req, res) => {
  try {
    const query = 'SELECT * FROM laporan';  // Mengambil semua data laporan
    const result = await client.query(query);  // Menjalankan query
    res.json(result.rows);  // Mengirimkan data laporan dalam bentuk JSON
  } catch (error) {
    console.error('❌ Gagal mengambil laporan:', error);
    res.status(500).send('❌ Gagal mengambil laporan');
  }
});

// Rute untuk mengambil jumlah laporan dan data hewan
app.get('/api/dashboard-stats', async (req, res) => {
  try {
    // Query untuk menghitung jumlah laporan
    const laporanQuery = 'SELECT COUNT(*) FROM laporan';
    const laporanResult = await client.query(laporanQuery);
    const laporanCount = laporanResult.rows[0].count;

    // Query untuk menghitung jumlah data hewan
    const hewanQuery = 'SELECT COUNT(*) FROM data_hewan';
    const hewanResult = await client.query(hewanQuery);
    const hewanCount = hewanResult.rows[0].count;

    // Mengirimkan jumlah laporan dan data hewan sebagai JSON
    res.json({
      laporanCount,
      hewanCount
    });
  } catch (error) {
    console.error('❌ Gagal mengambil data statistik:', error);
    res.status(500).send('❌ Gagal mengambil data statistik');
  }
});

// Route to get all animal data
app.get('/api/data-hewan', async (req, res) => {
  try {
    // Query to fetch all columns from the data_hewan table
    const query = 'SELECT id_hewan, nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, urlfoto FROM data_hewan';
    const result = await client.query(query);
    res.json(result.rows); // Send the data as JSON response
  } catch (error) {
    console.error('❌ Failed to fetch animals:', error);
    res.status(500).send('❌ Failed to fetch animals');
  }
});


// Route to update animal data
app.put('/api/data-hewan/:id', upload.single('new_image'), async (req, res) => {
    const { id } = req.params;
    const { nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi } = req.body;

    let fileUrl = null;

    // If a new image was uploaded, upload it to GCS
    if (req.file) {
        try {
            // Upload the file to GCS
            fileUrl = await uploadToGCS(req.file.path, req.file.originalname);
        } catch (error) {
            return res.status(500).send('Failed to upload image to GCS');
        }
    }

    try {
        // Update the animal data in the database
        const query = `
            UPDATE data_hewan
            SET nama_hewan = $1, nama_latin = $2, deskripsi = $3, status_lindungi = $4, wilayah = $5, populasi = $6, urlfoto = $7
            WHERE id_hewan = $8
        `;
        const values = [nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, fileUrl || null, id];

        await client.query(query, values);
        res.send('Animal updated successfully');
    } catch (error) {
        console.error('Error updating animal:', error);
        res.status(500).send('Failed to update animal data');
    }
});


// Route to delete an animal by ID
app.delete('/api/data-hewan/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'DELETE FROM data_hewan WHERE id_hewan = $1';
    await client.query(query, [id]);
    res.send('Animal deleted successfully');
  } catch (error) {
    console.error('❌ Failed to delete animal:', error);
    res.status(500).send('❌ Failed to delete animal');
  }
});

// Route to get animal data by ID
app.get('/api/data-hewan/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT * FROM data_hewan WHERE id_hewan = $1';
        const result = await client.query(query, [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]); // Send the first result as animal data
        } else {
            res.status(404).send('Animal not found');
        }
    } catch (error) {
        console.error('❌ Failed to fetch animal:', error);
        res.status(500).send('❌ Failed to fetch animal');
    }
});



// Menjalankan server di port 3000
app.listen(3000, () => {
  console.log('🌐 Server berjalan di http://localhost:3000');
});
