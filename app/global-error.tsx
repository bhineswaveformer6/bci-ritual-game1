
'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-black flex flex-col items-center justify-center text-center space-y-6 p-8">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-10 w-10 text-red-400" />
            <h2 className="text-3xl font-bold text-white">Application Error</h2>
          </div>
          
          <div className="max-w-lg space-y-4">
            <p className="text-gray-400 text-lg">
              A global error occurred in the BCI Ritual Game. Please try refreshing the page.
            </p>
            
            <div className="space-y-3">
              <button 
                onClick={() => reset()}
                className="inline-flex items-center px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try again
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-6 py-3 border border-gray-600 text-gray-300 hover:bg-gray-800 font-medium rounded-lg transition-colors ml-3"
              >
                Return to Dashboard
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
