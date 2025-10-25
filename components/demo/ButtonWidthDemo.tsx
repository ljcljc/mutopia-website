/**
 * Button Width Stability Demo
 * 
 * This component demonstrates how the button maintains its width
 * during loading state transitions, preventing layout shifts.
 */

import { useState } from 'react';
import { OrangeButton } from '../OrangeButton';
import { PurpleButton } from '../PurpleButton';
import { TertiaryButton } from '../TertiaryButton';
import { ArrowLeft } from 'lucide-react';

export function ButtonWidthDemo({ onBack }: { onBack: () => void }) {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

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

        <div>
          <h1 className="font-['Comfortaa:Bold',_sans-serif] text-[42px] leading-[52px] text-[#4a3c2a] mb-4">
            Button Width Stability Demo
          </h1>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[18px] text-[#4a3c2a] mb-8">
            Click the buttons below to see how they maintain their width during loading.
            Notice there's no layout shift or jitter - the button stays exactly the same size.
          </p>
        </div>

        {/* Demo 1: Different Button Lengths */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Different Text Lengths
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <OrangeButton 
                  variant="primary"
                  fullWidth
                  loading={loading1}
                  onClick={() => {
                    setLoading1(true);
                    setTimeout(() => setLoading1(false), 2000);
                  }}
                >
                  Short
                </OrangeButton>
              </div>
              <div className="flex-1">
                <OrangeButton 
                  variant="primary"
                  fullWidth
                  loading={loading1}
                  onClick={() => {
                    setLoading1(true);
                    setTimeout(() => setLoading1(false), 2000);
                  }}
                >
                  Medium Button Text
                </OrangeButton>
              </div>
              <div className="flex-1">
                <OrangeButton 
                  variant="primary"
                  fullWidth
                  loading={loading1}
                  onClick={() => {
                    setLoading1(true);
                    setTimeout(() => setLoading1(false), 2000);
                  }}
                >
                  This is a very long button text
                </OrangeButton>
              </div>
            </div>
          </div>
        </div>

        {/* Demo 2: Stacked Buttons */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Stacked Layout (No Shift)
          </h2>
          <div className="space-y-3">
            <PurpleButton 
              variant="primary"
              loading={loading2}
              onClick={() => {
                setLoading2(true);
                setTimeout(() => setLoading2(false), 2000);
              }}
            >
              Submit Application
            </PurpleButton>
            <div className="h-px bg-gray-200" />
            <OrangeButton 
              variant="outline"
              loading={loading2}
              onClick={() => {
                setLoading2(true);
                setTimeout(() => setLoading2(false), 2000);
              }}
            >
              Save as Draft
            </OrangeButton>
            <div className="h-px bg-gray-200" />
            <TertiaryButton 
              variant="orange"
              loading={loading2}
              onClick={() => {
                setLoading2(true);
                setTimeout(() => setLoading2(false), 2000);
              }}
            >
              Cancel
            </TertiaryButton>
          </div>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.7)] mt-4">
            Watch the divider lines - they don't move because buttons maintain their width.
          </p>
        </div>

        {/* Demo 3: Auto-Toggle */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Continuous Toggle (Watch Stability)
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <OrangeButton 
                variant="primary"
                loading={loading3}
                onClick={() => {
                  setLoading3(!loading3);
                }}
              >
                {loading3 ? 'Currently Loading' : 'Click to Toggle Loading'}
              </OrangeButton>
              <button
                onClick={() => setLoading3(!loading3)}
                className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#de6a07] underline hover:text-[#c25a06] transition-colors"
              >
                Toggle manually
              </button>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a]">
                <strong>How it works:</strong> The text becomes invisible but still occupies space,
                while the spinner is absolutely positioned on top. This prevents any width changes.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Explanation */}
        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-4">
            Technical Implementation
          </h2>
          <div className="space-y-3 font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a]">
            <p>
              <strong>Problem:</strong> Switching between text and a spinner typically changes the button width,
              causing layout shifts and poor UX.
            </p>
            <p>
              <strong>Solution:</strong> Our implementation uses a layered approach:
            </p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>Text content uses <code className="bg-white px-1 rounded">className="invisible"</code> when loading (not <code className="bg-white px-1 rounded">display: none</code>)</li>
              <li>This keeps the text in the layout flow, preserving the button's natural width</li>
              <li>Spinner is absolutely positioned with <code className="bg-white px-1 rounded">position: absolute</code> and centered</li>
              <li>Result: Zero layout shift, smooth transitions, better UX</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
