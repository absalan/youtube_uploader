
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center px-4">
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</h1>
      <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-4">Oops! Page Not Found.</p>
      <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" size="lg">
          Go to Homepage
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;