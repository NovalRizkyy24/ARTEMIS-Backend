# Gunakan Node.js versi 22
FROM node:22

# Direktori kerja dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json
COPY package.json package-lock.json ./

# Install dependensi
RUN npm install

# Salin semua file backend ke container
COPY . .

# Ekspos port (ubah jika server.js pakai port lain)
EXPOSE 3000

# Jalankan server
CMD ["node", "server.js"]


