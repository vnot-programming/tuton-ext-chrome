// Content script for UT E-Learning Text Grabber & AI Assistant

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'grabText') {
    grabTextFromPage()
      .then(text => {
        sendResponse({ success: true, text: text });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep message channel open for async response
  }
  
  // Handle PDF scanning request
  if (request.action === 'scanPDFs') {
    scanPDFLinks()
      .then(pdfs => {
        sendResponse({ success: true, pdfs: pdfs });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  // Handle PDF text extraction request
  if (request.action === 'extractPDFText') {
    extractPDFText(request.url)
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
});

// Function to grab text from the current page
async function grabTextFromPage() {
  try {
    // Wait for page to be fully loaded
    await waitForPageLoad();
    
    let extractedText = '';
    
    // Check if we're on a forum discussion page
    if (window.location.href.includes('/mod/forum/discuss.php')) {
      extractedText = extractForumDiscussionText();
    }
    // Check if we're on a course content page
    else if (window.location.href.includes('/mod/') || window.location.href.includes('/course/')) {
      extractedText = extractCourseContentText();
    }
    // General text extraction for other pages
    else {
      extractedText = extractGeneralPageText();
    }
    
    if (!extractedText.trim()) {
      throw new Error('No relevant text found on this page');
    }
    
    return extractedText;
  } catch (error) {
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}

// Extract text from forum discussion pages
function extractForumDiscussionText() {
  let text = '';
  let processedPosts = new Set(); // To avoid duplicates
  
  // Extract activity name (e.g., "Diskusi 1")
  const activityNameElement = document.querySelector('h2.activity-name');
  const activityName = activityNameElement ? activityNameElement.textContent.trim() : '';
  
  // Extract discussion materials (Bahan Diskusi) - keep for reference but don't add to output
  const discussionMaterials = document.querySelector('.no-overflow p');
  const materials = discussionMaterials ? discussionMaterials.textContent.trim() : '';
  
  console.log('Discussion materials found:', !!materials);
  console.log('Materials preview:', materials ? materials.substring(0, 100) : 'None');
  
  // Add activity context to the beginning
  if (activityName) {
    text += `=== AKTIVITAS: ${activityName} ===\n\n`;
  }
  
  // Don't add materials to text output - we only want student responses
  
  // Get all forum posts (including main post and replies)
  const forumPosts = document.querySelectorAll('.forum-post-container, .forumpost, [data-content="forum-post"]');
  
  console.log('Found forum posts:', forumPosts.length);
  
  if (forumPosts.length > 0) {
    let postIndex = 1;
    
    forumPosts.forEach((post) => {
      // Get the post ID to avoid duplicates
      const postId = post.getAttribute('data-post-id') || post.id;
      if (processedPosts.has(postId)) {
        return; // Skip if already processed
      }
      processedPosts.add(postId);
      
      // Get author information
      const authorElement = post.querySelector('a[href*="/user/view.php"]');
      const timeElement = post.querySelector('time');
      
      if (authorElement && timeElement) {
        text += `Post ${postIndex} - ${authorElement.textContent.trim()} (${timeElement.textContent.trim()}):\n`;
      }
      
      // Get the post content - this is the main part we want
      const postContent = post.querySelector('[id^="post-content-"]');
      console.log('Post content found:', !!postContent, postContent?.id);
      
      if (postContent) {
        const postText = postContent.innerText.trim();
        console.log('Post text length:', postText.length);
        console.log('Post text preview:', postText.substring(0, 100));
        
        // Always add post content - let AI handle the analysis
        if (postText.length > 0) {
          text += postText + '\n\n';
          postIndex++;
        }
      } else {
        // Fallback: get any content within the post
        const fallbackContent = post.querySelector('.post-content-container, .content, .post-content, .body-content-container');
        console.log('Fallback content found:', !!fallbackContent);
        
        if (fallbackContent) {
          const fallbackText = fallbackContent.innerText.trim();
          console.log('Fallback text length:', fallbackText.length);
          
          // Always add fallback content if it exists
          if (fallbackText.length > 0) {
            text += fallbackText + '\n\n';
            postIndex++;
          }
        }
      }
    });
  } else {
    // Fallback: try to get any forum-related content
    const discussionContent = document.querySelector('.forum-post-content, .post-content, .discussion-content');
    if (discussionContent) {
      text += 'Forum Content:\n';
      text += discussionContent.innerText + '\n\n';
    }
  }
  
  // If still no content, try to get main content area
  if (!text.trim()) {
    const mainContent = document.querySelector('main, .main-content, .content, #content');
    if (mainContent) {
      text = mainContent.innerText;
    }
  }
  
  return text.trim();
}

// Extract text from course content pages
function extractCourseContentText() {
  let text = '';
  
  // Get course title
  const courseTitle = document.querySelector('.course-title, h1, .page-title');
  if (courseTitle) {
    text += 'Course: ' + courseTitle.innerText + '\n\n';
  }
  
  // Get main content
  const mainContent = document.querySelector('.course-content, .content, main, .main-content');
  if (mainContent) {
    text += mainContent.innerText;
  }
  
  // Get any additional content sections
  const contentSections = document.querySelectorAll('.content-section, .lesson-content, .module-content');
  contentSections.forEach((section, index) => {
    if (section.innerText.trim()) {
      text += `\n\nSection ${index + 1}:\n`;
      text += section.innerText;
    }
  });
  
  return text.trim();
}

// Extract general text from any page
function extractGeneralPageText() {
  let text = '';
  
  // Get page title
  const pageTitle = document.querySelector('h1, .page-title, title');
  if (pageTitle) {
    text += 'Page Title: ' + pageTitle.innerText + '\n\n';
  }
  
  // Get main content area
  const mainContent = document.querySelector('main, .main-content, .content, #content, .container');
  if (mainContent) {
    text += mainContent.innerText;
  } else {
    // Fallback to body content
    text += document.body.innerText;
  }
  
  return text.trim();
}


// Helper function to wait for page to be fully loaded
function waitForPageLoad() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();
    } else {
      window.addEventListener('load', resolve);
    }
  });
}

// Add visual indicator when extension is active
function addExtensionIndicator() {
  // Create a small indicator that the extension is active
  const indicator = document.createElement('div');
  indicator.id = 'ut-extension-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-family: Arial, sans-serif;
    z-index: 10000;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    opacity: 0.8;
  `;
  indicator.textContent = '🎓 UT Assistant Active';
  document.body.appendChild(indicator);
  
  // Remove indicator after 3 seconds
  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 3000);
}

// Initialize extension indicator when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addExtensionIndicator);
} else {
  addExtensionIndicator();
}

// PDF scanning and extraction functions
async function scanPDFLinks() {
  console.log('Scanning for PDF links...');
  
  // Find all PDF links on the page - UT e-learning specific patterns
  const pdfLinks = document.querySelectorAll(`
    a[href$=".pdf"], 
    a[href*=".pdf"], 
    a[href*="forcedownload=1"],
    a[aria-label*=".pdf"],
    a[href*="pluginfile.php"][href*="attachment"],
    a[href*="pluginfile.php"][href*="mod_forum"]
  `);
  
  const pdfs = [];
  const processedUrls = new Set(); // To avoid duplicates
  
  pdfLinks.forEach((link, index) => {
    const url = link.href;
    const title = link.textContent.trim() || 
                  link.getAttribute('aria-label') || 
                  link.title || 
                  `PDF ${index + 1}`;
    
    // Clean up title (remove extra whitespace, decode HTML entities)
    const cleanTitle = title.replace(/\s+/g, ' ').trim();
    
    // Only add if URL contains PDF and not already processed
    if ((url.includes('.pdf') || url.includes('forcedownload=1')) && !processedUrls.has(url)) {
      processedUrls.add(url);
      
      pdfs.push({
        url: url,
        title: cleanTitle,
        index: pdfs.length
      });
    }
  });
  
  console.log(`Found ${pdfs.length} PDF links:`, pdfs);
  return pdfs;
}

async function extractPDFText(url) {
  console.log('Extracting text from PDF:', url);
  
  try {
    // Load PDF.js library dynamically
    if (!window.pdfjsLib) {
      await loadPDFJS();
    }
    
    // Download PDF data using fetch
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();

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

    console.log('PDF extraction successful.');
    return { success: true, text: fullText, url: url };
    
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return { success: false, error: error.message };
  }
}

// Function to load PDF.js library
async function loadPDFJS() {
  if (window.pdfjsLib) return window.pdfjsLib;
  
  try {
    // Fetch and execute PDF.js library
    const response = await fetch(chrome.runtime.getURL('lib/pdf.min.js'));
    const scriptText = await response.text();
    
    // Create a script element and execute it
    const script = document.createElement('script');
    script.textContent = scriptText;
    document.head.appendChild(script);
    
    // Get the global pdfjsLib
    window.pdfjsLib = window.pdfjsLib;
    
    if (!window.pdfjsLib) {
      throw new Error('PDF.js library not loaded properly');
    }
    
    // Set PDF.js worker path
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
    
    return window.pdfjsLib;
  } catch (error) {
    console.error('Failed to load PDF.js library:', error);
    throw error;
  }
}

