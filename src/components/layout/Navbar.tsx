import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, MapPin, HelpCircle, Phone, Search, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useWizard } from '../../context/WizardContext';
import ThemeToggle from '../shared/ThemeToggle';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showResourceDropdown, setShowResourceDropdown] = useState(false);
  const location = useLocation();
  const { wizardState } = useWizard();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Handle scroll event to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setShowAccountDropdown(false);
    setShowResourceDropdown(false);
  }, [location.pathname]);

  // Check if user has account info
  const hasAccountInfo = () => {
    return (
      wizardState.orderConfirmation.accountNumber && 
      wizardState.selectedPlan.provider &&
      wizardState.personalInfo.firstName
    );
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled 
        ? "bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/30" 
        : "bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/10"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src="https://i.postimg.cc/JzB3hySM/CPLogo-4-C-H-wtag.png" 
                alt="ComparePower" 
                className="h-8 dark:hidden" 
              />
              <img 
                src="https://i.postimg.cc/qvCYdvLC/comparepower-logo-grey-light.png" 
                alt="ComparePower" 
                className="h-8 hidden dark:block" 
              />
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/" isActive={isActive('/')}>
              <Home className="h-4 w-4 mr-1" />
              Home
            </NavLink>
            <NavLink to="/city-guides" isActive={isActive('/city-guides') || location.pathname.startsWith('/city-guides/')}>
              <MapPin className="h-4 w-4 mr-1" />
              City Guides
            </NavLink>
            <NavLink to="/transfer" isActive={isActive('/transfer')}>
              <ElectricityIcon className="h-4 w-4 mr-1" />
              Transfer Service
            </NavLink>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                  showResourceDropdown
                    ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
                onClick={() => setShowResourceDropdown(!showResourceDropdown)}
                onBlur={() => setTimeout(() => setShowResourceDropdown(false), 100)}
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Resources
                <ChevronDown className={cn(
                  "ml-1 h-4 w-4 transition-transform",
                  showResourceDropdown ? "rotate-180" : ""
                )} />
              </button>
              
              {showResourceDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to="/blog/ultimate-texas-electricity-setup-checklist"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Moving Checklist
                    </Link>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Energy Saving Tips
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Understanding Your Bill
                    </a>
                    <Link
                      to="/deploy"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Deploy This Site
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Account Dropdown (when account exists) */}
            {hasAccountInfo() ? (
              <div className="relative">
                <button
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center",
                    showAccountDropdown
                      ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
                      : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  onBlur={() => setTimeout(() => setShowAccountDropdown(false), 100)}
                >
                  <User className="h-4 w-4 mr-1" />
                  My Account
                  <ChevronDown className={cn(
                    "ml-1 h-4 w-4 transition-transform",
                    showAccountDropdown ? "rotate-180" : ""
                  )} />
                </button>
                
                {showAccountDropdown && (
                  <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black dark:ring-gray-700 ring-opacity-5 z-10">
                    <div className="py-3 px-4 border-b border-gray-100 dark:border-gray-700">
                      <div className="font-medium text-gray-900 dark:text-white">{wizardState.personalInfo.firstName} {wizardState.personalInfo.lastName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{wizardState.selectedPlan.provider} Customer</div>
                    </div>
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <div className="px-4 py-2 text-sm">
                        <div className="text-gray-500 dark:text-gray-400">Account #:</div>
                        <div className="font-medium text-gray-900 dark:text-white">{wizardState.orderConfirmation.accountNumber}</div>
                      </div>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        View Account Details
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Billing Information
                      </a>
                      <Link
                        to="/wizard/checklist"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        role="menuitem"
                      >
                        Moving Checklist
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/wizard/welcome" className="btn btn-primary flex items-center">
                <ElectricityIcon className="h-4 w-4 mr-1" />
                Get Connected
              </Link>
            )}
            
            <ThemeToggle />
          </div>
          
          <div className="flex md:hidden items-center">
            <ThemeToggle className="mr-2" />
            
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={cn(
        "md:hidden fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile menu background overlay */}
        <div 
          className="absolute inset-0 bg-black dark:bg-gray-900 opacity-25 dark:opacity-50" 
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        ></div>
        
        {/* Mobile menu panel */}
        <div className="relative bg-white dark:bg-gray-900 h-full w-3/4 max-w-xs shadow-xl flex flex-col overflow-y-auto">
          <div className="px-4 pt-4 pb-2 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <img 
                src="https://i.postimg.cc/JzB3hySM/CPLogo-4-C-H-wtag.png" 
                alt="ComparePower" 
                className="h-7 dark:hidden" 
              />
              <img 
                src="https://i.postimg.cc/qvCYdvLC/comparepower-logo-grey-light.png" 
                alt="ComparePower" 
                className="h-7 hidden dark:block" 
              />
            </div>
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 pt-2 pb-3 px-4 space-y-1 overflow-y-auto">
            <MobileNavLink to="/" isActive={isActive('/')} icon={<Home className="h-5 w-5 mr-3" />}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/city-guides" isActive={isActive('/city-guides') || location.pathname.startsWith('/city-guides/')} icon={<MapPin className="h-5 w-5 mr-3" />}>
              City Guides
            </MobileNavLink>
            <MobileNavLink to="/transfer" isActive={isActive('/transfer')} icon={<ElectricityIcon className="h-5 w-5 mr-3" />}>
              Transfer Service
            </MobileNavLink>
            
            {/* Mobile account section when account exists */}
            {hasAccountInfo() && (
              <>
                <div className="pt-4 pb-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-white">{wizardState.personalInfo.firstName} {wizardState.personalInfo.lastName}</div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{wizardState.selectedPlan.provider} Customer</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <a
                      href="#"
                      className="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      Account #{wizardState.orderConfirmation.accountNumber?.substring(0, 4)}...
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-base font-medium text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                    >
                      View Account Details
                    </a>
                    <Link
                      to="/wizard/checklist"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      role="menuitem"
                    >
                      Moving Checklist
                    </Link>
                  </div>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
              </>
            )}
            
            {/* Resources and help */}
            <div className="py-2">
              <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Resources
              </h3>
            </div>
            <MobileNavLink to="#" isActive={false} icon={<HelpCircle className="h-5 w-5 mr-3" />}>
              Help & Support
            </MobileNavLink>
            <MobileNavLink to="#" isActive={false} icon={<Search className="h-5 w-5 mr-3" />}>
              Find Plans
            </MobileNavLink>
            <MobileNavLink to="#" isActive={false} icon={<Phone className="h-5 w-5 mr-3" />}>
              Contact Us
            </MobileNavLink>
            <MobileNavLink to="/deploy" isActive={isActive('/deploy')} icon={<ElectricityIcon className="h-5 w-5 mr-3" />}>
              Deploy This Site
            </MobileNavLink>
            
            <div className="py-2 flex justify-center">
              <ThemeToggle variant="button" showLabel={true} />
            </div>
          </div>
          
          {!hasAccountInfo() && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/wizard/welcome"
                className="block w-full text-center py-3 px-4 rounded-md text-white dark:text-gray-900 bg-primary-600 dark:bg-primary-400 hover:bg-primary-700 dark:hover:bg-primary-500 font-medium shadow-sm transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Connected
              </Link>
              <div className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
                Setup takes less than 5 minutes
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-2 rounded-md text-sm font-medium flex items-center",
        isActive
          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps {
  to: string;
  isActive: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, isActive, icon, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-3 rounded-md text-base font-medium",
        isActive
          ? "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30"
          : "text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      {icon}
      {children}
    </Link>
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

export default Navbar;