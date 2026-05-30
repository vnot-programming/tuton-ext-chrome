# Software Requirements Specification (SRS)
## Project: UT E-Learning Text Grabber & AI Assistant
**Version:** 1.8.0-dev  
**Date:** May 29, 2026  

---

## 1. Introduction
The **UT E-Learning Text Grabber & AI Assistant** is a Chromium-based extension designed to assist tutors and lecturers (Tuton) on the Universitas Terbuka (UT) e-learning platform. It streamlines manual workflows such as text extraction from forum posts, academic reference checking, student response evaluation against course syllabus (RAT), and automatic grading synchronization.

---

## 2. Core Functional Requirements
1. **Automated Forum Text Grabber**: Instantly pull student responses, usernames, and post timing from active discussion threads.
2. **RAT Context Injection**: Allow the lecturer to paste course syllabus description and learning targets to guide the AI's grading logic.
3. **Moodle Grader Integration (New)**:
   - Detect grader URL patterns: `https://elearning.ut.ac.id/mod/assign/view.php?id=xxxx&action=grader&userid=yyyy`.
   - Automatically extract student ID, email, name, course code, due date, current grade, and existing feedback.
   - Detect student-submitted assignment PDFs, fetch them asynchronously, and extract text using an embedded, sandboxed version of PDF.js.
   - AI-assisted feedback generation comparing student text/PDF submissions with the RAT context.
   - Bidirectional sync to write scores and evaluation texts back to `#id_grade` and Moodle's TinyMCE feedback editor.
4. **Offline / Sandbox Simulation Mode**: Automatically activate a visual demo state when the extension is opened on non-Moodle pages, loading robust mock data for testing and validation.

---

## 3. Non-Functional Requirements
- **Security & Privacy**: User API keys must reside strictly in local storage (`chrome.storage.sync`) and must never be transmitted to external telemetry servers.
- **CSP Compliance**: The extension must avoid loading any remote CDN scripts (e.g., pdf.js or icons), performing all logic inside local background workers or popup scripts.
- **Visual Presentation**: Adhere fully to **Bio-Digital Minimalism 2026** design guidelines (harmonious HSL palettes, smooth transition curves, multi-layer depth shadows, and elegant badge indicators).
