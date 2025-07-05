
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
      <div className="flex items-center space-x-3">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <h2 className="text-2xl font-bold text-white">Something went wrong!</h2>
      </div>
      
      <div className="max-w-md space-y-4">
        <p className="text-gray-400">
          {error.message || 'An unexpected error occurred on this page.'}
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => reset()} 
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
