// Backend/package/users/login.js

// 1. Impor pool dari file koneksi terpusat Anda.
const pool = require('../db/connect'); 

// Fungsi untuk memverifikasi login (VERSI TIDAK AMAN)
const loginUser = async (username, password) => {
  // Menggunakan pool, tidak perlu lagi client.connect() dan client.end()
  const query = 'SELECT * FROM users WHERE username = $1';
  const values = [username];

  try {
    // Langsung gunakan pool.query(). Ini lebih efisien.
    const result = await pool.query(query, values);

    // Cek apakah username ditemukan
    if (result.rows.length > 0) {
      const user = result.rows[0];

      // =================================================================
      // PERINGATAN: Perbandingan password secara langsung ini SANGAT TIDAK AMAN.
      if (user.password === password) { 
      // =================================================================
        
        // Login berhasil. Kembalikan hanya data yang dibutuhkan untuk sesi.
        return { 
          success: true, 
          user: { 
            id: user.id_user, // sesuaikan dengan nama kolom ID Anda
            role: user.role 
          } 
        };
      } else {
        // Password salah
        return { success: false, message: 'Password salah' };
      }
    } else {
      // Username tidak ditemukan
      return { success: false, message: 'Username tidak ditemukan' };
    }
  } catch (err) {
    console.error('Error saat proses login:', err);
    // Kembalikan pesan error yang generik ke pengguna
    return { success: false, message: 'Terjadi kesalahan pada server' };
  }
};

module.exports = { loginUser };