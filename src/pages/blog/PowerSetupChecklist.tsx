import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Clock, Check, DollarSign, Zap, Home, Shield, AlertCircle } from 'lucide-react';
import SEO from '../../components/shared/SEO';
import PowerSetupChecklist from '../../components/shared/PowerSetupChecklist';
import { cn } from '../../utils/cn';

const PowerSetupChecklistPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="Ultimate Texas Electricity Setup Checklist - ComparePower"
        description="A comprehensive checklist to help you set up electricity in your new Texas home without missing any important steps."
      />
      
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary-600 dark:text-primary-400 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Ultimate Texas Electricity Setup Checklist</h1>
          <div className="text-gray-600 dark:text-gray-300">
            <div className="flex items-center text-sm mb-6">
              <Clock className="h-4 w-4 mr-1" />
              <span>Published: June 6, 2025</span>
              <span className="mx-2">•</span>
              <span>5 min read</span>
            </div>
            <p className="text-lg leading-relaxed mb-6">
              Setting up electricity for your new home in Texas involves several important steps that are easy to overlook. This comprehensive checklist will help you navigate the process smoothly, whether you're moving to a new apartment or buying your first house.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              By following this guide, you'll avoid common pitfalls and ensure your power is connected on time, with the right plan for your needs, at the best possible price.
            </p>
          </div>
          
          {/* Table of contents */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-12">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">In this guide:</h2>
            <ul className="space-y-2">
              <li>
                <a href="#why-checklist" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                  <ChevronIcon className="h-4 w-4 mr-2" />
                  Why You Need a Checklist
                </a>
              </li>
              <li>
                <a href="#before-moving" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                  <ChevronIcon className="h-4 w-4 mr-2" />
                  Before Your Move
                </a>
              </li>
              <li>
                <a href="#on-moving-day" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                  <ChevronIcon className="h-4 w-4 mr-2" />
                  On Moving Day
                </a>
              </li>
              <li>
                <a href="#after-moving" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                  <ChevronIcon className="h-4 w-4 mr-2" />
                  After Moving In
                </a>
              </li>
              <li>
                <a href="#checklist-download" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center">
                  <ChevronIcon className="h-4 w-4 mr-2" />
                  Downloadable Checklist
                </a>
              </li>
            </ul>
          </div>
          
          {/* Why You Need a Checklist */}
          <section id="why-checklist" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why You Need an Electricity Setup Checklist</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Moving is chaotic, and it's easy to forget crucial steps in the electricity setup process. The consequences of overlooking these steps can range from frustrating to costly:
              </p>
              <ul>
                <li>
                  <strong>Arriving at a dark home</strong> because you forgot to schedule your connection in advance
                </li>
                <li>
                  <strong>Paying higher rates</strong> because you didn't compare plans before signing up
                </li>
                <li>
                  <strong>Delayed move-in</strong> because you don't have proof of service for your apartment complex
                </li>
                <li>
                  <strong>Unexpected fees</strong> because you didn't understand the contract terms
                </li>
                <li>
                  <strong>Higher bills</strong> because you didn't optimize your home's energy efficiency
                </li>
              </ul>
              <p>
                Our checklist helps you avoid these problems and ensures a smooth transition to your new home.
              </p>
            </div>
          </section>
          
          {/* Before Your Move */}
          <section id="before-moving" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Before Your Move</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Starting early is key to a smooth electricity setup. Here's what to do at least 2 weeks before your move:
              </p>
              
              <h3>Research and Compare Plans</h3>
              <p>
                Texas has a deregulated electricity market with over 100 providers competing for your business. This means you have the power to choose, but it also means you need to compare options carefully.
              </p>
              <p>
                When comparing plans, pay attention to:
              </p>
              <ul>
                <li>Rate structure (fixed vs. variable)</li>
                <li>Contract length (1 month to 36 months)</li>
                <li>Cancellation fees</li>
                <li>Special promotions or incentives</li>
                <li>Renewable energy options</li>
                <li>Bill credit tiers (typically at 500, 1000, or 2000 kWh)</li>
              </ul>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800 my-6">
                <h4 className="text-blue-800 dark:text-blue-300 font-medium">Pro Tip: Understand "All-In" Pricing</h4>
                <p className="text-blue-700 dark:text-blue-400 mt-2">
                  The advertised rate may not include all fees. Look for "all-in" pricing that includes energy charges, TDU (Transmission and Distribution Utility) fees, and monthly service charges. This gives you the true cost per kWh.
                </p>
              </div>
              
              <h3>Check Special Requirements for Apartments</h3>
              <p>
                If you're moving to an apartment, ask the leasing office about their requirements for electricity service. Many apartments require proof of service before you can get your keys. Make sure you understand:
              </p>
              <ul>
                <li>When you need to show proof of service</li>
                <li>What format they accept (email, printed document, etc.)</li>
                <li>If they require service to be in your name or if roommates can be listed</li>
              </ul>
            </div>
            
            <div className={cn(
              "bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800 my-6",
              "flex items-start"
            )}>
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-amber-800 dark:text-amber-300 font-medium">Important Note for Existing Customers</h4>
                <p className="text-amber-700 dark:text-amber-400 mt-2">
                  If you're moving within Texas and already have electricity service, don't automatically transfer your current plan. Your current plan was priced based on your old home's usage pattern, which may not be optimal for your new home. Take the time to compare the cost of transferring versus selecting a new plan.
                </p>
              </div>
            </div>
          </section>
          
          {/* On Moving Day */}
          <section id="on-moving-day" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">On Moving Day</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                When you arrive at your new home, there are a few important electricity-related tasks to take care of right away:
              </p>
              
              <h3>Confirm Power is Connected</h3>
              <p>
                As soon as you arrive, verify that the electricity is working by checking lights and outlets. If your power isn't on:
              </p>
              <ul>
                <li>Check the breaker box to make sure the main switch is on</li>
                <li>Call your electricity provider's customer service line</li>
                <li>If you ordered same-day service, remember it may take until 8 PM to be connected</li>
              </ul>
              
              <h3>Locate Your Circuit Breaker Box</h3>
              <p>
                Finding your circuit breaker box early can save you frustration later. In apartments, it's often inside your unit, typically in a hallway, utility closet, or kitchen. In houses, check the garage, utility room, or basement. Once you find it:
              </p>
              <ul>
                <li>Make sure all breakers are in the "on" position</li>
                <li>Identify which breakers control which areas of your home</li>
                <li>Look for any breakers marked for major appliances</li>
              </ul>
              
              <h3>Test All Outlets and Switches</h3>
              <p>
                Before arranging furniture, test all electrical outlets and switches to make sure they're working properly. Note any issues to address later with your landlord or an electrician.
              </p>
              
              <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800 my-6">
                <h4 className="text-green-800 dark:text-green-300 font-medium">Safety First</h4>
                <p className="text-green-700 dark:text-green-400 mt-2">
                  If you notice any outlets with scorch marks, unusual warmth, or that spark when plugged into, don't use them and report the issue immediately to your landlord or an electrician.
                </p>
              </div>
            </div>
          </section>
          
          {/* After Moving In */}
          <section id="after-moving" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">After Moving In</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>
                Once you're settled, take these steps to ensure your electricity service runs smoothly:
              </p>
              
              <h3>Set Up Your Online Account</h3>
              <p>
                Create an online account with your electricity provider to:
              </p>
              <ul>
                <li>View and pay your bills</li>
                <li>Track your usage</li>
                <li>Update contact information</li>
                <li>Set up service notifications</li>
              </ul>
              <p>
                Most providers offer mobile apps that make account management even easier.
              </p>
              
              <h3>Set Up Autopay</h3>
              <p>
                Setting up automatic payments helps you avoid late fees and service interruptions. You can typically set this up through your online account or by calling customer service.
              </p>
              
              <h3>Program Your Thermostat for Energy Efficiency</h3>
              <p>
                Heating and cooling account for about 50% of home energy use. Setting your thermostat to energy-efficient temperatures can significantly reduce your bills:
              </p>
              <ul>
                <li>Summer: 78°F when home, 82°F when away</li>
                <li>Winter: 68°F when home, 62°F when away</li>
              </ul>
              <p>
                If you have a programmable thermostat, set it to automatically adjust based on your schedule.
              </p>
              
              <h3>Review Your First Bill</h3>
              <p>
                When your first bill arrives (typically after 30 days), review it carefully to:
              </p>
              <ul>
                <li>Verify the rate matches what you signed up for</li>
                <li>Check for unexpected fees or charges</li>
                <li>Understand your usage pattern</li>
                <li>Identify opportunities for energy savings</li>
              </ul>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800 my-6">
                <h4 className="text-purple-800 dark:text-purple-300 font-medium">Understanding Your Texas Electricity Bill</h4>
                <p className="text-purple-700 dark:text-purple-400 mt-2">
                  A typical Texas electricity bill includes:
                </p>
                <ul className="mt-2 text-purple-700 dark:text-purple-400">
                  <li>Energy charges (your kWh usage multiplied by your rate)</li>
                  <li>TDU delivery charges (the cost to deliver electricity to your home)</li>
                  <li>Monthly base charges or fees</li>
                  <li>Taxes</li>
                  <li>Any applicable credits or discounts</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Downloadable Checklist */}
          <section id="checklist-download" className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Power Setup Checklist</h2>
            
            <div className="mb-8">
              <PowerSetupChecklist />
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Want to take this checklist with you? Download it as a PDF or Google Sheet to track your progress.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    // In a real implementation, this would download a PDF
                    alert('PDF download would start here in the real implementation');
                  }}
                  className="btn btn-primary inline-flex items-center"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download PDF Checklist
                </a>
                <a 
                  href="https://docs.google.com/spreadsheets/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary inline-flex items-center"
                >
                  <GoogleSheetsIcon className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Open in Google Sheets
                </a>
              </div>
            </div>
          </section>
          
          {/* Get Connected CTA */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-8 border border-primary-100 dark:border-primary-800 text-center">
            <h2 className="text-2xl font-bold text-primary-800 dark:text-primary-200 mb-4">Ready to Set Up Your Electricity?</h2>
            <p className="text-primary-700 dark:text-primary-300 max-w-2xl mx-auto mb-6">
              Now that you know what to do, let us help you get connected. ComparePower makes it easy to compare plans, sign up in minutes, and get your power connected as soon as today.
            </p>
            <Link to="/wizard/welcome" className="btn btn-primary inline-flex items-center px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              Get Connected in 5 Minutes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom icons
function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

function GoogleSheetsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.5 2H9.2C8.3 2 7.5 2.8 7.5 3.7V11H19.5V2Z" fill="#0F9D58" />
      <path d="M7.5 22H17.8C18.7 22 19.5 21.2 19.5 20.3V13H7.5V22Z" fill="#0F9D58" />
      <path d="M6 13H1C0.4 13 0 12.6 0 12V6C0 5.4 0.4 5 1 5H6V13Z" fill="#57BB8A" />
      <path d="M6 19V13H0V17C0 18.1 0.9 19 2 19H6Z" fill="#57BB8A" />
      <path d="M24 13H7.5V5H23C23.6 5 24 5.4 24 6V12C24 12.6 23.6 13 23 13H24Z" fill="#57BB8A" />
      <path d="M7.5 19H22C23.1 19 24 18.1 24 17V13H7.5V19Z" fill="#57BB8A" />
    </svg>
  );
}

export default PowerSetupChecklistPage;