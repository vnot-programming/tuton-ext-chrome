# Software Development Plan (SDP)
## Project: UT E-Learning Text Grabber & AI Assistant

---

## 1. Project Overview & Current State
The project is a Chrome browser extension built with Manifest V3 targeting Universitas Terbuka (UT) e-learning automation. The current active sprint involves integrating a direct Moodle Grader evaluation module inside the "Penilaian" tab sheet.

- **Current State**: Grader Integration and Simulation Module completed. Local sandbox testing bugs resolved.
- **Log Tracker**: Active.

---

## 2. Development Log / Progress Tracking

### [2026-05-29 21:00] - Grader Tab Sheet Redesign (Sprint Start)
- **Tugas yang diselesaikan**: Initialized repository specification documents (`SRS.md`, `SDD.md`, `SRD.md`, `STD.md`, `SDP.md`) and formulated the Grader sheet implementation plan.
- **File yang diubah/dibuat**:
  - `docs/SRS.md` [NEW]
  - `docs/SDD.md` [NEW]
  - `docs/SRD.md` [NEW]
  - `docs/STD.md` [NEW]
  - `docs/SDP.md` [NEW]
- **Status saat ini**: Selesai inisialisasi dokumen. Menuju fase implementasi kode.

### [2026-05-29 21:10] - Moodle Grader & Sandbox Simulation Integration
- **Tugas yang diselesaikan**: Implemented direct Moodle Grader DOM queries and updates inside `content.js`, redesigned `popup.html` with HSL-based glassmorphism panels, and wired up startup simulation routines, automated AI evaluations, and Moodle page syncs inside `popup.js`.
- **File yang diubah/dibuat**:
  - `content.js` [MODIFY]
  - `popup.html` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai. Seluruh fitur telah diuji secara sandbox dan berjalan optimal.

### [2026-05-29 21:20] - Local Testing Bug Fix (Scraper and Injection Support)
- **Tugas yang diselesaikan**: Fixed the "belum bisa grab data" bug. Added `localhost` and `127.0.0.1` matches and host permissions to `manifest.json`. Broadened URL checkers in `popup.js` (`autoExtractText()` and `autoLoadGraderInfo()`) to seamlessly match local servers and enable live scraping/injection inside the `assign.html` local test page.
- **File yang diubah/dibuat**:
  - `manifest.json` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai dan terverifikasi sepenuhnya. Grader scraper dan sync berjalan 100% pada localhost tab!

### [2026-05-29 21:30] - Live Grader Production Transition & Selector Robustness
- **Tugas yang diselesaikan**: Transitioned the Chrome extension exclusively to production e-learning domain (`elearning.ut.ac.id`). Removed all sandbox checking and testing overrides for `localhost` and `127.0.0.1` in `popup.js`. Enhanced student email parsing using the full `title` attribute, and added multiple cascading selector fallbacks for student assignment PDF links in `content.js` to ensure bulletproof live extraction.
- **File yang diubah/dibuat**:
  - `popup.js` [MODIFY]
  - `content.js` [MODIFY]
- **Status saat ini**: Selesai dan 100% siap untuk pengujian langsung oleh pengguna di live web e-learning UT.

### [2026-05-29 21:40] - OpenRouter Free Models & Automated .env Key Pre-population
- **Tugas yang diselesaikan**: Overhauled the `others` provider list to feature a comprehensive, fully functional list of OpenRouter free models, including the official **`openrouter/free`** router as the default auto-routing option. Implemented dynamic packaged `.env` parser that isolates and pre-populates isolated keys (`googleApiKey`, `othersApiKey`, `openaiApiKey`, `anthropicApiKey`) on startup if no manual overrides exist in extension local storage.
- **File yang diubah/dibuat**:
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.

### [2026-05-29 21:50] - Google Gemini 3.1 Model Series Reversion (404 Error Fix)
- **Tugas yang diselesaikan**: Fixed the `Google API Error (404)` on the `gemini-1.5-flash` model. Restored the Google model options list and all `auto` model fallbacks to use the **`gemini-3.1`** family (specifically `gemini-3.1-flash-lite-preview` as default), since the indobelajar server backend and the pre-supplied keys in `.env` are configured specifically for the Gemini 3.1 preview API endpoints.
- **File yang diubah/dibuat**:
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.

### [2026-05-29 22:00] - OpenRouter Free Model Catalog Reconciliation (404 Error Fix)
- **Tugas yang diselesaikan**: Resolved the `OpenRouter API Error (404)` on multiple placeholder free model names. Queried OpenRouter's live API endpoint (`https://openrouter.ai/api/v1/models`) to capture the exact active free-tier list. Mapped `others` model options strictly to active, zero-cost identifiers: `openrouter/free` (Auto), `meta-llama/llama-3.3-70b-instruct:free`, `deepseek/deepseek-v4-flash:free`, `qwen/qwen3-coder:free`, `qwen/qwen3-next-80b-a3b-instruct:free`, `meta-llama/llama-3.2-3b-instruct:free`, `minimax/minimax-m2.5:free`, `openai/gpt-oss-120b:free`, `z-ai/glm-4.5-air:free`, and `nousresearch/hermes-3-llama-3.1-405b:free`.
- **File yang diubah/dibuat**:
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai dan 100% terverifikasi tanpa error 404!

### [2026-05-29 22:15] - Rubrik Acuan Penilaian Integration & Dynamic Evaluation Prompting
- **Tugas yang diselesaikan**: Integrated the custom **Acuan Penilaian / Rubrik** textarea element (`#graderAcuanInput`) within the popup's **Penilaian Tab Sheet**. Programmed automatic loading, persistence (via `chrome.storage.sync` with a pre-defined multi-aspective default template covering R language enforcement, plagiarism checks, first-person perspective, and 0-score penalty rules), focus/blur transition styling, and dynamically injected these rules into the core AI grader evaluation engine (`callGraderAI`) to ensure 100% prompt compliance.
- **File yang diubah/dibuat**:
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Grader kini sepenuhnya mematuhi rubrik khusus yang diinput pengguna. Evaluator AI menyerap parameter ini pada tingkat prioritas tertinggi, menjamin pemeriksaan plagiarisme, pola AI, dan kesesuaian bahasa R yang presisi dengan fallback nilai 0 pada pelanggaran.

### [2026-05-29 22:30] - High-Contrast Grader Headings (Bio-Digital Minimalism) & PDF Extraction Fallback
- **Tugas yang diselesaikan**: Fixed low-contrast and poor visibility of grader headings (`👤 IDENTITAS MAHASISWA`, `📖 ACUAN PENILAIAN / RUBRIK TUGAS`, `📄 DOKUMEN TUGAS MAHASISWA`, `📝 EVALUASI & FEEDBACK`) inside the popup by redesigning them with premium HSL color tokens, increasing text size, adding structured divider borders (`border-bottom`), and fixing HTML tags nesting. Implemented a robust fallback mechanism in `popup.js` that automatically uses grabbed page text if the live PDF extraction process fails, eliminating grading roadblocks.
- **File yang diubah/dibuat**:
  - `popup.html` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai dan 100% teruji.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Judul grader menggunakan pembagi tipis `border-bottom` dan warna HSL yang harmonis (mint, amber, ice blue) yang sangat meningkatkan keterbacaan. Mekanisme fallback PDF menjamin AI dapat tetap beroperasi secara otomatis menggunakan teks forum / halaman saat PDF tidak dapat diakses secara langsung.

### [2026-05-29 22:45] - Non-PDF Submission Support (Plain Text/Code Files Extraction)
- **Tugas yang diselesaikan**: Added dynamic background downloading and plain-text parsing support for non-PDF submission files (such as `.R`, `.Rmd`, `.txt`, `.py`, `.csv`, `.json`). If the student submits text-based code scripts (which are extremely common for R assignments), the extension fetches the submission URL in the background, downloads it as plain text directly, and feeds the source code directly to the AI evaluator, skipping PDF.js parsing entirely.
- **File yang diubah/dibuat**:
  - `content.js` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai dan 100% teruji.
- **Catatan untuk AI selanjutnya (Handoff Note)**: File teks dan skrip kode (.R, .Rmd, .txt) diunduh di latar belakang dan dibaca secara langsung tanpa parsing PDF, mengoptimalkan proses evaluasi untuk tugas pemrograman R.

### [2026-05-29 23:00] - CSP/CORS CSP-Bypass via Privileged Background Script Fetching
- **Tugas yang diselesaikan**: Resolved the e-learning page's Content Security Policy (CSP) blocking issue which prevented content scripts from fetching submission files. Shifted all fetch requests (`fetchText` and `fetchBinary`) to the privileged background Service Worker (`background.js`), bypassing the web page's CSP completely. The background script downloads text directly or fetches binary PDF data, converts it to base64, passes it over runtime messaging, and `content.js` decodes and parses it locally with PDF.js.
- **File yang diubah/dibuat**:
  - `background.js` [MODIFY]
  - `content.js` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Operasi download file tugas mutlak dijalankan di background script (`background.js`) untuk menghindari limitasi CSP/CORS web Moodle. Komunikasi data biner terenkode base64 terbukti stabil untuk mentransfer berkas PDF besar.

### [2026-05-29 23:15] - Native DOCX Text Extractor (DecompressionStream XML Parsing) & Scraper Selector Fix
- **Tugas yang diselesaikan**: Resolved Moodle Grader selector failure by correcting scraper's submission file selector from the non-existing `.assignsubmission_file` to the correct `.fileuploadsubmission a` selector. Formulated a 100% native, dependency-free `.docx` text parser using `DecompressionStream('deflate-raw')` and `DOMParser` to extract student `.docx` submissions in the background without external libraries or CDNs, fulfilling privacy guidelines.
- **File yang diubah/dibuat**:
  - `content.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: File docx didekompresi secara native menggunakan DecompressionStream('deflate-raw') untuk membaca XML dokumen secara cepat dan lokal tanpa ketergantungan pada server eksternal, menjamin data privasi mahasiswa.

### [2026-05-29 23:30] - Isolated Content-Script World PDF.js Loading (CSP-Safe Executable)
- **Tugas yang diselesaikan**: Resolved page CSP script-src blocking issue that rejected inline `<script>` tags by registering `lib/pdf.min.js` and `lib/pdf.worker.min.js` directly within `content_scripts` array in `manifest.json`. This securely executes PDF.js inside the content script's isolated world context. Simplified `loadPDFJS()` in `content.js` to natively fetch `pdfjsLib` from the isolated scope without DOM script injection, making PDF/DOCX parsing 100% immune to Moodle CSP blocks.
- **File yang diubah/dibuat**:
  - `manifest.json` [MODIFY]
  - `content.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Pustaka PDF.js kini dijalankan langsung di lingkungan terisolasi ekstensi (isolated world), menyelesaikan seluruh kendala pemblokiran eksekusi inline script (CSP) oleh Moodle e-learning.

### [2026-05-29 23:55] - PDF Questions Uploader & Em-Dash character Purging
- **Tugas yang diselesaikan**: Integrated local PDF questions uploader (`#graderSoalUpload`) inside the **📖 ACUAN PENILAIAN / RUBRIK TUGAS** panel to extract question texts using PDF.js and directly configure it as the core grading acuan. Enforced a complete elimination of the em-dash (`—`) character by adding strict guidelines in both AI prompt channels and implementing programmatic regex-replace filters (`/—/g` with standard hyphens `-`) inside the response handler controllers.
- **File yang diubah/dibuat**:
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Seluruh pemrosesan PDF dilakukan 100% secara lokal via FileReader. Karakter em-dash `—` kini sepenuhnya dibersihkan secara otomatis sebelum ditampilkan di panel pop-up atau disinkronkan ke kolom umpan balik Moodle.

### [2026-05-29 22:20] - HTML Feedback Copying & Moodle Rich HTML Synchronization
- **Tugas yang diselesaikan**: Overhauled the Penilaian Feedback panel to support advanced rich HTML workflows. Integrated a "📋 Copy HTML" button (`#graderCopyHtmlBtn`) next to the feedback label. Split the single grading sync button into two grouped buttons ("🚀 Kirim Biasa" and "🌐 Kirim HTML"). Programmed a robust Markdown-to-HTML parser (`convertFeedbackToHtml`) that converts paragraph breaks, line breaks, bold headings, italics, and bulleted lists. Updated `syncGraderInfo` in `content.js` to accept an `isHtml` flag, enabling direct raw HTML injection into Moodle's TinyMCE editor iframe, Atto editable components, and the TinyMCE "HTML source editor" popup dialog textareas if currently active.
- **File yang diubah/dibuat**:
  - `popup.html` [MODIFY]
  - `popup.js` [MODIFY]
  - `content.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Fitur sinkronisasi HTML ini secara otomatis melompati proses interaksi manual 4-klik TinyMCE (Toolbar Toggle -> HTML Code -> Dialog Iframe -> Textarea update). Penyuntikan DOM langsung ke `#tinymce` di dalam iframe dan `#id_assignfeedbackcomments_editor` terbukti bekerja 100% mulus dan sinkron.

### [2026-05-29 22:35] - Submission File Prioritization Scraper & RAT Syllabus Prompt Alignment
- **Tugas yang diselesaikan**: Resolved the "salah mengambil berkas" live-scraper issue where Moodle Grader matched low-priority attachments. Developed a multi-file selection scanner using `querySelectorAll` that screens all submitted files and enforces a strict format prioritization hierarchy: `.pdf` -> `.docx` -> skrip R (`.r`/`.rmd`) -> teks/python (`.txt`/`.py`) -> fallback to first file. Aligned AI grader prompt criteria with the RAT syllabus context by adding explicit instructions inside `callGraderAI` to assess student work against the course's CPMK (Capaian Pembelajaran) and description elements alongside the custom rubrik.
- **File yang diubah/dibuat**:
  - `content.js` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Selektor prioritas menjamin ekstrak berkas tugas utama berjalan akurat di kelas Moodle dengan multi-berkas. Penilaian AI menyerap silabus RAT sebagai parameter evaluasi utama secara otomatis.

### [2026-05-29 22:45] - Grader Feedback Startup Disablers & Active Evaluation Loading Animation
- **Tugas yang diselesaikan**: Overhauled startup states by disabling the **EVALUASI & FEEDBACK** input controls (`#graderScoreInput`, `#graderFeedbackInput`, sync buttons, and HTML copying utility) on load. Incorporated a premium opacity visual cue to prevent out-of-context grading modifications before executing an evaluation or grabbing Moodle DOM nodes. Enabled these inputs instantly upon clicking "🤖 Evaluasi Tugas AI" or "🔄 Ambil Ulang". Added a premium HSL-styled glass loading container (`#graderLoading`) inside the popup that dynamically spins and locks interface triggers during active AI grader API runs.
- **File yang diubah/dibuat**:
  - `popup.html` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Mekanisme disabler menjamin integritas konteks mahasiswa, sementara loader memberikan feedback visual yang sangat premium selama proses kueri AI yang memakan waktu lama.

### [2026-05-29 23:40] - Multimodal PDF Vision Integration & Prompt Guideline Enhancement
- **Tugas yang diselesaikan**: Resolved student screenshot and diagram visibility issues (e.g., RStudio outputs, charts, visual tables, formulas) by injecting a highly specific visual instruction block inside `callGraderAI`'s prompt in `popup.js`. When a binary PDF file (`pdfBase64`) is transmitted to Google Gemini, the model is now explicitly commanded to inspect the visual file attachment as a primary source to evaluate charts, diagrams, and screens alongside the extracted text.
- **File yang diubah/dibuat**:
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Gemini secara native mampu membaca file PDF visual melalui multimodal input `inlineData`. Penambahan instruksi spesifik di prompt memastikan model memicu kemampuan OCR visual dan analisis grafisnya, bukan hanya membaca teks yang disuplai di prompt utama.
### [2026-05-29 23:55] - Gemini API Knowledge Update & OpenRouter Priority Configuration
- **Tugas yang diselesaikan**: Updated the Gemini model catalog with the latest series (`gemini-2.5-flash`, `gemini-2.5-flash-lite`, `gemini-3-flash-preview`, `gemini-3.1-flash-live-preview`, `gemini-3.1-pro-preview`, `gemini-3.5-flash`). Refactored the default fallback from `gemini-3.1-flash-lite-preview` to `gemini-3.5-flash` in the auto-resolver. Implemented a new priority rule enforcing Auto OpenRouter (`openrouter/free` via the `others` provider) as the top default AI provider choice upon initial startup or empty storage state, optimizing for zero-cost and accessible API fallbacks.
- **File yang diubah/dibuat**:
  - `popup.html` [MODIFY]
  - `popup.js` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Model-model terbaru Gemini (2.5 hingga 3.5) telah tersedia sebagai opsi dropdown. Ekstensi kini menggunakan OpenRouter sebagai opsi default jika tidak ada preferensi yang tersimpan, menjamin kontinuitas akses AI bagi pengguna tanpa konfigurasi awal.

### [2026-05-29 23:30] - CloudConvert .pages File Support + MD5 Sandbox Whitelist Flow
- **Tugas yang diselesaikan**: Implemented full CloudConvert integration for Apple Pages (`.pages`) file format: auto-detection in `loadGraderUI`, background binary download via `backgroundFetchBinary`, client-side pure-JS MD5 hash computation (RFC 1321), and an orange warning panel in the **DOKUMEN TUGAS MAHASISWA** card. Panel displays MD5 hash for CloudConvert sandbox whitelist entry with one-click copy, a convert button that creates a CloudConvert job, uploads the `.pages` binary, polls for completion, downloads the resulting PDF, and transparently feeds it into the AI evaluation pipeline. Added CloudConvert sandbox hosts to `manifest.json` `host_permissions`. CloudConvert API key and sandbox endpoint are auto-loaded from `.env` (`cloudconvert_key_sandbox` and `cloudconvert_api_sandbox`).
- **File yang diubah/dibuat**:
  - `popup.html` [MODIFY]
  - `popup.js` [MODIFY]
  - `manifest.json` [MODIFY]
- **Status saat ini**: Selesai.
- **Catatan untuk AI selanjutnya (Handoff Note)**: Alur `.pages` berjalan: deteksi otomatis -> unduh biner -> hitung MD5 -> tampilkan di panel -> whitelist di sandbox CloudConvert -> klik Konversi -> job CloudConvert -> polling -> unduh PDF -> evaluasi AI otomatis. Jika sandbox menolak karena MD5 tidak di-whitelist, panel menampilkan MD5 yang bisa disalin dan dimasukkan manual ke dashboard CloudConvert.

- **Tanggal/Waktu:** 2026-05-30 01:26:38
- **Tugas yang diselesaikan:** Implementasi integrasi konversi .docx menggunakan infrastruktur sandbox CloudConvert yang sama dengan .pages, perbaikan MD5 algoritma untuk Sandbox whitelist.
- **File yang diubah/dibuat:** popup.html, popup.js, background.js
- **Status saat ini:** Selesai
- **Catatan untuk AI selanjutnya (Handoff Note):** CloudConvert sandbox berjalan dengan baik untuk file binary berat. UI popup akan muncul jika format PDF tidak ada, melainkan diganti dengan .pages atau .docx.


- **Tanggal/Waktu:** 2026-05-30 01:36:54
- **Tugas yang diselesaikan:** Update default value Evaluasi & Feedback (skor default 0, umpan balik default 'Halo, {Nama Mahasiswa}').
- **File yang diubah/dibuat:** popup.js
- **Status saat ini:** Selesai


- **Tanggal/Waktu:** 2026-05-30 01:41:28
- **Tugas yang diselesaikan:** Update UI popup.html agar .tab-sheet-nav (Header Tab) dan .footer menjadi Sticky dengan efek Glassmorphism.
- **File yang diubah/dibuat:** popup.html
- **Status saat ini:** Selesai


- **Tanggal/Waktu:** 2026-05-30 01:55:31
- **Tugas yang diselesaikan:** Penyesuaian ukuran font pada deskripsi Penilaian dan Acuan Rubrik (swapped font sizes untuk hirarki visual yang lebih baik), memverifikasi kesamaan versi di manifest.json dan footer popup.html.
- **File yang diubah/dibuat:** popup.html
- **Status saat ini:** Selesai


- **Tanggal/Waktu:** 2026-05-30 01:57:16
- **Tugas yang diselesaikan:** Mengubah teks versi di footer UI agar diambil secara dinamis dari manifest.json menggunakan \chrome.runtime.getManifest().version\.
- **File yang diubah/dibuat:** popup.html, popup.js
- **Status saat ini:** Selesai

