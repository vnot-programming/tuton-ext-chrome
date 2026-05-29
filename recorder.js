document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('preview');
  const canvasElement = document.getElementById('outputCanvas');
  const canvasCtx = canvasElement.getContext('2d');

  const startCameraBtn = document.getElementById('startCamera');
  const startRecordBtn = document.getElementById('startRecord');
  const stopRecordBtn = document.getElementById('stopRecord');
  const recordingIndicator = document.getElementById('recordingIndicator');
  const timerDisplay = document.getElementById('timerDisplay');

  const bgMode = document.getElementById('bgMode');
  const uploadBtn = document.getElementById('uploadBtn');
  const bgImageInput = document.getElementById('bgImageInput');
  const bgWarning = document.getElementById('bgWarning');
  const toggleFlipBtn = document.getElementById('toggleFlip');
  
  const cameraSelect = document.getElementById('cameraSelect');
  const micSelect = document.getElementById('micSelect');
  const deviceControls = document.querySelector('.device-controls');

  let stream = null;
  let mediaRecorder = null;
  let recordedChunks = [];
  let timerInterval = null;
  let startTime = null;
  let customBgImage = null;
  let camera = null;
  let currentVideoDeviceId = null;
  let currentAudioDeviceId = null;

  // Initialize MediaPipe Selfie Segmentation
  const selfieSegmentation = new SelfieSegmentation({locateFile: (file) => {
    return `lib/selfie_segmentation/${file}`;
  }});

  selfieSegmentation.setOptions({
    modelSelection: 1, // 1 for landscape mode, faster
  });

  selfieSegmentation.onResults(onResults);

  function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    const mode = bgMode.value;

    if (mode === 'normal') {
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    } else {
      // Draw segmentation mask (white where the person is)
      canvasCtx.globalCompositeOperation = 'source-over';
      canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

      // Draw the original image but only where the mask is (source-in)
      canvasCtx.globalCompositeOperation = 'source-in';
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      // Now draw the background BEHIND the person (destination-over)
      canvasCtx.globalCompositeOperation = 'destination-over';

      if (mode === 'blur') {
        // Blur the background
        canvasCtx.filter = 'blur(15px)';
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.filter = 'none'; // reset
      } else if (mode === 'image') {
        if (customBgImage) {
          canvasCtx.drawImage(customBgImage, 0, 0, canvasElement.width, canvasElement.height);
        } else {
          canvasCtx.fillStyle = '#1a241f'; // default dark bg
          canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        }
      }
    }
    canvasCtx.restore();
  }

  // Event Listener for Background Mode
  bgMode.addEventListener('change', (e) => {
    if (e.target.value === 'image') {
      uploadBtn.style.display = 'inline-block';
      bgWarning.style.display = 'inline-block';
      if (!customBgImage) {
        alert("Silakan unggah gambar dari PC Anda. Gambar ini hanya bersifat sementara (tidak disimpan setelah ditutup).");
      }
    } else {
      uploadBtn.style.display = 'none';
      bgWarning.style.display = 'none';
    }
  });

  // Handle Image Upload Temporarily
  bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          customBgImage = img;
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  async function getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    cameraSelect.innerHTML = '';
    micSelect.innerHTML = '';
    
    devices.forEach(device => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      if (device.kind === 'videoinput') {
        option.text = device.label || `Camera ${cameraSelect.length + 1}`;
        cameraSelect.appendChild(option);
      } else if (device.kind === 'audioinput') {
        option.text = device.label || `Microphone ${micSelect.length + 1}`;
        micSelect.appendChild(option);
      }
    });

    if (cameraSelect.options.length > 0) {
      cameraSelect.value = currentVideoDeviceId || cameraSelect.options[0].value;
      currentVideoDeviceId = cameraSelect.value;
    }
    if (micSelect.options.length > 0) {
      micSelect.value = currentAudioDeviceId || micSelect.options[0].value;
      currentAudioDeviceId = micSelect.value;
    }

    deviceControls.style.display = 'flex';
  }

  async function startCamera(videoDeviceId = null, audioDeviceId = null) {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (camera) {
        camera.stop();
      }

      startCameraBtn.disabled = true;
      startCameraBtn.textContent = '⏳';

      const constraints = {
        video: videoDeviceId 
          ? { deviceId: { exact: videoDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } 
          : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" },
        audio: audioDeviceId 
          ? { deviceId: { exact: audioDeviceId } } 
          : true
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      preview.srcObject = stream;
      
      await getDevices();
      
      // Setup MediaPipe Camera Utility
      camera = new Camera(preview, {
        onFrame: async () => {
          await selfieSegmentation.send({image: preview});
        },
        width: 1280,
        height: 720
      });
      await camera.start();

      startCameraBtn.style.display = 'none';
      startRecordBtn.disabled = false;
    } catch (err) {
      console.error("Error accessing media devices.", err);
      alert("Gagal mengakses kamera/mikrofon. Pastikan Anda telah memberikan izin di browser.");
      startCameraBtn.disabled = false;
      startCameraBtn.textContent = '📸';
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      timerDisplay.textContent = formatTime(elapsed);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerDisplay.textContent = "00:00";
  }

  function startRecording() {
    if (!stream) return;

    recordedChunks = [];
    
    // Combine Video from Canvas and Audio from Microphone
    const canvasStream = canvasElement.captureStream(30); // 30 FPS
    const combinedStream = new MediaStream();
    
    // Add video track
    canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));
    
    // Add audio track(s)
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks.forEach(track => combinedStream.addTrack(track));
    } else {
      console.warn("Tidak ada track audio yang ditemukan pada stream kamera.");
    }

    // Biarkan browser memilih codec WebM default yang paling stabil untuk kombinasi A/V ini
    const mimeType = 'video/webm';
    
    mediaRecorder = new MediaRecorder(combinedStream, { mimeType });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      downloadVideo(blob);
    };

    mediaRecorder.start(1000); // collect 1 sec chunks
    
    startRecordBtn.disabled = true;
    stopRecordBtn.disabled = false;
    recordingIndicator.classList.add('active');
    startTimer();
  }

  function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      startRecordBtn.disabled = false;
      stopRecordBtn.disabled = true;
      recordingIndicator.classList.remove('active');
      stopTimer();
    }
  }

  function downloadVideo(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    
    // Format nama file
    const date = new Date();
    const timestamp = `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2,'0')}${date.getDate().toString().padStart(2,'0')}_${date.getHours().toString().padStart(2,'0')}${date.getMinutes().toString().padStart(2,'0')}`;
    a.download = `UT_Rekaman_VB_${timestamp}.webm`;
    
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }

  // Event Listeners
  startCameraBtn.addEventListener('click', () => startCamera());
  startRecordBtn.addEventListener('click', startRecording);
  stopRecordBtn.addEventListener('click', stopRecording);
  
  cameraSelect.addEventListener('change', (e) => {
    currentVideoDeviceId = e.target.value;
    startCamera(currentVideoDeviceId, currentAudioDeviceId);
  });

  micSelect.addEventListener('change', (e) => {
    currentAudioDeviceId = e.target.value;
    startCamera(currentVideoDeviceId, currentAudioDeviceId);
  });
  
  toggleFlipBtn.addEventListener('click', () => {
    canvasElement.classList.toggle('mirrored');
  });
});
