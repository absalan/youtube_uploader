
import React from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string | React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ type, message, onClose, className = '' }) => {
  const baseStyles = "p-4 rounded-md flex items-start";
  const typeStyles = {
    success: "bg-green-50 dark:bg-green-900/30 border border-green-300 dark:border-green-600/50 text-green-700 dark:text-green-300",
    error: "bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-600/50 text-red-700 dark:text-red-300",
    info: "bg-blue-50 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600/50 text-blue-700 dark:text-blue-300",
    warning: "bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-600/50 text-yellow-700 dark:text-yellow-300",
  };

  const Icon: React.FC<{ type: AlertProps['type'] }> = ({ type }) => {
    const iconColorClass = {
        success: "text-green-500 dark:text-green-400",
        error: "text-red-500 dark:text-red-400",
        info: "text-blue-500 dark:text-blue-400",
        warning: "text-yellow-500 dark:text-yellow-400",
    }[type];

    if (type === 'success') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 mr-2 ${iconColorClass}`}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
    if (type === 'error') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 mr-2 ${iconColorClass}`}><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>;
    if (type === 'info') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 mr-2 ${iconColorClass}`}><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>;
    if (type === 'warning') return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 mr-2 ${iconColorClass}`}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
    return null;
  }

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${className} mb-4`} role="alert">
      <Icon type={type} />
      <div className="flex-1">{message}</div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-md hover:bg-opacity-20 dark:hover:bg-opacity-20 hover:bg-current dark:hover:bg-current focus:outline-none"
          aria-label="Close alert"
        >
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
        </button>
      )}
    </div>
  );
};

export default Alert;