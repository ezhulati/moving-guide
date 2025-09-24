import { render, screen, fireEvent } from '@testing-library/react';
import ElectricityFacts from './ElectricityFacts';

describe('ElectricityFacts', () => {
  it('renders with default facts', () => {
    render(<ElectricityFacts />);
    expect(screen.getByText('Texas Electricity Facts')).toBeInTheDocument();
    expect(screen.getByText('Texas Deregulated Market')).toBeInTheDocument();
  });

  it('toggles facts when clicked', () => {
    render(<ElectricityFacts />);
    const factButton = screen.getByText('Texas Deregulated Market');
    
    // Fact description should not be visible initially
    expect(screen.queryByText(/Texas has the largest deregulated electricity market/)).not.toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(factButton);
    expect(screen.getByText(/Texas has the largest deregulated electricity market/)).toBeInTheDocument();
    
    // Click again to collapse
    fireEvent.click(factButton);
    expect(screen.queryByText(/Texas has the largest deregulated electricity market/)).not.toBeInTheDocument();
  });

  it('shows all facts when "Expand All" is clicked', () => {
    render(<ElectricityFacts />);
    const expandAllButton = screen.getByText('Expand All');
    
    // Click to expand all
    fireEvent.click(expandAllButton);
    
    // All fact descriptions should be visible
    expect(screen.getByText(/Texas has the largest deregulated electricity market/)).toBeInTheDocument();
    expect(screen.getByText(/Standby power, or "phantom energy,"/)).toBeInTheDocument();
    
    // Button should now say "Collapse All"
    expect(screen.getByText('Collapse All')).toBeInTheDocument();
  });

  it('respects the showAllByDefault prop', () => {
    render(<ElectricityFacts showAllByDefault={true} />);
    
    // All fact descriptions should be visible by default
    expect(screen.getByText(/Texas has the largest deregulated electricity market/)).toBeInTheDocument();
    expect(screen.getByText(/Standby power, or "phantom energy,"/)).toBeInTheDocument();
    
    // Button should say "Collapse All" since all facts are expanded
    expect(screen.getByText('Collapse All')).toBeInTheDocument();
  });

  it('renders inline variant correctly', () => {
    render(<ElectricityFacts inline={true} />);
    
    // Should just show a button initially
    const button = screen.getByText('Electricity Facts');
    expect(button).toBeInTheDocument();
    
    // No fact content should be visible yet
    expect(screen.queryByText('Texas Deregulated Market')).not.toBeInTheDocument();
    
    // Click to show facts
    fireEvent.click(button);
    
    // Now facts should be visible
    expect(screen.getByText('Texas Deregulated Market')).toBeInTheDocument();
  });

  it('accepts custom facts', () => {
    const customFacts = [
      {
        id: 'custom-fact',
        title: 'Custom Fact',
        description: 'This is a custom fact for testing.',
      }
    ];
    
    render(<ElectricityFacts facts={customFacts} />);
    
    // Custom fact should be visible
    expect(screen.getByText('Custom Fact')).toBeInTheDocument();
    
    // Default facts should not be visible
    expect(screen.queryByText('Texas Deregulated Market')).not.toBeInTheDocument();
  });
});