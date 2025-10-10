```html
Tab sheet container:
<div class="tab-sheet-container" style="border: 3px solid green; background-color: rgba(0, 255, 0, 0.1);">
    <div class="tab-sheet-nav">
      <button id="tabMain" class="tab-sheet-button" data-tab="main">📝 Main</button>
      <button id="tabPenilaian" class="tab-sheet-button active" data-tab="penilaian">📊 Penilaian</button>
    </div>
    
    <!-- Tab Sheet Content -->
    <div class="tab-sheet-content" style="border: 3px solid orange; background-color: rgba(255, 165, 0, 0.1);">
      <!-- Main Tab Sheet -->
      <div id="mainSheet" class="tab-sheet">
    <div class="section">
      <h3>🔑 AI Model Selection</h3>
    <select id="aiModel" class="api-key-input" style="margin-bottom: 10px;">
      <option value="auto">Auto (Balance Quality &amp; Speed - Recommended)</option>
      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Latest &amp; Fastest)</option>
      <option value="nano-banana">Nano Banana (Ultra Lightweight)</option>
      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highest Quality)</option>
      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Stable)</option>
      <option value="gemini-flash-latest">Gemini Flash Latest</option>
      <option value="openai-gpt">OpenAI GPT-4</option>
      <option value="claude">Claude 3.5 Sonnet</option>
    </select>
    <div id="customApiKeySection" style="display: none;">
      <input type="password" id="customApiKey" class="api-key-input" placeholder="Enter your API Key for selected model">
    </div>
    <div id="apiStatus" class="status success" style="display: none;">Text extracted automatically!</div>
  </div>
  
  <div class="section">
    <h3>📚 RAT (Rancangan Aktivitas Tutorial)</h3>
    <div style="margin-bottom: 15px;">
      <label style="display: block; font-size: 12px; color: rgba(255,255,255,0.9); margin-bottom: 5px; font-weight: 600;">Deskripsi Singkat Mata Kuliah:</label>
      <textarea id="deskripsiMataKuliah" placeholder="Masukkan deskripsi singkat mata kuliah dari RAT..." style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; background: rgba(255, 255, 255, 0.95); color: #333; font-size: 12px; resize: vertical; box-sizing: border-box; font-family: inherit; outline: none; transition: border-color 0.3s ease;"></textarea>
    </div>
    <div style="margin-bottom: 15px;">
      <label style="display: block; font-size: 12px; color: rgba(255,255,255,0.9); margin-bottom: 5px; font-weight: 600;">Capaian Pembelajaran Mata Kuliah:</label>
      <textarea id="capaianPembelajaran" placeholder="Masukkan capaian pembelajaran mata kuliah dari RAT..." style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; background: rgba(255, 255, 255, 0.95); color: #333; font-size: 12px; resize: vertical; box-sizing: border-box; font-family: inherit; outline: none; transition: border-color 0.3s ease;"></textarea>
    </div>
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <button id="clearRAT" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(220, 20, 60, 0.4); color: white; font-size: 12px; cursor: pointer; transition: all 0.3s ease;">🗑️ Clear All</button>
      <button id="pasteFromClipboard" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(30, 144, 255, 0.4); color: white; font-size: 12px; cursor: pointer; transition: all 0.3s ease;">📋 Paste</button>
    </div>
    <div id="ratStatus" class="status info" style="display: none;">RAT content cleared</div>
  </div>
  
  <div class="section">
    <h3>📝 Extracted Text</h3>
    <div id="extractedText" class="extracted-text" style="display: block;">Dashboard

Site home

Site pages

My courses

MKKI4201.252

STIK4111.11

Participants

Grades

Pendahuluan

Sesi 1

Kehadiran Sesi ke-1

Mekanisme Kerja, Pembuatan Objek, dan Informasi Ba...

Pengayaan 1

Diskusi.1

Kuis 1

Sesi 2

Sesi 3

Sesi 4

Sesi 5

Sesi 6

Sesi 7

Sesi 8

STSI4102.169

Courses</div>
  </div>
  
  <div class="section">
    <h3>🤖 AI Response</h3>
    <button id="generateAnswer">Generate Answer with AI</button>
    <button id="tryDifferentModel" style="display: none; background: rgba(255, 165, 0, 0.4); border: 1px solid rgba(255, 165, 0, 0.7);">Try Different Model</button>
    <div class="loading" id="loading">
      <div class="spinner"></div>
      <div>Generating answer...</div>
    </div>
    <div id="aiResponseContainer" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 12px; color: rgba(255,255,255,0.7);">AI Response:</span>
        <button id="copyResponse" style="background: rgba(46, 139, 87, 0.4); border: 1px solid rgba(46, 139, 87, 0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.3s ease;">📋 Copy</button>
      </div>
      <div id="aiResponse" class="ai-response"></div>
    </div>
      </div>
      
      <!-- Penilaian Tab Sheet -->
      <div id="penilaianSheet" class="tab-sheet active">
        <div class="section" style="border: 5px solid red; background-color: rgba(255, 0, 0, 0.3); min-height: 300px; position: relative; z-index: 9999;">
          <h3 style="color: white; font-size: 16px; font-weight: bold; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">📊 Analisis PDF &amp; Penilaian</h3>
          <p style="font-size: 14px; color: white; margin-bottom: 15px; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            Upload PDF yang telah didownload dari diskusi mahasiswa untuk dianalisis relevansinya dengan pertanyaan diskusi.
          </p>
          
          <div style="margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <div style="position: relative; margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
              <input type="file" id="pdfUpload" accept=".pdf" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
              <label for="pdfUpload" style="display: block; width: 100%; padding: 15px; border: 1px solid blue; border-radius: 8px; background: rgba(0, 0, 255, 0.2); color: white; text-align: center; cursor: pointer; transition: 0.3s; font-size: 12px;">
                📁 <strong style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">Click untuk Upload PDF</strong><br style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
                <span style="font-size: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">Drag &amp; drop atau click untuk memilih file PDF</span>
              </label>
            </div>
            <div id="pdfStatus" class="status" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
          </div>
          
          <div id="pdfInfo" style="display: none; margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <div style="padding: 10px; background: rgba(0, 0, 255, 0.2); border-radius: 6px; border: 1px solid blue; color: white;">
              <h4 style="font-size: 14px; margin: 0px 0px 8px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">📄 File PDF:</h4>
              <div id="pdfFileName" style="font-size: 12px; color: white; margin-bottom: 5px; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
              <div id="pdfFileSize" style="font-size: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
            </div>
          </div>
          
          <div id="pdfAnalysis" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <h4 style="font-size: 14px; margin-bottom: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">🤖 Analisis AI:</h4>
            <div id="pdfResults" style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
            <button id="analyzePDF" style="width: 100%; padding: 10px; border: 1px solid blue; border-radius: 6px; background: rgba(0, 0, 255, 0.2); color: white; font-size: 12px; cursor: pointer; transition: 0.3s; margin-top: 10px;">
              🚀 Analisis PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="footer">
    <p>Made with ❤️ by <strong>Feri Febria Laksana</strong></p>
    <p>Using AI • Version 1.1</p>
    <p style="margin-top: 10px;">
      <a href="https://saweria.co/vnot01" target="_blank" style="color: #2E8B57; text-decoration: none; font-weight: 600; padding: 5px 10px; background: rgba(255, 255, 255, 0.2); border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.3); transition: all 0.3s ease;">
        ☕ Support Development
      </a>
    </p>
    <p style="font-size: 10px; color: rgba(255, 255, 255, 0.7); margin-top: 5px;">
      Jazakumullah Khairan 🙏
    </p>
  </div>
  
  <script src="popup.js"></script>



</div>
```

```html
Tab sheet content: 
<div class="tab-sheet-content" style="border: 3px solid orange; background-color: rgba(255, 165, 0, 0.1);">
      <!-- Main Tab Sheet -->
      <div id="mainSheet" class="tab-sheet">
    <div class="section">
      <h3>🔑 AI Model Selection</h3>
    <select id="aiModel" class="api-key-input" style="margin-bottom: 10px;">
      <option value="auto">Auto (Balance Quality &amp; Speed - Recommended)</option>
      <option value="gemini-2.5-flash">Gemini 2.5 Flash (Latest &amp; Fastest)</option>
      <option value="nano-banana">Nano Banana (Ultra Lightweight)</option>
      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Highest Quality)</option>
      <option value="gemini-2.0-flash">Gemini 2.0 Flash (Stable)</option>
      <option value="gemini-flash-latest">Gemini Flash Latest</option>
      <option value="openai-gpt">OpenAI GPT-4</option>
      <option value="claude">Claude 3.5 Sonnet</option>
    </select>
    <div id="customApiKeySection" style="display: none;">
      <input type="password" id="customApiKey" class="api-key-input" placeholder="Enter your API Key for selected model">
    </div>
    <div id="apiStatus" class="status success" style="display: none;">Text extracted automatically!</div>
  </div>
  
  <div class="section">
    <h3>📚 RAT (Rancangan Aktivitas Tutorial)</h3>
    <div style="margin-bottom: 15px;">
      <label style="display: block; font-size: 12px; color: rgba(255,255,255,0.9); margin-bottom: 5px; font-weight: 600;">Deskripsi Singkat Mata Kuliah:</label>
      <textarea id="deskripsiMataKuliah" placeholder="Masukkan deskripsi singkat mata kuliah dari RAT..." style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; background: rgba(255, 255, 255, 0.95); color: #333; font-size: 12px; resize: vertical; box-sizing: border-box; font-family: inherit; outline: none; transition: border-color 0.3s ease;"></textarea>
    </div>
    <div style="margin-bottom: 15px;">
      <label style="display: block; font-size: 12px; color: rgba(255,255,255,0.9); margin-bottom: 5px; font-weight: 600;">Capaian Pembelajaran Mata Kuliah:</label>
      <textarea id="capaianPembelajaran" placeholder="Masukkan capaian pembelajaran mata kuliah dari RAT..." style="width: 100%; min-height: 80px; padding: 8px; border: 1px solid rgba(255,255,255,0.3); border-radius: 6px; background: rgba(255, 255, 255, 0.95); color: #333; font-size: 12px; resize: vertical; box-sizing: border-box; font-family: inherit; outline: none; transition: border-color 0.3s ease;"></textarea>
    </div>
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
      <button id="clearRAT" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(220, 20, 60, 0.4); color: white; font-size: 12px; cursor: pointer; transition: all 0.3s ease;">🗑️ Clear All</button>
      <button id="pasteFromClipboard" style="flex: 1; padding: 8px; border: none; border-radius: 6px; background: rgba(30, 144, 255, 0.4); color: white; font-size: 12px; cursor: pointer; transition: all 0.3s ease;">📋 Paste</button>
    </div>
    <div id="ratStatus" class="status info" style="display: none;">RAT content cleared</div>
  </div>
  
  <div class="section">
    <h3>📝 Extracted Text</h3>
    <div id="extractedText" class="extracted-text" style="display: block;">Dashboard

Site home

Site pages

My courses

MKKI4201.252

STIK4111.11

Participants

Grades

Pendahuluan

Sesi 1

Kehadiran Sesi ke-1

Mekanisme Kerja, Pembuatan Objek, dan Informasi Ba...

Pengayaan 1

Diskusi.1

Kuis 1

Sesi 2

Sesi 3

Sesi 4

Sesi 5

Sesi 6

Sesi 7

Sesi 8

STSI4102.169

Courses</div>
  </div>
  
  <div class="section">
    <h3>🤖 AI Response</h3>
    <button id="generateAnswer">Generate Answer with AI</button>
    <button id="tryDifferentModel" style="display: none; background: rgba(255, 165, 0, 0.4); border: 1px solid rgba(255, 165, 0, 0.7);">Try Different Model</button>
    <div class="loading" id="loading">
      <div class="spinner"></div>
      <div>Generating answer...</div>
    </div>
    <div id="aiResponseContainer" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <span style="font-size: 12px; color: rgba(255,255,255,0.7);">AI Response:</span>
        <button id="copyResponse" style="background: rgba(46, 139, 87, 0.4); border: 1px solid rgba(46, 139, 87, 0.7); color: white; padding: 5px 10px; border-radius: 4px; font-size: 11px; cursor: pointer; transition: all 0.3s ease;">📋 Copy</button>
      </div>
      <div id="aiResponse" class="ai-response"></div>
    </div>
      </div>
      
      <!-- Penilaian Tab Sheet -->
      <div id="penilaianSheet" class="tab-sheet active">
        <div class="section" style="border: 5px solid red; background-color: rgba(255, 0, 0, 0.3); min-height: 300px; position: relative; z-index: 9999;">
          <h3 style="color: white; font-size: 16px; font-weight: bold; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">📊 Analisis PDF &amp; Penilaian</h3>
          <p style="font-size: 14px; color: white; margin-bottom: 15px; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            Upload PDF yang telah didownload dari diskusi mahasiswa untuk dianalisis relevansinya dengan pertanyaan diskusi.
          </p>
          
          <div style="margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <div style="position: relative; margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
              <input type="file" id="pdfUpload" accept=".pdf" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
              <label for="pdfUpload" style="display: block; width: 100%; padding: 15px; border: 1px solid blue; border-radius: 8px; background: rgba(0, 0, 255, 0.2); color: white; text-align: center; cursor: pointer; transition: 0.3s; font-size: 12px;">
                📁 <strong style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">Click untuk Upload PDF</strong><br style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
                <span style="font-size: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">Drag &amp; drop atau click untuk memilih file PDF</span>
              </label>
            </div>
            <div id="pdfStatus" class="status" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
          </div>
          
          <div id="pdfInfo" style="display: none; margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <div style="padding: 10px; background: rgba(0, 0, 255, 0.2); border-radius: 6px; border: 1px solid blue; color: white;">
              <h4 style="font-size: 14px; margin: 0px 0px 8px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">📄 File PDF:</h4>
              <div id="pdfFileName" style="font-size: 12px; color: white; margin-bottom: 5px; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
              <div id="pdfFileSize" style="font-size: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
            </div>
          </div>
          
          <div id="pdfAnalysis" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <h4 style="font-size: 14px; margin-bottom: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">🤖 Analisis AI:</h4>
            <div id="pdfResults" style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
            <button id="analyzePDF" style="width: 100%; padding: 10px; border: 1px solid blue; border-radius: 6px; background: rgba(0, 0, 255, 0.2); color: white; font-size: 12px; cursor: pointer; transition: 0.3s; margin-top: 10px;">
              🚀 Analisis PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
```

```html
Penilaian section found and styled:
<div class="section" style="border: 5px solid red; background-color: rgba(255, 0, 0, 0.3); min-height: 300px; position: relative; z-index: 9999;">
          <h3 style="color: white; font-size: 16px; font-weight: bold; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">📊 Analisis PDF &amp; Penilaian</h3>
          <p style="font-size: 14px; color: white; margin-bottom: 15px; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            Upload PDF yang telah didownload dari diskusi mahasiswa untuk dianalisis relevansinya dengan pertanyaan diskusi.
          </p>
          
          <div style="margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <div style="position: relative; margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
              <input type="file" id="pdfUpload" accept=".pdf" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
              <label for="pdfUpload" style="display: block; width: 100%; padding: 15px; border: 1px solid blue; border-radius: 8px; background: rgba(0, 0, 255, 0.2); color: white; text-align: center; cursor: pointer; transition: 0.3s; font-size: 12px;">
                📁 <strong style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">Click untuk Upload PDF</strong><br style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
                <span style="font-size: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">Drag &amp; drop atau click untuk memilih file PDF</span>
              </label>
            </div>
            <div id="pdfStatus" class="status" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
          </div>
          
          <div id="pdfInfo" style="display: none; margin-bottom: 15px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <div style="padding: 10px; background: rgba(0, 0, 255, 0.2); border-radius: 6px; border: 1px solid blue; color: white;">
              <h4 style="font-size: 14px; margin: 0px 0px 8px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">📄 File PDF:</h4>
              <div id="pdfFileName" style="font-size: 12px; color: white; margin-bottom: 5px; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
              <div id="pdfFileSize" style="font-size: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
            </div>
          </div>
          
          <div id="pdfAnalysis" style="display: none; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">
            <h4 style="font-size: 14px; margin-bottom: 10px; color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;">🤖 Analisis AI:</h4>
            <div id="pdfResults" style="color: white; background-color: rgba(0, 0, 255, 0.2); border: 1px solid blue;"></div>
            <button id="analyzePDF" style="width: 100%; padding: 10px; border: 1px solid blue; border-radius: 6px; background: rgba(0, 0, 255, 0.2); color: white; font-size: 12px; cursor: pointer; transition: 0.3s; margin-top: 10px;">
              🚀 Analisis PDF
            </button>
          </div>
        </div>
```
