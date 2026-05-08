import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import './ItineraryDisplay.css';

/**
 * Itinerary Display Component
 * Renders the AI-generated itinerary and a Google Maps view of the destination.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.itinerary - The itinerary metadata (destination, dates)
 * @param {string} props.content - The streamed markdown content
 * @param {boolean} props.isStreaming - Whether the content is currently being streamed
 */
const ItineraryDisplay = ({ itinerary, content, isStreaming }) => {
  if (!itinerary) return null;

  // Google Services: Dynamic Maps Embed for visual destination context
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}&q=${encodeURIComponent(itinerary.destination)}`;

  return (
    <article className="itinerary-container glass" aria-label="Generated Travel Itinerary">
      <div className="itinerary-header">
        <h2 className="itinerary-title">
          Your Journey to <span className="text-gradient">{itinerary.destination}</span>
        </h2>
        <p className="itinerary-dates" aria-label={`Travel dates: ${itinerary.dates}`}>
          {itinerary.dates}
        </p>
      </div>

      {/* Google Services: Maps Integration */}
      {import.meta.env.VITE_GOOGLE_MAPS_KEY && !isStreaming && (
        <div className="itinerary-map animate-fade-in">
          <iframe
            title={`Map showing ${itinerary.destination}`}
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={mapUrl}
          ></iframe>
        </div>
      )}
      
      <div className="itinerary-content" role="region" aria-label="Itinerary Details">
        <ReactMarkdown>{content}</ReactMarkdown>
        {isStreaming && (
          <span className="cursor-blink" aria-label="AI is typing..." role="status"></span>
        )}
      </div>
    </article>
  );
};

ItineraryDisplay.propTypes = {
  itinerary: PropTypes.shape({
    destination: PropTypes.string,
    dates: PropTypes.string,
  }),
  content: PropTypes.string,
  isStreaming: PropTypes.bool,
};

export default ItineraryDisplay;
