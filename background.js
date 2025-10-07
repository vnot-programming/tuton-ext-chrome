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
  
  if (request.action === 'openLoginPage') {
    chrome.tabs.create({
      url: 'https://elearning.ut.ac.id/login/index.php'
    });
    sendResponse({ success: true });
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

