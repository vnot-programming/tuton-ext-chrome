# Release Notes

## 🎓 UT E-Learning Text Grabber & AI Assistant v1.4.0

**Release Date:** April 24, 2026  
**Version:** 1.4.0  
**Status:** Stable Release

---

## 🚀 What's New in v1.4.0

### 🆕 Major New Features
- **🌐 OpenRouter Native Integration**: Seamless auto-routing capabilities for any `provider/model` formatted string.
- **🛡️ 4-Layer Anti-CoT Engine**: An aggressive text extraction algorithm that prevents "Thinking/Mental Draft" leakage from highly-aligned instruction-tuned models.
- **🗂️ Split Dropdown UI**: Revamped AI selection interface separating Providers from Models, complete with ascending alphabetical sorting.
- **💬 Smart Error Reporting**: Human-readable error translations for HTTP 401, 404, and 429 API failures.

### 🤖 Huge AI Model Roster Update
- Added **Gemini 3.1 Flash/Pro**, **GPT-5.4 Series**, **Claude 4.5/4.6**.
- Added top-tier Open-weights via OpenRouter: **DeepSeek-R1 & V3**, **Llama 4 (Maverick)**, **GLM-5**, **MiniMax M2.5**, and **Qwen 3.5**.
- Removed outdated models (Gemini 2.5) and incompatible models (Gemma 4) to maintain top-tier response quality.

---

## 🚀 Core Features (from v1.3.0)
- **📚 RAT Integration**: Added input fields for RAT (Rancangan Aktivitas Tutorial) course description and learning outcomes
- **🎓 Academic Reference Evaluation**: AI now evaluates student responses for proper academic references and citations
- **🔍 Enhanced Text Extraction**: Improved forum post extraction with better content detection
- **🚫 Smart Duplication Prevention**: Prevents duplicate content extraction between discussion materials and student posts

### 🔧 Bug Fixes & Improvements
- **✅ Text Extraction Fixed**: Resolved issue where only post headers were extracted without content
- **🛡️ Content Security Policy**: Fixed CSP violations by removing external PDF.js dependency
- **📁 File Management**: Properly excluded internal scripts from build zip and repository
- **🔄 Duplicate Content**: Eliminated duplicate text extraction between materials and posts

### 🎨 UI/UX Improvements
- **📝 Text Input Fields**: Replaced file upload with user-friendly text input fields
- **🎯 Focused Evaluation**: AI now focuses on academic references and implementation examples
- **🐛 Debug Logging**: Added comprehensive console logging for troubleshooting
- **⚡ Streamlined Processing**: Content extraction now focuses on student responses only

### ✨ Core Features (from v1.0)
- **🎯 Smart Text Extraction** - Automatically grabs text from UT e-learning forum discussions and course content
- **🤖 Multi-AI Support** - Choose from Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 2.0 Flash, OpenAI GPT-4, or Claude 3.5 Sonnet
- **🔐 100% Privacy & Local Storage** - Your custom API keys are strictly kept locally in your browser and sent directly to AI providers. We NEVER intercept or store your keys.
- **📋 One-Click Copy** - Copy AI responses directly to your clipboard
- **🎨 Modern Interface** - Beautiful, intuitive design that's easy to use

### 🛡️ Security & Privacy
- **🔒 Zero Server Storage for User Keys** - Your personal API keys are NEVER sent to our servers.
- **🔑 HMAC Authentication** - Military-grade security for fetching developer's fallback/free API keys.
- **⏰ Timestamp Protection** - Prevents replay attacks and unauthorized access
- **🚫 Rate Limiting** - Protects against abuse with intelligent request limiting
- **🌐 CORS Protection** - Secure cross-origin request handling

### 🎯 UT E-Learning Integration
- **📚 Forum Discussion Support** - Perfect for extracting forum posts and replies
- **📖 Course Content Extraction** - Works with all UT e-learning course materials
- **🔄 Auto-Detection** - Automatically detects the type of content you're viewing
- **👁️ Visual Indicators** - See when the extension is active on UT pages
- **🔍 Smart Parsing** - Avoids duplicate content and extracts the most relevant text

---

## 🎯 Perfect For

### 📝 Forum Discussions
- Extract question posts and all replies
- Get AI-powered answers to complex questions
- Understand difficult concepts with AI explanations
- Generate study summaries from forum discussions

### 📚 Course Content
- Extract course materials and readings
- Get AI explanations of complex topics
- Create study guides from course content
- Understand difficult concepts with AI assistance

### 💡 Study Assistance
- Get instant answers to your questions
- Understand complex topics with AI explanations
- Create study materials from course content
- Improve your learning with AI-powered insights

---

## 🔧 How It Works

1. **📖 Browse UT E-Learning** - Navigate to any forum discussion or course page
2. **🎯 Click Extension Icon** - The extension automatically detects UT e-learning content
3. **📝 Text Extraction** - Extension grabs all relevant text from the page
4. **🤖 Choose AI Model** - Select your preferred AI model (Auto recommended)
5. **⚡ Generate Answer** - Get instant AI-powered responses
6. **📋 Copy & Use** - Copy the response to your clipboard for use

---

## 🛠️ Technical Highlights

### 🔧 Architecture
- **Manifest V3** - Latest Chrome extension standard
- **Service Worker** - Efficient background processing
- **Content Scripts** - Seamless page integration
- **Web Crypto API** - Secure cryptographic operations

### 🌐 API Integration
- **Fallback Server** - `https://api.indobelajar.com/` (Only used to securely fetch developer's free fallback API key)
- **HMAC-SHA256** - Cryptographic authentication
- **Rate Limiting** - 100 requests per 15 minutes
- **Error Handling** - Comprehensive error management

### 🎨 User Experience
- **Responsive Design** - Works on all screen sizes
- **Smooth Animations** - Polished user interface
- **Real-time Feedback** - Instant status updates
- **Error Recovery** - Graceful error handling

---

## 📋 System Requirements

### 🌐 Browser Support
- **Chrome 88+** (Recommended)
- **Edge 88+** (Chromium-based)
- **Brave Browser** (Chromium-based)
- **Opera 74+** (Chromium-based)

### 💻 Operating Systems
- **Windows 10/11**
- **macOS 10.15+**
- **Linux (Ubuntu 18.04+)**

### 🔗 Internet Connection
- **Required** - For AI API calls
- **Stable** - For best performance
- **Secure** - HTTPS connections only

---

## 🚀 Getting Started

### 📥 Installation
1. **Download** from Chrome Web Store (coming soon)
2. **Install** with one click
3. **Enable** the extension
4. **Start using** on UT e-learning pages

### 🎯 First Use
1. **Open** any UT e-learning forum or course page
2. **Click** the extension icon in your toolbar
3. **Select** your preferred AI model
4. **Click** "Generate Answer with AI"
5. **Copy** the response to your clipboard

---

## 🔒 Privacy & Security

### 📊 Data Collection
- **No Personal Data** - We don't collect personal information
- **No Tracking** - No user behavior tracking
- **No Analytics** - No usage analytics collected
- **Local Storage Only** - Settings stored locally in your browser

### 🔐 API Security
- **Encrypted Communication** - All API calls use HTTPS
- **Secure Authentication** - HMAC signature verification for fallback key retrieval
- **Zero Key Logging** - Your personal API keys are strictly kept locally and never transmitted to our backend.
- **Rate Limiting** - Prevents abuse and protects resources

### 🛡️ Privacy Policy
- **Full Transparency** - Complete privacy policy available
- **No Data Sharing** - We don't share data with third parties
- **User Control** - You control your data and settings
- **Compliance** - Follows Chrome Web Store policies

---

## 🆘 Support & Help

### 📞 Getting Help
- **GitHub Issues** - Report bugs and request features
- **Documentation** - Complete setup and usage guides
- **Community** - Connect with other UT Tuton
- **Developer** - Direct support from the development team

### 🐛 Known Issues
- **None** - This is a stable release with all major issues resolved
- **Future Updates** - Regular updates and improvements planned
- **Feedback Welcome** - We value your input and suggestions

---

## 🎉 What's Next

### 🔮 Upcoming Features
- **Multi-language Support** - Indonesian and English interfaces
- **Custom Prompts** - User-defined AI prompt templates
- **Export Options** - Save responses to files
- **History Tracking** - Keep record of AI interactions
- **Advanced Filtering** - More sophisticated content extraction

### 🚀 Future Improvements
- **Performance Optimization** - Faster text extraction
- **Enhanced UI** - More customization options
- **Mobile Support** - Extension for mobile browsers
- **Integration APIs** - Connect with other educational tools

---

## 🙏 Acknowledgments

### 🎓 Special Thanks
- **Universitas Terbuka** - For the amazing e-learning platform
- **Google Gemini AI** - For powerful AI capabilities
- **Chrome Extension Team** - For excellent development tools
- **UT Tuton** - For feedback and testing

### 💝 Made With Love
This extension was created specifically for UT Tuton to enhance their learning experience. Every feature is designed with UT's e-learning platform in mind.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Developer

**Feri Febria Laksana**  
*Made with ❤️ for UT Tuton*

---

**🎓 Ready to enhance your UT e-learning experience? Install the extension today!**

*For the latest updates and support, visit our [GitHub repository](https://github.com/vnot-programming/tuton-ext-chrome).*
