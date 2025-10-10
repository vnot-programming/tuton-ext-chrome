document.addEventListener('DOMContentLoaded', function() {
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

  let extractedText = '';
  let ratText = '';
  
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

  // Load saved settings
  chrome.storage.sync.get(['selectedModel', 'customApiKey', 'deskripsiMataKuliah', 'capaianPembelajaran'], function(result) {
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

  // Handle model selection change
  aiModelSelect.addEventListener('change', function() {
    updateApiKeySection();
    chrome.storage.sync.set({ selectedModel: aiModelSelect.value });
  });
  
  // Handle custom API key input
  customApiKeyInput.addEventListener('input', function() {
    chrome.storage.sync.set({ customApiKey: customApiKeyInput.value });
  });
  
  // Handle RAT input changes
  deskripsiMataKuliah.addEventListener('input', updateRATContent);
  capaianPembelajaran.addEventListener('input', updateRATContent);
  
  // Handle paste events
  deskripsiMataKuliah.addEventListener('paste', function(e) {
    setTimeout(updateRATContent, 10); // Small delay to ensure paste is complete
  });
  capaianPembelajaran.addEventListener('paste', function(e) {
    setTimeout(updateRATContent, 10); // Small delay to ensure paste is complete
  });
  
  // Add focus/blur styling
  deskripsiMataKuliah.addEventListener('focus', function() {
    this.style.borderColor = 'rgba(46, 139, 87, 0.7)';
  });
  deskripsiMataKuliah.addEventListener('blur', function() {
    this.style.borderColor = 'rgba(255,255,255,0.3)';
  });
  
  capaianPembelajaran.addEventListener('focus', function() {
    this.style.borderColor = 'rgba(46, 139, 87, 0.7)';
  });
  capaianPembelajaran.addEventListener('blur', function() {
    this.style.borderColor = 'rgba(255,255,255,0.3)';
  });
  
  // Handle clear button
  clearRAT.addEventListener('click', function() {
    deskripsiMataKuliah.value = '';
    capaianPembelajaran.value = '';
    updateRATContent();
    showStatus('RAT content cleared!', 'info', ratStatus);
  });
  
  // Handle paste from clipboard button
  pasteFromClipboard.addEventListener('click', async function() {
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
    if (selectedModel === 'auto' || selectedModel.startsWith('gemini')) {
      customApiKeySection.style.display = 'none';
    } else {
      customApiKeySection.style.display = 'block';
    }
  }
  

  // Auto extract text function
  function autoExtractText() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'grabText' }, function(response) {
        if (chrome.runtime.lastError) {
          showStatus('Error: ' + chrome.runtime.lastError.message, 'error');
          return;
        }

        if (response && response.success) {
          extractedText = response.text;
          extractedTextDiv.textContent = extractedText;
          extractedTextDiv.style.display = 'block';
          showStatus('Text extracted automatically!', 'success');
        } else {
          showStatus('Failed to extract text: ' + (response?.error || 'Unknown error'), 'error');
        }
      });
    });
  }

  // Generate answer with AI
  generateAnswerBtn.addEventListener('click', async function() {
    if (!extractedText) {
      showStatus('No text extracted. Please refresh the page and try again.', 'error');
      return;
    }

    const selectedModel = aiModelSelect.value;
    let apiKey = '';
    let actualModel = selectedModel;

    // Determine API key and model
    if (selectedModel === 'auto') {
      try {
        apiKey = await getGeminiApiKey();
        actualModel = 'gemini-2.5-flash'; // Default for auto
      } catch (error) {
        showStatus('Failed to get API key from server: ' + error.message, 'error');
        return;
      }
    } else if (selectedModel.startsWith('gemini')) {
      try {
        apiKey = await getGeminiApiKey();
        actualModel = selectedModel;
      } catch (error) {
        showStatus('Failed to get API key from server: ' + error.message, 'error');
        return;
      }
    } else {
      // For non-Gemini models, use custom API key
      apiKey = customApiKeyInput.value.trim();
      if (!apiKey) {
        showStatus('Please enter API key for ' + selectedModel, 'error');
        return;
      }
      actualModel = selectedModel;
    }

    loadingDiv.style.display = 'block';
    generateAnswerBtn.disabled = true;

    // Call AI API based on selected model
    callAIAPI(apiKey, actualModel, extractedText)
      .then(response => {
        loadingDiv.style.display = 'none';
        generateAnswerBtn.disabled = false;
        
        if (response.success) {
          aiResponseDiv.textContent = response.answer;
          aiResponseContainer.style.display = 'block';
          tryDifferentModelBtn.style.display = 'none';
          showStatus('Answer generated successfully!', 'success');
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
  copyResponseBtn.addEventListener('click', function() {
    const responseText = aiResponseDiv.textContent;
    if (responseText) {
      navigator.clipboard.writeText(responseText).then(function() {
        showStatus('Response copied to clipboard!', 'success');
        // Change button text temporarily
        const originalText = copyResponseBtn.textContent;
        copyResponseBtn.textContent = '✅ Copied!';
        setTimeout(() => {
          copyResponseBtn.textContent = originalText;
        }, 2000);
      }).catch(function(err) {
        showStatus('Failed to copy: ' + err, 'error');
      });
    }
  });

  // Try different model button
  tryDifferentModelBtn.addEventListener('click', function() {
    // Cycle through different models (prioritizing the latest ones)
    const models = ['auto', 'gemini-2.5-flash', 'nano-banana', 'gemini-2.5-pro', 'gemini-2.0-flash', 'gemini-flash-latest', 'openai-gpt', 'claude'];
    const currentModel = aiModelSelect.value;
    const currentIndex = models.indexOf(currentModel);
    const nextIndex = (currentIndex + 1) % models.length;
    
    aiModelSelect.value = models[nextIndex];
    updateApiKeySection();
    showStatus(`Switched to ${aiModelSelect.options[aiModelSelect.selectedIndex].text}`, 'info');
    
    // Save the new model selection
    chrome.storage.sync.set({ selectedModel: models[nextIndex] });
    
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

  // Function to call AI API based on selected model
  async function callAIAPI(apiKey, model, text) {
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
13. Komentari apakah jawaban memiliki referensi yang memadai
14. Periksa apakah ada contoh implementasi dalam jawaban
15. Berikan feedback konstruktif untuk meningkatkan kualitas jawaban
16. Di akhir, berikan semangat kepada mahasiswa tanpa membuat summary atau kesimpulan

Tulis respons seperti teman yang sedang membantu di forum:`;

    try {
      switch (model) {
        case 'auto':
        case 'gemini-2.5-flash':
          return await callGemini25Flash(apiKey, prompt);
        case 'nano-banana':
          return await callNanoBanana(apiKey, prompt);
        case 'gemini-2.5-pro':
          return await callGemini25Pro(apiKey, prompt);
        case 'gemini-2.0-flash':
          return await callGemini20Flash(apiKey, prompt);
        case 'gemini-flash-latest':
          return await callGeminiFlashLatest(apiKey, prompt);
        case 'openai-gpt':
          return await callOpenAI(apiKey, prompt);
        case 'claude':
          return await callClaude(apiKey, prompt);
        default:
          return await callGemini25Flash(apiKey, prompt);
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Gemini 2.5 Flash API call (Latest and fastest)
  async function callGemini25Flash(apiKey, prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          thinkingConfig: {
            thinkingBudget: 0 // Disable thinking for faster responses
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini 2.5 Flash API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        answer: data.candidates[0].content.parts[0].text
      };
    } else {
      throw new Error('Invalid response format from Gemini 2.5 Flash API');
    }
  }

  // Nano Banana API call (Ultra lightweight)
  async function callNanoBanana(apiKey, prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Nano Banana API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        answer: data.candidates[0].content.parts[0].text
      };
    } else {
      throw new Error('Invalid response format from Nano Banana API');
    }
  }

  // Gemini 2.5 Pro API call (Highest quality with thinking enabled)
  async function callGemini25Pro(apiKey, prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          thinkingConfig: {
            thinkingBudget: 1 // Enable thinking for better quality
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini 2.5 Pro API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        answer: data.candidates[0].content.parts[0].text
      };
    } else {
      throw new Error('Invalid response format from Gemini 2.5 Pro API');
    }
  }

  // Gemini 2.0 Flash API call (Stable version)
  async function callGemini20Flash(apiKey, prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini 2.0 Flash API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        answer: data.candidates[0].content.parts[0].text
      };
    } else {
      throw new Error('Invalid response format from Gemini 2.0 Flash API');
    }
  }

  // Gemini Flash Latest API call
  async function callGeminiFlashLatest(apiKey, prompt) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          thinkingConfig: {
            thinkingBudget: 0 // Disable thinking for faster responses
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini Flash Latest API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        success: true,
        answer: data.candidates[0].content.parts[0].text
      };
    } else {
      throw new Error('Invalid response format from Gemini Flash Latest API');
    }
  }

  // OpenAI GPT API call
  async function callOpenAI(apiKey, prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        success: true,
        answer: data.choices[0].message.content
      };
    } else {
      throw new Error('Invalid response format from OpenAI API');
    }
  }

  // Claude API call
  async function callClaude(apiKey, prompt) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Claude API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.content && data.content[0] && data.content[0].text) {
      return {
        success: true,
        answer: data.content[0].text
      };
    } else {
      throw new Error('Invalid response format from Claude API');
    }
  }
});

