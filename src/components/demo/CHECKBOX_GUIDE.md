# Checkbox Component Guide

A fully accessible checkbox component built 1:1 from Figma designs with 5 distinct visual states.

## Features

- ✅ Five visual states: default, hover, focus, active, checked
- ✅ Fully accessible (ARIA attributes, keyboard support)
- ✅ Controlled or uncontrolled mode
- ✅ Optional label with proper spacing
- ✅ Smooth state transitions
- ✅ Gradient checkmark in active state
- ✅ Disabled state support
- ✅ TypeScript support
- ✅ Keyboard navigation (Tab, Space)
- ✅ Clean design (no visible focus ring)

## Visual States

### 1. Default State (Unchecked)

- Gray border: `#717182`
- White background
- Dark text: `#4a3c2a`
- 16x16px size
- **When**: Initial unchecked state

### 2. Hover State

- Same gray border
- Text changes to: `#717182`
- Smooth transition
- **When**: Mouse hovers over unchecked checkbox

### 3. Focus State

- Blue background: `#2374ff`
- White checkmark
- Dark text: `#4a3c2a`
- **When**: Checked checkbox receives keyboard focus (Tab)
- **Note**: No visible focus ring - clean design
- **Note**: Unchecked checkbox with focus shows Default state

### 4. Active State (Pressed)

- Orange background: `#de6a07`
- Gradient checkmark (cream to light yellow)
- Dark text: `#4a3c2a`
- **When**: Mouse clicks and holds on checked checkbox

### 5. Checked State

- Blue background: `#2374ff`
- White checkmark icon
- Dark text: `#4a3c2a`
- **When**: Checkbox is selected

## Props

```typescript
interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  containerClassName?: string;
}
```

### Prop Details

| Prop                           | Type                         | Description                                     |
| ------------------------------ | ---------------------------- | ----------------------------------------------- |
| `label`                        | `string`                     | Optional label text to display next to checkbox |
| `checked`                      | `boolean`                    | Controlled checked state                        |
| `defaultChecked`               | `boolean`                    | Initial checked state (uncontrolled)            |
| `onCheckedChange`              | `(checked: boolean) => void` | Callback when state changes                     |
| `disabled`                     | `boolean`                    | Disable the checkbox                            |
| `containerClassName`           | `string`                     | Additional classes for the container            |
| All other standard input props | -                            | `name`, `id`, `required`, etc.                  |

## Usage Examples

### Basic Checkbox with Label

```tsx
import { Checkbox } from "./components/Checkbox";

<Checkbox label="Remember me" />;
```

### Controlled Checkbox

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  label="I agree to terms"
  checked={checked}
  onCheckedChange={setChecked}
/>;
```

### Uncontrolled with Default State

```tsx
<Checkbox
  label="Subscribe to newsletter"
  defaultChecked={true}
  onCheckedChange={(checked) => console.log("Changed:", checked)}
/>
```

### Without Label

```tsx
<Checkbox onCheckedChange={(checked) => console.log("Checked:", checked)} />
```

### In a Form

```tsx
const [formData, setFormData] = useState({
  terms: false,
  newsletter: false,
});

<form onSubmit={handleSubmit}>
  <Checkbox
    label="I agree to the terms and conditions"
    checked={formData.terms}
    onCheckedChange={(checked) => setFormData({ ...formData, terms: checked })}
  />

  <Checkbox
    label="Send me promotional emails"
    checked={formData.newsletter}
    onCheckedChange={(checked) =>
      setFormData({ ...formData, newsletter: checked })
    }
  />

  <button type="submit">Submit</button>
</form>;
```

### Disabled State

```tsx
<Checkbox label="Disabled" disabled />
<Checkbox label="Disabled checked" disabled defaultChecked />
```

### Custom Styling

```tsx
<Checkbox
  label="Custom styled"
  containerClassName="my-4 p-2 bg-gray-100 rounded"
/>
```

## Interactive State Triggers

### Mouse Interaction

- **Default**: Initial unchecked state
- **Hover**: Move mouse over unchecked checkbox
- **Checked**: Click on checkbox
- **Active**: Click and hold on checked checkbox (shows orange with gradient)
- **Release**: Returns to checked state

### Keyboard Interaction

- **Default**: Initial state
- **Tab to focus (unchecked)**: Shows Default state
- **Press Space**: Toggles to Checked state
- **Tab to focus (checked)**: Shows Focus state (blue background, white checkmark)
- **Press Space again**: Returns to Default state (unchecked)

## State Logic

| Current State       | Interaction  | Next State |
| ------------------- | ------------ | ---------- |
| Default (unchecked) | Click        | Checked    |
| Default (unchecked) | Hover        | Hover      |
| Hover               | Click        | Checked    |
| Checked             | Tab focus    | Focus      |
| Checked             | Click & hold | Active     |
| Focus               | Blur         | Checked    |
| Active              | Release      | Checked    |

## Accessibility

The component includes proper accessibility features:

- Native `<input type="checkbox">` for full functionality
- Label is properly associated with input
- Keyboard support:
  - `Tab` - Focus the checkbox
  - `Space` - Toggle checked state
- Screen reader support:
  - Properly announces state changes
  - Label is read with checkbox
- Visual feedback for all interactions
- **Note**: Focus ring removed for clean design, but keyboard functionality is fully preserved

## Layout

The checkbox uses Figma-specified spacing:

- Checkbox: 16x16px
- Gap between checkbox and label: 8px
- Label font: Comfortaa Medium, 12px, leading 17.5px

## State Transitions

All state changes have smooth transitions (200ms):

- Border color
- Background color
- Text color

## Use Cases

### 1. Form Agreements

```tsx
<Checkbox label="I agree to the terms and conditions" />
<Checkbox label="I want to receive promotional emails" />
```

### 2. Task Lists

```tsx
{
  tasks.map((task) => (
    <Checkbox
      key={task.id}
      label={task.title}
      checked={task.completed}
      onCheckedChange={(checked) => updateTask(task.id, checked)}
    />
  ));
}
```

### 3. Settings Panel

```tsx
<Checkbox
  label="Enable notifications"
  checked={settings.notifications}
  onCheckedChange={(checked) => updateSettings({ notifications: checked })}
/>
```

### 4. Table Row Selection

```tsx
<Checkbox
  checked={selectedRows.includes(row.id)}
  onCheckedChange={(checked) => toggleRowSelection(row.id)}
/>
```

## Design Origin

Built from Figma imports with pixel-perfect accuracy:

- Checkbox dimensions: 16x16px
- Color palette:
  - Gray: `#717182`
  - Blue: `#2374ff`
  - Orange: `#de6a07`
  - Dark text: `#4a3c2a`
- Gradient checkmark: Linear gradient from `#FFF7ED` to `#FFFBEB`
- Spacing: 8px gap between checkbox and label
- Typography: Comfortaa Medium, 12px

### Figma Files Used

- `/imports/Label-14-1218.tsx` - Checked state
- `/imports/Label-14-1237.tsx` - Active state (orange)
- `/imports/Label-14-1264.tsx` - Focus state (blue)
- `/imports/svg-1l4mtpqhh5.ts` - Checkmark SVG path

## Checkmark Variations

### White Checkmark (Normal States)

- Used in: **Checked** and **Focus** states
- Color: White `#FFFFFF`
- Style: Lucide-react Check icon, 12px, strokeWidth 3

### Gradient Checkmark (Active State)

- Used in: **Active** state only
- Gradient: Linear from `#FFF7ED` (cream) to `#FFFBEB` (light yellow)
- Direction: From top-left to bottom-right
- SVG path: Imported from Figma design
- Appears when clicking and holding checked checkbox

## Browser Support

Works in all modern browsers with support for:

- CSS transitions
- Flexbox
- SVG (for checkmark icon)
- SVG linear gradients
- Mouse and keyboard events

## Common Patterns

### Multi-select List

```tsx
const [selectedItems, setSelectedItems] = useState<number[]>([]);

{
  items.map((item) => (
    <Checkbox
      key={item.id}
      label={item.name}
      checked={selectedItems.includes(item.id)}
      onCheckedChange={(checked) => {
        if (checked) {
          setSelectedItems([...selectedItems, item.id]);
        } else {
          setSelectedItems(selectedItems.filter((id) => id !== item.id));
        }
      }}
    />
  ));
}
```

### Select All Pattern

```tsx
const allSelected = items.length === selectedItems.length;

<Checkbox
  label="Select All"
  checked={allSelected}
  onCheckedChange={(checked) => {
    if (checked) {
      setSelectedItems(items.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  }}
/>;
```
