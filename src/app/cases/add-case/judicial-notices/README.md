# Judicial Notices Component Structure

This directory contains a refactored and organized implementation of the Judicial Notices feature, broken down into smaller, maintainable components following clean code principles.

## Directory Structure

```
judicial-notices/
├── components/          # UI Components
│   ├── AddNoticeDialog.js       # Dialog for adding new notices
│   ├── EditNoticeDialog.js      # Dialog for editing existing notices
│   ├── NoticeForm.js            # Reusable form with all input fields
│   ├── FileUploadArea.js        # File upload UI with drag & drop
│   ├── FileList.js              # Display list of uploaded files
│   ├── NoticesTable.js          # Table displaying all notices
│   └── index.js                 # Component exports
├── hooks/              # Custom React Hooks
│   ├── useFileUpload.js        # Hook for file upload & drag-drop logic
│   ├── useNoticeForm.js        # Hook for form state & CRUD operations
│   └── index.js                # Hook exports
├── utils/              # Utility Functions
│   ├── fileHelpers.js          # File icon & size formatting utilities
│   └── index.js                # Utility exports
├── JudicialNotices.js  # Main component (orchestrates all parts)
└── README.md           # This file

```

## Component Breakdown

### Main Component
- **JudicialNotices.js** - Main orchestrator component that:
  - Integrates with Formik context
  - Uses custom hooks for state management
  - Renders the card layout with dialogs and table

### UI Components (`/components`)

#### AddNoticeDialog.js
- Dialog component for adding new judicial notices
- Props: `isOpen`, `onOpenChange`, `formData`, `onInputChange`, `onFileChange`, `onRemoveFile`, `onAdd`
- Uses NoticeForm internally

#### EditNoticeDialog.js
- Dialog component for editing existing notices
- Props: `isOpen`, `onOpenChange`, `formData`, `onInputChange`, `onFileChange`, `onRemoveFile`, `onUpdate`
- Uses NoticeForm internally

#### NoticeForm.js
- Reusable form component containing:
  - Certification date picker
  - Notice period input
  - Checkboxes (notice completed, lawsuit filed)
  - File upload section
- Props: `formData`, `onInputChange`, `onFileChange`, `onRemoveFile`, `idPrefix`

#### FileUploadArea.js
- File upload UI with drag-and-drop functionality
- Visual feedback for drag over state
- Props: `onFileChange`, `isDragOver`, `onDragOver`, `onDragLeave`, `onDrop`, `inputId`

#### FileList.js
- Displays list of uploaded files
- Shows file icon, name, size, and remove button
- Props: `files`, `onRemoveFile`

#### NoticesTable.js
- Table component displaying all judicial notices
- Shows: certification date, period, checkboxes status, files, and actions
- Props: `notices`, `onEdit`, `onDelete`

### Custom Hooks (`/hooks`)

#### useFileUpload.js
Manages file upload functionality:
- Returns: `isDragOver`, `handleDragOver`, `handleDragLeave`, `handleDrop`
- Handles drag-and-drop events and state

#### useNoticeForm.js
Manages form state and CRUD operations:
- Parameters: `notices`, `setFieldValue`
- Returns: Dialog states, form data, and all handler functions
- Handles: Add, edit, update, delete operations

### Utilities (`/utils`)

#### fileHelpers.js
Helper functions for file operations:
- `getFileIcon(fileName)` - Returns appropriate icon based on file extension
- `formatFileSize(bytes)` - Converts bytes to human-readable format

## Benefits of This Structure

1. **Separation of Concerns**: Each file has a single, clear responsibility
2. **Reusability**: Components like NoticeForm, FileUploadArea, and FileList can be reused elsewhere
3. **Maintainability**: Smaller files are easier to understand and modify
4. **Testability**: Each component and hook can be tested in isolation
5. **Scalability**: Easy to add new features without affecting existing code
6. **Clean Code**: Follows React best practices and clean code principles

## Usage Example

```javascript
import JudicialNotices from './judicial-notices/JudicialNotices'

// Use in your case form
<JudicialNotices />
```

## Component Dependencies

- **UI Components**: Shadcn/ui components (Button, Card, Dialog, Table, etc.)
- **Icons**: Lucide React icons
- **Date Handling**: date-fns library
- **Form Integration**: Formik context
- **Translations**: Custom useTranslations hook

## Future Improvements

- Add unit tests for each component and hook
- Add TypeScript types/interfaces
- Add PropTypes or runtime validation
- Add loading states for file uploads
- Add error handling and validation feedback
- Consider adding file preview functionality
