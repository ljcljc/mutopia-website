/**
 * Checkbox Component Demo
 * 
 * Interactive demonstrations of the Checkbox component in all 5 states
 */

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Checkbox, OrangeButton } from '@/components/common';

export function CheckboxDemo({ onBack }: { onBack: () => void }) {
  const [checked1, setChecked1] = useState(false);
  // const [checked2, setChecked2] = useState(true);
  const [formData, setFormData] = useState({
    terms: false,
    newsletter: false,
    remember: false,
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    alert('Check console for form data');
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
          Back to Demo Hub
        </button>

        <h1 className="font-['Comfortaa:Bold',_sans-serif] text-[42px] leading-[52px] text-[#4a3c2a] mb-4">
          Checkbox Component
        </h1>
        <p className="font-['Comfortaa:Regular',_sans-serif] text-[18px] text-[rgba(74,60,42,0.8)] mb-12">
          Interactive checkbox built from Figma design with 5 distinct states
        </p>

        {/* Five States Demo */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Five Visual States
          </h2>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-8">
            Hover over, click, or use keyboard to see all state changes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* State 1: Default */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-4">
                1. Default
              </h3>
              <div className="bg-gray-50 p-6 rounded flex items-center justify-center mb-4 min-h-[80px]">
                <Checkbox label="Remember me" />
              </div>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] space-y-1 list-disc list-inside">
                <li>Gray border #717182</li>
                <li>Dark text #4a3c2a</li>
                <li>Unchecked state</li>
              </ul>
            </div>

            {/* State 2: Hover */}
            <div className="border-2 border-gray-200 rounded-lg p-6">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-4">
                2. Hover
              </h3>
              <div className="bg-gray-50 p-6 rounded flex items-center justify-center mb-4 min-h-[80px]">
                <Checkbox label="Remember me" />
              </div>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] space-y-1 list-disc list-inside">
                <li>Gray text #717182</li>
                <li>Hover over to see</li>
                <li>Smooth transition</li>
              </ul>
            </div>

            {/* State 3: Focus */}
            <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/30">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-4">
                3. Focus
              </h3>
              <div className="bg-gray-50 p-6 rounded flex items-center justify-center mb-4 min-h-[80px]">
                <Checkbox label="Remember me" defaultChecked />
              </div>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] space-y-1 list-disc list-inside">
                <li>Blue background #2374ff</li>
                <li>Tab to focus (when checked)</li>
                <li>White checkmark</li>
                <li>No visible focus ring</li>
              </ul>
            </div>

            {/* State 4: Active */}
            <div className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50/30">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-4">
                4. Active (Pressed)
              </h3>
              <div className="bg-gray-50 p-6 rounded flex items-center justify-center mb-4 min-h-[80px]">
                <Checkbox label="Remember me" defaultChecked />
              </div>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] space-y-1 list-disc list-inside">
                <li>Orange background #de6a07</li>
                <li>Gradient checkmark</li>
                <li>Click and hold to see</li>
              </ul>
            </div>

            {/* State 5: Checked */}
            <div className="border-2 border-blue-200 rounded-lg p-6">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-4">
                5. Checked
              </h3>
              <div className="bg-gray-50 p-6 rounded flex items-center justify-center mb-4 min-h-[80px]">
                <Checkbox label="Remember me" defaultChecked />
              </div>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.7)] space-y-1 list-disc list-inside">
                <li>Blue background #2374ff</li>
                <li>White checkmark</li>
                <li>Dark text #4a3c2a</li>
              </ul>
            </div>
          </div>

          {/* Instruction Box */}
          <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-4">
              💡 How to See Each State
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-['Comfortaa:Regular',_sans-serif] text-[13px] text-[rgba(74,60,42,0.8)]">
              <div>
                <p className="font-['Comfortaa:Bold',_sans-serif] text-[#717182] mb-1">Default:</p>
                <p>Initial unchecked state with gray border</p>
              </div>
              <div>
                <p className="font-['Comfortaa:Bold',_sans-serif] text-[#717182] mb-1">Hover:</p>
                <p>Move mouse over unchecked checkbox</p>
              </div>
              <div>
                <p className="font-['Comfortaa:Bold',_sans-serif] text-[#2374ff] mb-1">Focus:</p>
                <p>Tab to focus on a <strong>checked</strong> checkbox</p>
              </div>
              <div>
                <p className="font-['Comfortaa:Bold',_sans-serif] text-[#de6a07] mb-1">Active:</p>
                <p>Click and <strong>hold</strong> on checked checkbox</p>
              </div>
              <div>
                <p className="font-['Comfortaa:Bold',_sans-serif] text-[#2374ff] mb-1">Checked:</p>
                <p>Click to select checkbox</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white rounded border border-gray-200">
              <p className="font-['Comfortaa:Medium',_sans-serif] text-[12px] text-[#4a3c2a]">
                ⚠️ <strong>注意：</strong>所有状态均<strong>无可见聚焦环</strong>，采用简洁设计风格
              </p>
            </div>
          </div>
        </div>

        {/* State Demonstration */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Interactive State Demonstration
          </h2>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
            Try interacting with these checkboxes to see all states in action
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Mouse Interaction */}
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4 flex items-center gap-2">
                🖱️ Mouse Interaction
              </h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded">
                <Checkbox label="Hover over me" />
                <Checkbox label="Click and hold me" defaultChecked />
              </div>
              <p className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.6)] mt-4">
                Hover for gray text, click & hold checked box for orange
              </p>
            </div>

            {/* Keyboard Interaction */}
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4 flex items-center gap-2">
                ⌨️ Keyboard Interaction
              </h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded">
                <Checkbox label="Tab to focus me" defaultChecked />
                <Checkbox label="Press Space" />
              </div>
              <p className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.6)] mt-4">
                Tab to focus, Space to toggle
              </p>
            </div>

            {/* All States */}
            <div className="border-2 border-gray-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4 flex items-center gap-2">
                ✨ All States
              </h3>
              <div className="space-y-4 bg-gray-50 p-4 rounded">
                <Checkbox label="Try everything!" defaultChecked />
                <Checkbox label="Experiment here" />
              </div>
              <p className="font-['Comfortaa:Regular',_sans-serif] text-[12px] text-[rgba(74,60,42,0.6)] mt-4">
                Mix hover, focus, and active states
              </p>
            </div>
          </div>
        </div>

        {/* Controlled Components */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Controlled Components
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Controlled Checkbox */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-4">
                Controlled Checkbox
              </h3>
              <div className="space-y-4">
                <Checkbox
                  label="I agree to terms and conditions"
                  checked={checked1}
                  onCheckedChange={setChecked1}
                />
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#4a3c2a]">
                    State: <code className="bg-white px-2 py-1 rounded">{checked1 ? 'checked' : 'unchecked'}</code>
                  </p>
                </div>
                <button
                  onClick={() => setChecked1(!checked1)}
                  className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#2374ff] underline hover:text-[#1a5acc] transition-colors"
                >
                  Toggle programmatically
                </button>
              </div>
            </div>

            {/* Uncontrolled Checkbox */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-4">
                Uncontrolled Checkbox
              </h3>
              <div className="space-y-4">
                <Checkbox
                  label="Subscribe to newsletter"
                  defaultChecked={true}
                  onCheckedChange={(checked) => console.log('Changed:', checked)}
                />
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-['Comfortaa:Regular',_sans-serif] text-[13px] text-[rgba(74,60,42,0.7)]">
                    Uses defaultChecked prop. Check console for changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Example */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Form Integration
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-4">
              <Checkbox
                label="I agree to the terms and conditions"
                checked={formData.terms}
                onCheckedChange={(checked) => setFormData({ ...formData, terms: checked })}
              />
              <Checkbox
                label="Send me promotional emails and newsletters"
                checked={formData.newsletter}
                onCheckedChange={(checked) => setFormData({ ...formData, newsletter: checked })}
              />
              <Checkbox
                label="Remember me on this device"
                checked={formData.remember}
                onCheckedChange={(checked) => setFormData({ ...formData, remember: checked })}
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <OrangeButton type="submit" variant="primary">
                Submit Form
              </OrangeButton>
              <button
                type="button"
                onClick={() => setFormData({ terms: false, newsletter: false, remember: false })}
                className="font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#717182] underline hover:text-[#4a3c2a] transition-colors"
              >
                Clear All
              </button>
            </div>
          </form>
        </div>

        {/* Without Label */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Checkbox Without Label
          </h2>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] mb-6">
            Use for custom layouts or table rows
          </p>
          
          <div className="space-y-6">
            {/* Table-like layout */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4">
                Task List Example
              </h3>
              <div className="space-y-3">
                {[
                  { id: 1, task: 'Complete project proposal', checked: true },
                  { id: 2, task: 'Review design mockups', checked: false },
                  { id: 3, task: 'Send weekly report', checked: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                    <Checkbox
                      defaultChecked={item.checked}
                      onCheckedChange={(checked) => console.log(`Task ${item.id}:`, checked)}
                    />
                    <span className={`font-['Comfortaa:Regular',_sans-serif] text-[14px] ${item.checked ? 'line-through text-[rgba(74,60,42,0.5)]' : 'text-[#4a3c2a]'}`}>
                      {item.task}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid layout */}
            <div>
              <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[18px] text-[#4a3c2a] mb-4">
                Grid Layout Example
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <div key={num} className="flex items-center justify-center p-4 bg-gray-50 rounded border-2 border-gray-200">
                    <Checkbox />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Disabled State */}
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#633479] mb-6">
            Disabled State
          </h2>
          <div className="space-y-4">
            <Checkbox label="Disabled unchecked" disabled />
            <Checkbox label="Disabled checked" disabled defaultChecked />
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
                Basic Usage:
              </p>
              <div className="bg-white p-4 rounded font-mono text-[12px]">
                {`<Checkbox label="Remember me" />`}
              </div>
            </div>

            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
                Controlled Component:
              </p>
              <div className="bg-white p-4 rounded font-mono text-[12px] whitespace-pre-wrap">
{`const [checked, setChecked] = useState(false);

<Checkbox 
  label="I agree" 
  checked={checked}
  onCheckedChange={setChecked}
/>`}
              </div>
            </div>

            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
                Visual States:
              </p>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a] space-y-1 list-disc list-inside ml-4">
                <li><strong>Default:</strong> Gray border #717182, dark text #4a3c2a (unchecked)</li>
                <li><strong>Hover:</strong> Gray text #717182 (unchecked only)</li>
                <li><strong>Focus:</strong> Blue background #2374ff (checked + focused)</li>
                <li><strong>Active:</strong> Orange background #de6a07, gradient checkmark (pressed)</li>
                <li><strong>Checked:</strong> Blue background #2374ff, white checkmark</li>
                <li><strong>⚠️ Note:</strong> All states have no visible focus ring (clean design)</li>
              </ul>
            </div>

            <div>
              <p className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
                Features:
              </p>
              <ul className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[#4a3c2a] space-y-1 list-disc list-inside ml-4">
                <li>Five distinct visual states with smooth transitions</li>
                <li>Fully accessible with keyboard support (Tab, Space)</li>
                <li>Controlled or uncontrolled mode</li>
                <li>Optional label with proper spacing</li>
                <li>Disabled state support</li>
                <li>Gradient checkmark in active state</li>
                <li>Clean design with no visible focus ring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
