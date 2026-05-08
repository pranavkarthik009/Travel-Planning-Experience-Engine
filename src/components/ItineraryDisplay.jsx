import ReactMarkdown from 'react-markdown';
import './ItineraryDisplay.css';

const ItineraryDisplay = ({ itinerary, content, isStreaming }) => {
  if (!itinerary) return null;

  return (
    <div className="itinerary-container glass">
      <div className="itinerary-header">
        <h2 className="itinerary-title">
          Your Journey to <span className="text-gradient">{itinerary.destination}</span>
        </h2>
        <p className="itinerary-dates">{itinerary.dates}</p>
      </div>
      
      <div className="itinerary-content">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && <span className="cursor-blink"></span>}
      </div>
      
      {!isStreaming && content && (
        <div className="itinerary-actions animate-fade-in">
          <button className="btn-primary">Book Experience</button>
          <button className="btn-secondary">Save for Later</button>
        </div>
      )}
    </div>
  );
};

export default ItineraryDisplay;
