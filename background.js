// Background script for UT E-Learning Text Grabber & AI Assistant

// Import PDF.js library
importScripts('lib/pdf.min.js');

// Set PDF.js worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');

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
  
  // Handle PDF text extraction
  if (request.type === 'EXTRACT_PDF_TEXT') {
    const pdfUrl = request.url;
    console.log('Background script received request to process PDF:', pdfUrl);

    // Use async function inside listener
    (async () => {
      try {
        // 1. Download PDF data using fetch
        const response = await fetch(pdfUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();

        // 2. Load PDF using PDF.js
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        console.log('PDF loaded, pages:', pdf.numPages);
        
        let fullText = '';
        
        // 3. Iterate through each page to extract text
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(' ');
          fullText += pageText + '\n';
        }

        // 4. Send text back to content script
        console.log('PDF extraction successful. Sending text back.');
        sendResponse({ success: true, text: fullText, url: pdfUrl });

      } catch (error) {
        console.error('Error processing PDF in background:', error);
        sendResponse({ success: false, error: error.message, url: pdfUrl });
      }
    })();

    // Return true to indicate that sendResponse will be called asynchronously
    return true; 
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

