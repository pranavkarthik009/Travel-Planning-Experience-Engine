import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DestinationCard from './DestinationCard';

describe('DestinationCard', () => {
  const mockDest = {
    name: 'Bali',
    image: 'https://example.com/bali.jpg',
    desc: 'Tropical paradise'
  };

  it('renders destination information correctly', () => {
    render(<DestinationCard destination={mockDest} onClick={() => {}} />);
    
    expect(screen.getByText('Bali')).toBeDefined();
    expect(screen.getByText('Tropical paradise')).toBeDefined();
    expect(screen.getByAltText(/view of Bali/i)).toBeDefined();
  });

  it('triggers onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<DestinationCard destination={mockDest} onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('triggers onClick when Enter is pressed', () => {
    const handleClick = vi.fn();
    render(<DestinationCard destination={mockDest} onClick={handleClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalled();
  });
});
