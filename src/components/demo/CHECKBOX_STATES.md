# Checkbox States Quick Reference

## Five States Overview

| #   | State       | Trigger                | Background       | Border         | Checkmark   | Text Color     |
| --- | ----------- | ---------------------- | ---------------- | -------------- | ----------- | -------------- |
| 1   | **Default** | Unchecked initial      | White            | Gray `#717182` | None        | Dark `#4a3c2a` |
| 2   | **Hover**   | Mouse over (unchecked) | White            | Gray `#717182` | None        | Gray `#717182` |
| 3   | **Focus**   | Tab on checked         | Blue `#2374ff`   | None           | White solid | Dark `#4a3c2a` |
| 4   | **Active**  | Click & hold (checked) | Orange `#de6a07` | None           | Gradient    | Dark `#4a3c2a` |
| 5   | **Checked** | Selected               | Blue `#2374ff`   | None           | White solid | Dark `#4a3c2a` |

## State Details

### 1. Default (Unchecked)

```
Trigger: Initial state
Background: White
Border: Gray #717182
Checkmark: None
Text: Dark #4a3c2a
Focus Ring: No
```

### 2. Hover

```
Trigger: Mouse over unchecked checkbox
Background: White
Border: Gray #717182
Checkmark: None
Text: Gray #717182 (changed from dark)
Focus Ring: No
Transition: Text color fades smoothly
```

### 3. Focus

```
Trigger: Tab to checked checkbox
Background: Blue #2374ff
Border: None
Checkmark: White solid
Text: Dark #4a3c2a
Focus Ring: No (clean design)

Note: Unchecked + focused = Default state
```

### 4. Active (Pressed)

```
Trigger: Click and hold on checked checkbox
Background: Orange #de6a07
Border: None
Checkmark: Gradient (cream → light yellow)
Text: Dark #4a3c2a
Focus Ring: No
Duration: While mouse is pressed
```

### 5. Checked

```
Trigger: Click to select
Background: Blue #2374ff
Border: None
Checkmark: White solid
Text: Dark #4a3c2a
Focus Ring: No (unless also focused)
```

## Checkmark Variations

### Solid White Checkmark

**Used in:** Focus, Checked states

- Color: White `#FFFFFF`
- Icon: Lucide-react Check
- Size: 12px
- Stroke Width: 3

### Gradient Checkmark

**Used in:** Active state

- Gradient: `#FFF7ED` → `#FFFBEB`
- Direction: Top-left to bottom-right
- SVG Path: From Figma import
- Stroke Width: 2

## State Flow Diagrams

### Mouse Interaction Flow

```
Default (unchecked)
    ↓ hover
Hover
    ↓ click
Checked
    ↓ press & hold
Active
    ↓ release
Checked
    ↓ click again
Default (unchecked)
```

### Keyboard Interaction Flow

```
Default (unchecked)
    ↓ Tab
Default (unchecked, stays same)
    ↓ Space
Focus state (checked, blue background)
    ↓ Space again
Default (unchecked, gray border)
```

## Color Palette

```css
/* Backgrounds */
--bg-unchecked: #ffffff --bg-checked: #2374ff --bg-focus: #2374ff
  --bg-active: #de6a07 /* Borders */ --border-default: #717182
  --border-focus-ring: #2374ff /* Text */ --text-default: #4a3c2a
  --text-hover: #717182 /* Checkmark */ --check-solid: #ffffff
  --check-gradient-start: #fff7ed --check-gradient-end: #fffbeb;
```

## State Priority Logic

When multiple conditions are true:

1. **Active** (highest priority)
   - Condition: `isChecked && isActive`
   - Display: Orange background, gradient checkmark

2. **Focus**
   - Condition: `isChecked && isFocused`
   - Display: Blue background, white checkmark, focus ring

3. **Checked**
   - Condition: `isChecked`
   - Display: Blue background, white checkmark

4. **Hover**
   - Condition: `!isChecked && isHovered`
   - Display: Gray text

5. **Default** (lowest priority)
   - Condition: `!isChecked`
   - Display: Gray border, dark text

## Transition Timing

All state transitions use **200ms** duration:

- Background color: `200ms`
- Border color: `200ms`
- Text color: `200ms`
- Opacity: `200ms`

Easing: Default (ease)

## Implementation Notes

### State Management

```typescript
const [isChecked, setIsChecked] = useState(false);
const [isFocused, setIsFocused] = useState(false);
const [isHovered, setIsHovered] = useState(false);
const [isActive, setIsActive] = useState(false);
```

### Active State Detection

```typescript
// Only activate when checkbox is already checked
const handleMouseDown = () => {
  if (!disabled && isChecked) {
    setIsActive(true);
  }
};

const handleMouseUp = () => {
  setIsActive(false);
};
```

### Text Color Logic

```typescript
const getTextColor = () => {
  if (disabled) return "text-[#717182]/50";
  // Hover state: gray text when hovering over unchecked
  if (isHovered && !isChecked) return "text-[#717182]";
  // All other states: dark text
  return "text-[#4a3c2a]";
};
```

## Accessibility Features

### Keyboard Support

- `Tab` - Navigate to checkbox
- `Space` - Toggle checked state
- `Shift + Tab` - Navigate backward

### Screen Reader

- Announces "checkbox" role
- Reads label text
- States "checked" or "not checked"
- Focus changes are announced

### Visual Indicators

- Focus ring for keyboard navigation
- Color contrast meets WCAG AA standards
- State changes are visually distinct

## Testing Checklist

### Visual Tests

- [ ] Default state shows gray border
- [ ] Hover changes text to gray (unchecked only)
- [ ] Focus shows blue focus ring
- [ ] Active shows orange background (checked only)
- [ ] Checked shows blue background
- [ ] Gradient checkmark appears in active state
- [ ] White checkmark appears in checked/focus states

### Interaction Tests

- [ ] Click toggles checked state
- [ ] Hover over unchecked changes text color
- [ ] Tab navigation works
- [ ] Space key toggles state
- [ ] Click and hold shows active state
- [ ] Release returns to checked state
- [ ] Label click toggles checkbox

### Accessibility Tests

- [ ] Screen reader announces state
- [ ] Keyboard navigation works
- [ ] Focus is visible
- [ ] Disabled state prevents interaction
- [ ] Color contrast is sufficient

## Common Gotchas

1. **Active state only on checked**
   - Active state only appears when checkbox is already checked
   - Unchecked checkbox won't show orange on press

2. **Hover affects text, not box**
   - Hover state changes text color, not checkbox appearance
   - Only applies to unchecked state

3. **No visible focus ring**
   - Focus ring has been removed for clean design
   - Focus state shows blue background when checked
   - Unchecked + focused = Default state
   - "Focus state" refers specifically to checked + focused combination

4. **Gradient checkmark timing**
   - Only appears during active state (mouse pressed)
   - Returns to white checkmark on release

5. **Unchecked always looks the same**
   - Whether hovered, focused, or default - unchecked state has same gray border
   - Only the text color changes on hover
6. **No focus ring**
   - Focus ring has been removed from all states
   - Keyboard focus is still functional, just not visually indicated with a ring

## Browser Compatibility

| Feature             | Chrome | Firefox | Safari | Edge |
| ------------------- | ------ | ------- | ------ | ---- |
| Basic functionality | ✅     | ✅      | ✅     | ✅   |
| CSS transitions     | ✅     | ✅      | ✅     | ✅   |
| SVG gradients       | ✅     | ✅      | ✅     | ✅   |
| Keyboard events     | ✅     | ✅      | ✅     | ✅   |
| Focus-visible       | ✅     | ✅      | ✅     | ✅   |
