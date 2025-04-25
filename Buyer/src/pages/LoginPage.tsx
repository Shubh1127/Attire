import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect');
  
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to your account to continue
          </p>
        </div>
        
        <AuthForm type="login" />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to={redirectTo ? `/register?redirect=${redirectTo}` : '/register'} 
              className="text-navy-600 hover:text-navy-800 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-navy-600 hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy-policy" className="text-navy-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;