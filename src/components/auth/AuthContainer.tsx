import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      {isLogin ? (
        <div className="space-y-4">
          <LoginForm />
          <div className="text-center">
            <button
              onClick={switchToSignup}
              className="text-purple-600 hover:text-purple-700 underline"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>
      ) : (
        <SignupForm onSwitchToLogin={switchToLogin} />
      )}
    </div>
  );
};

export default AuthContainer;