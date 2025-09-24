import { useState, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { Upload, X, Check, Lock, Info, ArrowRight, AlertCircle } from 'lucide-react';

interface BillUploadAnalysisProps {
  onClose: () => void;
  onContinueWithNewPlans: () => void;
  onContinueWithTransfer: () => void;
}

const BillUploadAnalysis: React.FC<BillUploadAnalysisProps> = ({ 
  onClose, 
  onContinueWithNewPlans,
  onContinueWithTransfer 
}) => {
  const { wizardState, updateWizardState } = useWizard();
  const { addToast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    recommendedAction: 'transfer' | 'switch';
    currentRate: number;
    newRate: number;
    potentialSavings: number;
    confidence: 'high' | 'medium' | 'low';
    provider?: string;
    usageChange?: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Trigger file input click
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Start the mock upload/analysis process
      handleBillAnalysis(file);
    }
  };
  
  // Simulate drag and drop functionality
  const [isDragActive, setIsDragActive] = useState(false);
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      
      // Start the mock upload/analysis process
      handleBillAnalysis(file);
    }
  };
  
  // Simulate bill analysis
  const handleBillAnalysis = (file: File) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // Simulate analysis delay
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        
        // Randomly determine if transfer or switching is better (for demo purposes)
        // In a real app, this would be based on actual bill analysis
        const randomResult = Math.random() > 0.3; // 30% chance transfer is better
        
        const result = randomResult ? 
          {
            recommendedAction: 'switch' as const,
            currentRate: 12.5,
            newRate: 10.9,
            potentialSavings: 235,
            confidence: 'high' as const,
            provider: 'TXU Energy',
            usageChange: 15 // 15% higher usage expected at new home
          } : 
          {
            recommendedAction: 'transfer' as const,
            currentRate: 10.2,
            newRate: 11.5, // New plans are higher
            potentialSavings: 120, // Savings from transferring instead of switching
            confidence: 'medium' as const,
            provider: 'TXU Energy',
            usageChange: -5 // 5% lower usage expected at new home
          };
          
        setAnalysisResult(result);
        
        // Update wizard state with the analysis result
        updateWizardState({
          transferFlow: {
            ...wizardState.transferFlow,
            currentRate: result.currentRate,
            potentialSavings: result.potentialSavings,
            recommendedAction: result.recommendedAction,
            wantsTransfer: result.recommendedAction === 'transfer',
            currentProvider: result.provider
          }
        });
      }, 3000);
    }, 1500);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {!analysisComplete ? 'Transfer or Start New Service?' : 
           analysisResult?.recommendedAction === 'switch' ? 
           "You'll Save More With a New Plan" : 'Your Current Plan is Your Best Option'}
        </h3>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          onClick={onClose}
          disabled={isUploading || isAnalyzing}
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {!analysisComplete ? (
        <div className="p-6">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Drop your current electricity bill here and we'll analyze:
          </p>
          <ul className="mb-6 space-y-2">
            <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
              <Check className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>Your current rate vs. today's best rates</span>
            </li>
            <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
              <Check className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>How your new home changes your costs</span>
            </li>
            <li className="flex items-start text-sm text-gray-600 dark:text-gray-300">
              <Check className="h-4 w-4 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0 mt-0.5" />
              <span>Whether transferring or starting fresh saves more</span>
            </li>
          </ul>
          
          {isUploading || isAnalyzing ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
              {isUploading && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-primary-400"></div>
                  <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">Uploading your bill...</p>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-primary-400"></div>
                  <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">Analyzing your bill...</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Comparing rates and calculating potential savings</p>
                  <div className="mt-4 w-full max-w-xs bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div 
                      className="bg-primary-600 dark:bg-primary-400 h-2.5 rounded-full" 
                      style={{ width: '70%' }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              className={cn(
                "flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer",
                isDragActive 
                  ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30"
                  : "border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
              )}
              onClick={handleUploadClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="bill-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload your bill</span>
                    <input 
                      id="bill-upload" 
                      name="bill-upload" 
                      type="file" 
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center space-x-3 mt-4">
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Lock className="h-3.5 w-3.5 mr-1" />
              <span>Secure</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3.5 w-3.5 mr-1" />
              <span>Private</span>
            </div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Bolt className="h-3.5 w-3.5 mr-1" />
              <span>Instant Analysis</span>
            </div>
          </div>
          
          <div className="mt-5 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Honest recommendations</span> - Even if transferring is better, we'll tell you. We want to help you make the best decision for your situation.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isUploading || isAnalyzing}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onContinueWithNewPlans}
              disabled={isUploading || isAnalyzing}
            >
              Skip & Browse Plans
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Bill Analysis Results */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-5 mb-6">
            {analysisResult?.recommendedAction === 'switch' ? (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      Switching will save you ${analysisResult.potentialSavings}/year
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      We analyzed your bill from {analysisResult.provider} and compared it with current market rates.
                    </p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Your current plan rate:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{analysisResult.currentRate}¢/kWh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Expected usage change:</span>
                      <span className={cn(
                        "text-sm font-medium",
                        analysisResult.usageChange && analysisResult.usageChange > 0 
                          ? "text-red-600 dark:text-red-400" 
                          : "text-green-600 dark:text-green-400"
                      )}>
                        {analysisResult.usageChange && analysisResult.usageChange > 0 ? '+' : ''}
                        {analysisResult.usageChange}% at new address
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Best available new rate:</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{analysisResult.newRate}¢/kWh</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Potential annual savings:</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">${analysisResult.potentialSavings}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-100 dark:border-green-800">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Our recommendation: Switch to a new plan
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Your usage profile at your new address will be different, making a new plan more cost-effective than transferring.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      You already have a great rate - Transfer it!
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      We analyzed your bill from {analysisResult?.provider} and compared it with current market rates.
                    </p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Your current plan rate:</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">{analysisResult?.currentRate}¢/kWh (below market)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Expected usage change:</span>
                      <span className={cn(
                        "text-sm font-medium",
                        analysisResult?.usageChange && analysisResult.usageChange > 0 
                          ? "text-red-600 dark:text-red-400" 
                          : "text-green-600 dark:text-green-400"
                      )}>
                        {analysisResult?.usageChange && analysisResult.usageChange > 0 ? '+' : ''}
                        {analysisResult?.usageChange}% at new address
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Best available new rate:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{analysisResult?.newRate}¢/kWh</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Money saved by transferring:</span>
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">${analysisResult?.potentialSavings}/year</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-100 dark:border-green-800">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Our recommendation: Transfer your current plan
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        You locked in a great rate! Your current plan will still be cost-effective at your new address.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Confidence level */}
          <div className="mb-6 bg-gray-100 dark:bg-gray-800/80 p-3 rounded-lg">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Analysis Confidence: {analysisResult?.confidence === 'high' ? 'High' : analysisResult?.confidence === 'medium' ? 'Medium' : 'Low'}</h5>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={cn(
                  "h-1.5 rounded-full",
                  analysisResult?.confidence === 'high' ? "bg-green-500 w-full" :
                  analysisResult?.confidence === 'medium' ? "bg-yellow-500 w-2/3" :
                  "bg-red-500 w-1/3"
                )}
              ></div>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {analysisResult?.confidence === 'high' 
                ? 'Based on your complete bill data, we have high confidence in this recommendation.'
                : analysisResult?.confidence === 'medium'
                ? 'We have moderate confidence in this recommendation based on the information provided.'
                : 'Limited information available. Consider comparing more options for a better decision.'}
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            {analysisResult?.recommendedAction === 'switch' ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onContinueWithTransfer}
                >
                  Transfer Anyway
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onContinueWithNewPlans}
                >
                  See Better Plans
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onContinueWithNewPlans}
                >
                  See New Plans Anyway
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onContinueWithTransfer}
                >
                  Get Transfer Instructions
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom icons
function Shield(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function Bolt(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
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
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

function HelpCircle(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  );
}

export default BillUploadAnalysis;