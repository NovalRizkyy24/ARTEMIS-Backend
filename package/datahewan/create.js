// backend/package/datahewan/create.js
const client = require('../db/connect'); // Mengimpor koneksi ke PostgreSQL

const createDataHewan = async (nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, urlfoto) => {
  try {
    // Query untuk menyimpan data hewan ke database
    const insertQuery = `
      INSERT INTO data_hewan (nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, urlfoto)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    const values = [nama_hewan, nama_latin, deskripsi, status_lindungi, wilayah, populasi, urlfoto];

    // Menjalankan query untuk menyimpan data ke database
    await client.query(insertQuery, values);
    console.log('✅ Data hewan berhasil disimpan ke database!');
  } catch (error) {
    console.error('❌ Gagal menyimpan data hewan:', error);
    throw new Error('Gagal menyimpan data hewan');
  }
};

module.exports = { createDataHewan };
