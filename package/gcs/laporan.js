// backend/package/laporan/laporan.js
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const client = require('../db/connect'); // Mengimpor koneksi ke PostgreSQL

// Konfigurasi GCS
const storage = new Storage({
  keyFilename: path.join(__dirname, '..', '..', 'gcs-key.json'), // Path ke service account key
});
const bucket = storage.bucket('ember-antipecah'); // Nama bucket Anda

// Fungsi untuk meng-upload file ke GCS
const uploadToGCS = async (filePath, fileName) => {
  try {
    // Mengunggah file ke GCS
    await bucket.upload(filePath, {
      destination: fileName,
      resumable: false,
    });

    // Menghapus file lokal setelah di-upload ke GCS
    fs.unlinkSync(filePath);

    // URL GCS lengkap untuk file yang di-upload
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    return fileUrl; // Kembalikan URL GCS sebagai hasil
  } catch (error) {
    console.error('❌ Gagal upload ke GCS:', error);
    throw new Error('❌ Gagal upload ke GCS');
  }
};

// Fungsi untuk menyimpan laporan ke database
const createLaporan = async (nama_pelapor, email_pelapor, lokasi_kejadian, deskripsi_kejadian, foto_bukti) => {
  try {
    const query = `
      INSERT INTO laporan (nama_pelapor, email_pelapor, lokasi_kejadian, deskripsi_kejadian, foto_bukti)
      VALUES ($1, $2, $3, $4, $5) RETURNING id_laporan;
    `;
    const values = [nama_pelapor, email_pelapor, lokasi_kejadian, deskripsi_kejadian, foto_bukti];
    const result = await client.query(query, values);
    return result.rows[0].id_laporan; // Mengembalikan ID laporan yang baru saja dibuat
  } catch (err) {
    console.error('Error menyimpan laporan:', err);
    throw new Error('Gagal menyimpan laporan ke database');
  }
};

// Fungsi utama untuk menangani upload foto bukti dan menyimpan laporan ke database
const handleLaporanUpload = async (req) => {
  const { nama_pelapor, email_pelapor, lokasi_kejadian, deskripsi_kejadian } = req.body;
  const localPath = req.file.path;
  const gcsFileName = req.file.originalname;

  // Mengunggah foto bukti ke GCS
  const fileUrl = await uploadToGCS(localPath, gcsFileName);

  // Menyimpan data laporan ke database PostgreSQL, termasuk URL foto bukti dari GCS
  await createLaporan(nama_pelapor, email_pelapor, lokasi_kejadian, deskripsi_kejadian, fileUrl);

  return fileUrl; // Kembalikan URL foto bukti yang telah di-upload
};

module.exports = { handleLaporanUpload };
