import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';
import HeroSearch from './components/HeroSearch';
import DestinationCard from './components/DestinationCard';
import ItineraryDisplay from './components/ItineraryDisplay';
import AuthModal from './components/AuthModal';

const destinations = [
  { id: 1, name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', desc: 'Ancient temples and modern culture.' },
  { id: 2, name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop', desc: 'Stunning sunsets and white architecture.' },
  { id: 3, name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop', desc: 'Breathtaking mountains and crystal lakes.' }
];

function App() {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [socket, setSocket] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [streamContent, setStreamContent] = useState('');

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
      initSocket(token);
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  const initSocket = (token) => {
    // If we're not in production, point to the dev server, otherwise use relative path
    const socketUrl = import.meta.env.DEV ? 'http://localhost:8080' : '';
    const newSocket = io(socketUrl, {
      auth: { token }
    });

    newSocket.on('status', (msg) => setStatus(msg));
    newSocket.on('chunk', (text) => setStreamContent(prev => prev + text));
    newSocket.on('itinerary_ready', () => {
      setLoading(false);
      setStatus('');
    });
    newSocket.on('error', (err) => {
      console.error(err);
      setStatus('Error: ' + err.message);
      setLoading(false);
    });

    setSocket(newSocket);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    const token = localStorage.getItem('token');
    initSocket(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  const handleSearch = (searchData) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setLoading(true);
    setItinerary({ destination: searchData.destination, dates: searchData.dates });
    setStreamContent('');
    setStatus('Initializing connection...');

    if (socket) {
      socket.emit('search_itinerary', searchData);
    } else {
      setStatus('Socket connection not found. Please log in again.');
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="logo text-gradient">Wanderlust</div>
        <nav className="nav-links">
          <a href="#">Destinations</a>
          {user ? (
            <>
              <a href="#">My Trips</a>
              <div className="user-profile">
                <span>{user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
              </div>
            </>
          ) : (
            <button onClick={() => setIsAuthModalOpen(true)} className="nav-btn">Sign In</button>
          )}
        </nav>
      </header>

      <main>
        <HeroSearch onSearch={handleSearch} />

        {(loading || streamContent) && (
          <section className="itinerary-section animate-fade-in">
            {status && (
              <div className="streaming-status">
                <div className="spinner small"></div>
                <p className="text-gradient">{status}</p>
              </div>
            )}
            <ItineraryDisplay 
              itinerary={itinerary} 
              content={streamContent} 
              isStreaming={loading} 
            />
          </section>
        )}

        {!itinerary && !loading && (
          <section className="destinations-section animate-fade-in delay-200">
            <h2 className="section-title">Trending <span className="text-gradient">Destinations</span></h2>
            <div className="destinations-grid">
              {destinations.map(dest => (
                <DestinationCard key={dest.id} destination={dest} onClick={() => handleSearch({ destination: dest.name })} />
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Wanderlust Experience Engine. All rights reserved.</p>
      </footer>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess} 
      />
    </div>
  );
}

export default App;
