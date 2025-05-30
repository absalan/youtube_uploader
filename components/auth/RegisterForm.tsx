
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added useNavigate
import { registerUser } from '../../services/authService';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { ApiError } from '../../types';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Added for success message
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Added for redirection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setFieldErrors({ password_confirmation: ["Passwords do not match."] });
      return;
    }
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    setFieldErrors({});

    try {
      const response = await registerUser({ name, username, email, password, password_confirmation: passwordConfirmation });
      setSuccessMessage(response.message);
      setIsLoading(false); // Stop loading indicator
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login', { state: { message: response.message } });
      }, 2000); // 2-second delay

    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Registration failed. Please try again.');
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
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && Object.keys(fieldErrors).length === 0 && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {successMessage && <Alert type="success" message={successMessage} />}
          
          <Input
            label="Full Name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={fieldErrors.name?.[0]}
            disabled={isLoading || !!successMessage}
          />
          <Input
            label="Username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={fieldErrors.username?.[0]}
            disabled={isLoading || !!successMessage}
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email?.[0]}
            disabled={isLoading || !!successMessage}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={fieldErrors.password?.[0]}
            disabled={isLoading || !!successMessage}
          />
          <Input
            label="Confirm Password"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            required
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            error={fieldErrors.password_confirmation?.[0]}
            disabled={isLoading || !!successMessage}
          />

          <div>
            <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading || !!successMessage}>
              {successMessage ? 'Registered!' : 'Register'}
            </Button>
          </div>
          {!successMessage && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Sign in
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
