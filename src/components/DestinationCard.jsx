import PropTypes from 'prop-types';
import './DestinationCard.css';

/**
 * Destination Card Component
 * Displays a trending destination with an image and description.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.destination - The destination data
 * @param {Function} props.onClick - Click handler for the card
 */
const DestinationCard = ({ destination, onClick }) => {
  return (
    <div 
      className="dest-card glass" 
      onClick={onClick}
      role="button"
      tabIndex="0"
      aria-label={`Explore ${destination.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="dest-image-wrapper">
        <img 
          src={destination.image} 
          alt={`A beautiful view of ${destination.name}`} 
          className="dest-image" 
          loading="lazy"
        />
        <div className="dest-overlay">
          <span className="dest-badge">Trending</span>
        </div>
      </div>
      <div className="dest-info">
        <h3 className="dest-name">{destination.name}</h3>
        <p className="dest-desc">{destination.desc}</p>
      </div>
    </div>
  );
};

DestinationCard.propTypes = {
  destination: PropTypes.shape({
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default DestinationCard;
