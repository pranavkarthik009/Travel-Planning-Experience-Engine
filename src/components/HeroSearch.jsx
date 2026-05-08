import { useState } from 'react';
import './HeroSearch.css';

const HeroSearch = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination) {
      onSearch({ destination, dates });
    }
  };

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title animate-fade-in">
          Design Your <br/> <span className="text-gradient">Dream Journey</span>
        </h1>
        <p className="hero-subtitle animate-fade-in delay-100">
          Experience AI-curated travel itineraries tailored just for you.
        </p>
        
        <form className="search-bar glass animate-fade-in delay-200" onSubmit={handleSubmit}>
          <div className="search-input-group">
            <label htmlFor="destination">Where to?</label>
            <input 
              type="text" 
              id="destination" 
              placeholder="e.g. Kyoto, Japan" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="search-divider"></div>
          <div className="search-input-group">
            <label htmlFor="dates">When?</label>
            <input 
              type="text" 
              id="dates" 
              placeholder="Add dates" 
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn">
            Explore
          </button>
        </form>
      </div>
      <div className="hero-background">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
      </div>
    </div>
  );
};

export default HeroSearch;
