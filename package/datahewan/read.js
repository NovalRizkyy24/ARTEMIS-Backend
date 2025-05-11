// backend/package/datahewan/read.js
const client = require('../db/connect'); // Mengimpor koneksi ke PostgreSQL

const getAllDataHewan = async () => {
  try {
    // Query untuk mengambil semua data hewan dari database
    const result = await client.query('SELECT * FROM data_hewan');
    return result.rows;  // Mengembalikan hasil query (data hewan)
  } catch (error) {
    console.error('❌ Gagal mengambil data hewan:', error);
    throw new Error('Gagal mengambil data hewan');
  }
};

module.exports = { getAllDataHewan };
