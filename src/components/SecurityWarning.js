import React from 'react';
import { FaExclamationTriangle, FaEnvelope } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';

const SecurityWarning = () => {
  const { user, isAuthenticated } = useAuth0();
  
  // Don't show if not authenticated or email is verified
  if (!isAuthenticated || !user || user.email_verified) {
    return null;
  }
  
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <FaExclamationTriangle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
            Email Verification Required
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
            Your email address needs to be verified before you can create or edit assessments. 
            This helps prevent abuse and ensures the integrity of our community assessments.
          </p>
          <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-300">
            <FaEnvelope className="w-4 h-4" />
            <span>Check your email: <strong>{user.email}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityWarning; 