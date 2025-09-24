import { useWizard } from '../../context/WizardContext';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { AlertCircle, MapPin, Home } from 'lucide-react';
import SmartFormField from '../shared/SmartFormField';
import ContextualHelp from '../shared/ContextualHelp';

const AddressStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressAutofill, setShowAddressAutofill] = useState(false);
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSameDayAlert, setShowSameDayAlert] = useState(false);

  // Handle address form input changes
  const handleAddressChange = (field: string, value: string) => {
    updateWizardState({
      address: {
        ...wizardState.address,
        [field]: value,
      },
    });

    // Mark field as touched
    setTouched({
      ...touched,
      [field]: true
    });

    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
    
    // If it's the street field, update the search term for autofill
    if (field === 'street') {
      setSearchTerm(value);
    }
  };

  // Handle move-in date change
  const handleMoveInDateChange = (date: string) => {
    updateWizardState({ moveInDate: date });
    
    // Mark field as touched
    setTouched({
      ...touched,
      moveInDate: true
    });

    // Clear error when user selects a date
    if (errors.moveInDate) {
      setErrors({
        ...errors,
        moveInDate: '',
      });
    }
    
    // Check if selected date is today
    const today = new Date();
    const selectedDate = new Date(date);
    if (selectedDate.toDateString() === today.toDateString()) {
      setShowSameDayAlert(true);
    } else {
      setShowSameDayAlert(false);
    }
  };

  // Handle Texas residency selection
  const handleTexasResidencyChange = (isTexasResident: boolean) => {
    updateWizardState({ isTexasResident });
  };

  // Format today's date as YYYY-MM-DD for the date input min value
  const today = new Date().toISOString().split('T')[0];

  // Calculate maximum date (3 months from today)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateFormatted = maxDate.toISOString().split('T')[0];

  // Validate the entire form
  const validateForm = () => {
    const errors = {
      street: '',
      city: '',
      zip: '',
      moveInDate: '',
    };
    let isValid = true;

    // Street validation
    if (!wizardState.address.street.trim()) {
      errors.street = 'Street address is required';
      isValid = false;
    }

    // City validation
    if (!wizardState.address.city.trim()) {
      errors.city = 'City is required';
      isValid = false;
    }

    // ZIP validation
    const zipRegex = /^\d{5}$/;
    if (!wizardState.address.zip.trim()) {
      errors.zip = 'ZIP code is required';
      isValid = false;
    } else if (!zipRegex.test(wizardState.address.zip)) {
      errors.zip = 'Please enter a valid 5-digit ZIP code';
      isValid = false;
    }

    // Move-in date validation
    if (!wizardState.moveInDate) {
      errors.moveInDate = 'Move-in date is required';
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  // Validate ZIP code as Texas ZIP
  const isTexasZip = (zip: string) => {
    // Texas ZIP codes start with 75-79 or 88
    const texasZipRegex = /^(75|76|77|78|79|88)\d{3}$/;
    return texasZipRegex.test(zip);
  };

  // Check Texas ZIP when ZIP is entered
  useEffect(() => {
    if (touched.zip && wizardState.address.zip.length === 5) {
      if (!isTexasZip(wizardState.address.zip)) {
        setErrors(prev => ({
          ...prev,
          zip: 'This doesn\'t appear to be a Texas ZIP code. We currently only serve Texas.'
        }));
      }
    }
  }, [wizardState.address.zip, touched.zip]);

  // Mock address autofill/autocomplete functionality
  useEffect(() => {
    if (searchTerm.length > 3) {
      setShowAddressAutofill(true);
      
      // Mock API call to get address suggestions
      const mockAddresses = [
        "1800 North Field Street, Dallas, TX 75201",
        "1801 Main Street, Houston, TX 77002",
        "1234 Congress Ave, Austin, TX 78701",
        "5678 Broadway St, San Antonio, TX 78215",
        "910 Texas Ave, Fort Worth, TX 76102"
      ].filter(addr => 
        addr.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setAutocompleteResults(mockAddresses);
    } else {
      setShowAddressAutofill(false);
      setAutocompleteResults([]);
    }
  }, [searchTerm]);

  // Handle autocomplete selection
  const handleAutocompleteSelect = (address: string) => {
    // Parse address components
    let street = address;
    let city = '';
    let zip = '';
    
    // Extract city
    const cityMatch = address.match(/,\s*([^,]+),\s*TX/i);
    if (cityMatch && cityMatch[1]) {
      city = cityMatch[1];
    }
    
    // Extract ZIP
    const zipMatch = address.match(/\b(\d{5})\b/);
    if (zipMatch && zipMatch[1]) {
      zip = zipMatch[1];
    }
    
    // Extract street (everything before the city)
    if (cityMatch) {
      street = address.substring(0, address.indexOf(cityMatch[0]));
    }
    
    // Update wizard state
    updateWizardState({
      address: {
        ...wizardState.address,
        street: street.trim(),
        city,
        zip,
      },
    });
    
    // Mark fields as touched
    setTouched({
      ...touched,
      street: true,
      city: true,
      zip: true,
    });
    
    // Hide autocomplete
    setShowAddressAutofill(false);
    setAutocompleteResults([]);
  };

  // Validate zip code
  const validateZip = (zip: string) => {
    if (!zip) return 'ZIP code is required';
    if (!/^\d{5}$/.test(zip)) return 'Please enter a valid 5-digit ZIP code';
    if (!isTexasZip(zip)) return 'This doesn\'t appear to be a Texas ZIP code';
    return null;
  };

  // Simulate form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    setTouched({
      street: true,
      city: true,
      zip: true,
      moveInDate: true,
    });

    const isValid = validateForm();
    
    if (isValid) {
      // Proceed to next step is handled by the wizard navigation
      console.log('Form is valid, ready to proceed');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="wizard-step">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Where are you moving to?</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Enter the address where you need electricity service.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <SmartFormField
              id="street"
              label="Street Address"
              value={wizardState.address.street}
              onChange={(value) => {
                handleAddressChange('street', value);
                setSearchTerm(value);
              }}
              onBlur={() => setTouched({...touched, street: true})}
              placeholder="1800 North Field Street, Apt 456"
              required
              icon={<MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500\" aria-hidden="true" />}
              helpText="Enter your complete street address including apartment/unit numbers"
              validation={(val) => !val.trim() ? 'Street address is required' : null}
            />
            
            {/* Address autocomplete results */}
            {showAddressAutofill && autocompleteResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                {autocompleteResults.map((address, index) => (
                  <div
                    key={index}
                    onClick={() => handleAutocompleteSelect(address)}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                      <span className="font-normal text-gray-900 dark:text-white block truncate">
                        {address}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmartFormField
              id="city"
              label="City"
              value={wizardState.address.city}
              onChange={(value) => handleAddressChange('city', value)}
              onBlur={() => setTouched({...touched, city: true})}
              placeholder="Houston"
              required
              validation={(val) => !val.trim() ? 'City is required' : null}
            />

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Home className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  id="state"
                  value="TX"
                  disabled
                  className="input mt-1 pl-10 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                  aria-label="State (Texas only)"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                We currently only serve Texas
              </p>
            </div>
          </div>

          <SmartFormField
            id="zip"
            label="ZIP Code"
            value={wizardState.address.zip}
            onChange={(value) => handleAddressChange('zip', value.replace(/\D/g, '').slice(0, 5))}
            onBlur={() => setTouched({...touched, zip: true})}
            placeholder="77001"
            required
            maxLength={5}
            type="text"
            validation={validateZip}
            tooltip="Please enter a valid Texas ZIP code. We currently only provide service in Texas."
          />

          <SmartFormField
            id="moveInDate"
            label="When are you moving in?"
            value={wizardState.moveInDate || ''}
            onChange={handleMoveInDateChange}
            onBlur={() => setTouched({...touched, moveInDate: true})}
            type="date"
            required
            min={today}
            max={maxDateFormatted}
            validation={(val) => !val ? 'Move-in date is required' : null}
            tooltip="Select the date you want your electricity service to start. Same-day service is available if ordered before 5PM."
          />
          
          {showSameDayAlert && (
            <ContextualHelp
              title="Same-Day Service Available!"
              theme="success"
              className="mt-2 animate-fade-in"
            >
              <p>
                You've selected today as your move-in date. Great news! We can connect your power TODAY if you complete your order by 5PM.
              </p>
            </ContextualHelp>
          )}

          <div>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Do you currently live in Texas?
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={cn(
                  "flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer transition-colors",
                  wizardState.isTexasResident === true
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
                onClick={() => handleTexasResidencyChange(true)}
                role="radio"
                aria-checked={wizardState.isTexasResident === true}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTexasResidencyChange(true);
                  }
                }}
              >
                <span className="font-medium">Yes, I'm a Texan</span>
              </div>
              <div
                className={cn(
                  "flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer transition-colors",
                  wizardState.isTexasResident === false
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300'
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                )}
                onClick={() => handleTexasResidencyChange(false)}
                role="radio"
                aria-checked={wizardState.isTexasResident === false}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTexasResidencyChange(false);
                  }
                }}
              >
                <span className="font-medium">Nope, I'm new here</span>
              </div>
            </div>
            {touched.street && wizardState.isTexasResident === null && (
              <p className="mt-1 text-sm text-amber-600 dark:text-amber-500 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Please select if you currently live in Texas
              </p>
            )}
          </div>

          {!wizardState.address.city || !wizardState.address.zip ? (
            <ContextualHelp
              title="Please complete your address information"
              theme="warning"
              icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
            >
              <p>
                Both city and ZIP code are required to find available electricity plans for your area.
              </p>
            </ContextualHelp>
          ) : null}

          {/* Hidden submit button to enable form validation */}
          <button type="submit" className="hidden" disabled={isSubmitting}></button>
        </form>
      </div>
    </div>
  );
};

export default AddressStep;