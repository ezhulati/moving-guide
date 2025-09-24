import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { WizardProvider } from './context/WizardContext';
import { ToastProvider } from './context/ToastContext';
import { PersonalizationProvider } from './components/shared/PersonalizationEngine';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import WizardPage from './pages/WizardPage';
import CityGuidesPage from './pages/CityGuidesPage';
import CityDetailPage from './pages/CityDetailPage';
import DeployPage from './pages/DeployPage';
import TransferServicePage from './pages/TransferServicePage';
import TransferPage from './pages/TransferPage';
import NotFoundPage from './pages/NotFoundPage';
import SessionRecoveryModal from './components/shared/SessionRecoveryModal';
import PowerSetupChecklistPage from './pages/blog/PowerSetupChecklist';
import MobileBottomNavigation from './components/shared/MobileBottomNavigation';

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <ThemeProvider>
          <Router>
            <WizardProvider>
              <PersonalizationProvider>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/wizard/:step" element={<WizardPage />} />
                    <Route path="/city-guides" element={<CityGuidesPage />} />
                    <Route path="/city-guides/:cityName" element={<CityDetailPage />} />
                    <Route path="/deploy" element={<DeployPage />} />
                    <Route path="/transfer" element={<TransferPage />} />
                    <Route path="/transfer-service" element={<TransferServicePage />} />
                    <Route path="/blog/ultimate-texas-electricity-setup-checklist" element={<PowerSetupChecklistPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  <SessionRecoveryModal />
                  {/* Mobile-optimized bottom navigation */}
                  <MobileBottomNavigation />
                </Layout>
              </PersonalizationProvider>
            </WizardProvider>
          </Router>
        </ThemeProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;