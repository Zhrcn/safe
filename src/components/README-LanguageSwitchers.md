# Language Switcher Components

This directory contains three different language switcher implementations, each with a unique design approach and user experience.

## Components

### 1. LanguageSwitcher.jsx (Dropdown Menu)
**Default and recommended variant**

- **Design**: Modern dropdown menu with flags and native language names
- **Features**:
  - Accessible dropdown interface
  - Flag emojis for visual identification
  - Native language names with English translations
  - Check mark indicator for current language
  - Responsive design (shows language codes on mobile)
  - Smooth animations and transitions

- **Usage**: Import and use directly in your components
- **Best for**: Most use cases, especially when you might add more languages later

### 2. LanguageSwitcherToggle.jsx (Toggle Button)
**Animated toggle variant**

- **Design**: Animated toggle button with smooth transitions
- **Features**:
  - Smooth rotation and scale animations
  - Gradient background with hover effects
  - Ripple effect on click
  - Compact design
  - Visual feedback with globe icon rotation

- **Usage**: Import and use for a more interactive experience
- **Best for**: Compact spaces, modern interfaces, when you want more visual feedback

### 3. LanguageSwitcherSegmented.jsx (Segmented Control)
**iOS-style segmented control**

- **Design**: Segmented control with sliding indicator
- **Features**:
  - Sliding animation between languages
  - Active state indicators
  - Compact segmented design
  - Globe icon overlay
  - iOS-style visual design

- **Usage**: Import and use for a modern segmented control experience
- **Best for**: Modern interfaces, when you want a familiar mobile-like experience

## Demo Component

### LanguageSwitcherDemo.jsx
A comprehensive demo component that showcases all three variants side by side, allowing you to:
- Compare different designs
- Test functionality
- See features of each variant
- Choose the best fit for your use case

## Usage Examples

```jsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

import LanguageSwitcherToggle from '@/components/LanguageSwitcherToggle';

import LanguageSwitcherSegmented from '@/components/LanguageSwitcherSegmented';

import LanguageSwitcherDemo from '@/components/LanguageSwitcherDemo';
```

## Features

All variants include:
- ✅ RTL/LTR direction switching
- ✅ Local storage persistence
- ✅ Accessibility support
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Flag emojis
- ✅ Native language names
- ✅ Theme integration

## Customization

Each component can be customized by:
- Modifying the `languages` array to add more languages
- Adjusting CSS classes for different themes
- Changing animation durations
- Customizing flag emojis or using custom flag images

## Translation Keys

Required translation keys:
- `language`: "Language" / "اللغة"
- `switchTo`: "Switch to" / "التبديل إلى"
- `arabic`: "Arabic" / "العربية"
- `english`: "English" / "الإنجليزية"

## Browser Support

All components work with:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers
- RTL language support
- Touch devices

## Performance

- Lightweight components with minimal dependencies
- Efficient re-renders
- Smooth animations using CSS transitions
- No external dependencies beyond React and Lucide icons 