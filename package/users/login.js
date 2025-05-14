// Backend/package/users/login.js
const { Client } = require('pg');
require('dotenv').config(); // Untuk membaca file .env

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Fungsi untuk memverifikasi login
const loginUser = async (username, password) => {
  try {
    await client.connect(); // Menyambungkan ke database PostgreSQL
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      if (user.password === password) { // Untuk sementara, kita cek password secara langsung
        return { success: true, user }; // Kembalikan data user jika login berhasil
      } else {
        return { success: false, message: 'Password salah' };
      }
    } else {
      return { success: false, message: 'Username tidak ditemukan' };
    }
  } catch (err) {
    console.error('Error login:', err);
    return { success: false, message: 'Terjadi kesalahan pada server' };
  } finally {
    client.end(); // Menutup koneksi database
  }
};

module.exports = { loginUser };
