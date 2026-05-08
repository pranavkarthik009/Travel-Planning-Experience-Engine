import { useState } from 'react';
import PropTypes from 'prop-types';
import './HeroSearch.css';

/**
 * Hero Search Component
 * Provides the main search interface for the travel engine.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSearch - Callback function when search is submitted
 */
const HeroSearch = ({ onSearch }) => {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');

  /**
   * Handles form submission
   * @param {Event} e - Submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch({ destination: destination.trim(), dates: dates.trim() });
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
        
        <form className="search-bar glass animate-fade-in delay-200" onSubmit={handleSubmit} role="search">
          <div className="search-input-group">
            <label htmlFor="destination">Where to?</label>
            <input 
              type="text" 
              id="destination" 
              aria-label="Enter your destination"
              placeholder="e.g. Kyoto, Japan" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>
          <div className="search-divider" aria-hidden="true"></div>
          <div className="search-input-group">
            <label htmlFor="dates">When?</label>
            <input 
              type="text" 
              id="dates" 
              aria-label="Enter travel dates"
              placeholder="Add dates" 
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>
          <button type="submit" className="search-btn" aria-label="Generate Itinerary">
            Explore
          </button>
        </form>
      </div>
      <div className="hero-background" aria-hidden="true">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
      </div>
    </div>
  );
};

HeroSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default HeroSearch;
