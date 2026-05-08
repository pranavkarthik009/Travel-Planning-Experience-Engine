import { useState } from 'react';
import './App.css';
import HeroSearch from './components/HeroSearch';
import DestinationCard from './components/DestinationCard';
import ItineraryDisplay from './components/ItineraryDisplay';

const destinations = [
  { id: 1, name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800&auto=format&fit=crop', desc: 'Ancient temples and modern culture.' },
  { id: 2, name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=800&auto=format&fit=crop', desc: 'Stunning sunsets and white architecture.' },
  { id: 3, name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop', desc: 'Breathtaking mountains and crystal lakes.' }
];

function App() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (searchData) => {
    setLoading(true);
    // Simulate API call for generating itinerary
    setTimeout(() => {
      setItinerary({
        destination: searchData.destination || 'Unknown Destination',
        dates: searchData.dates || 'Upcoming',
        days: [
          { day: 1, title: 'Arrival & Exploration', activities: ['Check-in to hotel', 'Local market tour', 'Welcome dinner'] },
          { day: 2, title: 'Cultural Immersion', activities: ['Guided museum visit', 'Traditional lunch', 'City walking tour'] },
          { day: 3, title: 'Nature & Relaxation', activities: ['Morning hike', 'Spa session', 'Farewell sunset cruise'] }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="app-container">
      <header className="app-header glass">
        <div className="logo text-gradient">Wanderlust</div>
        <nav className="nav-links">
          <a href="#">Destinations</a>
          <a href="#">My Trips</a>
          <a href="#">Sign In</a>
        </nav>
      </header>

      <main>
        <HeroSearch onSearch={handleSearch} />

        {loading && (
          <div className="loading-container animate-fade-in">
            <div className="spinner"></div>
            <p>Crafting your perfect journey...</p>
          </div>
        )}

        {itinerary && !loading && (
          <section className="itinerary-section animate-fade-in">
            <ItineraryDisplay itinerary={itinerary} />
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
    </div>
  );
}

export default App;
