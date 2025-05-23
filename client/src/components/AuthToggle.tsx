import React from 'react';

type AuthMode = 'login' | 'signup';

interface AuthToggleProps {
  mode: AuthMode;
  onToggle: () => void;
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ mode, onToggle }) => {
  return (
    <div className="text-center mt-4">
      <p className="text-gray-600">
        {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={onToggle}
          className="ml-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          {mode === 'login' ? 'Sign up' : 'Login'}
        </button>
      </p>
    </div>
  );
};