import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroSearch from './HeroSearch';

describe('HeroSearch', () => {
  it('renders correctly', () => {
    render(<HeroSearch onSearch={() => {}} />);
    expect(screen.getByText('Where to?')).toBeDefined();
    expect(screen.getByText('When?')).toBeDefined();
  });

  it('calls onSearch with correct data when submitted', () => {
    const handleSearch = vi.fn();
    render(<HeroSearch onSearch={handleSearch} />);
    
    const destinationInput = screen.getByLabelText(/Enter your destination/i);
    const datesInput = screen.getByLabelText(/Enter travel dates/i);
    const exploreButton = screen.getByText('Explore');

    fireEvent.change(destinationInput, { target: { value: 'Paris' } });
    fireEvent.change(datesInput, { target: { value: 'Tomorrow' } });
    fireEvent.click(exploreButton);

    expect(handleSearch).toHaveBeenCalledWith({ destination: 'Paris', dates: 'Tomorrow' });
  });
});
