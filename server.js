import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DOMPurify for input sanitization
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const app = express();
const httpServer = createServer(app);

// 1. Enhanced Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "ws:", "wss:"],
    },
  },
}));

app.use(compression());

// Rate Limiter: Prevent API abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// 2. CORS Strategy
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || '*' : '*',
  methods: ['GET', 'POST'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// 3. Google Gemini AI Configuration
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

const generationConfig = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 2048,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

const io = new Server(httpServer, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('search_itinerary', async (data) => {
    try {
      // Input Sanitization
      const destination = DOMPurify.sanitize(data.destination || '');
      const dates = DOMPurify.sanitize(data.dates || '');
      
      if (!destination) {
        return socket.emit('error', { message: 'Destination is required.' });
      }

      socket.emit('status', 'Connecting to Gemini AI...');
      
      const prompt = `You are a professional travel planner. Create a detailed travel itinerary for ${destination} for the dates: ${dates}. Format in Markdown. Include daily schedules, food, and tips. Focus on safety and premium experiences.`;
      
      socket.emit('status', `Analyzing destination: ${destination}...`);
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is missing.');
      }

      const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const responseStream = await model.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig,
        safetySettings,
      });

      socket.emit('status', 'Curating activities...');
      
      for await (const chunk of responseStream.stream) {
        const chunkText = chunk.text();
        socket.emit('chunk', chunkText);
      }

      socket.emit('status', 'Finalizing itinerary...');
      socket.emit('itinerary_ready', { complete: true });

    } catch (error) {
      console.error('Gemini Error:', error);
      socket.emit('error', { message: 'Failed to generate itinerary. Please check your AI quota.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Catch-all route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} (NODE_ENV: ${process.env.NODE_ENV})`);
});
