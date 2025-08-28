# Internationalization (i18n) Implementation

This project implements a comprehensive internationalization solution supporting Arabic (RTL) and English (LTR) languages.

## Features

- ✅ Arabic and English language support
- ✅ RTL/LTR layout switching
- ✅ Persistent language preference
- ✅ Dynamic direction changes
- ✅ Translation system with namespaces
- ✅ Language switcher component
- ✅ Theme switcher with i18n support

## Best Practices Implemented

### 1. Language Context Pattern
- Uses React Context for global language state
- Automatic persistence to localStorage
- Dynamic direction attribute updates

### 2. Translation Hook
- Custom `useTranslations` hook with namespace support
- Fallback to English for missing translations
- Parameter interpolation support

### 3. Layout Responsiveness
- Dynamic HTML direction attributes
- CSS utilities for RTL/LTR layouts
- Component-level direction awareness

### 4. Component Design
- Language switcher follows theme switcher pattern
- Proper accessibility attributes
- Icon and text combinations

## Usage Examples

### Basic Translation
```jsx
import { useTranslations } from '@/hooks/useTranslations';

const MyComponent = () => {
  const t = useTranslations();
  
  return <h1>{t('navigation.dashboard')}</h1>;
};
```

### Namespaced Translation
```jsx
const t = useTranslations('buttons');
return <Button>{t('save')}</Button>; // Translates 'buttons.save'
```

### Language Context
```jsx
import { useLanguage } from '@/contexts/LanguageContext';

const MyComponent = () => {
  const { language, isRTL, switchLanguage } = useLanguage();
  
  return (
    <div className={isRTL ? 'text-right' : 'text-left'}>
      Current language: {language}
    </div>
  );
};
```

## File Structure

```
src/
├── contexts/
│   └── LanguageContext.js       # Language state management
├── hooks/
│   └── useTranslations.js       # Translation utilities
├── components/
│   ├── LanguageSwitcher.js      # Language switcher UI
│   ├── DynamicLayout.js         # Layout direction handler
│   └── ExampleTranslatedComponent.js  # Usage example
├── i18n/
│   └── config.js                # i18n configuration
└── app/
    ├── globals.css              # RTL/LTR CSS utilities
    └── layout.js                # Root layout with providers

messages/
├── ar.json                      # Arabic translations
└── en.json                      # English translations
```

## Adding New Translations

1. Add keys to both `messages/ar.json` and `messages/en.json`
2. Use nested structure for organization:
   ```json
   {
     "navigation": {
       "dashboard": "لوحة التحكم"
     },
     "buttons": {
       "save": "حفظ"
     }
   }
   ```

## RTL/LTR Styling

The implementation includes CSS utilities for RTL support:

```css
.rtl .text-left { text-align: right; }
.rtl .ml-auto { margin-left: 0; margin-right: auto; }
```

## Accessibility

- Proper `lang` and `dir` attributes
- Screen reader support with `sr-only` labels
- Keyboard navigation support
- ARIA labels in appropriate language

## Performance Considerations

- Translations loaded statically (not dynamically)
- Context providers at root level
- Minimal re-renders with proper dependencies
- CSS-based layout switching (no JavaScript calculations)

## Browser Support

- Modern browsers with ES6+ support
- CSS Grid and Flexbox
- localStorage API
- Document attribute manipulation

## Next Steps

1. Add more comprehensive translations
2. Implement date/number formatting
3. Add pluralization rules
4. Consider server-side translation loading
5. Add translation validation tools
