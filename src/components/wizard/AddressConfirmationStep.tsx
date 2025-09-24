import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { Check, MapPin, Info, Clock } from 'lucide-react';
import { useEffect } from 'react';
import { cn } from '../../utils/cn';

const AddressConfirmationStep = () => {
  const { wizardState, updateWizardState } = useWizard();
  const { addToast } = useToast();
  
  useEffect(() => {
    // Auto-fill city and ZIP code based on partial address if coming from homepage
    if (wizardState.address.street && (!wizardState.address.city || !wizardState.address.zip)) {
      // Improved address parsing
      const addressStr = wizardState.address.street;
      
      // Look for city and ZIP code patterns
      const cityZipRegex = /\b([A-Za-z\s]+)\s+(\d{5})\b/;
      const cityMatch = addressStr.match(cityZipRegex);
      
      if (cityMatch) {
        // Found a city name followed by 5 digits (ZIP)
        const city = cityMatch[1].trim();
        const zip = cityMatch[2];
        
        updateWizardState({
          address: {
            ...wizardState.address,
            city: city,
            zip: zip
          }
        });
        addToast('info', `We detected your address is in ${city}, TX ${zip}`);
      } else {
        // Try to extract just the city name without requiring ZIP
        const texasCities = ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth', 'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock'];
        
        // Check if any known city name is in the address string
        for (const city of texasCities) {
          if (addressStr.includes(city)) {
            updateWizardState({
              address: {
                ...wizardState.address,
                city: city,
              }
            });
            addToast('info', `We detected your address is in ${city}, TX`);
            break;
          }
        }
        
        // Try to extract just the ZIP code
        const zipRegex = /\b(\d{5})\b/;
        const zipMatch = addressStr.match(zipRegex);
        
        if (zipMatch) {
          updateWizardState({
            address: {
              ...wizardState.address,
              zip: zipMatch[1]
            }
          });
        }
      }
    }
  }, [wizardState.address.street]);
  
  // Simulate address validation and show it on a map
  // In a real app, this would call an API to validate the address
  const handleConfirmAddress = () => {
    updateWizardState({
      address: {
        ...wizardState.address,
        isValidated: true,
      },
    });
    addToast('success', 'Address confirmed successfully');
  };

  // Format the move-in date in a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // Check if service is available same day
  const isSameDayAvailable = () => {
    if (!wizardState.moveInDate) return false;
    
    const moveInDate = new Date(wizardState.moveInDate);
    const today = new Date();
    
    // Same day if move-in date is today
    if (moveInDate.toDateString() === today.toDateString()) {
      // Same day service is available Monday-Saturday before 5PM
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const hour = today.getHours();
      
      return dayOfWeek !== 0 && hour < 17; // Not Sunday and before 5PM
    }
    
    return false;
  };

  return (
    <div className="wizard-step">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Confirm Your Address</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Please verify this is the correct address for your electricity service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
          {/* Map visualization (in a real app, this would be a Google Maps component) */}
          <div className="h-64 bg-gray-200 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary-600 dark:text-primary-500 mx-auto" />
                <div className="mt-1 text-sm font-medium text-gray-700 dark:text-gray-300">Map Visualization</div>
                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {wizardState.address.city}, {wizardState.address.state} {wizardState.address.zip}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Service Address</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {wizardState.address.street}<br />
                  {wizardState.address.city}, {wizardState.address.state} {wizardState.address.zip}
                </p>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Property Type</h4>
                  <p className="text-gray-900 dark:text-white capitalize">{wizardState.propertyType}</p>
                  {wizardState.propertyType === 'apartment' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      You'll receive a proof of service document for your leasing office
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Move-in Date</h4>
                  <p className="text-gray-900 dark:text-white">{formatDate(wizardState.moveInDate)}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Power Connection Status</h4>
              
              {isSameDayAvailable() ? (
                <div className="mt-2 flex items-center text-success-600 dark:text-success-500">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Same-day connection available if ordered by 5PM today!</span>
                </div>
              ) : (
                <p className="text-gray-900 dark:text-white mt-2">
                  Standard connection (1-3 business days) available for your move-in date.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {wizardState.address.street.trim() !== '' && (!wizardState.address.city || !wizardState.address.zip) && (
        <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 dark:border-amber-600 p-4">
          <div className="flex">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                We need to complete your address information. Please add your city and ZIP code.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={handleConfirmAddress}
          className={cn(`btn ${
            wizardState.address.isValidated
              ? 'bg-success-600 hover:bg-success-700 text-white dark:bg-success-600 dark:hover:bg-success-700'
              : 'btn-primary'
          }`, "px-8")}
          disabled={!wizardState.address.city || !wizardState.address.zip}
        >
          {wizardState.address.isValidated ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Address Confirmed
            </>
          ) : (
            'Yes, This Is My Address'
          )}
        </button>
      </div>

      {isSameDayAvailable() && (
        <div className="mt-6 bg-success-50 dark:bg-success-900/30 rounded-lg p-4 flex items-start">
          <Clock className="h-5 w-5 text-success-600 dark:text-success-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-success-700 dark:text-success-400">
            Great news! Since you're moving in today, you qualify for same-day power connection if you complete your order by 5PM.
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressConfirmationStep;