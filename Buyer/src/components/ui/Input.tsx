import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  inputClassName?: string;   // <-- ADD THIS LINE
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, label, error, fullWidth = false, ...props }, ref) => {
    return (
      <div className={cn(fullWidth ? 'w-full' : '', className)}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          className={cn(
            "px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-navy-500 text-gray-900 shadow-sm",
            error 
              ? "border-red-500 focus:border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:border-navy-500",
            fullWidth ? 'w-full' : '',
            props.disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '',
            inputClassName,   // <-- APPLY CUSTOM CLASS HERE
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);


Input.displayName = 'Input';

export default Input;