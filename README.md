# AI Code Chat Uploader

A full-stack application with AI-powered chat, code generation, and file/image upload capabilities.

## Features

✨ **Chat Interface** - Talk to an AI assistant
💻 **Code Generator** - Generate code in multiple languages
📁 **File Upload** - Upload and manage files
🖼️ **Image Upload** - Upload and manage images
📋 **File Management** - View all uploaded files

## API Endpoints

### Health Check
- `GET /api/health` - Check if API is running

### Chat
- `POST /api/chat`
  - Body: `{ "message": "your message" }`
  - Returns: `{ "response": "ai response" }`

### Code Generation
- `POST /api/generate-code`
  - Body: `{ "prompt": "code description", "language": "javascript" }`
  - Returns: `{ "generatedCode": "..." }`

### File Operations
- `POST /api/upload-file` - Upload a file
- `POST /api/upload-image` - Upload an image
- `GET /api/uploads` - List all uploaded files

## Setup

### Prerequisites
- Node.js (v14+)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/vyombakshi233-blip/ai-code-chat-uploader.git
cd ai-code-chat-uploader

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the server
npm start
```

### Development

```bash
npm run dev  # Uses nodemon for auto-restart
```

The app will be available at `http://localhost:5000`

## Project Structure

```
.
├── server.js           # Express server with API routes
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── public/
│   ├── index.html      # Web interface
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── uploads/            # User-uploaded files (auto-created)
└── README.md           # Documentation
```

## Integration with AI Services

To connect with real AI services like OpenAI or Anthropic:

1. Install the AI SDK:
   ```bash
   npm install openai  # or anthropic
   ```

2. Update `server.js` with your AI service integration in the `/api/chat` and `/api/generate-code` endpoints

3. Add your API key to `.env`

## Usage

1. **Chat Tab**: Type messages and get AI responses
2. **Code Generator**: Describe what code you need, select a language, and generate
3. **Upload Files**: Drag and drop or click to upload files
4. **Upload Images**: Drag and drop or click to upload images
5. **My Files**: View all uploaded files and download them

## License

MIT
