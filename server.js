import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { geminiService } from './server/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

// Efficiency: In-memory cache for itineraries
const itineraryCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

const app = express();
const httpServer = createServer(app);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://maps.googleapis.com"],
      connectSrc: ["'self'", "https://generativelanguage.googleapis.com", "ws:", "wss:"],
      frameSrc: ["'self'", "https://www.google.com"], // For Maps Embed
    },
  },
}));

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL || '*' : '*',
  methods: ['GET', 'POST'],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

const io = new Server(httpServer, {
  cors: corsOptions
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('search_itinerary', async (data) => {
    try {
      const destination = DOMPurify.sanitize(data.destination || '').trim();
      const dates = DOMPurify.sanitize(data.dates || '').trim();
      
      if (!destination) {
        return socket.emit('error', { message: 'Destination is required.' });
      }

      const cacheKey = `${destination.toLowerCase()}_${dates.toLowerCase()}`;
      
      // Efficiency: Check cache first
      if (itineraryCache.has(cacheKey)) {
        const cached = itineraryCache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          console.log(`Cache hit for: ${destination}`);
          socket.emit('status', 'Retrieving from optimized cache...');
          socket.emit('chunk', cached.content);
          socket.emit('itinerary_ready', { complete: true });
          return;
        }
      }

      socket.emit('status', 'Connecting to Gemini AI...');
      socket.emit('status', `Analyzing destination with Google Search: ${destination}...`);
      
      const responseStream = await geminiService.generateItineraryStream(destination, dates);

      socket.emit('status', 'Curating activities...');
      
      let fullContent = '';
      for await (const chunk of responseStream.stream) {
        const chunkText = chunk.text();
        fullContent += chunkText;
        socket.emit('chunk', chunkText);
      }

      // Efficiency: Store in cache
      itineraryCache.set(cacheKey, { content: fullContent, timestamp: Date.now() });

      socket.emit('status', 'Finalizing itinerary...');
      socket.emit('itinerary_ready', { complete: true });

    } catch (error) {
      console.error('Gemini Error:', error);
      socket.emit('error', { message: 'Failed to generate itinerary. Please try again.' });
    }
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV || 'development'}`);
});
