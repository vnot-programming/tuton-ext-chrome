# 🎓 UT E-Learning Text Grabber & AI Assistant

Chrome extension untuk membantu mahasiswa Universitas Terbuka dalam forum diskusi dengan bantuan AI.

## ✨ Features

- **Auto Text Extraction**: Otomatis mengekstrak teks dari forum UT e-learning
- **RAT Integration**: Input fields untuk Deskripsi Singkat Mata Kuliah dan Capaian Pembelajaran
- **Academic Reference Evaluation**: AI mengevaluasi referensi akademik dan sitasi yang proper
- **Multi-Model AI Support**: Mendukung Gemini, OpenAI GPT, dan Claude
- **Secure API Integration**: Menggunakan server API yang aman untuk menyimpan API keys
- **Smart Duplication Prevention**: Mencegah duplikasi konten antara bahan diskusi dan jawaban mahasiswa
- **Modern UI**: Interface yang modern dan user-friendly
- **Copy Function**: Mudah copy response AI ke clipboard

## 🔧 Installation

### Development Mode
1. Clone repository ini
2. Buka Chrome dan pergi ke `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" dan pilih folder extension
5. Extension siap digunakan!

### Production (Chrome Web Store)
Extension tersedia di Chrome Web Store: [Link akan ditambahkan setelah publish]

## 🚀 Usage

1. **Buka halaman UT e-learning** (`https://elearning.ut.ac.id/`)
2. **Click icon extension** di toolbar Chrome
3. **Extension akan otomatis extract text** dari halaman
4. **Input RAT (Opsional)**: Masukkan Deskripsi Singkat Mata Kuliah dan Capaian Pembelajaran
5. **Pilih AI model** yang diinginkan
6. **Click "Generate Answer with AI"**
7. **Copy response** jika diperlukan

## 📚 RAT Integration

Extension mendukung integrasi dengan RAT (Rancangan Aktivitas Tutorial):

- **Deskripsi Singkat Mata Kuliah**: Input field untuk deskripsi mata kuliah dari RAT
- **Capaian Pembelajaran Mata Kuliah**: Input field untuk capaian pembelajaran dari RAT
- **AI Context**: AI akan menggunakan informasi RAT sebagai konteks untuk evaluasi
- **Academic Evaluation**: AI mengevaluasi jawaban mahasiswa berdasarkan RAT dan referensi akademik

## 🤖 Supported AI Models

- **Auto (Recommended)**: Balance antara kualitas dan kecepatan
- **Gemini 2.5 Flash**: Latest dan fastest
- **Gemini 2.5 Pro**: Highest quality
- **Gemini 2.0 Flash**: Stable version
- **OpenAI GPT-4**: Untuk custom API key
- **Claude 3.5 Sonnet**: Untuk custom API key

## 🔐 Security

- ✅ **API keys tersimpan aman** di server `https://api.indobelajar.com/`
- ✅ **HMAC signature verification** untuk autentikasi
- ✅ **Rate limiting** untuk mencegah abuse
- ✅ **CORS protection**
- ✅ **No embedded API keys** di extension

## 📁 Project Structure

```
tuton-ext-chrome/
├── manifest.json          # Extension configuration
├── popup.html             # Extension popup UI
├── popup.js               # Extension popup logic
├── content.js             # Content script untuk extract text
├── background.js          # Background service worker
├── icons/
│   └── icon.png           # Extension icon
├── .gitignore             # Git ignore file
└── README.md              # Documentation
```

## 🛠️ Development

### Prerequisites
- Chrome browser
- Text editor (VS Code recommended)

### Setup Development Environment
1. Clone repository
2. Buka Chrome extensions page
3. Enable developer mode
4. Load unpacked extension

### Testing
1. Buka halaman UT e-learning
2. Test text extraction
3. Test AI response generation
4. Test copy functionality

## 📋 Permissions

Extension memerlukan permission berikut:
- `activeTab`: Untuk akses halaman aktif
- `storage`: Untuk simpan settings
- Host permissions untuk:
  - `https://elearning.ut.ac.id/*`
  - `https://generativelanguage.googleapis.com/*`
  - `https://api.openai.com/*`
  - `https://api.anthropic.com/*`
  - `https://api.indobelajar.com/*`

## 🔄 API Integration

Extension menggunakan secure API server di `https://api.indobelajar.com/` untuk:
- Menyimpan Gemini API key dengan aman
- Autentikasi dengan HMAC signature
- Rate limiting dan monitoring

### API Endpoints
- `GET /api/key`: Mendapatkan Gemini API key dengan autentikasi

## 📝 Changelog

### Version 1.1
- Fixed Chrome Web Store compliance by removing unused 'scripting' permission
- Updated documentation to reflect correct permissions
- Enhanced security and policy compliance
- Improved extension stability

### Version 1.0
- Initial release
- Auto text extraction dari forum UT
- Multi-model AI support
- Secure API integration
- Modern UI design

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Feri Febria Laksana**
- Made with ❤️ for UT Tuton

## 💝 Donate

Jika extension ini membantu Anda dalam belajar di UT, pertimbangkan untuk memberikan dukungan:

<div align="center">

### ☕ Support Development

**Scan QR Code untuk donasi via Saweria:**

[![Saweria QR Code](./assets/qr-saweria.png)](https://saweria.co/vnot01)

**Jazakumullah Khairan** 🙏

**Atau kunjungi:** [saweria.co/vnot01](https://saweria.co/vnot01)

**🔗 Link Donasi Langsung:** [https://saweria.co/vnot01](https://saweria.co/vnot01)

*Setiap donasi sangat berarti untuk pengembangan fitur-fitur baru!* 🙏

</div>

### 🔧 Alternative Donation Methods

Jika QR code tidak muncul, Anda bisa:

1. **Kunjungi langsung:** [saweria.co/vnot01](https://saweria.co/vnot01)
2. **Link Donasi Langsung:** [https://saweria.co/vnot01](https://saweria.co/vnot01)
3. **Scan QR code di halaman Saweria** - QR code akan muncul di halaman tersebut
4. **Transfer langsung** - Gunakan fitur transfer di aplikasi Saweria


## 🙏 Acknowledgments

- Universitas Terbuka untuk platform e-learning
- Google Gemini AI untuk AI capabilities
- Chrome Extension API untuk development framework

## 📞 Support

Jika mengalami masalah atau memiliki pertanyaan:
1. Check [Issues](../../issues) untuk masalah yang sudah dilaporkan
2. Buat [New Issue](../../issues/new) untuk masalah baru
3. Contact developer untuk support langsung

---

**Made with ❤️ for UT Tutor** 🎓# tuton-ext-chrome
