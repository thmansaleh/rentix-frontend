# Search Component Architecture

A modular, well-organized search system with beautiful UI design.

## Structure

```
search/
├── SearchBar.js              # Main orchestrator component
├── SearchTypeSelector.js     # Icon-based type selector (System, Cases, Parties, Clients)
├── SearchInput.js            # Search input field with clear button
├── SearchResults.js          # Results container and state manager
├── SearchResultItem.js       # Individual result item with icons
├── LoadingState.js           # Loading spinner state
├── EmptyState.js            # No results state
├── useSearchAPI.js          # Custom hook for API calls
├── useKeyboardNavigation.js # Keyboard navigation hook
├── useClickOutside.js       # Click outside detection hook
└── index.js                 # Barrel exports

## Features

✅ **Icon-based Type Selector** - Beautiful pill-style buttons with icons
✅ **Smooth Animations** - Fade-in and slide effects
✅ **Keyboard Navigation** - Arrow keys, Enter, Escape support
✅ **Loading & Empty States** - User-friendly feedback
✅ **RTL Support** - Full right-to-left language support
✅ **Color-coded Results** - Different colors for each type
✅ **Responsive Design** - Works on all screen sizes
✅ **Custom Hooks** - Reusable logic separated into hooks

## Component Breakdown

### SearchBar (Main)
- Orchestrates all sub-components
- Manages state
- Handles routing

### SearchTypeSelector
- 4 types with icons: LayoutGrid, Folder, Users, UserCheck
- Active state styling
- Pill design with smooth transitions

### SearchResultItem
- Color-coded icons per type
- Truncated text for long names
- Chevron indicators
- Hover and selected states

## Usage

```jsx
import SearchBar from '@/app/components/search';

<SearchBar />
```
