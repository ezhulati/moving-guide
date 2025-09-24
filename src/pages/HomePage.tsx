import { ArrowRight, Check, Clock, DollarSign, ShieldCheck, MapPin, Star, LineChart, Info, Bolt, AlertTriangle, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWizard } from '../context/WizardContext';
import SEO from '../components/shared/SEO';
import MarketInsights from '../components/shared/MarketInsights';
import InteractiveRateCalculator from '../components/shared/InteractiveRateCalculator';
import DynamicValueProposition from '../components/shared/DynamicValueProposition';
import AbTestVariant from '../components/shared/AbTestVariant';
import { cn } from '../utils/cn';
import { useTheme } from '../context/ThemeContext';
import ElectricityFacts from '../components/shared/ElectricityFacts';

const HomePage = () => {
  const navigate = useNavigate();
  const { updateWizardState } = useWizard();
  const { isDark } = useTheme();
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState<'apartment' | 'house' | 'condo' | 'townhome'>('apartment');
  const [moveInDate, setMoveInDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  
  // Calculate total savings for Texans
  const annualSavingsPerHome = 350;
  const totalHomesConnected = 2000000; // 2M+
  const totalSavingsDollars = "$700,000,000"; // Formatted for better readability
  
  // Format today's date as YYYY-MM-DD for the date input min value
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate maximum date (3 months from today)
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateFormatted = maxDate.toISOString().split('T')[0];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Enhanced address parsing to extract city and ZIP
    let city = '';
    let zip = '';
    
    // Try to extract ZIP code (5 digits)
    const zipMatch = address.match(/\b(\d{5})\b/);
    if (zipMatch) {
      zip = zipMatch[1];
    }
    
    // Common Texas cities
    const texasCities = ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth', 
                         'El Paso', 'Arlington', 'Corpus Christi', 'Plano', 'Lubbock'];
    
    // Try to find city name in the address
    for (const possibleCity of texasCities) {
      if (address.includes(possibleCity)) {
        city = possibleCity;
        break;
      }
    }
    
    // If no city was found with the list, try a more general approach
    if (!city) {
      const cityRegex = /\b([A-Za-z\s]+)\s+(\d{5})\b/;
      const cityMatch = address.match(cityRegex);
      
      if (cityMatch) {
        // Found a city name followed by 5 digits (ZIP)
        city = cityMatch[1].trim();
      }
    }
    
    // Save data to wizard context
    updateWizardState({
      propertyType: propertyType,
      address: {
        street: address,
        city: city,
        state: 'TX', // Default to Texas
        zip: zip,
        isValidated: false
      },
      moveInDate: moveInDate,
      // Initialize the funnel tracking
      funnel: {
        entryPoint: 'homepage',
        completedSteps: [],
        timeOnSteps: {},
        revisitedSteps: []
      },
      startTime: new Date().toISOString()
    });
    
    // Navigate directly to address confirmation step, skipping welcome and address steps
    setTimeout(() => {
      navigate('/wizard/address-confirmation');
      setIsSubmitting(false);
    }, 500);
  };
  
  // Handle rate calculation
  const handleCalculate = (monthlyCost: number) => {
    setCalculatedCost(monthlyCost);
  };
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <SEO 
        title="Set Up Your Texas Electricity in 5 Minutes"
        description="Connect electricity for your Texas move instantly. Get same-day power, instant proof for apartments, and save an average of $350/year."
      />
      
      {/* Hero section */}
      <section className="relative overflow-hidden">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-secondary-700 dark:from-primary-800 dark:to-secondary-900">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              {/* A/B Test different hero headlines */}
              <AbTestVariant id="hero-headline" variant="A">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <span className="block">Get Connected in Minutes</span>
                  <span className="block mt-2 text-accent-300">Power When You Need It</span>
                </h1>
                <p className="mt-6 text-xl text-white/90">
                  Connect your Texas electricity in 5 minutes with same-day service. Save an average of $350/year with the perfect plan for your new home.
                </p>
              </AbTestVariant>
              
              <AbTestVariant id="hero-headline" variant="B">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  <span className="block">Electricity Setup,</span>
                  <span className="block mt-2 text-accent-300">Simplified.</span>
                </h1>
                <p className="mt-6 text-xl text-white/90">
                  No waiting. No hassle. Get your power connected today with our 5-minute setup process that's trusted by over 2 million Texans.
                </p>
              </AbTestVariant>
              
              {/* Trust signals - IMPROVED */}
              <div className="mt-10 py-6 px-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-300 fill-current mr-1.5" />
                      <span className="text-xl font-bold text-white">70,000+</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1.5 text-center">5-Star Reviews</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center">
                      <Clock className="h-5 w-5 text-accent-300 mr-1.5" />
                      <span className="text-xl font-bold text-white">Since 2009</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1.5 text-center">15+ Years in Texas</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center">
                      <HomeIcon className="h-5 w-5 text-accent-300 mr-1.5" />
                      <span className="text-xl font-bold text-white">2M+</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1.5 text-center">Homes Connected</p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-400 mr-1.5" />
                      <span className="text-xl font-bold text-white">{totalSavingsDollars}</span>
                    </div>
                    <p className="text-sm text-white/80 mt-1.5 text-center">Saved for Texans</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:shadow-primary-600/20 dark:hover:shadow-primary-400/20 hover:shadow-xl">
                <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/40 dark:to-primary-800/30 px-6 py-4 border-b border-primary-100 dark:border-primary-800">
                  <h2 className="text-lg font-bold text-primary-700 dark:text-primary-300">Get Power in Minutes</h2>
                </div>
                <div className="px-6 py-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Where do you need electricity?
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="text"
                          id="address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter your service address"
                          className="input pl-10 w-full focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Example: 1800 North Field Street, Dallas, TX 75201
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        What type of home is it?
                      </label>
                      <div className="mt-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { id: 'apartment', label: 'Apartment' },
                          { id: 'house', label: 'House' },
                          { id: 'condo', label: 'Condo' },
                          { id: 'townhome', label: 'Townhome' }
                        ].map((option) => (
                          <div
                            key={option.id}
                            className={cn(
                              "flex items-center justify-center px-4 py-3 border rounded-xl cursor-pointer transition-all",
                              propertyType === option.id
                                ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500 dark:border-primary-400 text-primary-700 dark:text-primary-300 shadow-sm'
                                : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            )}
                            onClick={() => setPropertyType(option.id as any)}
                          >
                            <span className="font-medium">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        When are you moving in?
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </div>
                        <input
                          type="date"
                          id="moveInDate"
                          value={moveInDate}
                          onChange={(e) => setMoveInDate(e.target.value)}
                          className="input pl-10 w-full focus:ring-primary-500 focus:border-primary-500"
                          min={today}
                          max={maxDateFormatted}
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full btn btn-primary py-3 px-4 text-base font-medium shadow-md relative overflow-hidden group transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
<svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Getting you connected...
                        </div>
                      ) : (
                        <>
                          <span className="relative z-10 flex items-center justify-center">
                            Set Up My Electricity
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </span>
                          <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        </>
                      )}
                    </button>
                    
                    <div className="bg-success-50 dark:bg-success-900/30 rounded-lg p-3 border border-success-200 dark:border-success-800">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <Clock className="h-5 w-5 text-success-600 dark:text-success-400" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-success-800 dark:text-success-200">Same-Day Connection Available</h3>
                          <p className="text-xs text-success-700 dark:text-success-300 mt-1">
                            Orders placed before 5PM (Mon-Sat) can get connected today!
                          </p>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Subtle transfer message below main form */}
                <div className="px-6 pb-6 pt-0">
                  <div className="flex items-start text-amber-700 dark:text-amber-400 text-sm">
                    <div className="flex-shrink-0 mt-0.5 mr-2">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <p>
                      <span className="font-medium">Moving within Texas?</span> Don't transfer blindly. Your current plan was priced for your old home, not your new one. <Link to="/transfer" className="underline font-medium">Compare options</Link>
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="hidden lg:block absolute -bottom-6 -left-12 w-24 h-24 bg-accent-500 dark:bg-accent-700 opacity-30 rounded-full blur-xl"></div>
              <div className="hidden lg:block absolute -top-10 -right-10 w-32 h-32 bg-primary-400 dark:bg-primary-600 opacity-20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Value propositions section - redesigned with cards */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose ComparePower</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join 2 million+ satisfied Texans who've simplified their electricity setup
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="h-14 w-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-5">
                <Clock className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5-Minute Setup</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                No phone calls or paperwork. Complete your entire electricity setup online in less than 5 minutes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Instant account creation</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Digital proof of service</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="h-14 w-14 rounded-full bg-success-100 dark:bg-success-900/50 flex items-center justify-center text-success-600 dark:text-success-400 mb-5">
                <DollarSign className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Save $350/Year</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our customers save an average of $350 annually compared to standard utility rates.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Personalized plan recommendations</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Transparent pricing</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-8 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
              <div className="h-14 w-14 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 mb-5">
                <Zap className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Same-Day Service</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Need power today? Get connected same-day when you order by 5PM (Monday-Saturday).
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">No wait times</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Perfect for last-minute moves</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - simplified, modern section */}
      <section className="py-20 bg-white dark:bg-gray-900" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 mb-3">How It Works</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">3 Simple Steps to Get Connected</h2>
          </div>
          
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800 md:block hidden"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: "Tell Us About Your Move",
                  description: "Enter your new address and move-in date. We'll instantly verify your address.",
                  icon: <HomeIcon className="h-6 w-6" />
                },
                {
                  step: 2,
                  title: "Choose Your Plan",
                  description: "Compare personalized recommendations based on your home's unique energy profile.",
                  icon: <Bolt className="h-6 w-6" />
                },
                {
                  step: 3,
                  title: "Confirm Your Order",
                  description: "Enter your details, get instant confirmation, and have power on your move-in day.",
                  icon: <Check className="h-6 w-6" />
                }
              ].map((step, index) => (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all h-full flex flex-col">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-0 h-16 w-16 rounded-full bg-primary-600 dark:bg-primary-700 text-white flex items-center justify-center text-xl font-bold">
                      {step.step}
                    </div>
                    <div className="mt-8 md:mt-0 md:ml-12">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
                      
                      {index === 2 && (
                        <div className="mt-auto pt-4">
                          <Link
                            to="/wizard/welcome"
                            className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium inline-flex items-center group"
                          >
                            Get Started
                            <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Market insights - redesigned for better UX */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 mb-3">Market Insights</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Texas Electricity Market Trends</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Stay informed about current market conditions to make the best decisions for your electricity needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <MarketInsights />
            </div>
            
            <div className="space-y-6">
              <InteractiveRateCalculator
                ratePerKwh={11.4}
                initialUsage={1000}
                onCalculate={handleCalculate}
              />
              
              {calculatedCost && (
                <div className="bg-success-50 dark:bg-success-900/30 p-4 rounded-lg border border-success-200 dark:border-success-800 animate-fade-in">
                  <div className="flex items-start">
                    <DollarSign className="h-5 w-5 text-success-600 dark:text-success-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-success-800 dark:text-success-200">
                        You could be saving money!
                      </h3>
                      <p className="mt-1 text-sm text-success-700 dark:text-success-300">
                        Lock in a fixed-rate plan now to protect against predicted summer price increases of 7-10%.
                      </p>
                      <div className="mt-3">
                        <Link to="/wizard/welcome" className="btn btn-primary text-sm w-full">
                          Get Started Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - updated with modern design */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 mb-3">Customer Stories</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What Our Customers Say</h2>
            <div className="mt-4 flex items-center justify-center">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">4.9/5</span>
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">(79,124 reviews)</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeIn 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {Array(5).fill(0).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 flex-grow mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                    {testimonial.initials}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{testimonial.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features section - modernized with icons */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 mb-3">Key Benefits</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Everything You Need</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We've streamlined the electricity setup process to make it fast, easy, and stress-free
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full flex flex-col"
              >
                <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                  {feature.description}
                </p>
                <ul className="mt-auto space-y-2">
                  {feature.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Transfer Informational Section - redesigned */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/10 dark:to-amber-800/20 border-y border-amber-100 dark:border-amber-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 mb-3">Important</span>
              <h2 className="text-3xl font-bold text-amber-800 dark:text-amber-300">
                Moving Within Texas?
              </h2>
              <p className="mt-4 text-lg text-amber-700 dark:text-amber-400 max-w-2xl mx-auto">
                Don't blindly transfer your existing plan. Your current rate was optimized for your old home, not your new one.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-amber-200 dark:border-amber-800 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start mb-6">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Did You Know?</h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                      Texas law allows you to cancel your current contract without penalty when moving, giving you the freedom to choose the best option for your new home.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">83%</p>
                    <p className="text-sm text-amber-600 dark:text-amber-500">of transfers cost more</p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">$175</p>
                    <p className="text-sm text-amber-600 dark:text-amber-500">avg. yearly overpayment</p>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">5 min</p>
                    <p className="text-sm text-amber-600 dark:text-amber-500">to compare options</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <Link
                    to="/transfer"
                    className="btn bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600 inline-flex items-center px-6 py-3 shadow-md"
                  >
                    Compare My Options 
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Electricity Facts Section - simplified */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900/50 text-primary-800 dark:text-primary-300 mb-3">Knowledge Center</span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Understanding Texas Energy</h2>
          </div>
          
          <ElectricityFacts size="lg" className="mx-auto" />
        </div>
      </section>

      {/* Final CTA section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-700 to-secondary-700 dark:from-primary-800 dark:to-secondary-900 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">
            Ready to get your power connected?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Join millions of Texans who trust ComparePower for fast, affordable electricity setup.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/wizard/welcome"
              className="btn bg-white text-primary-700 hover:bg-gray-100 dark:bg-white dark:text-primary-800 dark:hover:bg-gray-100 px-8 py-4 text-base font-medium shadow-lg"
            >
              Set Up My Electricity
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/city-guides"
              className="btn bg-primary-600/40 backdrop-blur-sm border border-white/30 text-white hover:bg-primary-700/40 px-8 py-4 text-base font-medium"
            >
              Explore City Guides
            </Link>
          </div>
          
          {/* Trust badges */}
          <div className="mt-12 inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="flex items-center divide-x divide-white/20">
              <div className="pr-4 flex items-center">
                <ShieldCheck className="h-5 w-5 text-white mr-2" />
                <span className="text-sm text-white font-medium">Secure Setup</span>
              </div>
              <div className="px-4 flex items-center">
                <Clock className="h-5 w-5 text-white mr-2" />
                <span className="text-sm text-white font-medium">5-Minute Process</span>
              </div>
              <div className="pl-4 flex items-center">
                <Star className="h-5 w-5 text-white mr-2 fill-yellow-300" />
                <span className="text-sm text-white font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Custom Calendar icon component
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

// Custom icons
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

// Custom electricity icon
function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 10V3L4 14H11V21L20 10H13Z" />
    </svg>
  );
}

// Testimonials data - updated for clarity and impact
const testimonials = [
  {
    quote: "Needed same-day power for my apartment and had my confirmation letter in minutes. The leasing office accepted it immediately and I got my keys right away!",
    name: "Jessica D.",
    location: "Houston, TX",
    initials: "JD"
  },
  {
    quote: "I saved over $420 compared to my previous provider. The whole setup process took less than 5 minutes and was completely paperless.",
    name: "Michael T.",
    location: "Dallas, TX",
    initials: "MT"
  },
  {
    quote: "The personalized recommendations were spot-on for my new home. My power was connected right on my move-in date with zero hassle or paperwork.",
    name: "Amanda L.",
    location: "Austin, TX",
    initials: "AL"
  }
];

// Features data - updated with more modern descriptions
const features = [
  {
    title: "Same-Day Service",
    description: "Need power today? Get connected by 8PM when you order before 5PM on weekdays and Saturdays.",
    icon: <Clock className="h-6 w-6" />,
    bullets: [
      "Available in all major Texas cities",
      "Perfect for last-minute moves"
    ]
  },
  {
    title: "Instant Proof Document",
    description: "Receive immediate proof of service for your apartment or leasing office in minutes.",
    icon: <Bolt className="h-6 w-6" />,
    bullets: [
      "Accepted by all major apartment complexes",
      "Email directly to your leasing office"
    ]
  },
  {
    title: "Personalized Recommendations",
    description: "Get plan recommendations tailored to your specific home profile and usage patterns.",
    icon: <ShieldCheck className="h-6 w-6" />,
    bullets: [
      "Optimized for home size & features",
      "Special plans for solar, EV, and pool homes"
    ]
  },
  {
    title: "Transparent Pricing",
    description: "See all-in prices with no hidden fees. Compare options based on your actual usage.",
    icon: <DollarSign className="h-6 w-6" />,
    bullets: [
      "No surprise charges or hidden fees",
      "Monthly cost estimates for your usage"
    ]
  },
  {
    title: "No-Deposit Options",
    description: "Many plans available with no security deposit required, saving you $100-400 upfront.",
    icon: <ShieldCheck className="h-6 w-6" />,
    bullets: [
      "Avoid large upfront payments",
      "Filter for no-deposit plans only"
    ]
  },
  {
    title: "100% Online Signup",
    description: "Complete your entire electricity setup online without phone calls or paperwork.",
    icon: <ExternalLink className="h-6 w-6" />,
    bullets: [
      "Paperless, digital enrollment",
      "Instant confirmation"
    ]
  }
];

// Market stats data - unchanged
const marketStats = [
  {
    title: "Market Trend",
    value: "Rising",
    description: "Prices expected to increase 7-10% by July",
    icon: <LineChart className="h-8 w-8 text-amber-500 dark:text-amber-400 mx-auto" />
  },
  {
    title: "Best Time to Lock In",
    value: "Now",
    description: "Before summer peak prices begin",
    icon: <Clock className="h-8 w-8 text-green-500 dark:text-green-400 mx-auto" />
  },
  {
    title: "Best Value Term",
    value: "12 Months",
    description: "Balances stability with competitive rates",
    icon: <DollarSign className="h-8 w-8 text-blue-500 dark:text-blue-400 mx-auto" />
  }
];

export default HomePage;