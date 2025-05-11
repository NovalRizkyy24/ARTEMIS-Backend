const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

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

    return fileUrl;  // Kembalikan URL GCS sebagai hasil
  } catch (error) {
    console.error('❌ Gagal upload ke GCS:', error);
    throw new Error('❌ Gagal upload ke GCS');
  }
};

module.exports = { uploadToGCS };
