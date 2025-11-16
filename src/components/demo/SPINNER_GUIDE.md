# Spinner Component Guide

A customizable loading spinner component built from Figma designs with two display modes.

## Features

- ✅ Two display modes: Basic and Track
- ✅ Customizable size (preset or custom number)
- ✅ Customizable color
- ✅ Adjustable track opacity
- ✅ Smooth rotation animation
- ✅ Accessibility support (aria-label)
- ✅ TypeScript support

## Props

```typescript
interface SpinnerProps {
  size?: "small" | "medium" | "large" | number;
  color?: string;
  className?: string;
  showTrack?: boolean;
  trackOpacity?: number;
}
```

### Prop Details

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `"small" \| "medium" \| "large" \| number` | `"medium"` | Size of the spinner. Presets: small (16px), medium (24px), large (48px) |
| `color` | `string` | `"white"` | Color of the spinner (any valid CSS color) |
| `className` | `string` | `""` | Additional CSS classes |
| `showTrack` | `boolean` | `false` | Whether to show background track/ring |
| `trackOpacity` | `number` | `0.3` | Opacity of the background track (0-1) |

## Usage Examples

### Basic Spinner

```tsx
import { Spinner } from './components/Spinner';

// Small spinner
<Spinner size="small" color="#633479" />

// Medium spinner (default)
<Spinner color="#de6a07" />

// Large spinner
<Spinner size="large" color="white" />

// Custom size
<Spinner size={32} color="#25C8A8" />
```

### Spinner with Background Track

```tsx
// Basic track
<Spinner 
  size="large" 
  color="#25C8A8" 
  showTrack 
/>

// Custom track opacity
<Spinner 
  size={40} 
  color="#633479" 
  showTrack 
  trackOpacity={0.2}
/>
```

### In Buttons (Automatic)

```tsx
import { OrangeButton } from './components/OrangeButton';

<OrangeButton 
  variant="primary"
  loading={isLoading}
>
  Submit
</OrangeButton>
```

### In Toast Notifications

```tsx
import { toast } from 'sonner@2.0.3';
import { Spinner } from './components/Spinner';

toast.promise(apiCall, {
  loading: (
    <div className="flex items-center gap-2">
      <Spinner size="small" color="#de6a07" />
      <span>Processing...</span>
    </div>
  ),
  success: 'Done!',
  error: 'Failed',
});
```

### Custom Loading Overlay

```tsx
{isLoading && (
  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
    <Spinner size="large" color="#633479" showTrack />
  </div>
)}
```

## When to Use Track Mode

Use `showTrack={true}` when:

- ✅ You want to show a visual progress indicator
- ✅ The spinner is on a light background
- ✅ You need better visual context for loading
- ✅ Representing file uploads or downloads
- ✅ Showing processing status

Use basic mode (no track) when:

- ✅ The spinner is on a dark or colored background
- ✅ Space is limited (buttons, inline)
- ✅ You want a minimal design
- ✅ The spinner is very small

## Design Origin

The spinner is extracted from Figma designs:
- Basic mode: `/imports/svg-jzpin5grdi.ts`
- Track mode: `/imports/svg-osebktixv4.ts`

Both modes maintain the exact visual design from Figma while adding flexibility for different use cases.

## Accessibility

The component includes proper ARIA attributes:
- `role="status"` - Indicates a status update
- `aria-label="Loading"` - Provides screen reader context

## Animation

The rotation animation is handled by Tailwind's `animate-spin` utility class, providing a smooth 1-second rotation cycle.
