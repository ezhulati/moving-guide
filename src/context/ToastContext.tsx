import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast, { ToastType } from '../components/shared/Toast';

// Unique ID generator for toasts
const generateId = () => `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Toast item interface
interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    text: string;
    onClick: () => void;
  };
}

// Context interface
interface ToastContextType {
  addToast: (type: ToastType, message: string, duration?: number, action?: { text: string, onClick: () => void }) => void;
  removeToast: (id: string) => void;
}

// Create context with default values
const ToastContext = createContext<ToastContextType>({
  addToast: () => {},
  removeToast: () => {},
});

// Custom hook to use the toast context
export const useToast = () => useContext(ToastContext);

// Provider component
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Add a new toast
  const addToast = useCallback((
    type: ToastType, 
    message: string, 
    duration?: number,
    action?: { text: string, onClick: () => void }
  ) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, type, message, duration, action }]);
    
    // Automatically clear success toasts after they're displayed (optional)
    if (type === 'success' && !duration) {
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    }
    
    return id;
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div 
        className="fixed bottom-0 right-0 z-50 p-4 space-y-3 pointer-events-none max-h-screen overflow-hidden"
        role="log"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map(toast => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={toast.duration}
              onClose={removeToast}
              action={toast.action}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;