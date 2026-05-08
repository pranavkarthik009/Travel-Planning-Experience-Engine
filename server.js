import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// 1. Security & Efficiency Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for simplicity in local dev/demo
}));
app.use(compression());

// Rate Limiter: Max 50 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 50,
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// 2. CORS Setup
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || '*' : '*',
  methods: ['GET', 'POST']
};
app.use(cors(corsOptions));
app.use(express.json());

const io = new Server(httpServer, {
  cors: corsOptions
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Serve static files in production
app.use(express.static(path.join(__dirname, 'dist')));

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('search_itinerary', async (data) => {
    try {
      const { destination, dates } = data;
      
      socket.emit('status', 'Connecting to Gemini AI...');
      
      // Google Services: Added explicit safety settings instructions to the prompt
      const prompt = `You are an expert, professional travel planner. Create a highly detailed travel itinerary for ${destination} for the dates: ${dates}. Format the output in Markdown. Include daily schedules, top attractions, local food recommendations, and travel tips. Keep all content strictly family-friendly and safe for work.`;
      
      socket.emit('status', `Analyzing destination: ${destination}...`);
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured.');
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      socket.emit('status', 'Curating activities...');
      
      for await (const chunk of responseStream) {
        socket.emit('chunk', chunk.text);
      }

      socket.emit('status', 'Finalizing itinerary...');
      socket.emit('itinerary_ready', { complete: true });

    } catch (error) {
      console.error('Error generating itinerary:', error);
      socket.emit('error', { message: error.message || 'Failed to generate itinerary.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// For any other requests, send back index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
