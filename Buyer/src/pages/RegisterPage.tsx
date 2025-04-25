import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const redirectTo = new URLSearchParams(location.search).get('redirect');
  
  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-gray-600 mt-2">
            Join Attire to shop the latest fashion
          </p>
        </div>
        
        <AuthForm type="register" />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              to={redirectTo ? `/login?redirect=${redirectTo}` : '/login'} 
              className="text-navy-600 hover:text-navy-800 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to our{' '}
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

export default RegisterPage;