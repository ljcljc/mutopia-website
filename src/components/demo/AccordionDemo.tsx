import { CustomAccordion, CustomAccordionItem } from '@/components/common';
import { ArrowLeft } from 'lucide-react';

export default function AccordionDemo({ onBack }: { onBack?: () => void }) {
  const demoFaqs = [
    {
      question: 'How does mobile grooming work?',
      answer:
        'Our mobile grooming service brings professional pet grooming directly to your doorstep. We arrive in our fully-equipped grooming van, complete with all the tools and products needed to pamper your pet.',
    },
    {
      question: 'How far in advance should I book?',
      answer:
        'We recommend booking at least 1-2 weeks in advance to secure your preferred time slot. However, we often have same-day or next-day availability depending on your location.',
    },
    {
      question: 'What if my pet is anxious or aggressive?',
      answer:
        'Our experienced groomers are trained to handle pets with various temperaments. We use calming techniques and take extra time to ensure your pet feels comfortable.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF] to-[rgba(255,231,210,0.40)] py-12 px-4">
      <div className="max-w-[784px] mx-auto space-y-12">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#8b6357] hover:text-[#6f4e44] transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Demo Hub
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-[#4a3c2a]">Custom Accordion Demo</h1>
          <p className="text-[#717182]">
            Built from Figma designs with 3 distinct states
          </p>
        </div>

        {/* States Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <h2 className="text-[#4a3c2a] mb-4">States Overview</h2>
          
          <div className="space-y-8">
            {/* Default State */}
            <div className="space-y-3">
              <h3 className="text-[#4a3c2a]">1. Default State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Gray border (#E5E7EB), gray icon (#717182)
              </p>
              <CustomAccordionItem
                question="How does mobile grooming work?"
                answer="Our mobile grooming service brings professional pet grooming directly to your doorstep."
                isOpen={false}
              />
            </div>

            {/* Hover State */}
            <div className="space-y-3">
              <h3 className="text-[#4a3c2a]">2. Hover State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Orange border (#DE6A07), orange icon (#DE6A07) - hover to see
              </p>
              <CustomAccordionItem
                question="Hover over this accordion item"
                answer="The border and icon will turn orange when you hover over this item."
                isOpen={false}
              />
            </div>

            {/* Focus State */}
            <div className="space-y-3">
              <h3 className="text-[#4a3c2a]">3. Focus State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Blue border (#2374FF), blue icon (#2374FF) - tab to see
              </p>
              <CustomAccordionItem
                question="Tab to focus on this item"
                answer="The border and icon will turn blue when this item has keyboard focus."
                isOpen={false}
              />
            </div>

            {/* Expanded State */}
            <div className="space-y-3">
              <h3 className="text-[#4a3c2a]">4. Expanded State</h3>
              <p className="text-[#717182] text-sm mb-3">
                Same state styles apply when expanded - icon rotates 180°
              </p>
              <CustomAccordionItem
                question="This item is expanded"
                answer="When expanded, the content is visible and the icon is rotated. The same hover and focus states apply."
                isOpen={true}
              />
            </div>
          </div>
        </div>

        {/* Interactive Example */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-[#4a3c2a]">Interactive Example</h2>
            <p className="text-[#717182] text-sm">
              Click to expand/collapse, hover for orange border, tab for blue border
            </p>
          </div>
          
          <CustomAccordion items={demoFaqs} />
        </div>

        {/* Feature List */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-[#4a3c2a]">Features</h2>
          <ul className="space-y-2 text-[#717182] text-sm list-disc list-inside">
            <li>Three distinct states: Default (gray), Hover (orange), Focus (blue)</li>
            <li>States apply to both collapsed and expanded items</li>
            <li>Smooth expand/collapse animation with content height transition</li>
            <li>Icon rotates 180° when expanded</li>
            <li>Keyboard accessible with focus states</li>
            <li>Single or multiple items can be open (configurable)</li>
            <li>Follows Figma design specifications exactly</li>
            <li>Border color: gray-200 (#E5E7EB), orange (#DE6A07), blue (#2374FF)</li>
            <li>Icon color: gray (#717182), orange (#DE6A07), blue (#2374FF)</li>
          </ul>
        </div>

        {/* Design Specifications */}
        <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-[#4a3c2a]">Design Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="text-[#4a3c2a] mb-2">Container</h3>
              <ul className="space-y-1 text-[#717182]">
                <li>Background: rgba(255,255,255,0.8)</li>
                <li>Border radius: 16px</li>
                <li>Padding: 24px horizontal</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#4a3c2a] mb-2">Content</h3>
              <ul className="space-y-1 text-[#717182]">
                <li>Min height (collapsed): 59.5px</li>
                <li>Top padding: 21px</li>
                <li>Bottom padding (expanded): 21px</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#4a3c2a] mb-2">Typography</h3>
              <ul className="space-y-1 text-[#717182]">
                <li>Font: Comfortaa Medium</li>
                <li>Size: 12px</li>
                <li>Question color: #4a3c2a</li>
                <li>Answer color: rgba(74,60,42,0.7)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#4a3c2a] mb-2">Icon</h3>
              <ul className="space-y-1 text-[#717182]">
                <li>Size: 14x14px</li>
                <li>Stroke width: 1.16667</li>
                <li>Rotation: 0° → 180° on expand</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
