import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bolt, DollarSign, HelpCircle, Star, MapPin, Calendar, Zap, ExternalLink, Info, TrendingUp, TrendingDown, LineChart, Leaf } from 'lucide-react';
import { useEffect, useState } from 'react';
import SEO from '../components/shared/SEO';
import Spinner from '../components/shared/Spinner';
import ElectricityFacts from '../components/shared/ElectricityFacts';

// Mock city data (extended from CityGuidesPage)
const cityData = {
  'houston': {
    name: 'Houston',
    image: 'https://images.pexels.com/photos/1755385/pexels-photo-1755385.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Houston is the largest city in Texas and the fourth largest in the United States. With a diverse population and robust economy, Houston residents have access to numerous electricity providers and plans. The city experiences hot, humid summers and mild winters, making cooling costs a significant portion of electricity bills.',
    utilityCo: 'CenterPoint Energy',
    avgRate: 10.8,
    summerPeak: 14.2,
    winterAvg: 9.8,
    topProviders: ['Reliant Energy', 'TXU Energy', 'Green Mountain Energy', 'Constellation', 'Cirro Energy'],
    popularPlans: [
      { name: 'Houston Saver 12', provider: 'Energy Texas', rate: 10.9, term: '12 months', features: ['No hidden fees', 'Fixed rate'] },
      { name: 'Space City Green 6', provider: 'Green Mountain Energy', rate: 11.7, term: '6 months', features: ['100% renewable', 'No deposit'] },
      { name: 'Houston Value 24', provider: 'TXU Energy', rate: 10.2, term: '24 months', features: ['Price guarantee', 'Free nights'] },
    ],
    movingTips: [
      'Houston traffic can be challenging, so plan your moving day outside of rush hours (7-9 AM and 4-7 PM).',
      'Summer moves should start early in the day to avoid the afternoon heat and humidity.',
      'Be prepared for sudden rain showers, especially during spring and summer months.',
      'Many Houston apartments require proof of electricity connection before giving keys.',
      'Consider flood zones when selecting a new home in Houston.',
    ],
    energyFacts: [
      {
        id: 'houston-climate',
        title: 'Humidity Impact',
        description: 'Houston\'s humid climate means air conditioners work harder and use more electricity than in drier regions of Texas.',
        icon: <Bolt className="text-primary-500" />
      },
      {
        id: 'houston-summer',
        title: 'Summer Usage Spike',
        description: 'The average Houston home uses 36% more electricity during summer months compared to spring and fall.',
        icon: <TrendingUp className="text-amber-500" />
      },
      {
        id: 'houston-efficiency',
        title: 'Efficiency Benefits',
        description: 'Energy-efficient homes can save up to 30% on cooling costs in Houston\'s climate, more than in most other Texas cities.',
        icon: <DollarSign className="text-green-500" />
      },
      {
        id: 'houston-pools',
        title: 'Pool Plans',
        description: 'Houston offers special electricity plans optimized for homes with pools, which can save homeowners with pools $200+ annually.',
        icon: <Zap className="text-blue-500" />
      }
    ]
  },
  'dallas': {
    name: 'Dallas',
    image: 'https://images.pexels.com/photos/45182/pexels-photo-45182.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Dallas is a major cultural and commercial center in North Texas. The city has a diverse and competitive electricity market with many providers offering innovative plans. Dallas experiences hot summers and cool winters with occasional ice storms, so both cooling and heating costs are considerations for residents.',
    utilityCo: 'Oncor Electric Delivery',
    avgRate: 11.2,
    summerPeak: 14.5,
    winterAvg: 10.1,
    topProviders: ['TXU Energy', 'Reliant Energy', 'Gexa Energy', 'Frontier Utilities', 'Amigo Energy'],
    popularPlans: [
      { name: 'Big D Special 12', provider: 'TXU Energy', rate: 11.1, term: '12 months', features: ['No hidden fees', 'Free weekends'] },
      { name: 'Dallas Saver 6', provider: 'Reliant Energy', rate: 11.8, term: '6 months', features: ['No deposit', 'Fixed rate'] },
      { name: 'North Texas Green 24', provider: 'Green Mountain Energy', rate: 12.2, term: '24 months', features: ['100% renewable', 'Price lock'] },
    ],
    movingTips: [
      'Dallas summers are hot, so plan moves for early morning during summer months.',
      'Winter moves should account for occasional ice storms that can disrupt schedules.',
      'Many Dallas apartment complexes require same-day electricity connection proof.',
      'Traffic can be heavy around downtown Dallas during business hours.',
      'Consider proximity to DART stations when selecting a home for public transit access.',
    ],
    energyFacts: [
      {
        id: 'dallas-usage',
        title: 'Seasonal Usage',
        description: 'Dallas homes use approximately 42% more electricity in summer than in spring/fall due to air conditioning demand.',
        icon: <Calendar className="text-primary-500" />
      },
      {
        id: 'dallas-smart',
        title: 'Smart Thermostats',
        description: 'Smart thermostats can reduce Dallas energy bills by up to 15% annually, a higher savings rate than the national average.',
        icon: <DollarSign className="text-green-500" />
      },
      {
        id: 'dallas-market',
        title: 'Competitive Market',
        description: 'Dallas has one of the most competitive electricity markets in Texas with over 48 providers offering service.',
        icon: <TrendingUp className="text-blue-500" />
      },
      {
        id: 'dallas-tou',
        title: 'Time-of-Use Plans',
        description: 'Oncor\'s time-of-use plans can save Dallas residents money by shifting usage to off-peak hours, especially beneficial for EV owners.',
        icon: <Clock className="text-amber-500" />
      }
    ]
  },
  'austin': {
    name: 'Austin',
    image: 'https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Austin, the capital of Texas, is known for its vibrant music scene, tech industry, and commitment to sustainability. The city has a strong focus on renewable energy, with many providers offering green energy plans. Austin experiences hot summers and mild winters, with electricity demand peaking during the summer cooling season.',
    utilityCo: 'Austin Energy',
    avgRate: 11.5,
    summerPeak: 15.1,
    winterAvg: 10.3,
    topProviders: ['Green Mountain Energy', 'TXU Energy', 'Reliant Energy', 'Chariot Energy', 'Bulb Energy'],
    popularPlans: [
      { name: 'ATX Green 12', provider: 'Green Mountain Energy', rate: 11.6, term: '12 months', features: ['100% renewable', 'Local wind power'] },
      { name: 'Capitol Value 6', provider: 'TXU Energy', rate: 11.9, term: '6 months', features: ['No deposit', 'Fixed rate'] },
      { name: 'Austin Tech 24', provider: 'Reliant Energy', rate: 11.3, term: '24 months', features: ['Smart home integration', 'Price guarantee'] },
    ],
    movingTips: [
      'Austin\'s popular neighborhoods like South Congress and Downtown have limited parking, so reserve a moving truck spot in advance.',
      'The city\'s tech events and festivals can cause traffic and accommodation challenges, so check event calendars when planning your move.',
      'Many Austin apartments are leased quickly, especially near UT campus, so secure housing and utilities early.',
      'Austin Energy serves most of the city, but outlying areas may have different utility companies.',
      'Consider proximity to the city\'s extensive hike and bike trails when choosing a neighborhood.',
    ],
    energyFacts: [
      {
        id: 'austin-renewable',
        title: 'Renewable Leader',
        description: 'Austin leads Texas in renewable energy adoption with over 30% of electricity coming from renewable sources.',
        icon: <Leaf className="text-green-500" />
      },
      {
        id: 'austin-rebates',
        title: 'Energy Rebates',
        description: 'Austin Energy offers rebates up to $2,500 for energy efficiency home improvements, among the highest in Texas.',
        icon: <DollarSign className="text-primary-500" />
      },
      {
        id: 'austin-usage',
        title: 'Lower Usage',
        description: 'The average Austin home uses 900 kWh per month, below the Texas average of 1,100 kWh.',
        icon: <TrendingDown className="text-green-500" />
      },
      {
        id: 'austin-pricing',
        title: 'Tiered Pricing',
        description: 'Austin\'s energy prices are tiered - using less saves more per kWh, incentivizing conservation.',
        icon: <LineChart className="text-amber-500" />
      }
    ]
  },
  'san-antonio': {
    name: 'San Antonio',
    image: 'https://images.pexels.com/photos/1122401/pexels-photo-1122401.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'San Antonio is a historic city with a rich cultural heritage, home to the Alamo and the famous River Walk. The electricity market in San Antonio offers competitive rates and diverse plan options. The city has hot summers and mild winters, with cooling costs being a significant factor in electricity bills.',
    utilityCo: 'CPS Energy',
    avgRate: 10.6,
    summerPeak: 13.8,
    winterAvg: 9.5,
    topProviders: ['Reliant Energy', 'TXU Energy', 'Direct Energy', 'Frontier Utilities', 'Payless Power'],
    popularPlans: [
      { name: 'Alamo Special 12', provider: 'Reliant Energy', rate: 10.5, term: '12 months', features: ['No hidden fees', 'Fixed rate'] },
      { name: 'River Walk 6', provider: 'TXU Energy', rate: 11.2, term: '6 months', features: ['No deposit', 'Free nights'] },
      { name: 'Mission Green 24', provider: 'Green Mountain Energy', rate: 11.9, term: '24 months', features: ['100% renewable', 'Price lock'] },
    ],
    movingTips: [
      'San Antonio summers are very hot, so schedule moves for early morning during summer months.',
      'Downtown and River Walk areas have limited parking for moving trucks, so plan accordingly.',
      'Military families moving to one of San Antonio\'s bases should check for special electricity plans for service members.',
      'Many historic homes in San Antonio may have different energy efficiency profiles than newer construction.',
      'The city\'s Fiesta celebrations in April can make moving challenging, so check event schedules.',
    ],
    energyFacts: [
      {
        id: 'sanantonio-utility',
        title: 'Municipal Utility',
        description: 'San Antonio\'s CPS Energy is the nation\'s largest municipally-owned energy utility and offers unique programs.',
        icon: <Bolt className="text-primary-500" />
      },
      {
        id: 'sanantonio-usage',
        title: 'Summer Usage',
        description: 'The average San Antonio home uses 1,200 kWh per month during summer, 25% higher than spring/fall.',
        icon: <TrendingUp className="text-amber-500" />
      },
      {
        id: 'sanantonio-audit',
        title: 'Free Energy Audits',
        description: 'CPS Energy offers free home energy audits to help identify efficiency improvements specific to your home.',
        icon: <HelpCircle className="text-blue-500" />
      },
      {
        id: 'sanantonio-insulation',
        title: 'Insulation Benefits',
        description: 'San Antonio residents can save up to 40% on summer cooling costs with proper attic insulation.',
        icon: <DollarSign className="text-green-500" />
      }
    ]
  },
  'fort-worth': {
    name: 'Fort Worth',
    image: 'https://images.pexels.com/photos/2365694/pexels-photo-2365694.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Fort Worth, often called "Cowtown," offers a blend of Western heritage and modern living. The electricity market in Fort Worth provides residents with many provider choices and plan options. The city experiences hot summers and cool winters, with both cooling and heating being significant energy uses throughout the year.',
    utilityCo: 'Oncor Electric Delivery',
    avgRate: 11.1,
    summerPeak: 14.3,
    winterAvg: 10.0,
    topProviders: ['TXU Energy', 'Reliant Energy', '4Change Energy', 'Gexa Energy', 'Pulse Power'],
    popularPlans: [
      { name: 'Cowtown Special 12', provider: 'TXU Energy', rate: 11.0, term: '12 months', features: ['No hidden fees', 'Fixed rate'] },
      { name: 'Fort Worth Flex 6', provider: 'Reliant Energy', rate: 11.6, term: '6 months', features: ['No deposit', 'Free weekends'] },
      { name: 'Stockyards Green 24', provider: 'Green Mountain Energy', rate: 12.1, term: '24 months', features: ['100% renewable', 'Price guarantee'] },
    ],
    movingTips: [
      'Fort Worth summers are hot, so plan moves for early morning during summer months.',
      'Winter moves should account for occasional ice storms that can disrupt schedules.',
      'The Fort Worth Stockyards area can be congested during tourist times, so plan moving around these periods if possible.',
      'Many new housing developments are being built in Fort Worth, so check utility service availability for newer areas.',
      'Fort Worth has many historic neighborhoods with charming older homes that may have different energy profiles.',
    ],
    energyFacts: [
      {
        id: 'fortworth-usage',
        title: 'Above Average Usage',
        description: 'Fort Worth residents use approximately 14% more electricity than the national average due to climate demands.',
        icon: <TrendingUp className="text-amber-500" />
      },
      {
        id: 'fortworth-historic',
        title: 'Historic Home Efficiency',
        description: 'Homes in Fort Worth\'s historic districts often need specialized energy efficiency solutions for older construction.',
        icon: <Home className="text-blue-500" />
      },
      {
        id: 'fortworth-peak',
        title: 'Peak Demand Times',
        description: 'Fort Worth\'s electricity demand peaks between 3-7pm during summer months, making time-of-use plans attractive.',
        icon: <Clock className="text-primary-500" />
      },
      {
        id: 'fortworth-fans',
        title: 'Ceiling Fan Benefits',
        description: 'Ceiling fans can reduce Fort Worth cooling costs by up to 15% when used properly with adjusted thermostat settings.',
        icon: <DollarSign className="text-green-500" />
      }
    ]
  },
  'el-paso': {
    name: 'El Paso',
    image: 'https://images.pexels.com/photos/1658967/pexels-photo-1658967.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'El Paso is a unique border city with a desert climate and strong cultural ties to Mexico. The electricity market in El Paso has fewer providers than other major Texas cities but still offers competitive options. The city experiences very hot, dry summers and mild winters, with cooling being the primary energy demand.',
    utilityCo: 'El Paso Electric',
    avgRate: 11.8,
    summerPeak: 15.5,
    winterAvg: 10.2,
    topProviders: ['El Paso Electric', 'TXU Energy', 'Reliant Energy', 'Gexa Energy', 'Frontier Utilities'],
    popularPlans: [
      { name: 'Sun City Special 12', provider: 'El Paso Electric', rate: 11.7, term: '12 months', features: ['No hidden fees', 'Fixed rate'] },
      { name: 'Border Saver 6', provider: 'TXU Energy', rate: 12.1, term: '6 months', features: ['No deposit', 'Free nights'] },
      { name: 'Desert Green 24', provider: 'Green Mountain Energy', rate: 12.6, term: '24 months', features: ['Solar power options', 'Price lock'] },
    ],
    movingTips: [
      'El Paso\'s desert climate means extremely hot daytime temperatures in summer, so plan moves for early morning.',
      'The city\'s proximity to the border means potential delays during high border crossing times if moving from out of state.',
      'El Paso has many military families moving to Fort Bliss, so check for special electricity plans for service members.',
      'The mountain terrain means some neighborhoods have different climate experiences and energy needs.',
      'El Paso\'s solar potential is excellent, so consider homes with solar installations or solar plan options.',
    ],
    energyFacts: [
      {
        id: 'elpaso-solar',
        title: 'Solar Potential',
        description: 'El Paso receives over 300 days of sunshine annually, making it ideal for solar energy installations and savings.',
        icon: <Sun className="text-amber-500" />
      },
      {
        id: 'elpaso-climate',
        title: 'Desert Temperature Swings',
        description: 'Desert climate means extreme temperature variations between day and night, requiring specialized HVAC strategies.',
        icon: <Thermometer className="text-red-500" />
      },
      {
        id: 'elpaso-timeofuse',
        title: 'Time-of-Use Benefits',
        description: 'El Paso Electric offers special time-of-use rates that can save money for many households willing to shift usage.',
        icon: <Clock className="text-primary-500" />
      },
      {
        id: 'elpaso-construction',
        title: 'Adobe Construction',
        description: 'Homes with adobe or thermal mass construction use up to 20% less energy in El Paso\'s climate than standard builds.',
        icon: <Home className="text-green-500" />
      }
    ]
  },
  'arlington': {
    name: 'Arlington',
    image: 'https://images.pexels.com/photos/1486577/pexels-photo-1486577.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Arlington is a vibrant city in the Dallas-Fort Worth metroplex, known for entertainment venues like AT&T Stadium and Six Flags Over Texas. The electricity market in Arlington offers many provider choices and competitive rates. The city experiences hot summers and cool winters, with significant cooling and heating demands throughout the year.',
    utilityCo: 'Oncor Electric Delivery',
    avgRate: 11.3,
    summerPeak: 14.7,
    winterAvg: 10.2,
    topProviders: ['TXU Energy', 'Reliant Energy', 'Gexa Energy', '4Change Energy', 'Cirro Energy'],
    popularPlans: [
      { name: 'Arlington Special 12', provider: 'TXU Energy', rate: 11.2, term: '12 months', features: ['No hidden fees', 'Fixed rate'] },
      { name: 'Entertainment District 6', provider: 'Reliant Energy', rate: 11.7, term: '6 months', features: ['No deposit', 'Free weekends'] },
      { name: 'Texas Green 24', provider: 'Green Mountain Energy', rate: 12.3, term: '24 months', features: ['100% renewable', 'Price guarantee'] },
    ],
    movingTips: [
      'Arlington has many major events at AT&T Stadium and Globe Life Field, so check event calendars when planning your move to avoid traffic.',
      'Areas near the entertainment district can be congested, especially during baseball and football seasons.',
      'Arlington has a large student population due to UT Arlington, so rental markets can be competitive near campus.',
      'Many new housing developments are being built in Arlington, so check utility service availability for newer areas.',
      'Arlington\'s central location in the metroplex makes it a popular choice, so secure housing and utilities early.',
    ],
    energyFacts: [
      {
        id: 'arlington-events',
        title: 'Event Power Demand',
        description: 'Arlington homes near stadiums may experience brief power demand spikes during major events affecting grid stability.',
        icon: <Users className="text-amber-500" />
      },
      {
        id: 'arlington-usage',
        title: 'Average Consumption',
        description: 'The average Arlington home uses 1,100 kWh per month, slightly above the Texas average.',
        icon: <Bolt className="text-primary-500" />
      },
      {
        id: 'arlington-new',
        title: 'New Development Efficiency',
        description: 'Arlington\'s newer developments often feature energy-efficient construction standards that can lower bills.',
        icon: <Home className="text-green-500" />
      },
      {
        id: 'arlington-students',
        title: 'Student Plans',
        description: 'Homes near UT Arlington can benefit from special student and multi-resident electricity plans with flexible terms.',
        icon: <GraduationCap className="text-blue-500" />
      }
    ]
  },
  'corpus-christi': {
    name: 'Corpus Christi',
    image: 'https://images.pexels.com/photos/771079/pexels-photo-771079.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    description: 'Corpus Christi is a coastal city offering beautiful beaches and a thriving port economy. The electricity market in Corpus Christi provides diverse options for residents. The city\'s coastal location means hot, humid summers and mild winters, with significant cooling demands most of the year and occasional hurricane risks.',
    utilityCo: 'AEP Texas',
    avgRate: 11.6,
    summerPeak: 15.0,
    winterAvg: 10.5,
    topProviders: ['Reliant Energy', 'TXU Energy', 'Direct Energy', 'Frontier Utilities', 'Payless Power'],
    popularPlans: [
      { name: 'Coastal 12', provider: 'Reliant Energy', rate: 11.5, term: '12 months', features: ['No hidden fees', 'Fixed rate'] },
      { name: 'Bayfront 6', provider: 'TXU Energy', rate: 12.0, term: '6 months', features: ['No deposit', 'Free nights'] },
      { name: 'Gulf Green 24', provider: 'Green Mountain Energy', rate: 12.4, term: '24 months', features: ['100% renewable', 'Price lock'] },
    ],
    movingTips: [
      'Corpus Christi\'s hurricane season (June through November) can affect moving plans, so check weather forecasts carefully.',
      'The coastal humidity can affect furniture and belongings during moves, so use moisture protection for sensitive items.',
      'Beach areas and tourist destinations can be congested during summer and spring break, so plan accordingly.',
      'Many coastal properties may have different energy efficiency profiles due to exposure to salt air and strong winds.',
      'Corpus Christi has various neighborhoods from downtown to island communities, each with different moving logistics.',
    ],
    energyFacts: [
      {
        id: 'corpus-humidity',
        title: 'Coastal Humidity Impact',
        description: 'Corpus Christi\'s coastal location means higher humidity, affecting how homes use energy for cooling and dehumidification.',
        icon: <Droplets className="text-blue-500" />
      },
      {
        id: 'corpus-hurricane',
        title: 'Hurricane Preparation',
        description: 'Hurricane-resistant construction features can improve energy efficiency by 15-25% while providing better protection.',
        icon: <Wind className="text-amber-500" />
      },
      {
        id: 'corpus-breezes',
        title: 'Gulf Breezes',
        description: 'Gulf breezes can reduce cooling needs when homes are designed to capture natural ventilation from the coast.',
        icon: <Wind className="text-green-500" />
      },
      {
        id: 'corpus-dehumid',
        title: 'Dehumidification',
        description: 'Coastal homes may benefit from specialized dehumidification systems to improve efficiency and comfort.',
        icon: <Droplets className="text-primary-500" />
      }
    ]
  }
};

const CityDetailPage = () => {
  const { cityName } = useParams<{ cityName: string }>();
  const [city, setCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentRates, setCurrentRates] = useState({
    seasonal: 'standard', // standard, summer, winter
    historicalData: [
      { month: 'Jan', rate: 10.2 },
      { month: 'Feb', rate: 10.5 },
      { month: 'Mar', rate: 10.3 },
      { month: 'Apr', rate: 10.1 },
      { month: 'May', rate: 10.6 },
      { month: 'Jun', rate: 11.8 },
      { month: 'Jul', rate: 12.9 },
      { month: 'Aug', rate: 13.2 },
      { month: 'Sep', rate: 12.5 },
      { month: 'Oct', rate: 10.8 },
      { month: 'Nov', rate: 10.4 },
      { month: 'Dec', rate: 10.3 }
    ]
  });
  const [marketInsights, setMarketInsights] = useState({
    trend: 'rising',
    priceChange: 5.2,
    bestDay: 'Tuesday',
    recommendedTerm: '12-month fixed',
    renewableStatus: 'Competitive pricing'
  });

  useEffect(() => {
    // Simulate fetching city data
    setTimeout(() => {
      if (cityName && cityData[cityName as keyof typeof cityData]) {
        setCity(cityData[cityName as keyof typeof cityData]);
      }
      setLoading(false);
    }, 600);
  }, [cityName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg\" text="Loading city information..." />
      </div>
    );
  }

  if (!city) {
    return (
      <>
        <SEO 
          title="City Not Found"
          description="The requested city guide could not be found. Browse our other Texas city electricity guides."
        />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">City Not Found</h1>
            <p className="mt-4 text-lg text-gray-600">
              We couldn't find information for the requested city.
            </p>
            <div className="mt-6">
              <Link to="/city-guides" className="btn btn-primary">
                Return to City Guides
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={`${city.name}, TX Electricity Guide`}
        description={`Comprehensive electricity guide for ${city.name}, Texas. Find local electricity rates, providers, and moving tips to save money on your power bill.`}
        ogImage={city.image}
      />
      
      {/* Hero section with city image */}
      <div className="relative h-80 sm:h-96">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8">
            <div className="flex items-center text-white mb-4">
              <Link to="/city-guides" className="flex items-center text-white hover:text-primary-200 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-1" />
                <span>Back to City Guides</span>
              </Link>
            </div>
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-white mr-2" />
              <h1 className="text-4xl font-extrabold text-white">{city.name}, Texas</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content column */}
          <div className="lg:col-span-2">
            <div className="prose prose-lg max-w-none">
              <p className="lead">{city.description}</p>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Electricity Market Overview</h2>
              
              <div className="bg-primary-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <Bolt className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Local Utility</h3>
                    </div>
                    <p className="text-gray-700">{city.utilityCo}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Average Rate</h3>
                    </div>
                    <p className="text-gray-700">{city.avgRate}¢ per kWh</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Summer Peak Rate</h3>
                    </div>
                    <p className="text-gray-700">{city.summerPeak}¢ per kWh</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-primary-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-900">Winter Average Rate</h3>
                    </div>
                    <p className="text-gray-700">{city.winterAvg}¢ per kWh</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Electricity Providers in {city.name}</h3>
              <ul className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {city.topProviders.map((provider: string) => (
                  <li key={provider} className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-800">{provider}</span>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">Popular Electricity Plans</h3>
              <div className="grid grid-cols-1 gap-4 mb-8">
                {city.popularPlans.map((plan: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{plan.name}</h4>
                        <p className="text-gray-600">{plan.provider}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">{plan.rate}¢</p>
                        <p className="text-sm text-gray-500">per kWh</p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-sm text-gray-600">{plan.term} term</p>
                      <div className="flex flex-wrap gap-2">
                        {plan.features.map((feature: string) => (
                          <span
                            key={feature}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Historical Rate Chart */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Electricity Rate Trends in {city.name}</h3>
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">Monthly Average Rates</h4>
                    <p className="text-sm text-gray-500">Past 12 months</p>
                  </div>
                  <div className="mt-3 sm:mt-0 flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="h-3 w-3 bg-primary-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Rate (¢/kWh)</span>
                    </div>
                  </div>
                </div>
                
                {/* Chart visualization */}
                <div className="relative h-64">
                  <div className="absolute inset-0">
                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                      <span>15¢</span>
                      <span>12.5¢</span>
                      <span>10¢</span>
                      <span>7.5¢</span>
                      <span>5¢</span>
                    </div>
                    
                    {/* X-axis grid lines */}
                    <div className="absolute left-8 right-0 top-0 bottom-0">
                      <div className="h-full flex flex-col justify-between">
                        <div className="border-b border-gray-200 h-0"></div>
                        <div className="border-b border-gray-200 h-0"></div>
                        <div className="border-b border-gray-200 h-0"></div>
                        <div className="border-b border-gray-200 h-0"></div>
                        <div className="border-b border-gray-200 h-0"></div>
                      </div>
                    </div>
                    
                    {/* Chart bars */}
                    <div className="absolute left-10 right-2 top-1 bottom-6 flex justify-between items-end">
                      {currentRates.historicalData.map((month, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className={`w-8 ${
                              month.rate > 13 
                                ? 'bg-red-500' 
                                : month.rate > 11 
                                  ? 'bg-yellow-500' 
                                  : 'bg-green-500'
                            } rounded-t`}
                            style={{ 
                              height: `${(month.rate / 15) * 100}%`,
                              minHeight: '4px'
                            }}
                          ></div>
                          <div className="mt-1 text-xs text-gray-500">{month.month}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Low Season (&lt;11¢)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Mid Season (11-13¢)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Peak Season (&gt;13¢)</span>
                  </div>
                </div>
              </div>
              
              {/* Local Market Analysis */}
              <h3 className="text-xl font-bold text-gray-900 mb-4">Current {city.name} Market Analysis</h3>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-center mb-2">
                      <TrendingUp className={`h-5 w-5 ${marketInsights.trend === 'rising' ? 'text-red-500' : 'text-green-500'} mr-2`} />
                      <h4 className="text-base font-medium text-gray-900">Price Trend</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {marketInsights.trend === 'rising' ? 'Rising' : 'Falling'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {marketInsights.trend === 'rising' 
                        ? `Prices up ${marketInsights.priceChange}% in 30 days` 
                        : `Prices down ${marketInsights.priceChange}% in 30 days`}
                    </p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-100">
                    <div className="flex items-center mb-2">
                      <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                      <h4 className="text-base font-medium text-gray-900">Best Day to Shop</h4>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {marketInsights.bestDay}
                    </p>
                    <p className="text-sm text-gray-600">
                      New plans are typically released mid-week
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Expert Recommendation for {city.name}</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Based on current market conditions in {city.name}, we recommend {marketInsights.recommendedTerm} plans. 
                        With {city.utilityCo} as your local utility company, you can expect reliable service regardless of which retail provider you choose.
                        Green energy plans are currently {marketInsights.renewableStatus.toLowerCase()}, making them an attractive option for environmentally conscious consumers.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-base font-medium text-gray-900 mb-3">Recent Market Developments</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <LineChart className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Infrastructure Investments</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {city.utilityCo} has announced a $45M investment in grid infrastructure in the {city.name} area, 
                          which could lead to more reliable service but potentially higher transmission costs in future bills.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <LineChart className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Natural Gas Price Impact</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Recent fluctuations in natural gas prices are affecting electricity rates in {city.name}. 
                          Prices are expected to {marketInsights.trend === 'rising' ? 'continue rising' : 'stabilize'} over the next quarter.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Moving to {city.name}: Tips & Advice</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-4">
                  {city.movingTips.map((tip: string, index: number) => (
                    <li key={index} className="flex">
                      <HelpCircle className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Energy Facts Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{city.name} Energy Facts</h2>
              
              {/* Use the ElectricityFacts component here with city-specific facts */}
              {city.energyFacts && (
                <ElectricityFacts 
                  facts={city.energyFacts} 
                  title={`${city.name} Electricity Facts`}
                  size="lg"
                />
              )}
            </div>
          </div>

          {/* Sidebar column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-primary-600 text-white rounded-lg overflow-hidden shadow-md">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">Ready to Connect Your Power?</h3>
                  <p className="mb-6">
                    Set up your electricity service for {city.name} in just 5 minutes. Get instant confirmation and same-day connection if needed.
                  </p>
                  <Link
                    to="/wizard/welcome"
                    className="w-full btn bg-white text-primary-700 hover:bg-gray-100 block text-center"
                  >
                    Connect My Power
                  </Link>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Why Use ComparePower?</h3>
                  
                  <ul className="space-y-3">
                    <li className="flex">
                      <Zap className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Compare all plans in {city.name}</span>
                    </li>
                    <li className="flex">
                      <Zap className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Same-day service available</span>
                    </li>
                    <li className="flex">
                      <Zap className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Instant proof documents</span>
                    </li>
                    <li className="flex">
                      <Zap className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">No-deposit options available</span>
                    </li>
                    <li className="flex">
                      <Zap className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">5-minute setup process</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Energy Savings Calculator */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-primary-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-primary-800">Rate Comparison</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Current Avg. Rate</span>
                        <span className="text-sm font-bold text-primary-700">{city.avgRate}¢</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-primary-600 h-1.5 rounded-full" 
                          style={{ width: `${(city.avgRate / 15) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Summer Peak</span>
                        <span className="text-sm font-bold text-red-600">{city.summerPeak}¢</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-red-500 h-1.5 rounded-full" 
                          style={{ width: `${(city.summerPeak / 15) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Winter Avg.</span>
                        <span className="text-sm font-bold text-green-600">{city.winterAvg}¢</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${(city.winterAvg / 15) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Locking in a fixed-rate plan now at {city.avgRate}¢ could save you up to {(city.summerPeak - city.avgRate).toFixed(1)}¢ per kWh during summer months.
                    </p>
                    
                    <Link
                      to="/wizard/welcome"
                      className="mt-4 w-full btn btn-primary text-sm"
                    >
                      Compare Plans
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Local Resources</h3>
                  
                  <ul className="space-y-3">
                    <li>
                      <a 
                        href="#" 
                        className="flex items-center text-primary-600 hover:text-primary-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span>{city.name} Utilities</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        className="flex items-center text-primary-600 hover:text-primary-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span>{city.name} City Website</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        className="flex items-center text-primary-600 hover:text-primary-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span>Moving Resources</span>
                      </a>
                    </li>
                    <li>
                      <a 
                        href="#" 
                        className="flex items-center text-primary-600 hover:text-primary-800"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span>Energy Saving Tips</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Customer Reviews */}
              <div className="mt-6 bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="bg-primary-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-primary-800">Customer Reviews</h3>
                </div>
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">4.9/5</span>
                    <span className="ml-1 text-xs text-gray-500">(79,124 reviews)</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic">
                        "ComparePower made it so easy to find the best electricity plan for my new home in {city.name}. Saved me over $300 compared to my previous provider!"
                      </p>
                      <p className="text-xs text-gray-500 mt-2">- Michael T., {city.name}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic">
                        "I needed same-day power connection for my apartment and ComparePower delivered! Had my confirmation in minutes."
                      </p>
                      <p className="text-xs text-gray-500 mt-2">- Jessica R., {city.name}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <Link
                      to="/wizard/welcome"
                      className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                    >
                      Join thousands of satisfied customers
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Move to {city.name}?</h2>
            <p className="mt-4 text-xl text-primary-100">
              Let us help you set up your electricity service in just a few minutes.
            </p>
            <div className="mt-8">
              <Link
                to="/wizard/welcome"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-base font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Additional icon components needed for city energy facts
function Home(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function Sun(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function Droplets(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c0 0-3.09 2.11-3.97 3.72A4.04 4.04 0 0 0 3 11.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c0 0 .5.83 1 1.82 1 1.98 1 3.14 0 5.12-.57 1.14-2 2.59-3 3.75a10.02 10.02 0 0 0-1.49-4.15" />
      <path d="M5.5 12.01A7.73 7.73 0 0 0 17 15.31c.7-.21 1.36-.53 2-1" />
    </svg>
  );
}

function Wind(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
      <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
      <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
    </svg>
  );
}

function Thermometer(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  );
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function Users(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

export default CityDetailPage;