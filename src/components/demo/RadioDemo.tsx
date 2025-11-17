/**
 * Radio Component Demo
 * Showcases all 5 states of the custom Radio component
 */

import { useState } from 'react';
import { Radio } from '@/components/common';
import { ArrowLeft } from 'lucide-react';

export default function RadioDemo({ onBack }: { onBack?: () => void }) {
  const [selectedValue, setSelectedValue] = useState('option1');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#8b6357] hover:text-[#6f4e44] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Back to Demo Hub
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-[#4a3c2a]">Radio Component Demo</h1>
          <p className="text-[#717182]">
            Custom radio built from Figma designs with distinct states
          </p>
        </div>

        {/* States Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <h2 className="text-[#4a3c2a] mb-4">States Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Default State */}
            <div className="space-y-2">
              <h3 className="text-[#4a3c2a]">1. Default State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Unchecked with gray border (#717182), dark text (#4a3c2a)
              </p>
              <Radio label="Unchecked radio" />
            </div>

            {/* Hover State */}
            <div className="space-y-2">
              <h3 className="text-[#4a3c2a]">2. Hover State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Unchecked with gray text (#717182) - hover to see
              </p>
              <Radio label="Hover over me" />
            </div>

            {/* Active State */}
            <div className="space-y-2">
              <h3 className="text-[#4a3c2a]">3. Active State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Checked with gray border, orange dot (#de6a07) - click and hold to see
              </p>
              <Radio label="Click and hold" checked={true} onChange={() => {}} />
            </div>

            {/* Checked State */}
            <div className="space-y-2">
              <h3 className="text-[#4a3c2a]">4. Checked State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Checked with blue background (#2374ff), orange dot (#de6a07)
              </p>
              <Radio label="Checked radio" checked={true} onChange={() => {}} />
            </div>

            {/* Checked + Focused State */}
            <div className="space-y-2">
              <h3 className="text-[#4a3c2a]">5. Checked + Focused</h3>
              <p className="text-[#717182] text-sm mb-3">
                Same as checked (blue background + orange dot) - checked state takes priority
              </p>
              <Radio label="Tab to focus" checked={true} onChange={() => {}} />
            </div>

            {/* Disabled State */}
            <div className="space-y-2">
              <h3 className="text-[#4a3c2a]">6. Disabled State</h3>
              <p className="text-[#717182] text-sm mb-3">
                50% opacity, non-interactive
              </p>
              <div className="space-y-2">
                <Radio label="Disabled unchecked" disabled />
                <Radio label="Disabled checked" checked={true} disabled onChange={() => {}} />
              </div>
            </div>
          </div>
        </div>

        {/* Radio Group Example */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-[#4a3c2a]">Radio Group Example</h2>
          <p className="text-[#717182] text-sm">
            Selected: <span className="text-[#4a3c2a] font-medium">{selectedValue}</span>
          </p>
          
          <div className="space-y-3">
            <Radio
              name="options"
              value="option1"
              label="Remember me"
              checked={selectedValue === 'option1'}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
            <Radio
              name="options"
              value="option2"
              label="Keep me logged in"
              checked={selectedValue === 'option2'}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
            <Radio
              name="options"
              value="option3"
              label="Auto-login on this device"
              checked={selectedValue === 'option3'}
              onChange={(e) => setSelectedValue(e.target.value)}
            />
          </div>
        </div>

        {/* Controlled vs Uncontrolled */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-[#4a3c2a]">Controlled vs Uncontrolled</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Controlled */}
            <div className="space-y-3">
              <h3 className="text-[#4a3c2a]">Controlled</h3>
              <p className="text-[#717182] text-sm">State managed by parent component</p>
              <Radio
                label="Controlled radio"
                checked={selectedValue === 'controlled'}
                onChange={() => setSelectedValue('controlled')}
              />
            </div>

            {/* Uncontrolled */}
            <div className="space-y-3">
              <h3 className="text-[#4a3c2a]">Uncontrolled</h3>
              <p className="text-[#717182] text-sm">State managed internally</p>
              <Radio
                label="Uncontrolled radio"
                defaultChecked={true}
              />
            </div>
          </div>
        </div>

        {/* With Custom Styling */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-[#4a3c2a]">Custom Styling</h2>
          
          <div className="space-y-3">
            <Radio
              label="Radio with custom container class"
              containerClassName="p-3 bg-slate-50 rounded-lg hover:bg-slate-100"
            />
            <Radio
              label="Radio with custom radio class"
              className="scale-125"
            />
          </div>
        </div>

        {/* API Reference */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-[#4a3c2a] mb-4">Props</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-[#4a3c2a]">Prop</th>
                  <th className="text-left py-2 px-3 text-[#4a3c2a]">Type</th>
                  <th className="text-left py-2 px-3 text-[#4a3c2a]">Default</th>
                  <th className="text-left py-2 px-3 text-[#4a3c2a]">Description</th>
                </tr>
              </thead>
              <tbody className="text-[#717182]">
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-mono text-xs">label</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">Label text to display next to radio</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-mono text-xs">checked</td>
                  <td className="py-2 px-3">boolean</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">Controlled checked state</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-mono text-xs">defaultChecked</td>
                  <td className="py-2 px-3">boolean</td>
                  <td className="py-2 px-3">false</td>
                  <td className="py-2 px-3">Default checked state (uncontrolled)</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-mono text-xs">onCheckedChange</td>
                  <td className="py-2 px-3">(checked: boolean) =&gt; void</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">Callback when checked state changes</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-mono text-xs">disabled</td>
                  <td className="py-2 px-3">boolean</td>
                  <td className="py-2 px-3">false</td>
                  <td className="py-2 px-3">Disable the radio</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-mono text-xs">containerClassName</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">''</td>
                  <td className="py-2 px-3">Additional className for the container</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-mono text-xs">className</td>
                  <td className="py-2 px-3">string</td>
                  <td className="py-2 px-3">''</td>
                  <td className="py-2 px-3">Additional className for the radio visual</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-mono text-xs">...props</td>
                  <td className="py-2 px-3">InputHTMLAttributes</td>
                  <td className="py-2 px-3">-</td>
                  <td className="py-2 px-3">All standard HTML input props</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Usage Example */}
        <div className="bg-slate-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-white mb-4">Usage Example</h2>
          <pre className="text-green-400 text-sm overflow-x-auto">
{`import { Radio } from './components/Radio';

// Basic usage
<Radio label="Remember me" />

// Controlled
const [selected, setSelected] = useState(false);
<Radio 
  label="Keep me logged in"
  checked={selected}
  onCheckedChange={setSelected}
/>

// Radio group
<Radio
  name="plan"
  value="basic"
  label="Basic Plan"
  checked={plan === 'basic'}
  onChange={(e) => setPlan(e.target.value)}
/>
<Radio
  name="plan"
  value="pro"
  label="Pro Plan"
  checked={plan === 'pro'}
  onChange={(e) => setPlan(e.target.value)}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
