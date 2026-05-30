// Background script for UT E-Learning Text Grabber & AI Assistant

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('UT E-Learning Text Grabber & AI Assistant installed');
    
    // Set default settings
    chrome.storage.sync.set({
      extensionEnabled: true,
      autoLoginEnabled: false
    });
  }
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'backgroundFetchText') {
    console.log('Background service worker fetching text URL:', request.url);
    fetch(request.url)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(text => {
        sendResponse({ success: true, text: text });
      })
      .catch(error => {
        console.error('Background fetch text failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (request.action === 'backgroundFetchBinary') {
    console.log('Background service worker fetching binary URL:', request.url);
    fetch(request.url)
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.arrayBuffer();
      })
      .then(buffer => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        sendResponse({ success: true, base64: base64 });
      })
      .catch(error => {
        console.error('Background fetch binary failed:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }

  if (request.action === 'getTabInfo') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          url: tabs[0].url,
          title: tabs[0].title
        });
      }
    });
    return true;
  }
  
  // Handle PDF text extraction - delegate to content script
  if (request.type === 'EXTRACT_PDF_TEXT') {
    const pdfUrl = request.url;
    console.log('Background script delegating PDF extraction to content script:', pdfUrl);

    // Forward the request to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'extractPDFText',
          url: pdfUrl
        }, (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      } else {
        sendResponse({ success: false, error: 'No active tab found' });
      }
    });

    return true; 
  }

  // CloudConvert: full .pages → PDF workflow (runs in service worker)
  if (request.action === 'cloudconvertConvert') {
    const { apiKey, apiBase, base64, filename } = request;
    const targetUrl = `${apiBase}/v2/jobs`;
    console.log('[CloudConvert] Starting job for:', filename);
    console.log('[CloudConvert] apiBase:', apiBase);
    console.log('[CloudConvert] targetUrl:', targetUrl);
    console.log('[CloudConvert] apiKey prefix (first 20 chars):', apiKey ? apiKey.slice(0, 20) + '...' : 'MISSING');
    console.log('[CloudConvert] base64 length:', base64 ? base64.length : 0);

    (async () => {
      try {
        // Step 1: Create job with file embedded as base64 (import/base64 — no separate upload needed)
        console.log('[CloudConvert] Sending job creation request to:', targetUrl);
        const jobRes = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            tasks: {
              'import-file': {
                operation: 'import/base64',
                file: base64,
                filename: filename
              },
              'convert-to-pdf': {
                operation: 'convert',
                input: ['import-file'],
                output_format: 'pdf'
              },
              'export-pdf': {
                operation: 'export/url',
                input: ['convert-to-pdf']
              }
            }
          })
        });

        console.log('[CloudConvert] Job response status:', jobRes.status);
        if (!jobRes.ok) {
          const errText = await jobRes.text();
          throw new Error(`Job creation failed (${jobRes.status}): ${errText.slice(0, 400)}`);
        }

        const jobData = await jobRes.json();
        const jobId = jobData.data.id;
        console.log('[CloudConvert] Job created, ID:', jobId);

        // Step 2: Poll until export is ready (max 60s, 30 attempts × 2s)
        let exportUrl = null;
        for (let attempt = 0; attempt < 30; attempt++) {
          await new Promise(r => setTimeout(r, 2000));
          const pollRes = await fetch(`${apiBase}/v2/jobs/${jobId}`, {
            headers: { 'Authorization': 'Bearer ' + apiKey }
          });
          const pollData = await pollRes.json();
          const overallStatus = pollData.data.status;
          console.log(`[CloudConvert] Poll #${attempt + 1}, job status: ${overallStatus}`);

          const exportTask = pollData.data.tasks.find(t => t.name === 'export-pdf');
          if (exportTask && exportTask.status === 'finished' && exportTask.result && exportTask.result.files && exportTask.result.files.length > 0) {
            exportUrl = exportTask.result.files[0].url;
            console.log('[CloudConvert] Export ready:', exportUrl);
            break;
          }
          if (overallStatus === 'error') {
            const errDetail = (pollData.data.tasks || []).map(t => `${t.name}:${t.status}(${t.message || ''})`).join(', ');
            throw new Error('CloudConvert job failed: ' + errDetail);
          }
        }

        if (!exportUrl) throw new Error('Konversi timeout (60 detik). Coba lagi.');

        // Step 3: Download the PDF as base64
        console.log('[CloudConvert] Downloading PDF from:', exportUrl);
        const pdfFetchRes = await fetch(exportUrl);
        if (!pdfFetchRes.ok) throw new Error(`PDF download failed (${pdfFetchRes.status})`);
        const pdfBuffer = await pdfFetchRes.arrayBuffer();
        const pdfBytes = new Uint8Array(pdfBuffer);
        let pdfBinary = '';
        for (let i = 0; i < pdfBytes.length; i++) pdfBinary += String.fromCharCode(pdfBytes[i]);
        const pdfBase64 = btoa(pdfBinary);

        console.log('[CloudConvert] Completed! PDF size =', pdfBytes.length, 'bytes');
        sendResponse({ success: true, base64: pdfBase64 });

      } catch (err) {
        console.error('[CloudConvert] Error:', err.name, err.message);
        sendResponse({ success: false, error: err.message });
      }
    })();

    return true; // Keep message channel open for async response
  }
});



// Handle tab updates to inject content script when needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('elearning.ut.ac.id')) {
    // Content script will be automatically injected based on manifest permissions
    console.log('UT e-learning page loaded:', tab.url);
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  // This will open the popup automatically due to the action configuration in manifest
  console.log('Extension icon clicked on tab:', tab.url);
});

