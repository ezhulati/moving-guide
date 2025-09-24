import { useState, useRef } from 'react';
import { cn } from '../../utils/cn';
import { useWizard } from '../../context/WizardContext';
import { useToast } from '../../context/ToastContext';
import { Upload, X, Check, Lock, Info, ArrowRight, DollarSign, Zap, Shield } from 'lucide-react';

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
        const randomResult = Math.random() > 0.3; // 70% chance switch is better
        
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
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {!analysisComplete ? 'Upload Your Electricity Bill for Analysis' : 
           analysisResult?.recommendedAction === 'switch' ? 
           'You\'ll Save More With a New Plan' : 'Your Current Plan is Best'}
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
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Upload your bill so we can analyze your current rate and usage patterns to provide the best recommendation.
          </p>
          
          {isUploading || isAnalyzing ? (
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg border border-gray-200 dark:border-gray-600 text-center mb-4">
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
                "flex justify-center px-5 pt-4 pb-5 border-2 border-dashed rounded-lg cursor-pointer mb-4",
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
              <div className="space-y-2 text-center">
                <Upload className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-500" />
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
          
          <div className="flex justify-center space-x-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
            <div className="flex items-center">
              <Lock className="h-3.5 w-3.5 mr-1" />
              <span>Secure</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-3.5 w-3.5 mr-1" />
              <span>Private</span>
            </div>
            <div className="flex items-center">
              <Zap className="h-3.5 w-3.5 mr-1" />
              <span>Instant Analysis</span>
            </div>
          </div>
          
          <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-medium">Our honest promise:</span> We'll give you our unbiased recommendation based on your actual data. If transferring your current service is better, we'll tell you - even if it means we make less money.
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              className="btn btn-secondary text-sm py-2"
              onClick={onClose}
              disabled={isUploading || isAnalyzing}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary text-sm py-2"
              onClick={onContinueWithNewPlans}
              disabled={isUploading || isAnalyzing}
            >
              Skip & Browse Plans
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-4 mb-4">
            {analysisResult?.recommendedAction === 'switch' ? (
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      Switching will save you ${analysisResult.potentialSavings}/year
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Your bill from {analysisResult.provider} shows you could save with a new plan
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Your current rate</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{analysisResult.currentRate}¢/kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">New plan rate</p>
                    <p className="text-lg font-medium text-green-600 dark:text-green-400">{analysisResult.newRate}¢/kWh</p>
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md border border-green-100 dark:border-green-800">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-green-800 dark:text-green-200">
                      We recommend switching to a new plan optimized for your new home's usage pattern.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base font-medium text-gray-900 dark:text-white">
                      Your current plan is your best option
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      You already have a great rate with {analysisResult?.provider}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Your current rate</p>
                    <p className="text-lg font-medium text-green-600 dark:text-green-400">{analysisResult?.currentRate}¢/kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Best new plan rate</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">{analysisResult?.newRate}¢/kWh</p>
                  </div>
                </div>
                
                <div className="bg-primary-50 dark:bg-primary-900/30 p-3 rounded-md border border-primary-100 dark:border-primary-800">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2 flex-shrink-0" />
                    <p className="text-sm text-primary-800 dark:text-primary-200">
                      We recommend transferring your current plan to save approximately ${analysisResult?.potentialSavings}/year.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3">
            {analysisResult?.recommendedAction === 'switch' ? (
              <>
                <button
                  type="button"
                  className="btn btn-secondary text-sm py-2"
                  onClick={onContinueWithTransfer}
                >
                  Transfer Anyway
                </button>
                <button
                  type="button"
                  className="btn btn-primary text-sm py-2"
                  onClick={onContinueWithNewPlans}
                >
                  See Better Plans
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-secondary text-sm py-2"
                  onClick={onContinueWithNewPlans}
                >
                  See New Plans
                </button>
                <button
                  type="button"
                  className="btn btn-primary text-sm py-2"
                  onClick={onContinueWithTransfer}
                >
                  Transfer My Service
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Custom Shield icon
function CustomShieldIcon(props: React.SVGProps<SVGSVGElement>) {
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

export default BillUploadAnalysis;