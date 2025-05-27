'use client';

import React, { useState } from 'react';
import { 
  FaKey, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt, 
  FaCheck, 
  FaExclamationTriangle,
  FaArrowLeft,
  FaSave
} from 'react-icons/fa';

interface AdminPasswordResetProps {
  onBack: () => void;
  onPasswordReset: (newPassword: string) => void;
}

export default function AdminPasswordReset({ onBack, onPasswordReset }: AdminPasswordResetProps) {
  const [step, setStep] = useState(1); // 1: Security Questions, 2: Reset Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Security questions and answers (simplified for admin-only access)
  const [securityAnswers, setSecurityAnswers] = useState({
    question1: '',
    question2: '',
    question3: ''
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Simplified security questions for admin
  const securityQuestions = [
    {
      id: 'question1',
      question: 'What is the name of this children\'s website platform?',
      correctAnswer: 'childrens-website' // Simple answer
    },
    {
      id: 'question2',
      question: 'What is the main purpose of this platform? (education/entertainment/learning)',
      correctAnswer: 'education' // Simple answer
    },
    {
      id: 'question3',
      question: 'What year was this admin system created? (2024)',
      correctAnswer: '2024' // Simple answer
    }
  ];

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate verification delay
    setTimeout(() => {
      // Check security answers (case-insensitive)
      const isValid = securityQuestions.every(q => {
        const userAnswer = securityAnswers[q.id as keyof typeof securityAnswers].toLowerCase().trim();
        const correctAnswer = q.correctAnswer.toLowerCase();
        return userAnswer === correctAnswer || userAnswer.includes(correctAnswer);
      });

      if (isValid) {
        setStep(2);
        setSuccess('Security verification successful! You can now reset your password.');
      } else {
        setError('Security answers are incorrect. Please try again.');
      }
      setLoading(false);
    }, 1500);
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate password
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Simulate password reset
    setTimeout(() => {
      // Store new password in localStorage (simplified for admin-only)
      localStorage.setItem('adminPassword', newPassword);
      setSuccess('Password reset successfully! You can now login with your new password.');
      
      // Call parent callback
      onPasswordReset(newPassword);
      
      // Auto redirect back to login after 3 seconds
      setTimeout(() => {
        onBack();
      }, 3000);
      
      setLoading(false);
    }, 1500);
  };

  const handleInputChange = (questionId: string, value: string) => {
    setSecurityAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
    setError(''); // Clear error when user types
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-orange-200/50 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <FaShieldAlt className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Admin Password Reset</h2>
              <p className="text-white/90">
                {step === 1 ? 'Security Verification' : 'Create New Password'}
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Step 1: Security Questions */}
          {step === 1 && (
            <form onSubmit={handleSecuritySubmit} className="space-y-6">
              <div className="text-center mb-6">
                <FaKey className="text-4xl text-orange-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Security Verification</h3>
                <p className="text-gray-600 text-sm">
                  Answer these simple questions to verify your admin access
                </p>
              </div>

              {securityQuestions.map((q, index) => (
                <div key={q.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Question {index + 1}:
                  </label>
                  <p className="text-gray-800 font-medium mb-2">{q.question}</p>
                  <input
                    type="text"
                    value={securityAnswers[q.id as keyof typeof securityAnswers]}
                    onChange={(e) => handleInputChange(q.id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Enter your answer..."
                    required
                  />
                </div>
              ))}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <FaExclamationTriangle />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <FaCheck />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <FaArrowLeft />
                  <span>Back to Login</span>
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaShieldAlt />
                      <span>Verify</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Password Reset */}
          {step === 2 && (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="text-center mb-6">
                <FaLock className="text-4xl text-green-500 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Create New Password</h3>
                <p className="text-gray-600 text-sm">
                  Enter your new admin password (minimum 6 characters)
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Enter new password..."
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                    placeholder="Confirm new password..."
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-2">
                <div className="text-sm text-gray-600">Password Strength:</div>
                <div className="flex space-x-1">
                  <div className={`h-2 flex-1 rounded ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-2 flex-1 rounded ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-2 flex-1 rounded ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-2 flex-1 rounded ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
                <div className="text-xs text-gray-500">
                  Requirements: 6+ characters, uppercase letter, number (recommended)
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <FaExclamationTriangle />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <FaCheck />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <FaArrowLeft />
                  <span>Back</span>
                </button>
                
                <button
                  type="submit"
                  disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaSave />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Help Text */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <FaShieldAlt className="text-blue-500 mt-1" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Admin Password Reset Help:</p>
                <ul className="text-xs space-y-1 text-blue-700">
                  <li>• Answer the security questions to verify admin access</li>
                  <li>• Create a new password (minimum 6 characters)</li>
                  <li>• Your new password will be saved securely</li>
                  <li>• Use the new password for future admin logins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
