// Content script for UT E-Learning Text Grabber & AI Assistant

let savedAiResponse = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveResponse') {
    savedAiResponse = request.text;
    sendResponse({ success: true });
    return false;
  }

  if (request.action === 'grabText') {
    grabTextFromPage()
      .then(text => {
        sendResponse({ success: true, text: text, savedResponse: savedAiResponse });
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
    extractPDFText(request.url, request.filename)
      .then(result => {
        sendResponse(result);
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  // Handle Grader Info extraction request
  if (request.action === 'grabGraderInfo') {
    grabGraderInfo()
      .then(info => {
        sendResponse({ success: true, info: info });
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    return true;
  }
  
  // Handle Grader Info sync request
  if (request.action === 'syncGraderInfo') {
    syncGraderInfo(request.grade, request.feedback, request.isHtml)
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

// Native DOCX XML-ZIP text extractor utilizing browser DecompressionStream API
async function extractDocxText(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  let offset = 0;
  
  while (offset < arrayBuffer.byteLength - 30) {
    const signature = view.getUint32(offset, true);
    if (signature !== 0x04034b50) { // PK\x03\x04
      break; 
    }
    
    const compressionMethod = view.getUint16(offset + 8, true);
    const compressedSize = view.getUint32(offset + 18, true);
    const fileNameLength = view.getUint16(offset + 26, true);
    const extraFieldLength = view.getUint16(offset + 28, true);
    
    // Read file name
    const fileNameBytes = new Uint8Array(arrayBuffer, offset + 30, fileNameLength);
    const fileName = new TextDecoder().decode(fileNameBytes);
    
    const dataOffset = offset + 30 + fileNameLength + extraFieldLength;
    
    if (fileName === 'word/document.xml') {
      const compressedData = new Uint8Array(arrayBuffer, dataOffset, compressedSize);
      let documentXmlText = '';
      
      if (compressionMethod === 8) { // DEFLATE
        const ds = new DecompressionStream('deflate-raw');
        const writer = ds.writable.getWriter();
        writer.write(compressedData);
        writer.close();
        
        const response = new Response(ds.readable);
        const decompressedBuffer = await response.arrayBuffer();
        documentXmlText = new TextDecoder().decode(decompressedBuffer);
      } else if (compressionMethod === 0) { // Uncompressed
        documentXmlText = new TextDecoder().decode(compressedData);
      }
      
      // Parse XML to extract plain text
      const parser = new DOMParser();
      const doc = parser.parseFromString(documentXmlText, 'application/xml');
      const paragraphs = doc.getElementsByTagName('w:p');
      let text = '';
      for (let i = 0; i < paragraphs.length; i++) {
        const textElements = paragraphs[i].getElementsByTagName('w:t');
        let paragraphText = '';
        for (let j = 0; j < textElements.length; j++) {
          paragraphText += textElements[j].textContent;
        }
        if (paragraphText) {
          text += paragraphText + '\n';
        }
      }
      return text;
    }
    
    offset = dataOffset + compressedSize;
  }
  throw new Error('word/document.xml tidak ditemukan di dalam berkas DOCX');
}

async function extractPDFText(url, filename = '') {
  console.log('Extracting text from submission file via background:', filename || url);
  
  const lowerUrl = url.toLowerCase();
  const lowerFilename = filename ? filename.toLowerCase() : '';
  
  // Detect if the file is an image
  const isImageFile = lowerFilename.endsWith('.png') || lowerFilename.endsWith('.jpg') || lowerFilename.endsWith('.jpeg') || lowerFilename.endsWith('.webp') ||
                      lowerUrl.includes('.png?') || lowerUrl.includes('.jpg?') || lowerUrl.includes('.jpeg?') || lowerUrl.includes('.webp?');

  let mimeType = 'application/pdf'; // default
  if (isImageFile) {
    if (lowerFilename.endsWith('.png') || lowerUrl.includes('.png?')) mimeType = 'image/png';
    else if (lowerFilename.endsWith('.webp') || lowerUrl.includes('.webp?')) mimeType = 'image/webp';
    else mimeType = 'image/jpeg';
  }

  // Detect if the file is text-based (.txt, .r, .rmd, .csv, .py, .json)
  const isTextFile = lowerFilename.endsWith('.r') || 
                     lowerFilename.endsWith('.rmd') || 
                     lowerFilename.endsWith('.txt') || 
                     lowerFilename.endsWith('.py') || 
                     lowerFilename.endsWith('.csv') || 
                     lowerFilename.endsWith('.json') ||
                     lowerUrl.includes('.r?') || 
                     lowerUrl.includes('.rmd?') || 
                     lowerUrl.includes('.txt?') ||
                     (!isImageFile && !lowerFilename.includes('.pdf') && !lowerUrl.includes('.pdf') && !lowerUrl.includes('forcedownload=1') && !lowerFilename.includes('.docx') && !lowerUrl.includes('.docx'));
  
  const isDocx = lowerFilename.endsWith('.docx') || lowerUrl.includes('.docx?');

  if (isTextFile) {
    try {
      console.log('Delegating text file fetch to background worker:', url);
      const res = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'backgroundFetchText', url: url }, resolve);
      });
      if (res && res.success) {
        console.log('Plain text file background extraction successful.');
        return { success: true, text: res.text, url: url };
      } else {
        throw new Error(res?.error || 'Gagal mengunduh teks berkas dari background');
      }
    } catch (error) {
      console.error('Error extracting text file via background:', error);
      return { success: false, error: error.message };
    }
  }

  if (isImageFile) {
    try {
      console.log('Delegating IMAGE file fetch to background worker:', url);
      const res = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'backgroundFetchBinary', url: url }, resolve);
      });
      if (!res || !res.success) {
        throw new Error(res?.error || 'Gagal mengunduh berkas gambar dari background');
      }
      console.log('IMAGE binary extraction successful.');
      return { success: true, text: 'Tugas mahasiswa berupa berkas gambar visual. Silakan periksa gambar secara langsung.', url: url, base64: res.base64, mimeType: mimeType };
    } catch (error) {
      console.error('Error extracting IMAGE via background:', error);
      return { success: false, error: error.message };
    }
  }

  if (isDocx) {
    try {
      console.log('Delegating DOCX file fetch to background worker:', url);
      const res = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'backgroundFetchBinary', url: url }, resolve);
      });
      if (!res || !res.success) {
        throw new Error(res?.error || 'Gagal mengunduh berkas DOCX dari background');
      }

      // Convert Base64 back to Uint8Array
      const binaryString = atob(res.base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      console.log('Extracting text from DOCX natively...');
      const docxText = await extractDocxText(bytes.buffer);
      console.log('DOCX text extraction successful.');
      return { success: true, text: docxText, url: url };
    } catch (error) {
      console.error('Error extracting DOCX text via background:', error);
      return { success: false, error: error.message };
    }
  }

  try {
    // Load PDF.js library dynamically
    if (!window.pdfjsLib) {
      await loadPDFJS();
    }
    
    console.log('Delegating PDF file fetch to background worker:', url);
    const res = await new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'backgroundFetchBinary', url: url }, resolve);
    });

    if (!res || !res.success) {
      throw new Error(res?.error || 'Gagal mengunduh berkas PDF dari background');
    }

    // Convert Base64 back to Uint8Array
    const binaryString = atob(res.base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Load PDF using PDF.js
    const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
    console.log('PDF loaded via background binary transfer, pages:', pdf.numPages);
    
    let fullText = '';
    
    // Iterate through each page to extract text
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    console.log('PDF extraction successful.');
    return { success: true, text: fullText, url: url, base64: res.base64, mimeType: 'application/pdf' };
    
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return { success: false, error: error.message };
  }
}

// Function to load PDF.js library
async function loadPDFJS() {
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
    return window.pdfjsLib;
  }
  
  if (typeof pdfjsLib !== 'undefined') {
    window.pdfjsLib = pdfjsLib;
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL('lib/pdf.worker.min.js');
    return window.pdfjsLib;
  }
  
  throw new Error('PDF.js library not loaded in isolated world context');
}

// Function to grab grader details from the Moodle Grader page
async function grabGraderInfo() {
  try {
    // 1. Get Course and Assignment Name from <title>
    const titleText = document.title;
    let courseCode = '';
    let assignmentName = '';
    
    // Parse "STIK4111.12: Tugas.1 - Grading | ElearningUT"
    const titleMatch = titleText.match(/^(.*?):\s*(.*?)\s*-\s*Grading/);
    if (titleMatch) {
      courseCode = titleMatch[1].trim();
      assignmentName = titleMatch[2].trim();
    } else {
      courseCode = titleText.split(':')[0]?.trim() || '';
      assignmentName = titleText.split(':')[1]?.split('-')[0]?.trim() || '';
    }
    
    // 2. Get Student Info
    let studentName = '';
    let studentNim = '';
    let studentEmail = '';
    let dueDate = '';
    
    // Selector for student profile link (prioritizing user-info region to avoid matching the tutor's own nav profile link)
    const userLink = document.querySelector('[data-region="user-info"] a[href*="/user/view.php"]') ||
                     document.querySelector('[data-region="user-info"] a') ||
                     document.querySelector('a[href*="/user/view.php"]:not(header a):not(.nav-link):not([id*="user-menu"])');
    if (userLink) {
      let text = '';
      userLink.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent;
        }
      });
      text = text.trim();
      
      const nimMatch = text.match(/^(.*?)\s+(\d+)$/);
      if (nimMatch) {
        studentName = nimMatch[1].trim();
        studentNim = nimMatch[2].trim();
      } else {
        studentName = text;
      }
      
      const emailEl = userLink.querySelector('small[title*="@"]');
      if (emailEl) {
        studentEmail = emailEl.getAttribute('title') || emailEl.textContent.trim();
      }
      
      const dueDateEl = userLink.querySelector('small[title*="Due date"]');
      if (dueDateEl) {
        dueDate = dueDateEl.textContent.trim().replace(/^Due date:\s*/i, '').trim();
      }
    }
    
    // 3. Get Current Grade from input
    const gradeInput = document.getElementById('id_grade');
    const currentGrade = gradeInput ? gradeInput.value.trim() : '';
    
    // 4. Get Current Feedback from TinyMCE, Atto, or textarea
    let currentFeedback = '';
    const iframe = document.getElementById('id_assignfeedbackcomments_editor_ifr');
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const tinymceBody = iframeDoc.getElementById('tinymce');
      if (tinymceBody) {
        currentFeedback = tinymceBody.innerText.trim();
      }
    }
    if (!currentFeedback) {
      const attoEditable = document.getElementById('id_assignfeedbackcomments_editoreditable');
      if (attoEditable) {
        currentFeedback = attoEditable.innerText.trim();
      }
    }
    if (!currentFeedback) {
      const feedbackTextarea = document.getElementById('id_assignfeedbackcomments_editor');
      if (feedbackTextarea) {
        currentFeedback = feedbackTextarea.value.trim();
      }
    }
    
    // 5. Detect student submission file links with format priority (PDF -> DOCX -> R -> Rmd -> TXT -> PY -> first available)
    let submissionPdfUrl = '';
    let submissionPdfName = '';
    
    const fileLinks = Array.from(document.querySelectorAll('.fileuploadsubmission a, a[href*="assignsubmission_file/submission_files"], a[href*="pluginfile.php"][href*="submission_files"], div[class*="summary_assignsubmission_file"] a, div.assignsubmission_file a'));
    
    if (fileLinks.length > 0) {
      let bestLink = null;
      const hasExt = (url, ext) => url.toLowerCase().split('?')[0].endsWith(ext);
      
      // Priority 1: PDF files
      bestLink = fileLinks.find(link => hasExt(link.href, '.pdf') || link.textContent.toLowerCase().includes('.pdf'));
      
      // Priority 2: DOCX files
      if (!bestLink) {
        bestLink = fileLinks.find(link => hasExt(link.href, '.docx') || link.textContent.toLowerCase().includes('.docx'));
      }
      
      // Priority 3: R / Rmd script files
      if (!bestLink) {
        bestLink = fileLinks.find(link => hasExt(link.href, '.r') || hasExt(link.href, '.rmd') || link.textContent.toLowerCase().includes('.r') || link.textContent.toLowerCase().includes('.rmd'));
      }
      
      // Priority 4: Plain text / python script files
      if (!bestLink) {
        bestLink = fileLinks.find(link => hasExt(link.href, '.txt') || hasExt(link.href, '.py') || link.textContent.toLowerCase().includes('.txt') || link.textContent.toLowerCase().includes('.py'));
      }
      
      // Fallback: Just grab the first link
      if (!bestLink) {
        bestLink = fileLinks[0];
      }
      
      submissionPdfUrl = bestLink.href;
      submissionPdfName = bestLink.textContent.trim();
    }
    
    return {
      courseCode,
      assignmentName,
      studentName,
      studentNim,
      studentEmail,
      dueDate,
      currentGrade,
      currentFeedback,
      submissionPdfUrl,
      submissionPdfName
    };
  } catch (error) {
    console.error('Error grabbing grader info:', error);
    throw error;
  }
}

// Function to synchronize evaluation details back into Moodle Grader elements
async function syncGraderInfo(grade, feedback, isHtml = false) {
  try {
    let gradeSynced = false;
    let feedbackSynced = false;
    
    // 1. Sync Grade
    const gradeInput = document.getElementById('id_grade');
    if (gradeInput) {
      gradeInput.value = grade;
      gradeInput.dispatchEvent(new Event('input', { bubbles: true }));
      gradeInput.dispatchEvent(new Event('change', { bubbles: true }));
      gradeSynced = true;
    }
    
    // 2. Sync Feedback to TinyMCE (Moodle's WYSIWYG), Atto Editor, or backup textarea
    const iframe = document.getElementById('id_assignfeedbackcomments_editor_ifr');
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const tinymceBody = iframeDoc.getElementById('tinymce');
      if (tinymceBody) {
        tinymceBody.innerHTML = isHtml ? feedback : `<p>${feedback.replace(/\n/g, '<br>')}</p>`;
        feedbackSynced = true;
      }
    }
    
    const attoEditable = document.getElementById('id_assignfeedbackcomments_editoreditable');
    if (attoEditable) {
      attoEditable.innerHTML = isHtml ? feedback : `<p>${feedback.replace(/\n/g, '<br>')}</p>`;
      attoEditable.dispatchEvent(new Event('input', { bubbles: true }));
      attoEditable.dispatchEvent(new Event('change', { bubbles: true }));
      feedbackSynced = true;
    }
    
    const feedbackTextarea = document.getElementById('id_assignfeedbackcomments_editor');
    if (feedbackTextarea) {
      feedbackTextarea.value = feedback;
      feedbackTextarea.dispatchEvent(new Event('input', { bubbles: true }));
      feedbackTextarea.dispatchEvent(new Event('change', { bubbles: true }));
      feedbackSynced = true;
    }
    
    // 3. Sync to raw TinyMCE HTML source editor popup dialog if open
    const inlineIframe = document.querySelector('iframe[id$="_ifr"][src*="source_editor.htm"]') || 
                         document.getElementById('mce_inlinepopups_63_ifr');
    if (inlineIframe) {
      try {
        const inlineDoc = inlineIframe.contentDocument || inlineIframe.contentWindow.document;
        const htmlSourceTextarea = inlineDoc.getElementById('htmlSource');
        if (htmlSourceTextarea) {
          htmlSourceTextarea.value = feedback;
          feedbackSynced = true;
        }
      } catch (e) {
        console.log('Unable to write directly to TinyMCE HTML popup editor iframe:', e);
      }
    }
    
    if (gradeSynced || feedbackSynced) {
      return {
        success: true,
        message: `Berhasil sinkronisasi:${gradeSynced ? ' [Nilai]' : ''}${feedbackSynced ? ' [Umpan Balik]' : ''}`
      };
    } else {
      throw new Error('Elemen penilaian tidak ditemukan di halaman ini. Pastikan Anda berada di halaman grading Moodle.');
    }
  } catch (error) {
    throw error;
  }
}

