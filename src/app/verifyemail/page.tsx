"use client"
import React, { useState } from 'react';

export default function VerificationPage() {
  const [isProcessing, setIsProcessing] = useState(false); // State to track whether the process is ongoing
  const [isVerified, setIsVerified] = useState(false);     // State to track whether the verification is done

  const handleVerifyClick = () => {
    setIsProcessing(true);
    setIsVerified(false);

    // Simulate verification process delay (e.g., 3 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      setIsVerified(true);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Verification Page</h1>

      {!isVerified && (
        <button
          onClick={handleVerifyClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
          disabled={isProcessing} // Disable the button during processing
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-white border-t-transparent mr-2"></div>
              Processing...
            </div>
          ) : (
            'Verify'
          )}
        </button>
      )}

      {isVerified && (
        <div className="mt-6 text-green-600 text-xl font-semibold">Verified</div>
      )}
    </div>
  );
}
