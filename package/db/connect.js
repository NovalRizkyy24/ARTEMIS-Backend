// backend/package/db/connect.js

// 1. Ganti impor dari Client menjadi Pool
const { Pool } = require('pg');
require('dotenv').config();

// 2. Buat instance dari Pool, bukan Client. Konfigurasinya sama.
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Tambahan konfigurasi untuk production (jika diperlukan)
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

// 3. Hapus blok client.connect(). Pool akan mengelola koneksi secara otomatis.
// Sebagai gantinya, kita bisa menambahkan listener untuk event 'connect' dan 'error'
// untuk memonitor kesehatan pool. Ini opsional tapi praktik yang baik.

pool.on('connect', () => {
  console.log('✅ Klien baru terhubung ke pool database PostgreSQL!');
});

pool.on('error', (err, client) => {
  console.error('❌ Terjadi error pada pool koneksi database:', err);
});

// 4. Ekspor pool, bukan client.
module.exports = pool;