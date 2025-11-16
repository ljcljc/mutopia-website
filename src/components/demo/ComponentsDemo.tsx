/**
 * Components Demo Page
 *
 * A comprehensive showcase of all custom components with interactive examples
 */

import { useState } from 'react';
import { Spinner } from '../Spinner';
import { OrangeButton } from '../OrangeButton';
import { PurpleButton } from '../PurpleButton';
import { TertiaryButton } from '../TertiaryButton';
import { Checkbox } from '../Checkbox';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

export function ComponentsDemo({ onBack }: { onBack: () => void }) {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleSubmit1 = () => {
    setLoading1(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 3000)),
      {
        loading: (
          <div className="flex items-center gap-2">
            <Spinner size="small" color="#633479" />
            <span>Submitting...</span>
          </div>
        ),
        success: 'Form submitted successfully!',
        error: 'Error submitting form',
      }
    );
    setTimeout(() => setLoading1(false), 3000);
  };

  const handleSubmit2 = () => {
    setLoading2(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: (
          <div className="flex items-center gap-2">
            <Spinner size="small" color="#de6a07" />
            <span>Processing...</span>
          </div>
        ),
        success: 'Request completed!',
        error: 'Request failed',
      }
    );
    setTimeout(() => setLoading2(false), 2000);
  };

  const handleSubmit3 = () => {
    setLoading3(true);
    setTimeout(() => setLoading3(false), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-[57.5px]">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#8b6357] hover:text-[#6f4e44] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <h1 className="font-['Comfortaa:Bold',_sans-serif] text-[42px] leading-[52px] text-[#4a3c2a] mb-4">
          Component Showcase
        </h1>
        <p className="font-['Comfortaa:Regular',_sans-serif] text-[18px] text-[rgba(74,60,42,0.8)] mb-12">
          Interactive demonstrations of all custom UI components
        </p>

        {/* Spinner Standalone Demo */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Spinner Component
          </h2>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
            Rotating spinner with customizable size and color, built from Figma design
          </p>

          {/* Basic Spinners */}
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-4">
            Basic Spinners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center gap-4">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Small (16px)
              </p>
              <div className="bg-[#633479] p-4 rounded-lg">
                <Spinner size="small" color="white" />
              </div>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">
                size="small"
              </code>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Medium (24px)
              </p>
              <div className="bg-[#de6a07] p-4 rounded-lg">
                <Spinner size="medium" color="white" />
              </div>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">
                size="medium"
              </code>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Large (48px)
              </p>
              <div className="bg-[#8b6357] p-4 rounded-lg">
                <Spinner size="large" color="white" />
              </div>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">
                size="large"
              </code>
            </div>
          </div>

          {/* Spinners with Track */}
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-4">
            Spinners with Background Track
          </h3>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
            Add a subtle background ring to show the full circular path
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center gap-4">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Small with Track
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <Spinner size="small" color="#25C8A8" showTrack />
              </div>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">
                showTrack
              </code>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Medium with Track
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <Spinner size="medium" color="#633479" showTrack />
              </div>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">
                showTrack
              </code>
            </div>
            <div className="flex flex-col items-center gap-4">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                Large with Track
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <Spinner size="large" color="#de6a07" showTrack />
              </div>
              <code className="bg-gray-100 px-2 py-1 rounded text-[12px] font-mono">
                showTrack
              </code>
            </div>
          </div>

          {/* Track Opacity Examples */}
          <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-4 mt-8">
            Custom Track Opacity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center gap-3">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[#4a3c2a]">
                Opacity 0.1
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <Spinner size={32} color="#633479" showTrack trackOpacity={0.1} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[#4a3c2a]">
                Opacity 0.3
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <Spinner size={32} color="#633479" showTrack trackOpacity={0.3} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[#4a3c2a]">
                Opacity 0.5
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <Spinner size={32} color="#633479" showTrack trackOpacity={0.5} />
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[#4a3c2a]">
                Opacity 0.8
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                <Spinner size={32} color="#633479" showTrack trackOpacity={0.8} />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons with Loading States */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Buttons with Loading States
          </h2>
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
              ✓ Button width stays constant during loading - no layout shift or jitter
            </p>
          </div>
          <div className="space-y-8">
            {/* Purple Buttons */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#633479] mb-4">
                Purple Buttons
              </h3>
              <div className="flex flex-wrap gap-4">
                <PurpleButton
                  variant="primary"
                  loading={loading1}
                  onClick={handleSubmit1}
                >
                  Submit Form
                </PurpleButton>
                <PurpleButton
                  variant="outline"
                  loading={loading1}
                  onClick={handleSubmit1}
                >
                  Submit Form
                </PurpleButton>
                <PurpleButton
                  variant="bordered"
                  loading={loading1}
                  onClick={handleSubmit1}
                >
                  Submit Form
                </PurpleButton>
              </div>
            </div>

            {/* Orange Buttons */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#de6a07] mb-4">
                Orange Buttons
              </h3>
              <div className="flex flex-wrap gap-4">
                <OrangeButton
                  variant="primary"
                  loading={loading2}
                  onClick={handleSubmit2}
                >
                  Book Now
                </OrangeButton>
                <OrangeButton
                  variant="outline"
                  loading={loading2}
                  onClick={handleSubmit2}
                >
                  Book Now
                </OrangeButton>
                <OrangeButton
                  variant="primary"
                  size="medium"
                  loading={loading3}
                  onClick={handleSubmit3}
                >
                  Medium Size
                </OrangeButton>
                <OrangeButton
                  variant="primary"
                  size="compact"
                  loading={loading3}
                  onClick={handleSubmit3}
                >
                  Compact
                </OrangeButton>
              </div>
            </div>

            {/* Width Stability Demo */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-4">
                Width Stability Test
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <OrangeButton
                    variant="primary"
                    loading={loading2}
                    onClick={handleSubmit2}
                  >
                    This is a very long button text
                  </OrangeButton>
                  <span className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.7)]">
                    ← Watch the width stay constant
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <TertiaryButton
                    variant="orange"
                    loading={loading3}
                    onClick={handleSubmit3}
                  >
                    Tertiary with loading
                  </TertiaryButton>
                  <span className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.7)]">
                    ← Works on tertiary too
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkbox Component */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Checkbox Component
          </h2>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
            Interactive checkbox with 5 states: default, hover, focus, active, and checked
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Examples */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-6">
                Basic Checkboxes
              </h3>
              <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
                <Checkbox label="Remember me" />
                <Checkbox label="I agree to terms and conditions" />
                <Checkbox label="Subscribe to newsletter" defaultChecked />
              </div>
            </div>

            {/* States Demo */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-6">
                Interactive States
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] mb-2">
                    Hover to see text color change
                  </p>
                  <Checkbox label="Hover over me" />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] mb-2">
                    Tab to focus (blue border)
                  </p>
                  <Checkbox label="Focus with keyboard" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
              💡 See the full <span className="text-[#2374ff] font-bold">Checkbox Demo</span> page for more examples and use cases
            </p>
          </div>
        </div>

        {/* Tertiary Buttons */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Tertiary Buttons
          </h2>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
            Lightweight buttons with hover border effect
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Orange Theme */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#de6a07] mb-6">
                Orange Theme
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] mb-2">
                    Default State
                  </p>
                  <TertiaryButton variant="orange">
                    Click Me
                  </TertiaryButton>
                </div>
                <div>
                  <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] mb-2">
                    Hover to see border
                  </p>
                  <TertiaryButton variant="orange">
                    Hover Over Me
                  </TertiaryButton>
                </div>
              </div>
            </div>

            {/* Brown Theme */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#8b6357] mb-6">
                Brown Theme
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] mb-2">
                    Default State
                  </p>
                  <TertiaryButton variant="brown">
                    Click Me
                  </TertiaryButton>
                </div>
                <div>
                  <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] mb-2">
                    Hover to see border
                  </p>
                  <TertiaryButton variant="brown">
                    Hover Over Me
                  </TertiaryButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-6">
            Usage Instructions
          </h2>
          <div className="space-y-4">
            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
                Spinner Component:
              </p>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a] space-y-1 list-disc list-inside ml-4">
                <li>Sizes: "small" (16px), "medium" (24px), "large" (48px), or custom number</li>
                <li>Customizable color prop</li>
                <li>Built-in rotation animation</li>
                <li>Optional background track with <code className="bg-white px-1 rounded">showTrack</code> prop</li>
                <li>Adjustable track opacity with <code className="bg-white px-1 rounded">trackOpacity</code> prop (0-1)</li>
                <li>Can be used in buttons, toasts, or standalone</li>
              </ul>
            </div>
            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
                Button Loading States:
              </p>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a] space-y-1 list-disc list-inside ml-4">
                <li>Add <code className="bg-white px-1 rounded">loading</code> prop to any button</li>
                <li>Spinner overlays the text while maintaining button width</li>
                <li>No layout shift or jitter during state transitions</li>
                <li>Button becomes disabled during loading</li>
                <li>Works with all button variants and sizes</li>
              </ul>
            </div>
            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
                Tertiary Button:
              </p>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a] space-y-1 list-disc list-inside ml-4">
                <li><strong>Default:</strong> Transparent background, no border, colored text</li>
                <li><strong>Hover:</strong> Border appears in the theme color</li>
                <li><strong>Focus/Active:</strong> Border changes to blue (#2374ff)</li>
              </ul>
            </div>
            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
                Checkbox Component:
              </p>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a] space-y-1 list-disc list-inside ml-4">
                <li><strong>Default:</strong> Gray border #717182, dark text</li>
                <li><strong>Hover:</strong> Gray text #717182 (unchecked only)</li>
                <li><strong>Focus:</strong> Blue background #2374ff with focus ring</li>
                <li><strong>Active:</strong> Orange background #de6a07, gradient checkmark</li>
                <li><strong>Checked:</strong> Blue background #2374ff, white checkmark</li>
                <li>Keyboard accessible with Tab navigation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
