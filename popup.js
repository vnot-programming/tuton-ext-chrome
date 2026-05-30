document.addEventListener('DOMContentLoaded', function () {
  const aiProviderSelect = document.getElementById('aiProvider');
  const aiModelSelect = document.getElementById('aiModel');
  const customApiKeyInput = document.getElementById('customApiKey');
  const customApiKeySection = document.getElementById('customApiKeySection');
  const apiStatus = document.getElementById('apiStatus');
  const extractedTextDiv = document.getElementById('extractedText');
  const generateAnswerBtn = document.getElementById('generateAnswer');
  const tryDifferentModelBtn = document.getElementById('tryDifferentModel');
  const loadingDiv = document.getElementById('loading');
  const aiResponseDiv = document.getElementById('aiResponse');
  const aiResponseContainer = document.getElementById('aiResponseContainer');
  const copyResponseBtn = document.getElementById('copyResponse');
  const deskripsiMataKuliah = document.getElementById('deskripsiMataKuliah');
  const capaianPembelajaran = document.getElementById('capaianPembelajaran');
  const ratStatus = document.getElementById('ratStatus');
  const clearRAT = document.getElementById('clearRAT');
  const pasteFromClipboard = document.getElementById('pasteFromClipboard');
  
  // Dynamic version
  const appVersionEl = document.getElementById('appVersion');
  if (appVersionEl && chrome.runtime && chrome.runtime.getManifest) {
    appVersionEl.textContent = `Using AI • Version ${chrome.runtime.getManifest().version}`;
  }

  // Tab Sheet elements
  const tabMain = document.getElementById('tabMain');
  const tabRat = document.getElementById('tabRat');
  const tabPenilaian = document.getElementById('tabPenilaian');
  const tabWebcam = document.getElementById('tabWebcam');
  const mainSheet = document.getElementById('mainSheet');
  const ratSheet = document.getElementById('ratSheet');
  const penilaianSheet = document.getElementById('penilaianSheet');
  const webcamSheet = document.getElementById('webcamSheet');
  const openRecorderBtn = document.getElementById('openRecorderBtn');
  
  // Grader Panel elements
  const graderModeBadge = document.getElementById('graderModeBadge');
  const graderModeDot = document.getElementById('graderModeDot');
  const graderModeText = document.getElementById('graderModeText');
  const graderCourseCode = document.getElementById('graderCourseCode');
  const graderStudentName = document.getElementById('graderStudentName');
  const graderStudentNim = document.getElementById('graderStudentNim');
  const graderStudentEmail = document.getElementById('graderStudentEmail');
  const graderDueDate = document.getElementById('graderDueDate');
  const graderAssignName = document.getElementById('graderAssignName');
  const graderPdfName = document.getElementById('graderPdfName');
  const graderPdfSize = document.getElementById('graderPdfSize');
  const graderScoreInput = document.getElementById('graderScoreInput');
  const graderFeedbackInput = document.getElementById('graderFeedbackInput');
  const graderGrabBtn = document.getElementById('graderGrabBtn');
  const graderAnalyzeBtn = document.getElementById('graderAnalyzeBtn');
  const graderSyncBtn = document.getElementById('graderSyncBtn');
  const graderStatus = document.getElementById('graderStatus');
  const graderAcuanInput = document.getElementById('graderAcuanInput');
  const graderSoalUpload = document.getElementById('graderSoalUpload');
  const graderSoalStatus = document.getElementById('graderSoalStatus');
  const graderCopyHtmlBtn = document.getElementById('graderCopyHtmlBtn');
  const graderSyncHtmlBtn = document.getElementById('graderSyncHtmlBtn');
  const graderLoading = document.getElementById('graderLoading');

  // CloudConvert panel elements
  const graderConvertPanel = document.getElementById('graderConvertPanel');
  const graderMd5Display = document.getElementById('graderMd5Display');
  const graderMd5CopyBtn = document.getElementById('graderMd5CopyBtn');
  const graderConvertBtn = document.getElementById('graderConvertBtn');
  const graderConvertStatus = document.getElementById('graderConvertStatus');

  // Keep compatibility references to prevent exceptions in unresolved handlers
  const pdfUpload = null;
  const pdfStatus = graderStatus;
  const pdfInfo = null;
  const pdfFileName = null;
  const pdfFileSize = null;
  const pdfAnalysis = null;
  const pdfResults = null;
  const analyzePDFBtn = null;

  // Tab elements initialized

  let extractedText = '';
  let ratText = '';
  let uploadedPDF = null;

  // API Configuration
  const API_CONFIG = {
    baseUrl: 'https://api.indobelajar.com',
    apiKey: 'my-secure-secret-key-2024',        // Sama dengan di server
    secretKey: 'my-secure-secret-key-2024',     // Sama dengan di server
    extensionId: 'jdbphidcaelegicljgoeceikcgeadpnl'  // Extension ID Chrome Anda
  };

  // Generate HMAC signature
  async function generateSignature(extensionId, timestamp, apiKey, secretKey) {
    const data = `${extensionId}${timestamp}${apiKey}`;
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secretKey);
    const messageData = encoder.encode(data);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureArray = new Uint8Array(signature);
    const signatureHex = Array.from(signatureArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return signatureHex;
  }

  // Get Gemini API Key dari server
  async function getGeminiApiKey() {
    try {
      const timestamp = Date.now().toString();
      const signature = await generateSignature(
        API_CONFIG.extensionId,
        timestamp,
        API_CONFIG.apiKey,
        API_CONFIG.secretKey
      );

      const response = await fetch(`${API_CONFIG.baseUrl}/api/key`, {
        method: 'GET',
        headers: {
          'x-api-key': API_CONFIG.apiKey,
          'x-extension-id': API_CONFIG.extensionId,
          'x-timestamp': timestamp,
          'x-signature': signature
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data.gemini_api_key;

    } catch (error) {
      console.error('Error getting Gemini API key:', error);
      throw error;
    }
  }

  const modelOptions = {
    google: [
      { value: 'auto', label: 'Auto (Gemini 3.5 Flash)' },
      { value: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
      { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro' },
      { value: 'gemini-3.1-flash-live-preview', label: 'Gemini 3.1 Flash Live' },
      { value: 'gemini-3-flash-preview', label: 'Gemini 3.0 Flash' },
      { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
      { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' }
    ],
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' }
    ],
    anthropic: [
      { value: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet' },
      { value: 'claude-3-5-haiku-latest', label: 'Claude 3.5 Haiku' },
      { value: 'claude-3-opus-latest', label: 'Claude 3 Opus' }
    ],
    others: [
      { value: 'openrouter/free', label: 'Auto (OpenRouter Free Router)' },
      { value: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Free)' },
      { value: 'deepseek/deepseek-v4-flash:free', label: 'DeepSeek V4 Flash (Free)' },
      { value: 'qwen/qwen3-coder:free', label: 'Qwen 3 Coder (Free)' },
      { value: 'qwen/qwen3-next-80b-a3b-instruct:free', label: 'Qwen 3 Next 80B (Free)' },
      { value: 'meta-llama/llama-3.2-3b-instruct:free', label: 'Llama 3.2 3B (Free)' },
      { value: 'minimax/minimax-m2.5:free', label: 'MiniMax M2.5 (Free)' },
      { value: 'openai/gpt-oss-120b:free', label: 'GPT OSS 120B (Free)' },
      { value: 'z-ai/glm-4.5-air:free', label: 'GLM 4.5 Air (Free)' },
      { value: 'nousresearch/hermes-3-llama-3.1-405b:free', label: 'Hermes 3 Llama 3.1 405B (Free)' }
    ]
  };

  function updateModelList(provider) {
    if (!aiModelSelect) return;
    aiModelSelect.innerHTML = '';
    const options = modelOptions[provider] || modelOptions['google'];
    options.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      aiModelSelect.appendChild(optionEl);
    });
  }

  // Parse .env keys
  async function loadEnvKeys() {
    try {
      const response = await fetch(chrome.runtime.getURL('.env'));
      if (response.ok) {
        const text = await response.text();
        const keys = {};
        text.split('\n').forEach(line => {
          const eqIdx = line.indexOf('=');
          if (eqIdx === -1) return;
          const key = line.slice(0, eqIdx).trim().toLowerCase();
          // Join everything after the first '=' (handles values with '=' like JWTs)
          let val = line.slice(eqIdx + 1).trim();
          // Strip surrounding quotes (single or double) added by the user
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1).trim();
          }
          // Strip trailing dots/slashes from URL values
          val = val.replace(/[./\r]+$/, '');
          if (key && val) keys[key] = val;
        });
        return keys;
      }
    } catch (e) {
      console.log('No .env file found or accessible. Fallback to manual.');
    }
    return null;
  }

  // Load saved settings & .env fallbacks
  chrome.storage.sync.get([
    'selectedProvider', 'selectedModel', 
    'googleApiKey', 'othersApiKey', 'openaiApiKey', 'anthropicApiKey',
    'deskripsiMataKuliah', 'capaianPembelajaran', 'graderAcuanInput'
  ], async function (result) {
    const defaultProvider = result.selectedProvider || 'others';
    if (aiProviderSelect) aiProviderSelect.value = defaultProvider;

    updateModelList(defaultProvider);

    if (result.selectedModel) {
      aiModelSelect.value = result.selectedModel;
    } else {
      aiModelSelect.value = 'auto'; // Default to auto
    }

    // Try loading keys from .env
    const envKeys = await loadEnvKeys();
    const keysToStore = {};

    // Store CloudConvert sandbox API key & endpoint from .env
    if (envKeys && envKeys.cloudconvert_key_sandbox) {
      keysToStore.cloudconvertKeySandbox = envKeys.cloudconvert_key_sandbox.trim();
    }
    if (envKeys && envKeys.cloudconvert_api_sandbox) {
      // Strip trailing dot if present
      keysToStore.cloudconvertApiSandbox = envKeys.cloudconvert_api_sandbox.trim().replace(/\.$/, '');
    }

    let googleKey = result.googleApiKey;
    if (!googleKey && envKeys && envKeys.gemini_key) {
      googleKey = envKeys.gemini_key;
      keysToStore.googleApiKey = googleKey;
    }

    let othersKey = result.othersApiKey;
    if (!othersKey && envKeys) {
      othersKey = envKeys.others_key || envKeys.api_key;
      keysToStore.othersApiKey = othersKey;
    }

    let openaiKey = result.openaiApiKey;
    if (!openaiKey && envKeys && envKeys.openai_key) {
      openaiKey = envKeys.openai_key;
      keysToStore.openaiApiKey = openaiKey;
    }

    let anthropicKey = result.anthropicApiKey;
    if (!anthropicKey && envKeys && envKeys.anthropic_key) {
      anthropicKey = envKeys.anthropic_key;
      keysToStore.anthropicApiKey = anthropicKey;
    }

    if (Object.keys(keysToStore).length > 0) {
      chrome.storage.sync.set(keysToStore);
    }

    // Set value of key input based on active provider
    if (defaultProvider === 'google') {
      customApiKeyInput.value = googleKey || '';
    } else if (defaultProvider === 'others') {
      customApiKeyInput.value = othersKey || '';
    } else if (defaultProvider === 'openai') {
      customApiKeyInput.value = openaiKey || '';
    } else if (defaultProvider === 'anthropic') {
      customApiKeyInput.value = anthropicKey || '';
    }

    if (result.deskripsiMataKuliah) {
      deskripsiMataKuliah.value = result.deskripsiMataKuliah;
    }
    if (result.capaianPembelajaran) {
      capaianPembelajaran.value = result.capaianPembelajaran;
    }

    const defaultAcuanPenilaian = `1. Berikan skor nilai dalam rentang 1 hingga 100 untuk setiap jawaban mahasiswa, dengan melakukan evaluasi terhadap tiga aspek utama: ketepatan jawaban terhadap materi soal, kelengkapan jawaban sesuai dengan persyaratan soal diskusi, dan kedalaman pemahaman mahasiswa terhadap materi yang diujikan.

2. Lakukan pengecekan pelanggaran akademik secara menyeluruh pada seluruh pekerjaan mahasiswa dengan memenuhi semua kriteria verifikasi berikut:
- Deteksi adanya kesamaan pola jawaban yang identik atau hampir identik antara satu mahasiswa dengan mahasiswa lain untuk mengidentifikasi praktik plagiarisme
- Analisis penggunaan pola bahasa Agentic AI pada jawaban yang dikumpulkan, guna mengidentifikasi apakah mahasiswa menggunakan bantuan agen AI dalam mengerjakan tugas
- Verifikasi bahwa seluruh implementasi kode yang dibuat dalam jawaban hanya menggunakan bahasa pemrograman R, tanpa ada penggunaan bahasa pemrograman lain yang tidak diizinkan

3. Berikan skor nilai 0 untuk setiap mahasiswa yang terbukti melakukan salah satu atau lebih pelanggaran akademik yang tercantum di atas. Sertakan bukti deteksi pelanggaran yang jelas dan terperinci untuk setiap kasus pelanggaran yang ditemukan.

4. Gunakan format penulisan dengan sudut pandang "Orang Pertama" yang memberikan nasihat konstruktif kepada setiap mahasiswa dalam laporan penilaian.`;

    if (graderAcuanInput) {
      graderAcuanInput.value = result.graderAcuanInput !== undefined ? result.graderAcuanInput : defaultAcuanPenilaian;
    }

    // Disable feedback inputs on startup until evaluated or retrieved
    setFeedbackFieldsDisabled(true);

    updateApiKeySection();
    updateRATContent(); // Update RAT content after loading
    autoLoadGraderInfo(); // Load Moodle Grader info
  });

  // Helper to enable or disable feedback inputs
  function setFeedbackFieldsDisabled(disabled) {
    if (graderScoreInput) graderScoreInput.disabled = disabled;
    if (graderFeedbackInput) graderFeedbackInput.disabled = disabled;
    if (graderSyncBtn) graderSyncBtn.disabled = disabled;
    if (graderSyncHtmlBtn) graderSyncHtmlBtn.disabled = disabled;
    if (graderCopyHtmlBtn) graderCopyHtmlBtn.disabled = disabled;
    
    // Style adjustments for visual cue
    const op = disabled ? '0.5' : '1';
    if (graderScoreInput) graderScoreInput.style.opacity = op;
    if (graderFeedbackInput) graderFeedbackInput.style.opacity = op;
    if (graderSyncBtn) graderSyncBtn.style.opacity = op;
    if (graderSyncHtmlBtn) graderSyncHtmlBtn.style.opacity = op;
    if (graderCopyHtmlBtn) graderCopyHtmlBtn.style.opacity = op;
  }

  // Auto extract text when popup opens
  autoExtractText();

  // Handle provider selection change
  if (aiProviderSelect) {
    aiProviderSelect.addEventListener('change', function () {
      const provider = this.value;
      updateModelList(provider);
      aiModelSelect.value = modelOptions[provider][0].value;
      updateApiKeySection();

      // Retrieve correct isolated key and set it
      chrome.storage.sync.get(['googleApiKey', 'othersApiKey', 'openaiApiKey', 'anthropicApiKey'], function (keysResult) {
        if (provider === 'google') {
          customApiKeyInput.value = keysResult.googleApiKey || '';
        } else if (provider === 'others') {
          customApiKeyInput.value = keysResult.othersApiKey || '';
        } else if (provider === 'openai') {
          customApiKeyInput.value = keysResult.openaiApiKey || '';
        } else if (provider === 'anthropic') {
          customApiKeyInput.value = keysResult.anthropicApiKey || '';
        }
        chrome.storage.sync.set({ selectedProvider: provider, selectedModel: aiModelSelect.value });
      });
    });
  }

  // Handle model selection change
  if (aiModelSelect) {
    aiModelSelect.addEventListener('change', function () {
      updateApiKeySection();
      chrome.storage.sync.set({ selectedModel: aiModelSelect.value });
    });
  }

  // Handle isolated custom API key input
  customApiKeyInput.addEventListener('input', function () {
    const provider = aiProviderSelect.value;
    const keyVal = customApiKeyInput.value.trim();
    const saveObj = {};
    if (provider === 'google') {
      saveObj.googleApiKey = keyVal;
    } else if (provider === 'others') {
      saveObj.othersApiKey = keyVal;
    } else if (provider === 'openai') {
      saveObj.openaiApiKey = keyVal;
    } else if (provider === 'anthropic') {
      saveObj.anthropicApiKey = keyVal;
    }
    chrome.storage.sync.set(saveObj);
  });

  // Handle RAT input changes
  deskripsiMataKuliah.addEventListener('input', updateRATContent);
  capaianPembelajaran.addEventListener('input', updateRATContent);

  // Handle paste events
  deskripsiMataKuliah.addEventListener('paste', function (e) {
    setTimeout(updateRATContent, 10); // Small delay to ensure paste is complete
  });
  capaianPembelajaran.addEventListener('paste', function (e) {
    setTimeout(updateRATContent, 10); // Small delay to ensure paste is complete
  });

  // Add focus/blur styling
  deskripsiMataKuliah.addEventListener('focus', function () {
    this.style.borderColor = 'rgba(46, 139, 87, 0.7)';
  });
  deskripsiMataKuliah.addEventListener('blur', function () {
    this.style.borderColor = 'rgba(255,255,255,0.3)';
  });

  capaianPembelajaran.addEventListener('focus', function () {
    this.style.borderColor = 'rgba(46, 139, 87, 0.7)';
  });
  capaianPembelajaran.addEventListener('blur', function () {
    this.style.borderColor = 'rgba(255,255,255,0.3)';
  });

  // Handle Rubrik (graderAcuanInput) events
  if (graderAcuanInput) {
    graderAcuanInput.addEventListener('input', function () {
      chrome.storage.sync.set({ graderAcuanInput: graderAcuanInput.value });
    });
    graderAcuanInput.addEventListener('focus', function () {
      this.style.borderColor = 'rgba(46, 139, 87, 0.7)';
      this.style.boxShadow = '0 0 5px rgba(46, 139, 87, 0.5)';
      this.style.outline = 'none';
    });
    graderAcuanInput.addEventListener('blur', function () {
      this.style.borderColor = '';
      this.style.boxShadow = '';
    });
  }

  // Handle PDF Questions Upload for Rubrik
  if (graderSoalUpload) {
    graderSoalUpload.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (!file) return;

      if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
        showStatus('Error: Berkas harus berupa file PDF.', 'error', graderSoalStatus);
        graderSoalUpload.value = '';
        return;
      }

      showStatus('Membaca berkas PDF...', 'info', graderSoalStatus);

      const reader = new FileReader();
      reader.onload = async function (e) {
        try {
          const arrayBuffer = e.target.result;
          
          // Configure worker
          if (typeof pdfjsLib !== 'undefined') {
            window.pdfjsLib = pdfjsLib;
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
          } else if (!window.pdfjsLib) {
            throw new Error('PDF.js library tidak termuat.');
          }

          const pdf = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }

          if (fullText.trim()) {
            if (graderAcuanInput) {
              graderAcuanInput.value = fullText;
              chrome.storage.sync.set({ graderAcuanInput: fullText });
            }
            showStatus('Teks soal berhasil dimuat sebagai acuan penilaian!', 'success', graderSoalStatus);
          } else {
            showStatus('Error: PDF tidak memiliki teks yang bisa diekstrak.', 'error', graderSoalStatus);
          }
        } catch (error) {
          console.error('Error parsing PDF:', error);
          showStatus('Gagal membaca PDF: ' + error.message, 'error', graderSoalStatus);
        }
      };
      reader.onerror = function () {
        showStatus('Gagal membaca berkas.', 'error', graderSoalStatus);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  // Handle clear button
  clearRAT.addEventListener('click', function () {
    deskripsiMataKuliah.value = '';
    capaianPembelajaran.value = '';
    updateRATContent();
    showStatus('RAT content cleared!', 'info', ratStatus);
  });

  // Handle paste from clipboard button
  pasteFromClipboard.addEventListener('click', async function () {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (clipboardText) {
        // Try to detect which field to paste to based on content
        if (clipboardText.toLowerCase().includes('deskripsi') || clipboardText.toLowerCase().includes('mata kuliah')) {
          deskripsiMataKuliah.value = clipboardText;
        } else if (clipboardText.toLowerCase().includes('capaian') || clipboardText.toLowerCase().includes('pembelajaran')) {
          capaianPembelajaran.value = clipboardText;
        } else {
          // If unclear, paste to the first empty field
          if (!deskripsiMataKuliah.value.trim()) {
            deskripsiMataKuliah.value = clipboardText;
          } else if (!capaianPembelajaran.value.trim()) {
            capaianPembelajaran.value = clipboardText;
          } else {
            // Both fields have content, ask user to choose
            showStatus('Both fields have content. Please paste manually to the desired field.', 'info', ratStatus);
            return;
          }
        }
        updateRATContent();
        showStatus('Content pasted successfully!', 'success', ratStatus);
      } else {
        showStatus('No content in clipboard', 'info', ratStatus);
      }
    } catch (error) {
      showStatus('Cannot access clipboard. Please paste manually (Ctrl+V)', 'error', ratStatus);
    }
  });

  function updateRATContent() {
    const deskripsi = deskripsiMataKuliah.value.trim();
    const capaian = capaianPembelajaran.value.trim();

    // Save to storage
    chrome.storage.sync.set({
      deskripsiMataKuliah: deskripsi,
      capaianPembelajaran: capaian
    });

    if (deskripsi || capaian) {
      ratText = '';
      if (deskripsi) {
        ratText += '=== DESKRIPSI SINGKAT MATA KULIAH ===\n' + deskripsi + '\n\n';
      }
      if (capaian) {
        ratText += '=== CAPAIAN PEMBELAJARAN MATA KULIAH ===\n' + capaian + '\n\n';
      }
      showStatus('RAT content updated!', 'success', ratStatus);
    } else {
      ratText = '';
      showStatus('RAT content cleared', 'info', ratStatus);
    }
  }



  // Function to update API key section visibility
  function updateApiKeySection() {
    const selectedModel = aiModelSelect.value;
    // Tampilkan selalu opsi custom API key sebagai fallback
    customApiKeySection.style.display = 'block';

    // Ubah placeholder untuk memperjelas
    if (selectedModel === 'auto' || selectedModel.startsWith('gemini')) {
      customApiKeyInput.placeholder = "Opsional: Isi Gemini API Key jika server error";
    } else {
      customApiKeyInput.placeholder = "Wajib: Masukkan API key Anda di sini";
    }
  }


  // Auto extract text function
  function autoExtractText() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || !tabs[0] || !tabs[0].url) return;

      const currentUrl = tabs[0].url;
      // Memastikan ekstensi hanya dijalankan di halaman e-learning UT
      if (!currentUrl.includes('elearning.ut.ac.id')) {
        showStatus('Mohon buka web e-learning UT terlebih dahulu.', 'info');
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: 'grabText' }, function (response) {
        if (chrome.runtime.lastError) {
          console.warn('Content script belum terhubung:', chrome.runtime.lastError.message);
          showStatus('Halaman belum termuat sepenuhnya. Silakan refresh halaman.', 'info');
          return;
        }

        if (response && response.success) {
          extractedText = response.text;
          extractedTextDiv.textContent = extractedText;
          extractedTextDiv.style.display = 'none';

          if (response.savedResponse) {
            aiResponseDiv.textContent = response.savedResponse;
            aiResponseContainer.style.display = 'block';
          }

          showStatus('Teks berhasil diekstrak otomatis!', 'success');
        } else {
          showStatus('Gagal mengekstrak teks: ' + (response?.error || 'Unknown error'), 'error');
        }
      });
    });
  }

  // Generate answer with AI
  generateAnswerBtn.addEventListener('click', async function () {
    if (!extractedText) {
      showStatus('No text extracted. Please refresh the page and try again.', 'error');
      return;
    }

    const selectedProvider = document.getElementById('aiProvider').value;
    const selectedModel = aiModelSelect.value;
    let apiKey = '';
    let actualModel = selectedModel;

    // Determine API key and model
    const manualKey = customApiKeyInput.value.trim();

    if (selectedProvider === 'google') {
      actualModel = selectedModel === 'auto' ? 'gemini-3.1-flash-lite-preview' : selectedModel;

      if (manualKey) {
        apiKey = manualKey;
      } else {
        try {
          apiKey = await getGeminiApiKey();
        } catch (error) {
          showStatus('Server indobelajar down (502). Masukkan Gemini API Key manual.', 'error');
          return;
        }
      }
    } else {
      // For non-Google models, we REQUIRE manual API key
      apiKey = manualKey;
      if (!apiKey) {
        showStatus('Please enter API key for ' + selectedModel, 'error');
        return;
      }
      actualModel = selectedModel;
    }

    loadingDiv.style.display = 'block';
    generateAnswerBtn.disabled = true;

    // Call AI API based on selected model
    callAIAPI(apiKey, actualModel, extractedText, selectedProvider)
      .then(response => {
        loadingDiv.style.display = 'none';
        generateAnswerBtn.disabled = false;

        if (response.success) {
          let finalAnswer = response.answer;
          
          // Purge em-dash character completely to prevent rendering errors
          finalAnswer = finalAnswer.replace(/—/g, '-');
          
          // 1. Coba cari tag <balasan> (prioritas utama)
          const balasanMatch = finalAnswer.match(/<balasan>([\s\S]*?)<\/balasan>/i);
          if (balasanMatch) {
            finalAnswer = balasanMatch[1].trim();
          } else {
            // 2. Jika tag XML gagal/tidak ada, coba potong berdasarkan pola "Final Text" atau "Revised Final" yang sering bocor dari CoT model
            const fallbackRegex = /\*(?:Final Text Construction|Revised Final|Final Polish|Final Version|Final Text|Balasan Akhir)[^:]*:\*?\s*([\s\S]*?)(?:$|\n\*)/i;
            const fallbackMatch = finalAnswer.match(fallbackRegex);
            if (fallbackMatch && fallbackMatch[1].trim().length > 0) {
              finalAnswer = fallbackMatch[1].trim();
            } else {
              // 3. Fallback kasar: ambil teks setelah blok "**" atau "*" terakhir jika sangat panjang
              const lastAsteriskSplit = finalAnswer.split(/\n\s*\*(?!\*)/); // Pisahkan berdasarkan bullet/asterisk di awal baris
              if (lastAsteriskSplit.length > 1) {
                  const possibleFinal = lastAsteriskSplit[lastAsteriskSplit.length - 1].trim();
                  // Asumsi teks akhir cukup panjang, bukan sekadar kalimat penutup evaluasi
                  if (possibleFinal.length > 100) {
                      finalAnswer = possibleFinal;
                  }
              }
            }
          }

          // 4. Final Aggressive Cleanup (Layer 4): 
          // Karena Prompt Rule #18 memaksa model memunculkan "Selamat pagi/siang/sore/malam",
          // Kita bisa memotong (trim) semua teks sampah yang bocor sebelum kata sapaan tersebut.
          const sapaanRegex = /(?:Halo.*?|Hai.*?)?Selamat (?:pagi|siang|sore|malam)/i;
          const sapaanMatch = finalAnswer.match(sapaanRegex);
          if (sapaanMatch) {
              const matchIndex = finalAnswer.indexOf(sapaanMatch[0]);
              // Jika sapaan ditemukan di bagian awal/tengah (bukan di akhir banget), potong semuanya sebelum sapaan
              if (matchIndex >= 0 && matchIndex < 500) {
                  finalAnswer = finalAnswer.substring(matchIndex).trim();
              }
          }

          // Bersihkan sisa-sisa asterisk atau kutipan di awal jika masih ada
          finalAnswer = finalAnswer.replace(/^["'*`\s]+/, '');

          aiResponseDiv.textContent = finalAnswer;
          aiResponseContainer.style.display = 'block';
          tryDifferentModelBtn.style.display = 'none';
          showStatus('Answer generated successfully!', 'success');

          // Simpan hasil ke content script agar bertahan jika popup ditutup
          chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, { action: 'saveResponse', text: finalAnswer });
            }
          });
        } else {
          showStatus('Error: ' + response.error, 'error');
          tryDifferentModelBtn.style.display = 'block';
        }
      })
      .catch(error => {
        loadingDiv.style.display = 'none';
        generateAnswerBtn.disabled = false;
        showStatus('Error: ' + error.message, 'error');
        tryDifferentModelBtn.style.display = 'block';
      });
  });

  // Copy response button
  copyResponseBtn.addEventListener('click', function () {
    const responseText = aiResponseDiv.textContent;
    if (responseText) {
      navigator.clipboard.writeText(responseText).then(function () {
        showStatus('Response copied to clipboard!', 'success');
        // Change button text temporarily
        const originalText = copyResponseBtn.textContent;
        copyResponseBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          copyResponseBtn.textContent = originalText;
        }, 2000);
      }).catch(function (err) {
        showStatus('Failed to copy: ' + err, 'error');
      });
    }
  });

  // Try different model button
  tryDifferentModelBtn.addEventListener('click', function () {
    const aiProviderSelect = document.getElementById('aiProvider');
    const currentProvider = aiProviderSelect ? aiProviderSelect.value : 'google';
    const options = modelOptions[currentProvider] || modelOptions['google'];
    const currentModel = aiModelSelect.value;
    const currentIndex = options.findIndex(opt => opt.value === currentModel);
    const nextIndex = (currentIndex + 1) % options.length;

    aiModelSelect.value = options[nextIndex].value;
    updateApiKeySection();
    showStatus(`Switched to ${options[nextIndex].label}`, 'info');

    // Save the new model selection
    chrome.storage.sync.set({ selectedModel: aiModelSelect.value });

    // Hide the button
    tryDifferentModelBtn.style.display = 'none';
  });


  // Helper function to show status messages
  function showStatus(message, type, targetElement = apiStatus) {
    targetElement.textContent = message;
    targetElement.className = 'status ' + type;
    targetElement.style.display = 'block';

    setTimeout(() => {
      targetElement.style.display = 'none';
    }, 3000);
  }

  // Function to call AI API based on selected provider and model
  async function callAIAPI(apiKey, model, text, provider = 'google', pdfBase64 = null, mimeType = 'application/pdf') {
    // Menentukan waktu berdasarkan jam komputer saat ini
    const hour = new Date().getHours();
    let waktuSekarang = "pagi";
    if (hour >= 10 && hour < 15) {
      waktuSekarang = "siang";
    } else if (hour >= 15 && hour < 18) {
      waktuSekarang = "sore";
    } else if (hour >= 18 || hour < 4) {
      waktuSekarang = "malam";
    }

    let prompt = `Anda adalah seorang dosen atau tutor yang membantu mahasiswa di forum diskusi UT. 

Teks berikut adalah postingan dari mahasiswa di forum:

${text}`;

    // Add RAT context if available
    if (ratText) {
      prompt += `\n\n=== RANCANGAN AKTIVITAS TUTORIAL (RAT) ===\n${ratText}`;
    }

    prompt += `\n\nBerikan respons yang:
1. Natural dan seperti ditulis manusia, bukan AI
2. Menggunakan bahasa Indonesia yang sederhana dan mudah dipahami
3. Ramah dan mendukung, seperti teman yang membantu
4. Tidak menggunakan format markdown atau bullet points
5. Menyebut "Tuton" bukan "Tutorial Online"
6. Menyebut "mahasiswa" bukan "mahasiswa baru"
7. Menghindari kata-kata seperti "sebagai asisten AI" atau "saya akan membantu"
8. Fokus pada isi postingan dan berikan saran yang relevan
9. Gunakan paragraf yang mengalir natural
10. Berikan tips praktis jika relevan
11. JANGAN menyebutkan atau menjelaskan tentang "Deskripsi Singkat Mata Kuliah" atau "Capaian Pembelajaran" dari RAT
12. Jika jawaban sudah sesuai dengan topik, tanggapi secara natural tanpa menjelaskan kesesuaiannya
13. EVALUASI REFERENSI AKADEMIK: Periksa apakah jawaban mahasiswa menyertakan referensi yang proper seperti:
    - Sumber bacaan (buku, jurnal, artikel ilmiah)
    - Format sitasi yang benar (penulis, judul, tahun, penerbit)
    - Contoh: "Menurut Smith (2020) dalam bukunya 'Algoritma Modern'..."
    - Atau: "Berdasarkan penelitian Johnson et al. (2019) yang diterbitkan di Journal of Computer Science..."
14. EVALUASI CONTOH IMPLEMENTASI: Periksa apakah ada contoh praktis atau implementasi nyata
15. Berikan saran untuk menambahkan referensi jika jawaban tidak memilikinya
16. Berikan feedback konstruktif untuk meningkatkan kualitas akademik jawaban
17. Di akhir, berikan semangat kepada mahasiswa tanpa membuat summary atau kesimpulan
18. PENTING: Waktu komputer saat ini adalah ${waktuSekarang}. Jika Anda mengawali atau membalas ucapan salam waktu (seperti selamat pagi/siang/sore/malam), Anda WAJIB menggunakan sapaan "Selamat ${waktuSekarang}", tanpa terpengaruh oleh salam waktu yang ditulis mahasiswa di postingannya.
19. SANGAT PENTING: JANGAN PERNAH memperkenalkan diri atau menggunakan teks *placeholder* seperti "[Nama Tutor/Dosen]". Nama akun Anda sudah otomatis terlihat di forum, jadi langsung saja masuk ke isi pembahasan dan jangan menuliskan nama pengirim di akhir pesan.
20. ATURAN FINAL SANGAT PENTING: Anda WAJIB membungkus hasil akhir teks balasan Anda secara eksklusif di dalam tag <balasan> dan </balasan>. Segala proses berpikir atau draf yang Anda buat harus berada di luar tag tersebut.
21. SANGAT PENTING: JANGAN SEKALI-KALI menggunakan karakter em-dash (—) di dalam seluruh teks balasan Anda. Selalu gunakan tanda hubung standar (-) jika diperlukan.

Tulis respons seperti teman yang sedang membantu di forum:`;

    try {
      if (provider === 'google') {
        return await callGoogleAPI(apiKey, model, prompt, pdfBase64, mimeType);
      } else if (provider === 'openai') {
        return await callOpenAIAPI(apiKey, model, prompt);
      } else if (provider === 'anthropic') {
        return await callAnthropicAPI(apiKey, model, prompt);
      } else if (provider === 'others') {
        return await callOthersAPI(apiKey, model, prompt);
      } else {
        return await callGoogleAPI(apiKey, model, prompt, pdfBase64, mimeType);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async function callGoogleAPI(apiKey, model, prompt, pdfBase64 = null, mimeType = 'application/pdf') {
    let modelName = model === 'auto' ? 'gemini-3.5-flash' : model;

    const parts = [];
    if (pdfBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: pdfBase64
        }
      });
    }
    parts.push({ text: prompt });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: parts }]
      })
    });

    if (!response.ok) {
      let errorMsg = `Google API Error (${response.status}): `;
      if (response.status === 404) errorMsg += `Model '${modelName}' tidak ditemukan (Not Found). Pastikan nama model sudah benar.`;
      else if (response.status === 403 || response.status === 400) errorMsg += `API Key tidak valid atau akses ditolak.`;
      else if (response.status === 429) errorMsg += `Limit kuota habis (Too Many Requests).`;
      else if (response.status === 503) errorMsg += `Server Google sedang sibuk/overload (Service Unavailable).`;
      else errorMsg += response.statusText;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return { success: true, answer: data.candidates[0].content.parts[0].text };
    } else {
      throw new Error('Invalid response format from Google API');
    }
  }

  async function callOpenAIAPI(apiKey, model, prompt) {
    let baseUrl = 'https://api.openai.com/v1/chat/completions';
    let extraHeaders = {};

    if (model.includes('/')) {
      baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
      extraHeaders = {
        'HTTP-Referer': 'https://elearning.ut.ac.id',
        'X-OpenRouter-Title': 'UT Assistant'
      };
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...extraHeaders
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      let errorMsg = `OpenAI API Error (${response.status}): `;
      if (response.status === 404) errorMsg += `Model '${model}' tidak tersedia.`;
      else if (response.status === 401 || response.status === 403) errorMsg += `API Key OpenAI salah atau tidak memiliki saldo.`;
      else if (response.status === 429) errorMsg += `Rate limit tercapai.`;
      else errorMsg += response.statusText;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return { success: true, answer: data.choices[0].message.content };
    } else {
      throw new Error('Invalid response format from OpenAI API');
    }
  }

  async function callAnthropicAPI(apiKey, model, prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerously-allow-custom-urls': 'true'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      let errorMsg = `Anthropic API Error (${response.status}): `;
      if (response.status === 404) errorMsg += `Model '${model}' tidak tersedia.`;
      else if (response.status === 401 || response.status === 403) errorMsg += `API Key Claude salah atau ditolak.`;
      else if (response.status === 429) errorMsg += `Rate limit tercapai.`;
      else errorMsg += response.statusText;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data.content && data.content[0] && data.content[0].text) {
      return { success: true, answer: data.content[0].text };
    } else {
      throw new Error('Invalid response format from Anthropic API');
    }
  }

  async function callOthersAPI(apiKey, model, prompt) {
    let baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
    let providerName = 'Groq';
    let extraHeaders = {};

    if (model.includes('/')) {
      baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
      providerName = 'OpenRouter';
      extraHeaders = {
        'HTTP-Referer': 'https://elearning.ut.ac.id',
        'X-OpenRouter-Title': 'UT Assistant'
      };
    } else if (model.includes('deepseek')) {
      baseUrl = 'https://api.deepseek.com/chat/completions';
      providerName = 'DeepSeek';
    } else if (model.includes('mistral')) {
      baseUrl = 'https://api.mistral.ai/v1/chat/completions';
      providerName = 'Mistral';
    } else if (model.includes('glm')) {
      baseUrl = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
      providerName = 'Zhipu AI';
    } else if (model.includes('qwen')) {
      baseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
      providerName = 'Alibaba DashScope';
    }

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        ...extraHeaders
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      let errorMsg = `${providerName} API Error (${response.status}): `;
      if (response.status === 404) errorMsg += `Model '${model}' tidak ditemukan di ${providerName}.`;
      else if (response.status === 401 || response.status === 403) errorMsg += `API Key Anda salah/ditolak.`;
      else if (response.status === 429) errorMsg += `Rate limit tercapai.`;
      else errorMsg += response.statusText;
      throw new Error(errorMsg);
    }

    const data = await response.json();
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return { success: true, answer: data.choices[0].message.content };
    } else {
      throw new Error('Invalid response format from API');
    }
  }

  // Tab Sheet switching functionality
  if (tabMain) {
    tabMain.addEventListener('click', function () {
      switchTabSheet('main');
    });
  }

  if (tabRat) {
    tabRat.addEventListener('click', function () {
      switchTabSheet('rat');
    });
  }

  if (tabPenilaian) {
    tabPenilaian.addEventListener('click', function () {
      switchTabSheet('penilaian');
    });
  }

  if (tabWebcam) {
    tabWebcam.addEventListener('click', function () {
      switchTabSheet('webcam');
    });
  }

  if (openRecorderBtn) {
    openRecorderBtn.addEventListener('click', function () {
      chrome.windows.create({ 
        url: 'recorder.html', 
        type: 'popup', 
        width: 850, 
        height: 850 
      });
    });
  }

  // PDF upload functionality
  if (pdfUpload) {
    pdfUpload.addEventListener('change', function (event) {
      handlePDFUpload(event);
    });
  }

  // PDF analysis functionality
  if (analyzePDFBtn) {
    analyzePDFBtn.addEventListener('click', function () {
      analyzeUploadedPDF();
    });
  }

  // Tab Sheet switching function
  function switchTabSheet(tabName) {
    console.log('Switching to tab sheet:', tabName);

    // Check if elements exist
    if (!tabMain || !tabPenilaian || !mainSheet || !penilaianSheet) {
      console.error('Tab sheet elements not found!');
      return;
    }

    // Remove active class from all tabs and sheets
    tabMain.classList.remove('active');
    if (tabRat) tabRat.classList.remove('active');
    tabPenilaian.classList.remove('active');
    if (tabWebcam) tabWebcam.classList.remove('active');
    mainSheet.classList.remove('active');
    if (ratSheet) ratSheet.classList.remove('active');
    penilaianSheet.classList.remove('active');
    if (webcamSheet) webcamSheet.classList.remove('active');

    // Add active class to selected tab and sheet
    if (tabName === 'main') {
      tabMain.classList.add('active');
      mainSheet.classList.add('active');
      console.log('Switched to main sheet');
    } else if (tabName === 'rat') {
      if (tabRat) tabRat.classList.add('active');
      if (ratSheet) ratSheet.classList.add('active');
      console.log('Switched to rat sheet');
    } else if (tabName === 'penilaian') {
      tabPenilaian.classList.add('active');
      penilaianSheet.classList.add('active');
      console.log('Switched to penilaian sheet');
      console.log('penilaianSheet display:', window.getComputedStyle(penilaianSheet).display);

      // Tab sheet switching successful
    } else if (tabName === 'webcam') {
      if (tabWebcam) tabWebcam.classList.add('active');
      if (webcamSheet) webcamSheet.classList.add('active');
      console.log('Switched to webcam sheet');
    }

    if (tabName === 'penilaian') {
      // Ensure text visibility in Penilaian Sheet
      const section = penilaianSheet.querySelector('.section');
      if (section) {
        // Apply text visibility fixes
        const h3 = section.querySelector('h3');
        const p = section.querySelector('p');
        const label = section.querySelector('label');

        if (h3) {
          h3.style.color = 'white';
          h3.style.fontSize = '16px';
          h3.style.fontWeight = 'bold';
        }

        if (p) {
          p.style.color = 'white';
          p.style.fontSize = '14px';
        }

        if (label) {
          label.style.color = 'white';
          label.style.fontSize = '12px';
        }

        console.log('Penilaian section found and styled:', section);
        console.log('Section innerHTML length:', section.innerHTML.length);
      } else {
        console.error('Section not found in penilaianSheet!');
        console.log('penilaianSheet innerHTML:', penilaianSheet.innerHTML);
      }
    }
  }

  // --- Moodle Grader Engine & Simulation Mode ---
  
  let isSimulationMode = true;
  let currentGraderData = null;
  
  // Default simulation data matching user profile and requirements
  const simulationData = {
    courseCode: 'STIK4111.12',
    assignmentName: 'Tugas.1',
    studentName: 'PRASTIANO NOER ADITYA',
    studentNim: '042070105',
    studentEmail: '042070105@ecampus.ut.ac.id',
    dueDate: '11 May 2026, 3:00 PM',
    currentGrade: '85',
    currentFeedback: '',
    submissionPdfName: 'Tugas 1 Dasar Pemrograman R Prastiano Noer Aditya.pdf',
    submissionPdfUrl: '',
    submissionPdfText: `TUGAS 1 - DASAR PEMROGRAMAN R
Nama: PRASTIANO NOER ADITYA
NIM: 042070105
Mata Kuliah: STIK4111.12

Jawaban Soal 1:
Dalam bahasa pemrograman R, struktur data vektor merupakan objek dasar yang menyimpan elemen-elemen dengan tipe data yang sama. Vektor dapat dibuat menggunakan fungsi c(). Contohnya, x <- c(1, 2, 3, 4, 5).

Jawaban Soal 2:
Analisis deskriptif menggunakan data frame df dilakukan dengan fungsi summary(df). Fungsi ini menampilkan nilai minimum, kuartil pertama, median, mean, kuartil ketiga, dan nilai maksimum untuk setiap kolom numerik.

Referensi:
1. Kabacoff, R. I. (2020). R in Action: Data Analysis and Graphics with R. Manning Publications.
2. Wickham, H., & Grolemund, G. (2017). R for Data Science. O'Reilly Media.`
  };

  // Load grader data to popup UI elements
  function loadGraderUI(data, isSimulated) {
    isSimulationMode = isSimulated;
    currentGraderData = data;
    
    // Update Badge
    if (graderModeBadge && graderModeDot && graderModeText) {
      if (isSimulated) {
        graderModeBadge.className = 'badgePremium simulated';
        graderModeDot.className = 'dotActive simulated';
        graderModeText.textContent = 'Mode Simulasi';
      } else {
        graderModeBadge.className = 'badgePremium';
        graderModeDot.className = 'dotActive';
        graderModeText.textContent = 'Moodle Grader';
      }
    }
    
    // Update texts
    if (graderCourseCode) graderCourseCode.textContent = data.courseCode || '-';
    if (graderStudentName) graderStudentName.textContent = data.studentName || '-';
    if (graderStudentNim) graderStudentNim.textContent = data.studentNim || '-';
    if (graderStudentEmail) graderStudentEmail.textContent = data.studentEmail || '-';
    if (graderDueDate) graderDueDate.textContent = data.dueDate || '-';
    if (graderAssignName) graderAssignName.textContent = data.assignmentName || '-';
    
    // PDF Info
    if (graderPdfName) {
      graderPdfName.textContent = data.submissionPdfName || 'Tidak ada file PDF terlampir';
    }
    if (graderPdfSize) {
      graderPdfSize.textContent = data.submissionPdfName ? '' : '';
    }

    // CloudConvert .pages / .docx detection
    const fileName = (data.submissionPdfName || '').toLowerCase();
    const isConvertible = fileName.endsWith('.pages') || fileName.endsWith('.docx');
    if (graderConvertPanel) {
      if (isConvertible && data.submissionPdfUrl) {
        graderConvertPanel.style.display = 'block';
        // Compute MD5 hash of the file in background
        computeFileMd5(data.submissionPdfUrl);
      } else {
        graderConvertPanel.style.display = 'none';
        if (graderMd5Display) graderMd5Display.value = '-';
      }
    }
    
    // Inputs
    if (graderScoreInput) graderScoreInput.value = data.currentGrade || '0';
    if (graderFeedbackInput) {
      const studentName = data.studentName || 'Mahasiswa';
      graderFeedbackInput.value = data.currentFeedback || `Halo, ${studentName}`;
    }
  }

  // CloudConvert: compute MD5 hash of remote file binary
  async function computeFileMd5(url) {
    if (graderMd5Display) {
      graderMd5Display.value = 'Menghitung...';
    }
    try {
      const res = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'backgroundFetchBinary', url: url }, resolve);
      });
      if (!res || !res.success) throw new Error(res?.error || 'Gagal mengunduh berkas');

      // Decode base64 to binary string
      const binaryString = atob(res.base64);

      // Compute MD5 via robust pure JS
      const md5 = computeMD5(binaryString);
      if (graderMd5Display) graderMd5Display.value = md5;

      // Store the base64 for later conversion
      graderConvertPanel._pagesBase64 = res.base64;
      graderConvertPanel._pagesUrl = url;
    } catch (err) {
      if (graderMd5Display) graderMd5Display.value = 'Gagal: ' + err.message;
    }
  }

  // ─── Pure-JS MD5 implementation (RFC 1321) ──────────────────────────────────
  function computeMD5(string) {
    function md5cycle(x, k) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586); c = ff(c, d, a, b, k[2], 17,  606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12,  1200080426); c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7,  1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417); c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7,  1804603682); d = ff(d, a, b, c, k[13], 12, -40341101); c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22,  1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632); c = gg(c, d, a, b, k[11], 14,  643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9,  38016083); c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5,  568446438); d = gg(d, a, b, c, k[14], 9, -1019803690); c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20,  1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784); c = gg(c, d, a, b, k[7], 14,  1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463); c = hh(c, d, a, b, k[11], 16,  1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11,  1272893353); c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4,  681279174); d = hh(d, a, b, c, k[0], 11, -358537222); c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23,  76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835); c = hh(c, d, a, b, k[15], 16,  530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10,  1126891415); c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6,  1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606); c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6,  1873313359); d = ii(d, a, b, c, k[15], 10, -30611744); c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21,  1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379); c = ii(c, d, a, b, k[2], 15,  718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
    function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
    
    var n = string.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= string.length; i += 64) {
      var k = [];
      for (let j = 0; j < 64; j += 4) {
        k.push((string.charCodeAt(i - 64 + j) & 0xFF) | ((string.charCodeAt(i - 64 + j + 1) & 0xFF) << 8) | ((string.charCodeAt(i - 64 + j + 2) & 0xFF) << 16) | ((string.charCodeAt(i - 64 + j + 3) & 0xFF) << 24));
      }
      md5cycle(state, k);
    }
    string = string.substring(i - 64);
    var tail = [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0];
    for (i = 0; i < string.length; i++) tail[i >> 2] |= (string.charCodeAt(i) & 0xFF) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    var hex = '';
    for (i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        hex += ((state[i] >> (j * 8)) & 0xFF).toString(16).padStart(2, '0');
      }
    }
    return hex;
  }

  // CloudConvert .pages -> PDF conversion (all API calls run via background.js)
  async function convertPagesFileToPdf() {
    const base64 = graderConvertPanel._pagesBase64;
    const pagesFilename = (currentGraderData && currentGraderData.submissionPdfName) || 'tugas.pages';

    if (!base64) {
      showStatus('Berkas .pages belum siap. Tunggu sebentar atau coba Ambil Ulang.', 'error', graderConvertStatus || graderStatus);
      return null;
    }

    return new Promise((resolve) => {
      chrome.storage.sync.get(['cloudconvertKeySandbox', 'cloudconvertApiSandbox'], (keys) => {
        const apiKey = keys.cloudconvertKeySandbox;
        // Strip trailing dots and slashes that may come from .env value
        const apiBase = (keys.cloudconvertApiSandbox || 'https://api.sandbox.cloudconvert.com')
          .trim().replace(/[./]+$/, '');

        if (!apiKey) {
          showStatus('CloudConvert API Key tidak ditemukan di .env', 'error', graderConvertStatus || graderStatus);
          resolve(null);
          return;
        }

        if (graderConvertBtn) graderConvertBtn.disabled = true;
        showStatus('Mengirim ke CloudConvert... (proses 30-60 detik)', 'info', graderConvertStatus || graderStatus);

        // Delegate ENTIRE workflow to background.js service worker
        // (popup context cannot make cross-origin fetch to CloudConvert)
        chrome.runtime.sendMessage({
          action: 'cloudconvertConvert',
          apiKey: apiKey,
          apiBase: apiBase,
          base64: base64,
          filename: pagesFilename
        }, (res) => {
          if (graderConvertBtn) graderConvertBtn.disabled = false;

          if (!res || !res.success) {
            const errMsg = res ? res.error : 'Tidak ada respons dari background worker';
            showStatus('Gagal konversi: ' + errMsg, 'error', graderConvertStatus || graderStatus);
            resolve(null);
            return;
          }

          showStatus('Konversi selesai! File PDF siap dievaluasi.', 'success', graderConvertStatus || graderStatus);

          // Store the converted PDF base64 into graderData so evaluation picks it up
          if (currentGraderData) {
            currentGraderData.submissionPdfName = pagesFilename.replace(/\.(pages|docx)$/i, '.pdf');
            currentGraderData._convertedPdfBase64 = res.base64;
          }
          if (graderPdfName) graderPdfName.textContent = pagesFilename.replace(/\.(pages|docx)$/i, '.pdf') + ' (terkonversi)';
          if (graderConvertPanel) graderConvertPanel.style.display = 'none';

          resolve(res.base64);
        });
      });
    });
  }


  // Handle Convert Button Click
  if (graderConvertBtn) {
    graderConvertBtn.addEventListener('click', async function () {
      await convertPagesFileToPdf();
    });
  }

  // Handle MD5 Copy Button Click
  if (graderMd5CopyBtn) {
    graderMd5CopyBtn.addEventListener('click', function () {
      const md5 = graderMd5Display ? graderMd5Display.value.trim() : '';
      if (md5 && md5 !== '-' && !md5.startsWith('Gagal') && !md5.startsWith('Menghi')) {
        navigator.clipboard.writeText(md5).then(() => {
          const orig = graderMd5CopyBtn.textContent;
          graderMd5CopyBtn.textContent = '✅ Disalin!';
          setTimeout(() => { graderMd5CopyBtn.textContent = orig; }, 2000);
        }).catch(() => {
          showStatus('Gagal menyalin ke clipboard.', 'error', graderStatus);
        });
      } else {
        showStatus('MD5 belum siap. Tunggu proses hash selesai.', 'info', graderStatus);
      }
    });
  }

  // Scrape page or fallback to Simulation
  function autoLoadGraderInfo() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || !tabs[0] || !tabs[0].url) {
        loadGraderUI(simulationData, true);
        return;
      }
      
      const url = tabs[0].url;
      // Check if it's Moodle grader page
      const isGraderPage = url.includes('elearning.ut.ac.id') && url.includes('action=grader');
      if (isGraderPage) {
        showStatus('Membaca halaman Moodle...', 'info', graderStatus);
        chrome.tabs.sendMessage(tabs[0].id, { action: 'grabGraderInfo' }, function (response) {
          if (chrome.runtime.lastError || !response || !response.success) {
            console.log('Failing back to simulation mode');
            loadGraderUI(simulationData, true);
          } else {
            console.log('Successfully grabbed Moodle Grader info:', response.info);
            // If scraped data is mostly empty, use simulation fallback
            if (!response.info.studentName) {
              loadGraderUI(simulationData, true);
            } else {
              loadGraderUI(response.info, false);
              showStatus('Data Moodle berhasil dimuat!', 'success', graderStatus);
            }
          }
        });
      } else {
        console.log('Not on grader page. Activating Simulation Mode.');
        loadGraderUI(simulationData, true);
      }
    });
  }

  // Handle reload button click
  if (graderGrabBtn) {
    graderGrabBtn.addEventListener('click', function () {
      setFeedbackFieldsDisabled(false);
      autoLoadGraderInfo();
    });
  }

  // Converter function: plain text / markdown to clean HTML paragraphs
  function convertFeedbackToHtml(text) {
    if (!text) return '';
    
    // Split into paragraphs by double newlines
    let paragraphs = text.split(/\n\n+/);
    let htmlParagraphs = paragraphs.map(p => {
      let trimmed = p.trim();
      if (!trimmed) return '';
      
      // Convert single newlines inside paragraph to <br>
      let formatted = trimmed.replace(/\n/g, '<br>');
      
      // Convert Markdown **bold** to <strong>bold</strong>
      formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      
      // Convert Markdown *italic* to <em>italic</em>
      formatted = formatted.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      
      // Convert basic Markdown list items starting with "-" or "*"
      if (formatted.startsWith('- ') || formatted.startsWith('* ')) {
        let items = formatted.split(/(?:\r?\n|^- |^\* )+/m);
        items = items.map(item => item.trim()).filter(Boolean);
        let listHtml = '<ul>' + items.map(item => `<li>${item}</li>`).join('') + '</ul>';
        return listHtml;
      }
      
      return `<p>${formatted}</p>`;
    }).filter(Boolean);
    
    return htmlParagraphs.join('\n');
  }

  // Handle Copy HTML Button Click
  if (graderCopyHtmlBtn) {
    graderCopyHtmlBtn.addEventListener('click', function () {
      const feedbackText = graderFeedbackInput.value.trim();
      const htmlFeedback = convertFeedbackToHtml(feedbackText);
      
      if (htmlFeedback) {
        navigator.clipboard.writeText(htmlFeedback).then(function () {
          showStatus('HTML copied to clipboard!', 'success', graderStatus);
          const originalText = graderCopyHtmlBtn.textContent;
          graderCopyHtmlBtn.textContent = '✅ Copied!';
          setTimeout(() => {
            graderCopyHtmlBtn.textContent = originalText;
          }, 2000);
        }).catch(function (err) {
          showStatus('Failed to copy HTML: ' + err, 'error', graderStatus);
        });
      } else {
        showStatus('Umpan balik kosong!', 'error', graderStatus);
      }
    });
  }

  // Handle Moodle Synchronization (Plain / Text-to-HTML conversion)
  if (graderSyncBtn) {
    graderSyncBtn.addEventListener('click', function () {
      const grade = graderScoreInput.value.trim();
      const feedback = graderFeedbackInput.value.trim();
      
      if (!grade) {
        showStatus('Harap masukkan nilai terlebih dahulu!', 'error', graderStatus);
        return;
      }
      
      if (isSimulationMode) {
        showStatus('Simulasi: Nilai & Feedback disinkronkan ke Moodle!', 'success', graderStatus);
        return;
      }
      
      showStatus('Mengirim data penilaian ke Moodle...', 'info', graderStatus);
      graderSyncBtn.disabled = true;
      
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'syncGraderInfo', 
          grade: grade, 
          feedback: feedback,
          isHtml: false
        }, function (response) {
          graderSyncBtn.disabled = false;
          
          if (chrome.runtime.lastError || !response) {
            showStatus('Gagal terhubung dengan Moodle. Silakan refresh halaman.', 'error', graderStatus);
          } else if (response.success) {
            showStatus('Sukses sinkronisasi ke Moodle!', 'success', graderStatus);
            const originalText = graderSyncBtn.innerHTML;
            graderSyncBtn.innerHTML = '✅ Berhasil Disinkronkan!';
            setTimeout(() => {
              graderSyncBtn.innerHTML = originalText;
            }, 2000);
          } else {
            showStatus('Gagal: ' + response.error, 'error', graderStatus);
          }
        });
      });
    });
  }

  // Handle Moodle Synchronization (Direct HTML Mode)
  if (graderSyncHtmlBtn) {
    graderSyncHtmlBtn.addEventListener('click', function () {
      const grade = graderScoreInput.value.trim();
      const feedbackText = graderFeedbackInput.value.trim();
      const htmlFeedback = convertFeedbackToHtml(feedbackText);
      
      if (!grade) {
        showStatus('Harap masukkan nilai terlebih dahulu!', 'error', graderStatus);
        return;
      }
      
      if (isSimulationMode) {
        showStatus('Simulasi: Nilai & Feedback HTML disinkronkan ke Moodle!', 'success', graderStatus);
        return;
      }
      
      showStatus('Mengirim data penilaian HTML ke Moodle...', 'info', graderStatus);
      graderSyncHtmlBtn.disabled = true;
      
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'syncGraderInfo', 
          grade: grade, 
          feedback: htmlFeedback,
          isHtml: true
        }, function (response) {
          graderSyncHtmlBtn.disabled = false;
          
          if (chrome.runtime.lastError || !response) {
            showStatus('Gagal terhubung dengan Moodle. Silakan refresh halaman.', 'error', graderStatus);
          } else if (response.success) {
            showStatus('Sukses sinkronisasi HTML ke Moodle!', 'success', graderStatus);
            const originalText = graderSyncHtmlBtn.innerHTML;
            graderSyncHtmlBtn.innerHTML = '✅ Berhasil Disinkronkan!';
            setTimeout(() => {
              graderSyncHtmlBtn.innerHTML = originalText;
            }, 2000);
          } else {
            showStatus('Gagal: ' + response.error, 'error', graderStatus);
          }
        });
      });
    });
  }

  // Handle AI analysis
  if (graderAnalyzeBtn) {
    graderAnalyzeBtn.addEventListener('click', async function () {
      const selectedProvider = aiProviderSelect.value;
      const selectedModel = aiModelSelect.value;
      let apiKey = '';
      let actualModel = selectedModel;
      
      const manualKey = customApiKeyInput.value.trim();
      
      if (selectedProvider === 'google') {
        actualModel = selectedModel === 'auto' ? 'gemini-3.1-flash-lite-preview' : selectedModel;
        if (manualKey) {
          apiKey = manualKey;
        } else {
          try {
            apiKey = await getGeminiApiKey();
          } catch (error) {
            showStatus('Server down (502). Masukkan Gemini API Key manual.', 'error', graderStatus);
            return;
          }
        }
      } else {
        apiKey = manualKey;
        if (!apiKey) {
          showStatus('Masukkan API Key manual untuk model non-Google.', 'error', graderStatus);
          return;
        }
        actualModel = selectedModel;
      }
      
      // Enable feedback inputs immediately when they request an evaluation
      setFeedbackFieldsDisabled(false);
      
      // Toggle Loader states
      showStatus('Menganalisis jawaban mahasiswa...', 'info', graderStatus);
      graderAnalyzeBtn.disabled = true;
      if (graderGrabBtn) graderGrabBtn.disabled = true;
      if (graderLoading) graderLoading.style.display = 'block';
      
      let textToAnalyze = '';
      let pdfBase64 = null;
      let fileMimeType = 'application/pdf';
      if (isSimulationMode) {
        textToAnalyze = simulationData.submissionPdfText;
      } else if (currentGraderData && currentGraderData._convertedPdfBase64) {
        // Use already-converted PDF (e.g. from .pages CloudConvert flow)
        pdfBase64 = currentGraderData._convertedPdfBase64;
        textToAnalyze = 'Tugas mahasiswa telah dikonversi dari format .pages ke PDF. Periksa lampiran dokumen PDF untuk evaluasi lengkap.';
        fileMimeType = 'application/pdf';
      } else {
        if (currentGraderData && currentGraderData.submissionPdfUrl) {
          const isPdf = (currentGraderData.submissionPdfName || '').toLowerCase().includes('.pdf');
          showStatus(isPdf ? 'Mengekstrak PDF tugas dari Moodle...' : 'Membaca berkas tugas dari Moodle...', 'info', graderStatus);
          try {
            const extractResponse = await new Promise((resolve, reject) => {
              chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { 
                  action: 'extractPDFText', 
                  url: currentGraderData.submissionPdfUrl,
                  filename: currentGraderData.submissionPdfName
                }, function (res) {
                  if (chrome.runtime.lastError || !res) {
                    reject(new Error(chrome.runtime.lastError?.message || 'Gagal mengekstrak berkas'));
                  } else {
                    resolve(res);
                  }
                });
              });
            });
            
            if (extractResponse.success) {
              textToAnalyze = extractResponse.text;
              pdfBase64 = extractResponse.base64 || null;
              if (extractResponse.mimeType) fileMimeType = extractResponse.mimeType;
            } else {
              throw new Error(extractResponse.error || 'Gagal mengekstrak text PDF');
            }
          } catch (e) {
            console.error(e);
            if (extractedText && extractedText.trim()) {
              showStatus('Gagal ekstrak PDF. Menggunakan teks halaman Moodle...', 'warning', graderStatus);
              textToAnalyze = extractedText;
            } else {
              showStatus('Gagal ekstrak PDF otomatis. Silakan lakukan evaluasi manual.', 'error', graderStatus);
              graderAnalyzeBtn.disabled = false;
              if (graderGrabBtn) graderGrabBtn.disabled = false;
              if (graderLoading) graderLoading.style.display = 'none';
              return;
            }
          }
        } else {
          textToAnalyze = extractedText || 'Tidak ada teks tugas yang terdeteksi.';
        }
      }
      
      callGraderAI(apiKey, actualModel, textToAnalyze, selectedProvider, pdfBase64, fileMimeType)
        .then(response => {
          graderAnalyzeBtn.disabled = false;
          if (graderGrabBtn) graderGrabBtn.disabled = false;
          if (graderLoading) graderLoading.style.display = 'none';
          
          if (response.success) {
            let finalOutput = response.answer;
            
            // Clean XML and process the result
            let cleanResponse = finalOutput;
            const balasanMatch = finalOutput.match(/<balasan>([\s\S]*?)<\/balasan>/i);
            if (balasanMatch) {
              cleanResponse = balasanMatch[1].trim();
            }
            
            // Purge em-dash character completely to prevent rendering errors
            cleanResponse = cleanResponse.replace(/—/g, '-');
            
            // Parse out score and feedback
            const gradeMatch = cleanResponse.match(/\[NILAI\]\s*(\d+)/i) || cleanResponse.match(/Nilai:\s*(\d+)/i) || cleanResponse.match(/Score:\s*(\d+)/i);
            let score = 85;
            if (gradeMatch) {
              score = parseInt(gradeMatch[1].trim(), 10);
            }
            
            let feedback = cleanResponse.replace(/\[NILAI\]\s*\d+/i, '').trim();
            feedback = feedback.replace(/Nilai:\s*\d+/i, '').trim();
            feedback = feedback.replace(/^["'*`\s]+/, '');
            
            if (graderScoreInput) graderScoreInput.value = score;
            if (graderFeedbackInput) graderFeedbackInput.value = feedback;
            
            showStatus('Evaluasi AI selesai!', 'success', graderStatus);
          } else {
            showStatus('Gagal: ' + response.error, 'error', graderStatus);
          }
        })
        .catch(error => {
          graderAnalyzeBtn.disabled = false;
          if (graderGrabBtn) graderGrabBtn.disabled = false;
          if (graderLoading) graderLoading.style.display = 'none';
          showStatus('Error: ' + error.message, 'error', graderStatus);
        });
    });
  }

  async function callGraderAI(apiKey, model, submissionText, provider = 'google', pdfBase64 = null, mimeType = 'application/pdf') {
    const hour = new Date().getHours();
    let waktuSekarang = "pagi";
    if (hour >= 10 && hour < 15) {
      waktuSekarang = "siang";
    } else if (hour >= 15 && hour < 18) {
      waktuSekarang = "sore";
    } else if (hour >= 18 || hour < 4) {
      waktuSekarang = "malam";
    }

    let prompt = `Anda adalah seorang Dosen/Tutor Universitas Terbuka yang sangat profesional, ramah, dan teliti dalam memberikan penilaian dan umpan balik tugas mahasiswa.

Silakan evaluasi tugas mahasiswa berikut ini:

=== NAMA MAHASISWA ===
${currentGraderData ? currentGraderData.studentName : 'PRASTIANO NOER ADITYA'}

=== TUGAS MAHASISWA ===
${submissionText}`;

    // Jika file PDF biner tersedia, instruksikan Gemini secara eksplisit untuk membaca dokumen asli secara visual
    if (pdfBase64 && provider === 'google') {
      prompt += `\n\n=== INFORMASI DOKUMEN VISUAL (SANGAT PENTING) ===
Dokumen asli tugas mahasiswa terlampir langsung sebagai dokumen PDF biner. Selain membaca teks hasil ekstraksi di atas, Anda WAJIB memeriksa lampiran dokumen PDF asli tersebut secara visual untuk membaca, menganalisis, dan mengevaluasi elemen-elemen grafis seperti tangkapan layar (screenshots) running program R/RStudio, grafik, chart, diagram, tabel dalam bentuk gambar, rumus matematika, atau teks/tulisan tangan yang tidak dapat diekstraksi ke teks biasa. Berikan penilaian berdasarkan seluruh konten visual dan tekstual tersebut.`;
    }

    if (ratText) {
      prompt += `\n\n=== RANCANGAN AKTIVITAS TUTORIAL (RAT) ===\n${ratText}`;
    }

    // Ambil acuan kriteria penilaian (rubrik) dari input
    const acuanKriteria = graderAcuanInput ? graderAcuanInput.value.trim() : '';
    if (acuanKriteria) {
      prompt += `\n\n=== ACUAN PENILAIAN / RUBRIK TUGAS ===\n${acuanKriteria}\n\nSANGAT PENTING: Anda WAJIB mematuhi seluruh instruksi khusus di dalam 'ACUAN PENILAIAN / RUBRIK TUGAS' di atas dengan prioritas tertinggi! Jika terdapat pelanggaran akademik (plagiarisme, pola bahasa AI, atau penggunaan bahasa non-R) sebagaimana diuraikan dalam rubrik, berikan nilai [NILAI] 0 beserta uraian bukti deteksi pelanggaran yang sangat jelas dan terperinci.`;
      
      if (ratText) {
        prompt += `\n\nSelain mematuhi rubrik tugas, Anda juga WAJIB menyelaraskan seluruh evaluasi dan umpan balik Anda agar sesuai dengan Capaian Pembelajaran (CPMK) dan Deskripsi Mata Kuliah yang tercantum di dalam RANCANGAN AKTIVITAS TUTORIAL (RAT) di atas.`;
      }
    } else if (ratText) {
      prompt += `\n\n=== ACUAN PENILAIAN / RUBRIK TUGAS ===\nEvaluasilah tugas mahasiswa berdasarkan Capaian Pembelajaran (CPMK) dan Deskripsi Mata Kuliah yang tercantum di dalam RANCANGAN AKTIVITAS TUTORIAL (RAT) di atas.`;
    }

    prompt += `\n\nBerikan evaluasi yang memenuhi kriteria berikut:
1. Berikan nilai numerik (0-100) berdasarkan kualitas akademis, akurasi jawaban, orisinalitas, dan pemahaman materi. Tuliskan nilai tersebut di awal dengan format [NILAI] <skor> (Contoh: [NILAI] 85).
2. Tulis catatan umpan balik yang terstruktur, ramah, konstruktif, dan memotivasi mahasiswa.
3. Sebutkan nama mahasiswa secara sopan dan ramah di awal (Contoh: "Selamat ${waktuSekarang} Prastiano, ...").
4. Evaluasi apakah mahasiswa menyertakan referensi/sitasi akademik yang proper. Berikan saran perbaikan referensi jika belum ada.
5. Sebutkan kelebihan tugas mereka serta area spesifik yang perlu ditingkatkan secara akademis.
6. Gunakan bahasa Indonesia yang mengalir natural, tanpa bullet points berlebihan, ramah, layaknya asisten dosen sejati.
7. JANGAN PERNAH menyertakan proses berpikir, draf evaluasi, atau tag XML di dalam tag <balasan>.
8. Anda WAJIB membungkus hasil akhir (termasuk tag [NILAI] dan teks evaluasi) secara eksklusif di dalam tag <balasan> dan </balasan>.
9. SANGAT PENTING: JANGAN SEKALI-KALI menggunakan karakter em-dash (—) di dalam seluruh teks umpan balik atau nilai. Selalu gunakan tanda hubung standar (-) jika diperlukan.

Format balasan Anda harus seperti ini:
<balasan>
[NILAI] 85
Selamat ${waktuSekarang} Prastiano, terima kasih atas tugas yang telah dikirimkan. ...
</balasan>

Tulis evaluasi Anda secara profesional:`;

    return await callAIAPI(apiKey, model, prompt, provider, pdfBase64, mimeType);
  }
});

