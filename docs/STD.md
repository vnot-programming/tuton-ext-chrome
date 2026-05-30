# Software Test Document (STD)
## Project: UT E-Learning Text Grabber & AI Assistant

---

## 1. Test Cases for Grader Feature

### Test Case 1: Active Tab Grader Detection
- **Description**: Verify the extension accurately detects if it is currently run on Moodle's Grader URL.
- **Preconditions**: Extension installed.
- **Steps**:
  1. Open a non-UT page (e.g. `google.com`).
  2. Open the extension popup, switch to the "Penilaian" tab sheet.
- **Expected Result**: The popup displays the "Mode Simulasi Aktif" badge, loads details for **PRASTIANO NOER ADITYA**, and sets the mock PDF named "Tugas 1 Dasar Pemrograman R Prastiano Noer Aditya.pdf".

### Test Case 2: AI Evaluator and Feedback Generation
- **Description**: Test AI content evaluation against the mock PDF and RAT settings.
- **Preconditions**: Simulation mode loaded, valid API key stored.
- **Steps**:
  1. Click the "Mulai Analisis AI" button inside the "Penilaian" sheet.
  2. Wait for completion indicator.
- **Expected Result**: A valid numeric grade is generated, and constructive, academic-compliant feedback is written into the evaluation textarea.

### Test Case 3: Synchronization to Moodle Page
- **Description**: Ensure the synchronized values are accurately injected into Moodle's DOM.
- **Preconditions**: Opened UT mock page (`~bahan/assign.html`).
- **Steps**:
  1. Fill Grade and Feedback inputs in the "Penilaian" tab.
  2. Click "Sinkronisasi ke Moodle".
- **Expected Result**: `#id_grade` on the mock page holds the correct value, and the TinyMCE feedback editor iframe displays the exact feedback comment text.
