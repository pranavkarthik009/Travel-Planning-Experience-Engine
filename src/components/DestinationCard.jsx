import './DestinationCard.css';

const DestinationCard = ({ destination, onClick }) => {
  return (
    <div className="destination-card glass" onClick={onClick}>
      <div className="card-image-wrapper">
        <img src={destination.image} alt={destination.name} className="card-image" />
        <div className="card-overlay"></div>
      </div>
      <div className="card-content">
        <h3 className="card-title">{destination.name}</h3>
        <p className="card-desc">{destination.desc}</p>
        <div className="card-footer">
          <span className="card-action text-gradient">Explore</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <defs>
              <linearGradient id="paint0_linear" x1="5" y1="12" x2="19" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--color-gradient-start)"/>
                <stop offset="1" stopColor="var(--color-gradient-end)"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
