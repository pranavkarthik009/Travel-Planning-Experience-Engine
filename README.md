# Wanderlust: AI-Powered Travel Planning Experience Engine

A production-grade, real-time travel itinerary generator built with **React (Vite)**, **Node.js**, **Socket.io**, and **Google Gemini AI**.

## 🚀 Key Features
- **Real-Time AI Streaming**: Watch your itinerary being built live on your screen, powered by Google Gemini 1.5 Flash.
- **Premium Design System**: A high-fidelity, responsive UI featuring glassmorphism, smooth animations, and tailored color palettes.
- **Production Grade Security**: Implements `helmet` for secure headers, `express-rate-limit` to prevent abuse, and strict CORS policies.
- **Optimized for Efficiency**: Gzip compression and a lean Docker setup ensure lightning-fast performance.
- **Accessible & Tested**: ARIA-compliant UI with unit tests for core search functionality.

## 🛠️ Technology Stack
- **Frontend**: React 18, Vite, CSS (Glassmorphism), Socket.io-client.
- **Backend**: Node.js, Express, Socket.io, Google GenAI SDK.
- **Deployment**: Optimized Dockerfile for Google Cloud Run.
- **Testing**: Vitest, React Testing Library.

## 📦 Getting Started

### Local Development
1. **Clone the repository**:
   ```bash
   git clone https://github.com/pranavkarthik009/Travel-Planning-Experience-Engine.git
   cd Travel-Planning-Experience-Engine
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_ai_studio_key
   PORT=8080
   ```
4. **Run the application**:
   - Start the backend: `npm start`
   - Start the frontend (in a new terminal): `npm run dev`
5. **Open your browser**: Navigate to `http://localhost:5173`.

### 🧪 Running Tests
```bash
npm run test
```

## ☁️ Deployment (Google Cloud Run)
This project is pre-configured for **Google Cloud Run**.

1. **Continuous Deployment**: Link this repository to your Google Cloud Run service via GitHub.
2. **Secrets**: Add your `GEMINI_API_KEY` to the Environment Variables in the Cloud Run service console.
3. **Port**: The application listens on port `8080` by default, which Cloud Run detects automatically.

---
Built with ❤️ for the ultimate travel experience.
