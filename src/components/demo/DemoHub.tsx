/**
 * Demo Hub - Main entry point for all component demos
 *
 * Allows users to navigate between different demo pages
 */

import { useState } from "react";
import { ComponentsDemo } from "./ComponentsDemo";
import { ButtonWidthDemo } from "./ButtonWidthDemo";
import { SpinnerExamples } from "./SpinnerExamples";
import { CheckboxDemo } from "./CheckboxDemo";
import RadioDemo from "./RadioDemo";
import AccordionDemo from "./AccordionDemo";
import {
  ArrowLeft,
  Sparkles,
  Activity,
  Layout,
  CheckSquare,
  Circle,
  ChevronDown,
} from "lucide-react";

type DemoPage =
  | "hub"
  | "components"
  | "button-width"
  | "spinner-examples"
  | "checkbox"
  | "radio"
  | "accordion";

export function DemoHub({ onBack }: { onBack: () => void }) {
  const [currentDemo, setCurrentDemo] = useState<DemoPage>("hub");

  // If viewing a specific demo, render it
  if (currentDemo === "components") {
    return <ComponentsDemo onBack={() => setCurrentDemo("hub")} />;
  }

  if (currentDemo === "button-width") {
    return <ButtonWidthDemo onBack={() => setCurrentDemo("hub")} />;
  }

  if (currentDemo === "spinner-examples") {
    return <SpinnerExamples onBack={() => setCurrentDemo("hub")} />;
  }

  if (currentDemo === "checkbox") {
    return <CheckboxDemo onBack={() => setCurrentDemo("hub")} />;
  }

  if (currentDemo === "radio") {
    return <RadioDemo onBack={() => setCurrentDemo("hub")} />;
  }

  if (currentDemo === "accordion") {
    return <AccordionDemo onBack={() => setCurrentDemo("hub")} />;
  }

  // Hub page with all demos
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f1] to-[#fef7ed] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-[57.5px]">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#8b6357] hover:text-[#6f4e44] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#633479]/10 px-4 py-2 rounded-full mb-6">
            <Sparkles size={20} className="text-[#633479]" />
            <span className="font-['Comfortaa:Bold',_sans-serif] text-[14px] text-[#633479]">
              Component Showcase
            </span>
          </div>
          <h1 className="font-['Comfortaa:Bold',_sans-serif] text-[48px] leading-[60px] text-[#4a3c2a] mb-4">
            Interactive Demo Gallery
          </h1>
          <p className="font-['Comfortaa:Regular',_sans-serif] text-[18px] text-[rgba(74,60,42,0.8)] max-w-2xl mx-auto">
            Explore our custom-built components with live examples and code
            snippets. All components are built from Figma designs with
            pixel-perfect accuracy.
          </p>
        </div>

        {/* Demo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Components Demo Card */}
          <DemoCard
            icon={<Layout className="text-[#633479]" size={32} />}
            title="Component Showcase"
            description="Comprehensive demo of all buttons, spinners, and interactive elements with state management examples."
            color="purple"
            onClick={() => setCurrentDemo("components")}
          />

          {/* Button Width Demo Card */}
          <DemoCard
            icon={<Activity className="text-[#de6a07]" size={32} />}
            title="Button Width Stability"
            description="See how buttons maintain perfect width during loading states without any layout shifts or jitter."
            color="orange"
            onClick={() => setCurrentDemo("button-width")}
          />

          {/* Spinner Examples Card */}
          <DemoCard
            icon={<Sparkles className="text-[#8b6357]" size={32} />}
            title="Spinner Usage Guide"
            description="Real-world examples with basic and track modes. See how to integrate spinners in different loading scenarios."
            color="brown"
            onClick={() => setCurrentDemo("spinner-examples")}
          />

          {/* Checkbox Demo Card */}
          <DemoCard
            icon={<CheckSquare className="text-[#2374ff]" size={32} />}
            title="Checkbox Component"
            description="Interactive checkboxes with 5 states: default, hover, focus, active, and checked. Features gradient checkmark on press."
            color="purple"
            onClick={() => setCurrentDemo("checkbox")}
          />

          {/* Radio Demo Card */}
          <DemoCard
            icon={<Circle className="text-[#de6a07]" size={32} />}
            title="Radio Component"
            description="Custom radio buttons with 5 states: default, hover, focus, active, and checked. Blue background with orange dot."
            color="orange"
            onClick={() => setCurrentDemo("radio")}
          />

          {/* Accordion Demo Card */}
          <DemoCard
            icon={<ChevronDown className="text-[#8b6357]" size={32} />}
            title="Accordion Component"
            description="FAQ-style accordion with 3 states for each item: default (gray), hover (orange), and focus (blue). Smooth expand/collapse."
            color="brown"
            onClick={() => setCurrentDemo("accordion")}
          />
        </div>

        {/* Features Section */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="font-['Comfortaa:Bold',_sans-serif] text-[28px] leading-[36px] text-[#4a3c2a] mb-6 text-center">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureItem
              title="Figma Design"
              description="1:1 pixel-perfect recreation from Figma designs"
            />
            <FeatureItem
              title="No Layout Shift"
              description="Buttons maintain width during loading states"
            />
            <FeatureItem
              title="Track Mode"
              description="Spinners with optional background track for progress"
            />
            <FeatureItem
              title="Fully Typed"
              description="Complete TypeScript support with proper types"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface DemoCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "orange" | "brown";
  onClick: () => void;
}

function DemoCard({ icon, title, description, color, onClick }: DemoCardProps) {
  const colorClasses = {
    purple:
      "hover:border-[#633479] hover:shadow-[0_8px_30px_rgba(99,52,121,0.12)]",
    orange:
      "hover:border-[#de6a07] hover:shadow-[0_8px_30px_rgba(222,106,7,0.12)]",
    brown:
      "hover:border-[#8b6357] hover:shadow-[0_8px_30px_rgba(139,99,87,0.12)]",
  };

  return (
    <button
      onClick={onClick}
      className={`bg-white p-8 rounded-lg border-2 border-transparent transition-all duration-300 cursor-pointer text-left group ${colorClasses[color]}`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[21px] leading-[28px] text-[#4a3c2a] mb-3 group-hover:text-[#633479] transition-colors">
        {title}
      </h3>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[14px] text-[rgba(74,60,42,0.8)] leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex items-center gap-2 font-['Comfortaa:Medium',_sans-serif] text-[14px] text-[#633479]">
        View Demo
        <ArrowLeft
          size={16}
          className="rotate-180 group-hover:translate-x-1 transition-transform"
        />
      </div>
    </button>
  );
}

interface FeatureItemProps {
  title: string;
  description: string;
}

function FeatureItem({ title, description }: FeatureItemProps) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-[#633479]/10 rounded-full mb-3">
        <div className="w-2 h-2 bg-[#633479] rounded-full" />
      </div>
      <h3 className="font-['Comfortaa:Bold',_sans-serif] text-[16px] text-[#4a3c2a] mb-2">
        {title}
      </h3>
      <p className="font-['Comfortaa:Regular',_sans-serif] text-[13px] text-[rgba(74,60,42,0.7)]">
        {description}
      </p>
    </div>
  );
}
