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
  const pdfUpload = document.getElementById('pdfUpload');
  const pdfStatus = document.getElementById('pdfStatus');
  const pdfInfo = document.getElementById('pdfInfo');
  const pdfFileName = document.getElementById('pdfFileName');
  const pdfFileSize = document.getElementById('pdfFileSize');
  const pdfAnalysis = document.getElementById('pdfAnalysis');
  const pdfResults = document.getElementById('pdfResults');
  const analyzePDFBtn = document.getElementById('analyzePDF');

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
      { value: 'auto', label: 'Auto (Gemini 3.1 Flash Lite)' },
      { value: 'gemini-3.1-flash-preview', label: 'Gemini 3.1 Flash' },
      { value: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite' },
      { value: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro' }
    ],
    openai: [
      { value: 'gpt-4o', label: 'GPT-4o' },
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
      { value: 'gpt-5.4', label: 'GPT-5.4' },
      { value: 'gpt-5.4-mini', label: 'GPT-5.4 Mini' },
      { value: 'gpt-5.4-pro', label: 'GPT-5.4 Pro' },
      { value: 'openai/gpt-oss-120b:free', label: 'GPT-OSS-120B (by OpenRouter)' }
    ],
    anthropic: [
      { value: 'claude-haiku-4.5', label: 'Claude Haiku 4.5' },
      { value: 'claude-opus-4.6', label: 'Claude Opus 4.6' },
      { value: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5' }
    ],
    others: [
      { value: 'deepseek-r1', label: 'DeepSeek-R1' },
      { value: 'deepseek-v3', label: 'DeepSeek-V3' },
      { value: 'z-ai/glm-4.5-air:free', label: 'GLM 4.5 Air (by OpenRouter)' },
      { value: 'glm-5', label: 'GLM-5' },
      { value: 'inclusionai/ling-2.6-flash:free', label: 'Ling-2.6-flash (by OpenRouter)' },
      { value: 'llama-3.3', label: 'Llama 3.3' },
      { value: 'llama-4-maverick', label: 'Llama 4 (Maverick)' },
      { value: 'minimax/minimax-m2.5:free', label: 'MiniMax M2.5 (by OpenRouter)' },
      { value: 'mistral-large-3', label: 'Mistral Large 3' },
      { value: 'qwen-3.5', label: 'Qwen 3.5' }
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

  // Load saved settings
  chrome.storage.sync.get(['selectedProvider', 'selectedModel', 'customApiKey', 'deskripsiMataKuliah', 'capaianPembelajaran'], function (result) {
    const defaultProvider = result.selectedProvider || 'google';
    if (aiProviderSelect) aiProviderSelect.value = defaultProvider;

    updateModelList(defaultProvider);

    if (result.selectedModel) {
      aiModelSelect.value = result.selectedModel;
    } else {
      aiModelSelect.value = 'auto'; // Default to auto
    }
    if (result.customApiKey) {
      customApiKeyInput.value = result.customApiKey;
    }
    if (result.deskripsiMataKuliah) {
      deskripsiMataKuliah.value = result.deskripsiMataKuliah;
    }
    if (result.capaianPembelajaran) {
      capaianPembelajaran.value = result.capaianPembelajaran;
    }
    updateApiKeySection();
    updateRATContent(); // Update RAT content after loading
  });

  // Auto extract text when popup opens
  autoExtractText();

  // Handle provider selection change
  if (aiProviderSelect) {
    aiProviderSelect.addEventListener('change', function () {
      updateModelList(this.value);
      aiModelSelect.value = modelOptions[this.value][0].value;
      updateApiKeySection();
      chrome.storage.sync.set({ selectedProvider: this.value, selectedModel: aiModelSelect.value });
    });
  }

  // Handle model selection change
  if (aiModelSelect) {
    aiModelSelect.addEventListener('change', function () {
      updateApiKeySection();
      chrome.storage.sync.set({ selectedModel: aiModelSelect.value });
    });
  }

  // Handle custom API key input
  customApiKeyInput.addEventListener('input', function () {
    chrome.storage.sync.set({ customApiKey: customApiKeyInput.value });
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
  async function callAIAPI(apiKey, model, text, provider = 'google') {
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

Tulis respons seperti teman yang sedang membantu di forum:`;

    try {
      if (provider === 'google') {
        return await callGoogleAPI(apiKey, model, prompt);
      } else if (provider === 'openai') {
        return await callOpenAIAPI(apiKey, model, prompt);
      } else if (provider === 'anthropic') {
        return await callAnthropicAPI(apiKey, model, prompt);
      } else if (provider === 'others') {
        return await callOthersAPI(apiKey, model, prompt);
      } else {
        return await callGoogleAPI(apiKey, model, prompt);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // API Fetch implementation based on provider
  async function callGoogleAPI(apiKey, model, prompt) {
    let modelName = model === 'auto' ? 'gemini-3.1-flash-lite-preview' : model;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
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

  // PDF upload handling function
  async function handlePDFUpload(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== 'application/pdf') {
      showStatus('Please select a PDF file', 'error', pdfStatus);
      return;
    }

    try {
      showStatus('Processing PDF file...', 'info', pdfStatus);

      // Store file info
      uploadedPDF = {
        file: file,
        name: file.name,
        size: file.size,
        text: null
      };

      // Display file info
      displayPDFInfo();

      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      uploadedPDF.text = text;

      showStatus('PDF processed successfully!', 'success', pdfStatus);
      pdfAnalysis.style.display = 'block';

    } catch (error) {
      console.error('Error processing PDF:', error);
      showStatus('Error processing PDF: ' + error.message, 'error', pdfStatus);
    }
  }

  // Display PDF info
  function displayPDFInfo() {
    if (!uploadedPDF) {
      pdfInfo.style.display = 'none';
      return;
    }

    pdfFileName.textContent = uploadedPDF.name;
    pdfFileSize.textContent = `Size: ${formatFileSize(uploadedPDF.size)}`;
    pdfInfo.style.display = 'block';
  }

  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Extract text from uploaded PDF
  async function extractTextFromPDF(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async function (e) {
        try {
          const arrayBuffer = e.target.result;

          // Load PDF.js library if not already loaded
          if (!window.pdfjsLib) {
            await loadPDFJS();
          }

          // Load PDF using PDF.js
          const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
          console.log('PDF loaded, pages:', pdf.numPages);

          let fullText = '';

          // Iterate through each page to extract text
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }

          resolve(fullText);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = function () {
        reject(new Error('Failed to read PDF file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  // Analyze uploaded PDF
  async function analyzeUploadedPDF() {
    if (!uploadedPDF || !uploadedPDF.text) {
      showStatus('Please upload a PDF file first', 'error', pdfStatus);
      return;
    }

    try {
      showStatus('Analyzing PDF...', 'info', pdfStatus);
      analyzePDFBtn.disabled = true;

      const selectedModel = aiModelSelect.value;
      let apiKey = '';
      let actualModel = selectedModel;

      // Determine API key and model
      if (selectedModel === 'auto') {
        try {
          apiKey = await getGeminiApiKey();
          actualModel = 'gemini-2.5-flash';
        } catch (error) {
          showStatus('Failed to get API key from server: ' + error.message, 'error', pdfStatus);
          return;
        }
      } else if (selectedModel.startsWith('gemini')) {
        try {
          apiKey = await getGeminiApiKey();
          actualModel = selectedModel;
        } catch (error) {
          showStatus('Failed to get API key from server: ' + error.message, 'error', pdfStatus);
          return;
        }
      } else {
        apiKey = customApiKeyInput.value.trim();
        if (!apiKey) {
          showStatus('Please enter API key for ' + selectedModel, 'error', pdfStatus);
          return;
        }
        actualModel = selectedModel;
      }

      // Analyze the uploaded PDF
      pdfResults.innerHTML = '';
      const analysis = await analyzePDFContent(apiKey, actualModel, uploadedPDF);
      displayPDFAnalysis(uploadedPDF, analysis);

      showStatus('Analysis completed!', 'success', pdfStatus);
    } catch (error) {
      showStatus('Error: ' + error.message, 'error', pdfStatus);
    } finally {
      analyzePDFBtn.disabled = false;
    }
  }

  // Analyze PDF content with AI
  async function analyzePDFContent(apiKey, model, pdf) {
    const prompt = `Anda adalah seorang dosen yang menganalisis dokumen PDF dalam konteks forum diskusi mahasiswa.

Nama PDF: ${pdf.name}

Konten PDF:
${pdf.text}

Pertanyaan diskusi dari forum:
${extractedText}

RAT Context (jika tersedia):
${ratText}

Berikan analisis yang mencakup:
1. **Ringkasan Singkat**: Ringkasan isi PDF dalam 2-3 kalimat
2. **Relevansi dengan Pertanyaan**: Apakah PDF ini relevan dengan pertanyaan diskusi? Berikan penilaian 1-10 dan jelaskan alasannya
3. **Kontribusi untuk Jawaban**: Bagaimana PDF ini dapat membantu menjawab pertanyaan diskusi?
4. **Rekomendasi**: Apakah mahasiswa sebaiknya menggunakan PDF ini sebagai referensi? Mengapa?

Gunakan bahasa Indonesia yang natural dan ramah, seperti dosen yang sedang memberikan feedback.`;

    try {
      const response = await callAIAPI(apiKey, model, prompt);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Display PDF analysis results
  function displayPDFAnalysis(pdf, analysis) {
    const analysisDiv = document.createElement('div');
    analysisDiv.style.cssText = `
      margin: 10px 0;
      padding: 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    if (analysis.success) {
      analysisDiv.innerHTML = `
        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: rgba(255,255,255,0.9);">📄 ${pdf.name}</h4>
        <div style="font-size: 12px; line-height: 1.4; color: rgba(255,255,255,0.8);">
          ${analysis.answer}
        </div>
      `;
    } else {
      analysisDiv.innerHTML = `
        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: rgba(255,255,255,0.9);">📄 ${pdf.name}</h4>
        <div style="font-size: 12px; color: rgba(255, 100, 100, 0.8);">
          Error: ${analysis.error}
        </div>
      `;
    }

    pdfResults.appendChild(analysisDiv);
  }
});

