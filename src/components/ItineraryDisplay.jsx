import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import './ItineraryDisplay.css';

/**
 * Itinerary Display Component
 * Renders the AI-generated itinerary using Markdown.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.itinerary - The itinerary metadata (destination, dates)
 * @param {string} props.content - The streamed markdown content
 * @param {boolean} props.isStreaming - Whether the content is currently being streamed
 */
const ItineraryDisplay = ({ itinerary, content, isStreaming }) => {
  if (!itinerary) return null;

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
  isStreaming: PropTypes.boolean,
};

export default ItineraryDisplay;
