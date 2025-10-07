# 🎓 UT E-Learning Text Grabber & AI Assistant

Chrome extension untuk membantu mahasiswa Universitas Terbuka dalam forum diskusi dengan bantuan AI.

## ✨ Features

- **Auto Text Extraction**: Otomatis mengekstrak teks dari forum UT e-learning
- **Multi-Model AI Support**: Mendukung Gemini, OpenAI GPT, dan Claude
- **Secure API Integration**: Menggunakan server API yang aman untuk menyimpan API keys
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
4. **Pilih AI model** yang diinginkan
5. **Click "Generate Answer with AI"**
6. **Copy response** jika diperlukan

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
- `scripting`: Untuk inject content script
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
- Made with ❤️ for UT students

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
