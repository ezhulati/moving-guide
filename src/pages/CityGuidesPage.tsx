import { Link } from 'react-router-dom';
import { MapPin, Search, Info, Clock, DollarSign, Leaf, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import SEO from '../components/shared/SEO';
import Spinner from '../components/shared/Spinner';
import { cn } from '../utils/cn';

// Enhanced city data with more detailed information
const cities = [
  {
    id: 'houston',
    name: 'Houston',
    description: 'The largest city in Texas with diverse neighborhoods and energy options.',
    image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 52,
    avgRate: 10.8,
    utility: 'CenterPoint Energy',
    topPlans: ['Texas Saver 12', 'Space City Green 6'],
    population: '2.3M',
    popular: true
  },
  {
    id: 'dallas',
    name: 'Dallas',
    description: 'A major cultural and commercial center with competitive electricity rates.',
    image: 'https://images.pexels.com/photos/45182/pexels-photo-45182.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 48,
    avgRate: 11.2,
    utility: 'Oncor Electric Delivery',
    topPlans: ['Big D Special 12', 'Dallas Saver 6'],
    population: '1.3M',
    popular: true
  },
  {
    id: 'austin',
    name: 'Austin',
    description: 'Texas\' capital city known for tech industry and renewable energy options.',
    image: 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 43,
    avgRate: 11.5,
    utility: 'Austin Energy',
    topPlans: ['ATX Green 12', 'Capitol Value 6'],
    population: '950K',
    popular: true
  },
  {
    id: 'san-antonio',
    name: 'San Antonio',
    description: 'Historic city with a rich cultural heritage and affordable electricity.',
    image: 'https://images.pexels.com/photos/1122401/pexels-photo-1122401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 45,
    avgRate: 10.6,
    utility: 'CPS Energy',
    topPlans: ['Alamo Special 12', 'River Walk 6'],
    population: '1.5M',
    popular: true
  },
  {
    id: 'fort-worth',
    name: 'Fort Worth',
    description: 'Cowtown offers a blend of Western heritage and modern living.',
    image: 'https://images.pexels.com/photos/2365694/pexels-photo-2365694.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 47,
    avgRate: 11.1,
    utility: 'Oncor Electric Delivery',
    topPlans: ['Cowtown Special 12', 'Fort Worth Flex 6'],
    population: '895K',
    popular: false
  },
  {
    id: 'el-paso',
    name: 'El Paso',
    description: 'Sunny border city with unique energy needs and options.',
    image: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 32,
    avgRate: 11.8,
    utility: 'El Paso Electric',
    topPlans: ['Sun City Special 12', 'Border Saver 6'],
    population: '680K',
    popular: false
  },
  {
    id: 'arlington',
    name: 'Arlington',
    description: 'Entertainment hub with competitive electricity rates and services.',
    image: 'https://images.pexels.com/photos/1486577/pexels-photo-1486577.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 44,
    avgRate: 11.3,
    utility: 'Oncor Electric Delivery',
    topPlans: ['Arlington Special 12', 'Entertainment District 6'],
    population: '398K',
    popular: false
  },
  {
    id: 'corpus-christi',
    name: 'Corpus Christi',
    description: 'Coastal city with unique energy demands and specialized plans.',
    image: 'https://images.pexels.com/photos/771079/pexels-photo-771079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 38,
    avgRate: 11.6,
    utility: 'AEP Texas',
    topPlans: ['Coastal 12', 'Bayfront 6'],
    population: '326K',
    popular: false
  },
  {
    id: 'plano',
    name: 'Plano',
    description: 'Affluent Dallas suburb with excellent schools and energy efficiency.',
    image: 'https://images.pexels.com/photos/2119714/pexels-photo-2119714.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 42,
    avgRate: 11.3,
    utility: 'Oncor Electric Delivery',
    topPlans: ['Plano Premium 12', 'Suburban Saver 6'],
    population: '287K',
    popular: false
  },
  {
    id: 'laredo',
    name: 'Laredo',
    description: 'Border city with unique energy needs and growing opportunities.',
    image: 'https://images.pexels.com/photos/2559749/pexels-photo-2559749.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 28,
    avgRate: 11.9,
    utility: 'AEP Texas',
    topPlans: ['Border Value 12', 'Laredo Special 6'],
    population: '256K',
    popular: false
  },
  {
    id: 'lubbock',
    name: 'Lubbock',
    description: 'Hub city with recent deregulation and new electricity options.',
    image: 'https://images.pexels.com/photos/3064079/pexels-photo-3064079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 24,
    avgRate: 11.7,
    utility: 'Lubbock Power & Light',
    topPlans: ['Lubbock Choice 12', 'West Texas Value 6'],
    population: '257K',
    popular: false
  },
  {
    id: 'irving',
    name: 'Irving',
    description: 'Business hub with competitive rates for residents and companies.',
    image: 'https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    providers: 46,
    avgRate: 11.2,
    utility: 'Oncor Electric Delivery',
    topPlans: ['Irving Business 12', 'Las Colinas Special 6'],
    population: '240K',
    popular: false
  },
];

// Texas utility companies data
const utilityCompanies = [
  {
    name: 'Oncor Electric',
    description: 'Serving North Texas including Dallas-Fort Worth metroplex',
    customerCount: '10+ million',
    avgRate: 10.9,
    areas: 'Dallas, Fort Worth, Arlington, Plano, Irving',
    website: 'https://www.oncor.com'
  },
  {
    name: 'CenterPoint Energy',
    description: 'Serving Houston metropolitan area',
    customerCount: '7+ million',
    avgRate: 10.8,
    areas: 'Houston, Galveston, Katy, Sugar Land, Pearland',
    website: 'https://www.centerpointenergy.com'
  },
  {
    name: 'AEP Texas',
    description: 'Serving parts of South and West Texas',
    customerCount: '5+ million',
    avgRate: 11.2,
    areas: 'Corpus Christi, Laredo, McAllen, Victoria, Abilene',
    website: 'https://www.aeptexas.com'
  },
  {
    name: 'Texas-New Mexico Power',
    description: 'Serving Gulf Coast and rural areas',
    customerCount: '250,000+',
    avgRate: 11.5,
    areas: 'Lewisville, Texas City, Dickinson, Angleton, Pecos',
    website: 'https://www.tnmp.com'
  },
  {
    name: 'Lubbock Power & Light',
    description: 'Serving Lubbock area',
    customerCount: '100,000+',
    avgRate: 11.0,
    areas: 'Lubbock, Ransom Canyon',
    website: 'https://www.lpandl.com'
  }
];

// Features of Texas deregulated energy market
const marketFeatures = [
  {
    title: "Customer Choice",
    description: "Choose from over 100 electricity providers competing for your business",
    icon: <ShieldCheck className="h-6 w-6 text-blue-500" />
  },
  {
    title: "Renewable Energy",
    description: "Texas leads the nation in wind power production with growing solar options",
    icon: <Leaf className="h-6 w-6 text-green-500" />
  },
  {
    title: "Competitive Rates",
    description: "Provider competition leads to lower rates than regulated markets",
    icon: <DollarSign className="h-6 w-6 text-amber-500" />
  },
  {
    title: "Innovative Plans",
    description: "Free nights/weekends plans, prepaid options, and green energy plans",
    icon: <Zap className="h-6 w-6 text-purple-500" />
  }
];

const CityGuidesPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [displayedCities, setDisplayedCities] = useState<typeof cities>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPopular, setFilterPopular] = useState(false);
  const [texasStats, setTexasStats] = useState({
    avgRate: 11.4,
    nationalAvgRate: 14.1,
    avgBill: 140,
    lowestRate: 10.5,
    providers: 120
  });

  useEffect(() => {
    // Simulate loading cities from API
    const timer = setTimeout(() => {
      setIsLoading(false);
      setDisplayedCities(cities);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter cities based on search query and popularity
  const filteredCities = displayedCities
    .filter(city => {
      if (filterPopular && !city.popular) {
        return false;
      }
      
      if (!searchQuery) {
        return true;
      }
      
      return (
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <SEO 
        title="Texas City Electricity Guides"
        description="Find electricity information specific to your Texas city. Compare rates, providers, and get expert advice for your location."
      />
      
      <div className="relative bg-primary-700 py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-800 to-secondary-700 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Texas City Electricity Guides
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl mx-auto">
            Find electricity information specific to your Texas city. Compare rates, providers, and get expert advice for your location.
          </p>
          
          <div className="mt-8 max-w-lg mx-auto flex items-center gap-4">
            <div className="relative flex-grow rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md"
                placeholder="Search for your city..."
                aria-label="Search for your city"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <span className="text-gray-500 sm:text-sm" id="city-count">
                  {filteredCities.length} cities
                </span>
              </div>
            </div>
            
            <button
              className={cn(
                "px-4 py-3 rounded-md text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors whitespace-nowrap",
                filterPopular ? 
                  "bg-white text-primary-700 hover:bg-gray-100" : 
                  "bg-primary-600 text-white hover:bg-primary-700"
              )}
              onClick={() => setFilterPopular(!filterPopular)}
            >
              {filterPopular ? "Show All Cities" : "Show Major Cities"}
            </button>
          </div>
        </div>
      </div>

      {/* Texas Electricity Overview */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Texas Electricity Overview</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              With over {texasStats.providers} Retail Electricity Providers (REPs) active in Texas and five major utility companies,
              you have more choice than ever to find the best plan for your home.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <DollarSign className="h-6 w-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Average Rate</h3>
              </div>
              <p className="text-3xl font-bold text-primary-600">{texasStats.avgRate}¢</p>
              <p className="text-sm text-gray-500">per kWh (15% lower than national average)</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <ElectricityIcon className="h-6 w-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Monthly Bill</h3>
              </div>
              <p className="text-3xl font-bold text-primary-600">${texasStats.avgBill}</p>
              <p className="text-sm text-gray-500">Average residential bill (ranks 13th nationally)</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <Leaf className="h-6 w-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Cheapest Plan</h3>
              </div>
              <p className="text-3xl font-bold text-primary-600">{texasStats.lowestRate}¢</p>
              <p className="text-sm text-gray-500">Lowest available rate (20% below Texas average)</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-2">
                <Clock className="h-6 w-6 text-primary-500 mr-2" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Best Time to Shop</h3>
              </div>
              <p className="text-lg font-medium text-gray-800">Spring & Fall</p>
              <p className="text-sm text-gray-500">Shoulder months offer the lowest rates</p>
            </div>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Market features */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Texas Deregulated Market Benefits</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {marketFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1 mr-3">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-base font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Rate comparison by city */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Rate Comparison by City</h3>
              
              <div className="space-y-4">
                {cities.slice(0, 5).map((city) => (
                  <div key={city.id} className="flex items-center">
                    <Link 
                      to={`/city-guides/${city.id}`}
                      className="flex-grow flex items-center text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                    >
                      <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                      <span className="font-medium">{city.name}</span>
                    </Link>
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${
                          city.avgRate < 11.0 ? 'bg-green-500' : 
                          city.avgRate < 11.5 ? 'bg-blue-500' : 
                          'bg-amber-500'
                        }`} 
                        style={{ width: `${(city.avgRate / 15) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-900 dark:text-white w-16 text-right">
                      {city.avgRate}¢/kWh
                    </span>
                  </div>
                ))}
                
                <Link 
                  to="#city-list"
                  className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium mt-2"
                >
                  See all cities <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main city guides section */}
      <div id="city-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Select Your City</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our comprehensive electricity guides for major Texas cities. Each guide provides local rates, provider information, and moving tips.
          </p>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Spinner size="lg" color="primary" text="Loading city guides..." />
          </div>
        ) : filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCities.map((city, index) => (
              <Link
                key={city.id}
                to={`/city-guides/${city.id}`}
                className="group"
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeIn 0.5s ease-out forwards',
                  opacity: 0
                }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {city.popular && (
                      <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs uppercase font-bold px-3 py-1 rounded-bl-md">
                        Popular
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-1" />
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{city.name}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
                      {city.description}
                    </p>
                    
                    <div className="mt-auto space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Population</div>
                          <div className="font-medium text-gray-800 dark:text-gray-200">{city.population}</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-md">
                          <div className="text-gray-500 dark:text-gray-400 text-xs">Avg Rate</div>
                          <div className="font-medium text-primary-600 dark:text-primary-400">{city.avgRate}¢/kWh</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <Info className="h-3 w-3 mr-1" />
                        <span className="line-clamp-1">Utility: {city.utility}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <ElectricityIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No cities found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We couldn't find any cities matching "{searchQuery}". Please try a different search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterPopular(false);
              }}
              className="btn btn-primary"
            >
              Show all cities
            </button>
          </div>
        )}

        {/* Utility Companies Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Texas Electric Utility Companies</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Electricity transmission and distribution are managed by utility companies, ensuring reliability regardless of your provider choice.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {utilityCompanies.map((utility, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-2">
                    <ElectricityIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  {utility.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{utility.description}</p>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Service Areas:</span>
                    <span className="text-right text-gray-700 dark:text-gray-300 font-medium">{utility.areas}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Customers:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{utility.customerCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Average Rate:</span>
                    <span className="font-medium text-primary-700 dark:text-primary-400">{utility.avgRate}¢/kWh</span>
                  </div>
                </div>
                
                <a 
                  href={utility.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="mt-4 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium inline-flex items-center"
                >
                  Visit website <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
        
        {/* Electricity Plan Types */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Types of Electricity Plans</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the right type of plan based on your priorities and preferences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                  <Leaf className="h-6 w-6 text-green-500 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Green Energy Plans</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Support renewable energy with plans sourced from wind, solar, and other sustainable sources.</p>
              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rate Premium:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">+0.2¢/kWh (avg)</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Best for: Environmentally conscious consumers</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
                  <DollarSign className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Fixed-Rate Plans</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Lock in a consistent rate for the duration of your contract, protecting you from market fluctuations.</p>
              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Common Terms:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">6, 12, 24 months</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Best for: Budget-conscious consumers seeking predictability</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-3">
                  <ElectricityIcon className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prepaid Plans</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Pay for electricity before you use it with no deposit, credit check, or long-term commitment required.</p>
              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Rate Premium:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">+1-2¢/kWh (avg)</span>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Best for: Those needing flexibility or avoiding deposits</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800 rounded-lg p-8 shadow-md">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Don't See Your City?</h3>
            <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
              We serve all deregulated areas in Texas. Start your power setup process and we'll check availability for your specific address.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/wizard/welcome"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-base font-medium shadow-lg"
              >
                Connect My Power
              </Link>
              <Link
                to="/"
                className="btn bg-primary-700 text-white border border-white hover:bg-primary-800 px-8 py-3 text-base font-medium"
              >
                Compare Plans First
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Common Questions</h2>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">Find answers to frequently asked questions about Texas electricity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Why do advertised rates differ from my bill?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Advertised rates typically show the energy charge per kWh, but your final bill includes additional 
                fees like transmission charges, utility fees, and taxes. Some plans also have tiered pricing based 
                on your total usage.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link to="/wizard/welcome" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center">
                  Find transparent pricing <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">When is the best time to shop for electricity?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                The shoulder months (spring and fall) typically offer the lowest rates due to reduced demand. 
                Shopping 2-3 weeks before your contract expires gives you time to compare options without rushing.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link to="/wizard/welcome" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center">
                  Compare current rates <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">How does switching providers work?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Switching is seamless with no service interruption. Your new provider handles the transfer process,
                coordinating with your current provider and the utility company. The physical electricity delivery 
                remains unchanged.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link to="/wizard/welcome" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center">
                  Switch providers seamlessly <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Can I get same-day electricity service?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes, many providers offer same-day connection if you complete your order before 5 PM on weekdays.
                This is especially important for apartment moves where proof of service is required to get your keys.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link to="/wizard/welcome" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium inline-flex items-center">
                  Get same-day service <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="bg-white dark:bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Find Your Perfect Electricity Plan?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Whether you're moving to a new home or just looking to save on your current electricity bill, 
            ComparePower makes it easy to find and connect the best plan for your needs.
          </p>
          
          <Link
            to="/wizard/welcome"
            className="btn btn-primary inline-flex items-center px-8 py-3 text-base font-medium shadow-lg"
          >
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Custom electricity icon
function ElectricityIcon(props: React.SVGProps<SVGSVGElement>) {
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

export default CityGuidesPage;