
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../services/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { ApiError } from '../../types';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const [identifier, setIdentifier] = useState(''); // For username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && !fieldErrors.identifier && !fieldErrors.password && <Alert type="error" message={error} onClose={() => setError(null)} />}
          
          <Input
            label="Username or Email"
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
           <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
