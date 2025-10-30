# AddSessionModal Component Structure

This directory contains the refactored AddSessionModal component, split into smaller, maintainable modules.

## File Structure

```
AddSessionModal/
├── index.js                  # Main modal component (entry point)
├── useSessionForm.js         # Custom hook for form logic and state
├── SessionBasicInfo.js       # Basic session information fields
├── SessionSettings.js        # Session settings switches
├── RulingSection.js          # Ruling details (conditional)
├── FileUploadSection.js      # File upload interface
└── README.md                 # This file
```

## Components

### `index.js` (Main Component)
- Entry point for the modal
- Handles modal layout and structure
- Composes all sub-components
- Manages portal rendering

### `useSessionForm.js` (Custom Hook)
- Manages all form state and logic
- Handles file upload logic
- Formik integration and validation
- API calls for creating sessions
- Legal periods fetching

### `SessionBasicInfo.js`
- Session date picker
- Session time input
- Notes textarea
- Link input field

### `SessionSettings.js`
- Session status switch
- Expert session toggle
- Judgment reserved toggle (auto-disables status when active)
- Has ruling toggle

### `RulingSection.js`
- Conditionally rendered when "Has Ruling" is active
- Ruling text textarea
- Ruling date picker
- Legal period selector

### `FileUploadSection.js`
- File drag & drop zone
- File selection interface
- Selected files list
- File removal controls

## Usage

```javascript
import AddSessionModal from '@/app/cases/modals/AddSessionModal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <AddSessionModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      caseId={123}
      onSessionAdded={(session) => {
        console.log('Session added:', session);
      }}
    />
  );
}
```

## Key Features

- **Auto-disable status**: When "Judgment Reserved" is toggled ON, the session status automatically becomes inactive
- **Visual feedback**: Red border and warning message when status is auto-disabled
- **File validation**: Validates file size (max 10MB) and type before upload
- **Conditional rendering**: Ruling section only appears when needed
- **Legal period management**: Inline addition of new legal periods

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility
2. **Reusability**: Components can be reused in other contexts
3. **Testability**: Easier to write unit tests for individual components
4. **Readability**: Smaller files are easier to understand
5. **Performance**: Easier to optimize individual components
6. **Collaboration**: Multiple developers can work on different components

## Future Improvements

- Add TypeScript types
- Extract validation schema to separate file
- Add component-level error boundaries
- Add loading skeletons
- Add keyboard navigation support
