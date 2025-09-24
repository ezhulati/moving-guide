// Utility functions for local storage management

// Save wizard state to localStorage
export const saveWizardState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('wizardState', serializedState);
  } catch (error) {
    console.error('Could not save wizard state to localStorage', error);
  }
};

// Load wizard state from localStorage
export const loadWizardState = () => {
  try {
    const serializedState = localStorage.getItem('wizardState');
    if (!serializedState) return null;
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Could not load wizard state from localStorage', error);
    return null;
  }
};

// Clear wizard state from localStorage
export const clearWizardState = () => {
  try {
    localStorage.removeItem('wizardState');
  } catch (error) {
    console.error('Could not clear wizard state from localStorage', error);
  }
};