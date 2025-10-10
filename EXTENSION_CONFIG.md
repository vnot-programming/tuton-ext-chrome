# Konfigurasi Extension untuk API Server

## 🔧 **Yang Perlu Diubah di Extension:**

### 1. **Extension ID Sudah Dikonfigurasi**
Di file `popup.js`, baris 27, sudah dikonfigurasi:
```javascript
extensionId: 'jdbphidcaelegicljgoeceikcgeadpnl'  // Extension ID Chrome Anda
```

**Extension ID Anda:** `jdbphidcaelegicljgoeceikcgeadpnl`

### 2. **Ganti Secret Key (Opsional)**
Jika Anda ingin menggunakan secret key yang berbeda, ganti di:
- `popup.js` baris 19-20
- `docker-compose.yml` baris 14

### 3. **URL API Sudah Dikonfigurasi**
Di file `popup.js`, baris 18, sudah dikonfigurasi:
```javascript
baseUrl: 'https://api.indobelajar.com',  // Production API server
```

## 🚀 **Cara Testing:**

### 1. **API Server Sudah Online:**
API server sudah berjalan di `https://api.indobelajar.com/` (port 3000)

### 2. **Load Extension di Chrome:**
1. Buka `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Pilih folder `/home/my/Tuton`

### 3. **Test Extension:**
1. Buka halaman UT e-learning
2. Click icon extension
3. Click "Generate Answer with AI"
4. Check apakah berhasil mendapatkan API key dari server

## 🔐 **Keamanan:**

- ✅ Gemini API key tidak lagi tersimpan di extension
- ✅ API key didapat dari server dengan autentikasi
- ✅ HMAC signature verification
- ✅ Rate limiting di server
- ✅ CORS protection

## 📋 **File yang Dimodifikasi:**

1. **`manifest.json`** - Ditambahkan permission untuk localhost
2. **`popup.js`** - Ditambahkan fungsi untuk mendapatkan API key dari server

## 🐛 **Troubleshooting:**

### Error: "Failed to get API key from server"
- Pastikan API server berjalan di `https://api.indobelajar.com/`
- Check apakah extension ID sudah benar
- Check apakah secret key sama antara extension dan server

### Error: "HTTP error! status: 401"
- Check apakah signature generation benar
- Pastikan timestamp tidak terlalu lama (max 5 menit)

### Error: "Extension not authorized"
- Pastikan extension ID sudah terdaftar di server
- Check apakah request berasal dari Chrome extension

## 📝 **Contoh Konfigurasi Lengkap:**

```javascript
const API_CONFIG = {
  baseUrl: 'https://api.indobelajar.com',
  apiKey: 'my-secure-secret-key-2024',
  secretKey: 'my-secure-secret-key-2024',
  extensionId: 'jdbphidcaelegicljgoeceikcgeadpnl'  // Extension ID Anda
};
```

Extension sekarang siap untuk menggunakan API server yang aman! 🎉
