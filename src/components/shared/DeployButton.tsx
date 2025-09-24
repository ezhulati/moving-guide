import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { ExternalLink, Loader, Check, AlertCircle, Copy, Github } from 'lucide-react';
import { getDeploymentStatus } from '../../utils/deploymentStatus';

interface DeployButtonProps {
  className?: string;
}

type DeployStatus = 'idle' | 'deploying' | 'success' | 'error';

const DeployButton: React.FC<DeployButtonProps> = ({ className }) => {
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('idle');
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployStep, setDeployStep] = useState(0);
  const [deployProgress, setDeployProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [claimUrl, setClaimUrl] = useState<string | null>(null);
  const [deployId, setDeployId] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  // Poll deployment status
  useEffect(() => {
    if (deployStatus === 'deploying' && deployId) {
      const interval = setInterval(async () => {
        try {
          setChecking(true);
          const status = await getDeploymentStatus({ id: deployId });
          setChecking(false);
          
          if (status && status.state) {
            // Update progress based on state
            if (status.state === 'ready') {
              setDeployProgress(100);
              setDeployStatus('success');
              setDeployUrl(status.deploy_url || null);
              setClaimUrl(status.claim_url || null);
              clearInterval(interval);
            } else if (status.state === 'error') {
              setDeployStatus('error');
              setErrorMessage('Deployment failed. Please try again.');
              clearInterval(interval);
            } else {
              // Update progress for in-progress states
              if (status.state === 'building') {
                setDeployStep(2);
                setDeployProgress(40);
              } else if (status.state === 'enqueued') {
                setDeployStep(1);
                setDeployProgress(20);
              } else if (status.state === 'uploading') {
                setDeployStep(3);
                setDeployProgress(70);
              } else if (status.state === 'processing') {
                setDeployStep(4);
                setDeployProgress(90);
              }
            }
          }
        } catch (error) {
          console.error('Error checking deployment status:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [deployStatus, deployId]);

  // Simulate deployment progress when not using real API
  useEffect(() => {
    if (deployStatus === 'deploying' && !deployId) {
      const interval = setInterval(() => {
        setDeployProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });

        // Update deployment steps
        if (deployProgress < 20 && deployStep === 0) {
          setDeployStep(1);
        } else if (deployProgress >= 20 && deployProgress < 50 && deployStep === 1) {
          setDeployStep(2);
        } else if (deployProgress >= 50 && deployProgress < 80 && deployStep === 2) {
          setDeployStep(3);
        } else if (deployProgress >= 80 && deployProgress < 95 && deployStep === 3) {
          setDeployStep(4);
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [deployStatus, deployProgress, deployStep, deployId]);

  // Complete deployment when progress reaches 100%
  useEffect(() => {
    if (deployProgress >= 100 && deployStatus === 'deploying') {
      setDeployStatus('success');
      setDeployUrl('https://texas-power-mover-guide.netlify.app');
    }
  }, [deployProgress, deployStatus]);

  const handleDeploy = async () => {
    setDeployStatus('deploying');
    setDeployStep(0);
    setDeployProgress(0);
    setErrorMessage(null);
    setCopySuccess(false);
    
    // Generate a timestamp-based ID for tracking this deployment
    const timestamp = Date.now();
    const newDeployId = `deploy-${timestamp}`;
    setDeployId(newDeployId);
  };

  const handleCopyUrl = () => {
    if (deployUrl) {
      navigator.clipboard.writeText(deployUrl);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {deployStatus === 'idle' && (
        <button
          onClick={handleDeploy}
          className="btn btn-primary flex items-center justify-center transition-colors"
        >
          Deploy to Netlify
        </button>
      )}
      
      {deployStatus === 'deploying' && (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Deploying{checking ? '...' : ''}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{deployProgress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-primary-600 dark:bg-primary-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${deployProgress}%` }}
            ></div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md p-4 border border-gray-200 dark:border-gray-700">
            <ol className="space-y-3">
              <li className="flex items-start">
                <div className={cn("flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3",
                  deployStep >= 1 ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                )}>
                  {deployStep > 1 ? <Check className="h-3 w-3" /> : <span className="text-xs">1</span>}
                </div>
                <div className="flex-1">
                  <span className={cn("text-sm", 
                    deployStep >= 1 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    Preparing build environment
                  </span>
                  {deployStep === 1 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Loader className="animate-spin h-3 w-3 mr-1" /> 
                      Setting up dependencies...
                    </div>
                  )}
                </div>
              </li>
              
              <li className="flex items-start">
                <div className={cn("flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3",
                  deployStep >= 2 ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                )}>
                  {deployStep > 2 ? <Check className="h-3 w-3" /> : <span className="text-xs">2</span>}
                </div>
                <div className="flex-1">
                  <span className={cn("text-sm", 
                    deployStep >= 2 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    Building the application
                  </span>
                  {deployStep === 2 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Loader className="animate-spin h-3 w-3 mr-1" /> 
                      Running build commands...
                    </div>
                  )}
                </div>
              </li>
              
              <li className="flex items-start">
                <div className={cn("flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3",
                  deployStep >= 3 ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                )}>
                  {deployStep > 3 ? <Check className="h-3 w-3" /> : <span className="text-xs">3</span>}
                </div>
                <div className="flex-1">
                  <span className={cn("text-sm", 
                    deployStep >= 3 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    Optimizing assets
                  </span>
                  {deployStep === 3 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Loader className="animate-spin h-3 w-3 mr-1" /> 
                      Processing and compressing files...
                    </div>
                  )}
                </div>
              </li>
              
              <li className="flex items-start">
                <div className={cn("flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center mr-3",
                  deployStep >= 4 ? "bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400" : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                )}>
                  {deployStep > 4 ? <Check className="h-3 w-3" /> : <span className="text-xs">4</span>}
                </div>
                <div className="flex-1">
                  <span className={cn("text-sm", 
                    deployStep >= 4 ? "text-gray-900 dark:text-gray-100" : "text-gray-500 dark:text-gray-400"
                  )}>
                    Deploying to Netlify
                  </span>
                  {deployStep === 4 && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <Loader className="animate-spin h-3 w-3 mr-1" /> 
                      Provisioning CDN resources...
                    </div>
                  )}
                </div>
              </li>
            </ol>
          </div>
        </div>
      )}
      
      {deployStatus === 'success' && (
        <>
          <button className="btn btn-success flex items-center justify-center">
            <Check className="h-4 w-4 mr-2" />
            Deployed Successfully
          </button>
          
          {deployUrl && (
            <div className="mt-4 space-y-4 w-full max-w-md">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">Live URL</h3>
                  <button
                    onClick={handleCopyUrl}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded"
                    aria-label="Copy URL to clipboard"
                  >
                    {copySuccess ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <a 
                  href={deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center break-all"
                >
                  {deployUrl} <ExternalLink className="ml-1 h-4 w-4 flex-shrink-0" />
                </a>
              </div>
              
              {claimUrl && (
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4 text-blue-800 dark:text-blue-300 text-sm">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Transfer ownership to your Netlify account</p>
                      <p className="mt-1">Use the claim link below to transfer this project to your own Netlify account.</p>
                      <a 
                        href={claimUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-blue-700 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center underline"
                      >
                        Claim this Netlify site <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-md text-success-800 dark:text-success-300 text-sm">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-success-600 dark:text-success-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Success! Your Texas Power Mover Guide is live</p>
                    <p className="mt-1">You can share this link with others or continue to make updates to your application.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href={deployUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Site
                </a>
                <button
                  className="btn btn-secondary flex items-center justify-center"
                  onClick={() => {
                    setDeployStatus('idle');
                    setDeployUrl(null);
                    setDeployId(null);
                    setClaimUrl(null);
                  }}
                >
                  Deploy Again
                </button>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                <a 
                  href="https://github.com/yourusername/texas-power-mover-guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
                >
                  <Github className="h-4 w-4 mr-1" />
                  View source on GitHub
                </a>
              </div>
            </div>
          )}
        </>
      )}
      
      {deployStatus === 'error' && (
        <div className="w-full max-w-md">
          <button className="btn btn-error flex items-center justify-center mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            Deployment Failed
          </button>
          
          {errorMessage && (
            <div className="p-4 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-md text-error-800 dark:text-error-300 text-sm">
              <p className="font-medium">Error Details:</p>
              <p className="mt-1">{errorMessage}</p>
            </div>
          )}
          
          <button
            onClick={() => setDeployStatus('idle')}
            className="btn btn-secondary mt-4 w-full"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function to format Info icon
function Info(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export default DeployButton;