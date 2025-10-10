# Changelog

All notable changes to the UT E-Learning Text Grabber & AI Assistant Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1] - 2025-10-08

### Fixed
- **Chrome Web Store Compliance**: Removed unused 'scripting' permission that was causing policy violation
- **Permission Documentation**: Updated README.md to accurately reflect only used permissions
- **Policy Violation**: Fixed "Purple Potassium" violation by removing unnecessary permission

### Changed
- **Manifest Version**: Updated from 1.0 to 1.1
- **Permission Set**: Now only requests 'activeTab' and 'storage' permissions
- **Documentation**: Enhanced permission justification and compliance information

### Security
- **Reduced Attack Surface**: Removed unused permission reduces potential security risks
- **Policy Compliance**: Extension now fully compliant with Chrome Web Store policies
- **Permission Audit**: Complete review of all permissions to ensure necessity

---

## [1.0.0-alpha] - 2025-10-08

### Added
- **Initial Release** of UT E-Learning Text Grabber & AI Assistant
- **Auto Text Extraction** from UT e-learning forum discussions and course content
- **Multi-Model AI Support** with the following models:
  - Auto (Recommended) - Balance between quality and speed
  - Gemini 2.5 Flash - Latest and fastest model
  - Gemini 2.5 Pro - Highest quality responses
  - Gemini 2.0 Flash - Stable version
  - OpenAI GPT-4 - For custom API key users
  - Claude 3.5 Sonnet - For custom API key users
- **Secure API Integration** with `https://api.indobelajar.com/`
- **HMAC Signature Authentication** for secure API key retrieval
- **Modern UI Design** with gradient backgrounds and smooth animations
- **Copy to Clipboard** functionality for AI responses
- **Real-time Status Updates** with visual feedback
- **Content Script Integration** for automatic text extraction
- **Background Service Worker** for extension lifecycle management
- **Chrome Extension Manifest V3** compliance
- **Comprehensive Error Handling** with user-friendly messages
- **Rate Limiting Protection** to prevent API abuse
- **CORS Security** implementation
- **Privacy Policy** with full transparency about data usage

### Features
- **Smart Text Detection** - Automatically detects forum posts, course content, and general page text
- **Duplicate Prevention** - Avoids processing the same content multiple times
- **Visual Indicators** - Shows extension activity on UT e-learning pages
- **Responsive Design** - Works seamlessly across different screen sizes
- **Auto-login Detection** - Identifies when users need to log in to UT e-learning
- **Tab Management** - Handles multiple tabs and page navigation
- **Storage Management** - Saves user preferences and settings

### Security
- **No Embedded API Keys** - All sensitive credentials stored securely on server
- **HMAC-SHA256 Authentication** - Cryptographic signature verification
- **Timestamp Validation** - Prevents replay attacks
- **Origin Validation** - Only allows requests from authorized Chrome extensions
- **Rate Limiting** - 100 requests per 15 minutes per extension
- **CORS Protection** - Restricts cross-origin requests

### Technical Implementation
- **Web Crypto API** - For secure signature generation
- **Fetch API** - Modern HTTP client for API communication
- **Chrome Extension APIs** - Full Manifest V3 compliance
- **Content Script Injection** - Automatic script injection on UT e-learning pages
- **Message Passing** - Secure communication between extension components
- **Error Boundaries** - Comprehensive error handling and recovery

### Documentation
- **README.md** - Complete setup and usage instructions
- **LICENSE** - MIT License for open source distribution
- **GitHub Templates** - Issue and pull request templates
- **Privacy Policy** - Detailed privacy and data usage information
- **API Documentation** - Complete API usage guide

### Browser Compatibility
- **Chrome 88+** - Full support for Manifest V3
- **Chromium-based browsers** - Edge, Brave, Opera support
- **Cross-platform** - Windows, macOS, Linux support

### Performance
- **Lightweight** - Minimal resource usage
- **Fast Text Extraction** - Optimized DOM parsing
- **Efficient API Calls** - Minimal network overhead
- **Memory Management** - Proper cleanup and garbage collection
- **Background Optimization** - Efficient service worker implementation

---

## [Unreleased]

### Planned Features
- **Multi-language Support** - Indonesian and English interface
- **Custom AI Prompts** - User-defined prompt templates
- **Export Functionality** - Save AI responses to files
- **History Tracking** - Keep record of previous AI interactions
- **Advanced Text Filtering** - More sophisticated content extraction
- **Batch Processing** - Handle multiple forum posts at once
- **Offline Mode** - Basic functionality without internet connection
- **Theme Customization** - Dark/light mode options
- **Keyboard Shortcuts** - Quick access to extension features
- **Analytics Dashboard** - Usage statistics and insights

### Potential Improvements
- **AI Model Selection** - Dynamic model switching based on content type
- **Response Caching** - Cache frequently requested responses
- **Smart Summarization** - Automatic content summarization
- **Citation Tracking** - Track sources and references
- **Collaborative Features** - Share responses with other Tuton
- **Integration APIs** - Connect with other educational tools
- **Mobile Support** - Extension for mobile browsers
- **Accessibility** - Enhanced accessibility features
- **Performance Monitoring** - Real-time performance metrics
- **A/B Testing** - Feature testing and optimization

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.1 | 2025-10-08 | Fixed Chrome Web Store compliance and permission issues |
| 1.0.0-alpha | 2025-10-08 | Initial alpha release with core functionality |

---

## Support

For support, bug reports, or feature requests, please visit our [GitHub Issues](https://github.com/vnot-programming/tuton-ext-chrome/issues) page.

---

**Made with ❤️ for UT Tuton** 🎓
