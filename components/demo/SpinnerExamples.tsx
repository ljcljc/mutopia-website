/**
 * Spinner Component Usage Examples
 *
 * This file demonstrates various ways to use the Spinner component
 * in your application.
 *
 * Key Features:
 * - Buttons maintain their width during loading (no layout shift)
 * - Text becomes invisible but keeps its space, spinner overlays on top
 * - Smooth transitions without any jitter or reflow
 */

import { useState } from 'react';
import { Spinner } from '../Spinner';
import { OrangeButton } from '../OrangeButton';
import { PurpleButton } from '../PurpleButton';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export function SpinnerExamples({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 md:px-12 lg:px-[57.5px]">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#8b6357] hover:text-[#6f4e44] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 className="font-['Comfortaa:Bold',_sans-serif] text-[42px] leading-[52px] text-[#4a3c2a] mb-4">
          Spinner Usage Examples
        </h1>
        <p className="font-['Comfortaa:Regular',_sans-serif] text-[18px] text-[rgba(74,60,42,0.8)] mb-12">
          Real-world examples of using the Spinner component
        </p>

        <div className="space-y-8">
          <Example1 />
          <Example2 />
          <Example3 />
          <Example4 />
          <Example5 />
          <Example6 />
          <Example7 />
        </div>
      </div>
    </div>
  );
}

// Example 1: Standalone Spinner
function Example1() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[24px] leading-[32px] text-[#633479] mb-4">
        1. Standalone Spinner
      </h2>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
        Use spinner on its own for loading states
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a] mb-3">
            Basic Spinner
          </p>
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded">
            <Spinner size="large" color="#633479" />
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <code className="text-[12px] font-mono text-[#4a3c2a]">
              {`<Spinner size="large" color="#633479" />`}
            </code>
          </div>
        </div>
        <div>
          <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a] mb-3">
            Spinner with Track
          </p>
          <div className="flex items-center justify-center p-8 bg-gray-50 rounded">
            <Spinner size="large" color="#25C8A8" showTrack />
          </div>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <code className="text-[12px] font-mono text-[#4a3c2a] whitespace-pre-wrap">
              {`<Spinner
  size="large"
  color="#25C8A8"
  showTrack
/>`}
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

// Example 2: Button with Loading State
function Example2() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Form submitted successfully!');
    } catch (error) {
      toast.error('Error submitting form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[24px] leading-[32px] text-[#633479] mb-4">
        2. Button with Loading State
      </h2>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
        Button automatically shows spinner during async operations
      </p>
      <OrangeButton
        variant="primary"
        loading={isLoading}
        onClick={handleSubmit}
      >
        Submit Form
      </OrangeButton>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <code className="text-[12px] font-mono text-[#4a3c2a] whitespace-pre-wrap">
{`<OrangeButton
  variant="primary"
  loading={isLoading}
  onClick={handleSubmit}
>
  Submit Form
</OrangeButton>`}
        </code>
      </div>
    </div>
  );
}

// Example 3: Toast with Spinner
function Example3() {
  const handleApiCall = async () => {
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });

    toast.promise(promise, {
      loading: (
        <div className="flex items-center gap-2">
          <Spinner size="small" color="#de6a07" />
          <span>Processing your request...</span>
        </div>
      ),
      success: 'Request completed!',
      error: 'Request failed',
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[24px] leading-[32px] text-[#633479] mb-4">
        3. Toast with Spinner
      </h2>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
        Show spinner in toast notifications for API calls
      </p>
      <PurpleButton onClick={handleApiCall}>
        Make API Call
      </PurpleButton>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <code className="text-[12px] font-mono text-[#4a3c2a] whitespace-pre-wrap">
{`toast.promise(apiCall, {
  loading: (
    <div className="flex items-center gap-2">
      <Spinner size="small" color="#de6a07" />
      <span>Processing...</span>
    </div>
  ),
  success: 'Done!',
  error: 'Failed',
});`}
        </code>
      </div>
    </div>
  );
}

// Example 4: Custom Loading Overlay
function Example4() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[24px] leading-[32px] text-[#633479] mb-4">
        4. Custom Loading Overlay
      </h2>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
        Create loading overlays for entire sections
      </p>
      <div className="relative">
        {/* Content */}
        <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] mb-4">
            Your Content Here
          </h3>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px]">
            This content will be overlaid with a spinner when loading.
          </p>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
            <Spinner size="large" color="#633479" />
          </div>
        )}

        {/* Toggle Button */}
        <div className="mt-4">
          <OrangeButton
            variant="outline"
            onClick={() => setIsLoading(!isLoading)}
          >
            {isLoading ? 'Stop Loading' : 'Start Loading'}
          </OrangeButton>
        </div>
      </div>
    </div>
  );
}

// Example 5: Inline Loading State
function Example5() {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [data, setData] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoadingData(true);
    setData(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setData('Data loaded successfully!');
    } catch (error) {
      setData('Error loading data');
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[24px] leading-[32px] text-[#633479] mb-4">
        5. Inline Loading State
      </h2>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
        Show inline loading indicators
      </p>
      <div className="space-y-4">
        <OrangeButton onClick={fetchData} loading={isLoadingData}>
          Fetch Data
        </OrangeButton>

        <div className="min-h-[60px] flex items-center">
          {isLoadingData ? (
            <div className="flex items-center gap-2">
              <Spinner size="small" color="#de6a07" />
              <span className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a]">
                Loading data...
              </span>
            </div>
          ) : data ? (
            <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a]">
              {data}
            </p>
          ) : (
            <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.5)]">
              Click the button to load data
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Example 6: Multiple Buttons with Independent Loading States
function Example6() {
  const [loadingStates, setLoadingStates] = useState({
    button1: false,
    button2: false,
    button3: false,
  });

  const handleClick = async (buttonId: keyof typeof loadingStates) => {
    setLoadingStates(prev => ({ ...prev, [buttonId]: true }));

    await new Promise(resolve => setTimeout(resolve, 2000));

    setLoadingStates(prev => ({ ...prev, [buttonId]: false }));
    toast.success(`${buttonId} completed!`);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[24px] leading-[32px] text-[#633479] mb-4">
        6. Multiple Independent Loading States
      </h2>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
        Each button maintains its own loading state
      </p>
      <div className="flex flex-wrap gap-4">
        <PurpleButton
          variant="primary"
          loading={loadingStates.button1}
          onClick={() => handleClick('button1')}
        >
          Action 1
        </PurpleButton>

        <OrangeButton
          variant="primary"
          loading={loadingStates.button2}
          onClick={() => handleClick('button2')}
        >
          Action 2
        </OrangeButton>

        <OrangeButton
          variant="outline"
          loading={loadingStates.button3}
          onClick={() => handleClick('button3')}
        >
          Action 3
        </OrangeButton>
      </div>
    </div>
  );
}

// Example 7: Spinners with Background Track
function Example7() {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[24px] leading-[32px] text-[#633479] mb-4">
        7. Spinners with Background Track
      </h2>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
        Show a circular progress indicator with a visible background track
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Use Case 1: File Upload Progress */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4">
            File Upload Progress
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <Spinner size={40} color="#25C8A8" showTrack trackOpacity={0.2} />
            <div className="flex-1">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Uploading document.pdf
              </p>
              <p className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.6)]">
                Please wait...
              </p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded text-[11px] font-mono">
            {`<Spinner
  size={40}
  color="#25C8A8"
  showTrack
  trackOpacity={0.2}
/>`}
          </div>
        </div>

        {/* Use Case 2: API Call Loading */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4">
            API Call Loading
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <Spinner size={40} color="#633479" showTrack trackOpacity={0.3} />
            <div className="flex-1">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Fetching data...
              </p>
              <p className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.6)]">
                This may take a few seconds
              </p>
            </div>
          </div>
          <div className="p-3 bg-gray-50 rounded text-[11px] font-mono">
            {`<Spinner
  size={40}
  color="#633479"
  showTrack
  trackOpacity={0.3}
/>`}
          </div>
        </div>

        {/* Use Case 3: Processing Status */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4">
            Processing Status
          </h3>
          <div className="flex flex-col items-center text-center gap-4">
            <Spinner size={56} color="#de6a07" showTrack trackOpacity={0.25} />
            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-1">
                Processing Payment
              </p>
              <p className="font-['Comfortaa:Regular',_sans-serif] text-[13px] text-[rgba(74,60,42,0.6)]">
                Do not close this window
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 rounded text-[11px] font-mono">
            {`<Spinner
  size={56}
  color="#de6a07"
  showTrack
  trackOpacity={0.25}
/>`}
          </div>
        </div>

        {/* Use Case 4: Comparison */}
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4">
            With vs Without Track
          </h3>
          <div className="flex items-center justify-around mb-4">
            <div className="text-center">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[#4a3c2a] mb-3">
                Without Track
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <Spinner size={40} color="#8b6357" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[#4a3c2a] mb-3">
                With Track
              </p>
              <div className="bg-gray-50 p-4 rounded">
                <Spinner size={40} color="#8b6357" showTrack />
              </div>
            </div>
          </div>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] text-center">
            The track provides visual context for the loading progress
          </p>
        </div>
      </div>
    </div>
  );
}
