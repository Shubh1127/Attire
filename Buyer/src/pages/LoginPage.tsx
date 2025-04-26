import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../Context/ThemeContext';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect');
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen pt-24 pb-16 flex items-center justify-center ${
      theme === 'dark' ? 'bg-navy-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-md ${
        theme === 'dark' ? 'bg-navy-800' : 'bg-white'
      }`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600 mt-2'}>
            Sign in to your account to continue
          </p>
        </div>
        
        <AuthForm type="login" />
        
        <div className="mt-6 text-center">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Don't have an account?{' '}
            <Link 
              to={redirectTo ? `/register?redirect=${redirectTo}` : '/register'} 
              className={`${
                theme === 'dark' ? 'text-amber-400 hover:text-amber-300' : 'text-navy-600 hover:text-navy-800'
              } font-medium`}
            >
              Sign up
            </Link>
          </p>
        </div>
        
        <div className={`mt-8 border-t ${
          theme === 'dark' ? 'border-navy-700' : 'border-gray-200'
        } pt-6`}>
          <p className={`text-xs text-center ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            By signing in, you agree to our{' '}
            <Link 
              to="/terms" 
              className={`${
                theme === 'dark' ? 'text-amber-400 hover:underline' : 'text-navy-600 hover:underline'
              }`}
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link 
              to="/privacy-policy" 
              className={`${
                theme === 'dark' ? 'text-amber-400 hover:underline' : 'text-navy-600 hover:underline'
              }`}
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;