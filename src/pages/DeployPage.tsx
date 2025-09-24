import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeployButton from '../components/shared/DeployButton';
import SEO from '../components/shared/SEO';

const DeployPage = () => {
  return (
    <div className="min-h-[70vh] bg-white flex flex-col items-center px-4 py-16">
      <SEO 
        title="Deploy Your ComparePower Guide"
        description="Deploy your customized ComparePower Guide application to Netlify."
      />
      
      <div className="max-w-3xl w-full text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Deploy Your Application</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Your ComparePower Guide is ready to be deployed. Click below to deploy it to Netlify.
        </p>
        
        <div className="mt-12 space-y-10">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Deployment Options</h2>
            
            <DeployButton className="mt-6" />
            
            <div className="mt-8 border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">About Deployment</h3>
              <p className="text-gray-600 text-sm">
                Deploying to Netlify will make your ComparePower Guide accessible online via a public URL.
                This is a one-click deployment that automatically optimizes your site for performance.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Next Steps After Deployment</h2>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 flex-shrink-0">
                  1
                </span>
                <span>Share your deployment URL with potential users</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 flex-shrink-0">
                  2
                </span>
                <span>Connect your own custom domain (optional)</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 flex-shrink-0">
                  3
                </span>
                <span>Set up form handling for user submissions</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-600 mr-2 flex-shrink-0">
                  4
                </span>
                <span>Configure analytics to track user engagement</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8">
          <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DeployPage;