import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ItineraryDisplay from './ItineraryDisplay';

describe('ItineraryDisplay', () => {
  const mockItinerary = {
    destination: 'Tokyo',
    dates: 'Next Week'
  };

  it('renders nothing when no itinerary is provided', () => {
    const { container } = render(<ItineraryDisplay itinerary={null} content="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the destination and content correctly', () => {
    render(
      <ItineraryDisplay 
        itinerary={mockItinerary} 
        content="# Day 1: Arrival" 
        isStreaming={false} 
      />
    );
    
    expect(screen.getByText(/Tokyo/i)).toBeDefined();
    expect(screen.getByText(/Day 1: Arrival/i)).toBeDefined();
  });

  it('shows the cursor blinker while streaming', () => {
    render(
      <ItineraryDisplay 
        itinerary={mockItinerary} 
        content="Streaming..." 
        isStreaming={true} 
      />
    );
    
    const cursor = screen.getByLabelText('AI is typing...');
    expect(cursor).toBeDefined();
  });
});
