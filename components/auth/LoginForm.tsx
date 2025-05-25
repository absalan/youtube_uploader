
import React, { useState, useEffect } from 'react'; // Added useEffect
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../services/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { ApiError } from '../../types';
import { Link, useLocation } from 'react-router-dom'; // Added useLocation

const LoginForm: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // For username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null); // Added for messages from other pages
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const location = useLocation(); // Added to get route state

  useEffect(() => {
    if (location.state?.message) {
      setInfoMessage(location.state.message);
      // Clear the state from history so message doesn't reappear on refresh/navigation
      window.history.replaceState({}, document.title)
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setInfoMessage(null); // Clear info message on new submit attempt
    setFieldErrors({});

    try {
      const credentials = identifier.includes('@') ? { email: identifier, password } : { username: identifier, password };
      const response = await loginUser(credentials);
      login(response.user, response.token);
      // Navigate to dashboard is handled by App.tsx based on user state
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Login failed. Please try again.');
      if (apiError.errors) {
        setFieldErrors(apiError.errors);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg dark:shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {infoMessage && <Alert type="info" message={infoMessage} onClose={() => setInfoMessage(null)} />}
          {error && !fieldErrors.identifier && !fieldErrors.password && <Alert type="error" message={error} onClose={() => setError(null)} />}
          
          <Input
            label="Email"
            name="identifier"
            type="text"
            autoComplete="username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={fieldErrors.username?.[0] || fieldErrors.email?.[0]}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password?.[0]}
          />

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
              Sign in
            </Button>
          </div>
           <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
