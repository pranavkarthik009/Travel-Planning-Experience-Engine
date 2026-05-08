import './ItineraryDisplay.css';

const ItineraryDisplay = ({ itinerary }) => {
  return (
    <div className="itinerary-container glass">
      <div className="itinerary-header">
        <h2 className="itinerary-title">
          Your Journey to <span className="text-gradient">{itinerary.destination}</span>
        </h2>
        <p className="itinerary-dates">{itinerary.dates}</p>
      </div>
      
      <div className="timeline">
        {itinerary.days.map((day, index) => (
          <div className="timeline-item" style={{ animationDelay: `${index * 150}ms` }} key={day.day}>
            <div className="timeline-dot"></div>
            <div className="timeline-content glass">
              <div className="day-badge">Day {day.day}</div>
              <h3 className="day-title">{day.title}</h3>
              <ul className="activity-list">
                {day.activities.map((activity, actIdx) => (
                  <li key={actIdx}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="itinerary-actions">
        <button className="btn-primary">Book Experience</button>
        <button className="btn-secondary">Save for Later</button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
