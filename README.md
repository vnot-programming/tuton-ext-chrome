# 🎓 UT E-Learning Text Grabber & AI Assistant

Chrome extension untuk membantu mahasiswa Universitas Terbuka dalam forum diskusi dengan bantuan AI.

## ✨ Features

- **Auto Text Extraction**: Otomatis mengekstrak teks dari forum UT e-learning
- **RAT Integration**: Input fields untuk Deskripsi Singkat Mata Kuliah dan Capaian Pembelajaran
- **Academic Reference Evaluation**: AI mengevaluasi referensi akademik dan sitasi yang proper
- **Multi-Provider AI Support**: Mendukung Google (Gemini), OpenAI (GPT), Anthropic (Claude), dan OpenRouter (DeepSeek, Llama, Qwen, dll).
- **Smart API Routing**: Integrasi native dengan OpenRouter. Hanya dengan memasukkan nama model (misal: `provider/model`), API akan otomatis diarahkan.
- **Aggressive Anti-CoT Engine**: Dilengkapi 4 lapis filter ekstraksi cerdas (XML, Regex, Fallback) untuk memastikan model *open-weights* tidak membocorkan *Chain-of-Thought* (draf mental) ke antarmuka pengguna.
- **Human-Readable Error Handling**: Pesan error yang informatif jika terjadi kegagalan API (401, 404, 429).
- **100% Privacy & Local Storage**: API Key pribadi milik End User hanya disimpan di memori *browser* lokal dan dikirim langsung ke penyedia AI. Kami tidak menyimpan atau menyadap API Key Anda.
- **Smart Duplication Prevention**: Mencegah duplikasi konten antara bahan diskusi dan jawaban mahasiswa.
- **Modern UI**: Interface yang modern dan user-friendly.
- **Copy Function**: Mudah copy response AI ke clipboard.

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

## 🤖 Supported AI Models & Providers

Ekstensi kini mendukung banyak AI Provider dan puluhan model terbaru yang dipisahkan berdasarkan kategori:

### Google DeepMind
- **Auto (Gemini 3.1 Flash Lite)**: Direkomendasikan
- **Gemini 3.1 Flash**
- **Gemini 3.1 Pro**

### OpenAI
- **GPT-4o & GPT-4o Mini**
- **GPT-5.4 Series**: GPT-5.4, Mini, Pro
- **GPT-OSS-120B** (via OpenRouter)

### Anthropic
- **Claude 4.6 Opus**
- **Claude 4.5 Sonnet & Haiku**

### Others (via OpenRouter & Direct)
- **DeepSeek**: DeepSeek-R1, DeepSeek-V3
- **Meta**: Llama 3.3, Llama 4 (Maverick)
- **Alibaba**: Qwen 3.5
- **Mistral**: Mistral Large 3
- **Zhipu / 01.AI / MiniMax**: GLM-5, GLM 4.5 Air, Ling-2.6-flash, MiniMax M2.5

*Sistem dilengkapi fitur **Smart Routing**, di mana model yang memiliki karakter `/` (slash) akan secara otomatis diteruskan ke OpenRouter tanpa perlu konfigurasi tambahan.*

## 🔐 Security & Privacy (100% Aman)

Privasi dan keamanan kredensial Anda adalah prioritas mutlak kami.
- ✅ **Zero Server Storage**: API Key pribadi yang diisikan oleh End User **sama sekali tidak dikirim atau disimpan ke server mana pun** (termasuk `api.indobelajar.com`). API Key Anda tetap aman, eksklusif berada di *browser* Anda (Local/Sync Storage).
- ✅ **Direct API Connection**: Saat Anda men-generate jawaban, API Key Anda dikirimkan secara langsung dari browser Anda ke Endpoint resmi penyedia AI (Google, OpenAI, Anthropic, OpenRouter).
- ✅ **Server Indobelajar Hanya Untuk Fallback**: Ekstensi menggunakan server `api.indobelajar.com` secara eksklusif dan aman (menggunakan algoritma *HMAC signature verification*) semata-mata untuk mengambil "API Key Publik Gratis" milik developer jika Anda memilih tidak memasukkan API Key pribadi.
- ✅ **Rate Limiting & CORS Protection** untuk mencegah eksploitasi pada jalur komunikasi.

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

Extension menggunakan secure API server di `https://api.indobelajar.com/` semata-mata untuk:
- Menyediakan *fallback API Key* milik developer untuk pengguna secara aman.
- Autentikasi koneksi dengan HMAC signature.
- Rate limiting dan monitoring penggunaan server.
*(Catatan: API Key milik Anda sendiri tidak pernah dikirim ke server ini)*

### API Endpoints
- `GET /api/key`: Mendapatkan Gemini API key dengan autentikasi

## 📝 Changelog

### Version 1.7.0 (April 2026)
- **New Feature**: Native OpenRouter API Integration dengan *auto-routing*.
- **New Feature**: 4-Layer Aggressive Anti-CoT Engine untuk memfilter "kebocoran pikiran" AI.
- **Enhancement**: Dukungan puluhan model baru (Gemini 3.1, GPT-5.4, Claude 4.5/4.6, DeepSeek-R1/V3, Llama 4, dll).
- **Enhancement**: *Human-readable Error Handling* (401, 404, 429).
- **Enhancement**: Model Provider di-dropdown secara terpisah dan diurutkan sesuai abjad.

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
1. Check [Issues](https://github.com/vnot-programming/tuton-ext-chrome/issues) untuk masalah yang sudah dilaporkan
2. Buat [New Issue](https://github.com/vnot-programming/tuton-ext-chrome/issues/new) untuk masalah baru
3. Contact developer untuk support langsung

---

**Made with ❤️ for UT Tuton** 🎓

## 🔗 Links

- **GitHub Repository**: [https://github.com/vnot-programming/tuton-ext-chrome](https://github.com/vnot-programming/tuton-ext-chrome)
- **Chrome Web Store**: [Coming Soon]
- **Support**: [GitHub Issues](https://github.com/vnot-programming/tuton-ext-chrome/issues)
