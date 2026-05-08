import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './server/auth.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use';

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', authRouter);

// Serve static files in production
app.use(express.static(path.join(__dirname, 'dist')));

// WebSocket connections
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return next(new Error('Authentication error'));
    socket.userId = decoded.userId;
    next();
  });
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.userId}`);

  socket.on('search_itinerary', async (data) => {
    try {
      const { destination, dates } = data;
      
      socket.emit('status', 'Connecting to Gemini AI...');
      
      const prompt = `You are an expert travel planner. Create a highly detailed travel itinerary for ${destination} for the dates: ${dates}. Format the output in Markdown. Include daily schedules, top attractions, local food recommendations, and travel tips.`;
      
      socket.emit('status', `Analyzing destination: ${destination}...`);
      
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('Gemini API key is not configured.');
      }

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      socket.emit('status', 'Curating activities...');
      
      let fullContent = '';
      for await (const chunk of responseStream) {
        fullContent += chunk.text;
        socket.emit('chunk', chunk.text);
      }

      socket.emit('status', 'Saving itinerary...');

      // Save to database
      await prisma.itinerary.create({
        data: {
          userId: socket.userId,
          destination,
          dates,
          content: fullContent
        }
      });

      socket.emit('itinerary_ready', { complete: true });

    } catch (error) {
      console.error('Error generating itinerary:', error);
      socket.emit('error', { message: error.message || 'Failed to generate itinerary.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// For any other requests, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
