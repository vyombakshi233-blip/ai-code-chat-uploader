const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Chat endpoint
app.post('/api/chat', express.json(), (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // TODO: Integrate with AI service (OpenAI, Claude, etc.)
  const response = `Echo: ${message}`;
  
  res.json({
    success: true,
    message: message,
    response: response,
    timestamp: new Date()
  });
});

// Code generation endpoint
app.post('/api/generate-code', express.json(), (req, res) => {
  const { prompt, language = 'javascript' } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // TODO: Integrate with AI service for code generation
  const generatedCode = `// Generated code for: ${prompt}\n// Language: ${language}\nfunction exampleFunction() {\n  console.log('AI generated code');\n}`;
  
  res.json({
    success: true,
    prompt: prompt,
    language: language,
    generatedCode: generatedCode,
    timestamp: new Date()
  });
});

// File upload endpoint
app.post('/api/upload-file', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    success: true,
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      path: `/uploads/${req.file.filename}`
    },
    timestamp: new Date()
  });
});

// Image upload endpoint
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Invalid image type' });
  }

  res.json({
    success: true,
    message: 'Image uploaded successfully',
    image: {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      path: `/uploads/${req.file.filename}`
    },
    timestamp: new Date()
  });
});

// Get uploaded files list
app.get('/api/uploads', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read uploads' });
    }
    res.json({
      success: true,
      files: files.map(file => ({ name: file, url: `/uploads/${file}` }))
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - POST /api/chat`);
  console.log(`   - POST /api/generate-code`);
  console.log(`   - POST /api/upload-file`);
  console.log(`   - POST /api/upload-image`);
  console.log(`   - GET  /api/uploads`);
});
