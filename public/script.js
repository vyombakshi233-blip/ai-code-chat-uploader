const API_BASE_URL = 'http://localhost:5000/api';

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabName = btn.getAttribute('data-tab');
    switchTab(tabName);
  });
});

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Show selected tab
  document.getElementById(tabName).classList.add('active');
  event.target.classList.add('active');
}

// Chat functionality
function sendChat() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();

  if (!message) return;

  // Add user message to chat
  addChatMessage(message, 'user');
  input.value = '';

  // Send to API
  fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  })
    .then(res => res.json())
    .then(data => {
      addChatMessage(data.response, 'assistant');
    })
    .catch(err => {
      addChatMessage('Error: ' + err.message, 'assistant');
      console.error(err);
    });
}

function addChatMessage(text, sender) {
  const messagesDiv = document.getElementById('chatMessages');
  const messageEl = document.createElement('div');
  messageEl.className = `message ${sender}`;
  messageEl.textContent = text;
  messagesDiv.appendChild(messageEl);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Code generation
function generateCode() {
  const prompt = document.getElementById('codePrompt').value.trim();
  const language = document.getElementById('language').value;

  if (!prompt) {
    alert('Please enter a code prompt');
    return;
  }

  fetch(`${API_BASE_URL}/generate-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language })
  })
    .then(res => res.json())
    .then(data => {
      const output = document.getElementById('codeOutput');
      output.innerHTML = `
        <h4>Generated Code:</h4>
        <pre><code>${data.generatedCode}</code></pre>
      `;
    })
    .catch(err => {
      alert('Error generating code: ' + err.message);
      console.error(err);
    });
}

// File upload
function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select a file');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  fetch(`${API_BASE_URL}/upload-file`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const status = document.getElementById('fileStatus');
      if (data.success) {
        status.textContent = 'File uploaded successfully!';
        status.className = 'status success';
        fileInput.value = '';
      }
    })
    .catch(err => {
      const status = document.getElementById('fileStatus');
      status.textContent = 'Error uploading file: ' + err.message;
      status.className = 'status error';
      console.error(err);
    });
}

// Image upload
function uploadImage() {
  const imageInput = document.getElementById('imageInput');
  const file = imageInput.files[0];

  if (!file) {
    alert('Please select an image');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  fetch(`${API_BASE_URL}/upload-image`, {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      const status = document.getElementById('imageStatus');
      if (data.success) {
        status.textContent = 'Image uploaded successfully!';
        status.className = 'status success';
        imageInput.value = '';
      }
    })
    .catch(err => {
      const status = document.getElementById('imageStatus');
      status.textContent = 'Error uploading image: ' + err.message;
      status.className = 'status error';
      console.error(err);
    });
}

// Load files list
function loadFiles() {
  fetch(`${API_BASE_URL}/uploads`)
    .then(res => res.json())
    .then(data => {
      const filesList = document.getElementById('filesList');
      if (data.files.length === 0) {
        filesList.innerHTML = '<p>No files uploaded yet</p>';
        return;
      }
      filesList.innerHTML = data.files
        .map(
          file =>
            `<div class="file-item">
          <a href="${file.url}" target="_blank">${file.name}</a>
        </div>`
        )
        .join('');
    })
    .catch(err => {
      console.error('Error loading files:', err);
    });
}

// Drag and drop support
setupDropZone('fileDropZone', 'fileInput');
setupDropZone('imageDropZone', 'imageInput');

function setupDropZone(dropZoneId, inputId) {
  const dropZone = document.getElementById(dropZoneId);
  const input = document.getElementById(inputId);

  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.style.background = '#f0f2ff';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => {
      dropZone.style.background = '';
    });
  });

  dropZone.addEventListener('drop', e => {
    const dt = e.dataTransfer;
    const files = dt.files;
    input.files = files;
  });

  dropZone.addEventListener('click', () => input.click());
}

// Enter key support for chat
document.getElementById('chatInput')?.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendChat();
});
