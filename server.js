import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';

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

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

// Serve static files in production
app.use(express.static(path.join(__dirname, 'dist')));

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

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
        model: 'gemini-1.5-flash',
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

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
