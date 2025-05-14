  // backend/package/db/connect.js
  const { Client } = require('pg');  // Mengimpor package pg
  require('dotenv').config();  // Untuk membaca file .env

  // Membuat koneksi ke PostgreSQL
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Menyambungkan ke database
  client.connect()
    .then(() => console.log('✅ Koneksi ke database PostgreSQL berhasil!'))
    .catch(err => console.error('❌ Gagal koneksi ke database PostgreSQL:', err));

  module.exports = client;  // Mengekspor client untuk digunakan di file lain
