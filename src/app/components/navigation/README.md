# AppSidebar Component Architecture

This document describes the refactored AppSidebar component structure, which has been organized into multiple files and components for better maintainability and clean code practices.

## Directory Structure

```
frontend/src/app/components/navigation/
├── AppSidebar.js                    # Main sidebar component
├── components/                      # UI Components
│   ├── MenuItem.js                  # Individual menu item component
│   ├── NavigationMenu.js            # Navigation menu list component
│   ├── SidebarHeader.js             # Sidebar header (logo & title)
│   ├── SidebarFooter.js             # Sidebar footer (user profile)
│   ├── MobileSidebar.js             # Mobile sidebar implementation
│   └── DesktopSidebar.js            # Desktop sidebar implementation
├── hooks/                           # Custom Hooks
│   └── useKeyboardNavigation.js     # Keyboard navigation hook
└── config/                          # Configuration
    └── menuConfig.js                # Menu items configuration
```

## Components Overview

### 1. **AppSidebar.js** (Main Component)
The main orchestrator component that:
- Manages state (openSubmenus, activeItem, isMobileSidebarOpen)
- Handles navigation logic
- Handles logout functionality
- Conditionally renders Mobile or Desktop sidebar based on viewport

**Key Features:**
- Centralized state management
- Memoized callbacks for performance
- Responsive design with mobile/desktop detection

---

### 2. **MenuItem.js**
Renders individual menu items with support for:
- Link type items (navigational links)
- Category type items (with submenus)
- Active state styling
- Submenu expansion/collapse
- RTL support
- Accessibility features (ARIA attributes)

**Props:**
- `item` - Menu item configuration object
- `activeItem` - Currently active item ID
- `openSubmenus` - Object tracking open submenus
- `onNavClick` - Navigation click handler
- `onToggleSubmenu` - Submenu toggle handler
- `isRTL` - RTL language support flag

---

### 3. **NavigationMenu.js**
Renders the complete navigation menu list:
- Maps through menu items
- Provides menu structure wrapper
- Handles scrolling for overflow content

**Props:**
- `menuItems` - Array of menu configuration objects
- `activeItem` - Currently active item ID
- `openSubmenus` - Object tracking open submenus
- `onNavClick` - Navigation click handler
- `onToggleSubmenu` - Submenu toggle handler
- `isRTL` - RTL language support flag

---

### 4. **SidebarHeader.js**
Displays the sidebar header with:
- Law office logo
- Office name
- Responsive design

**Props:**
- `isRTL` - RTL language support flag

---

### 5. **SidebarFooter.js**
Displays user profile information:
- User avatar (with initial)
- User name
- User role
- Logout button

**Props:**
- `user` - User object with profile information
- `userRole` - User's role/position
- `isRTL` - RTL language support flag
- `onLogout` - Logout handler function

---

### 6. **MobileSidebar.js**
Complete mobile navigation implementation:
- Fixed top navigation bar
- Slide-in sidebar with overlay
- Touch-friendly interactions
- Responsive layout

**Props:**
- `isOpen` - Sidebar open state
- `onClose` - Close handler
- `onToggle` - Toggle handler
- `menuItems` - Menu configuration
- `activeItem` - Active item ID
- `openSubmenus` - Open submenus object
- `onNavClick` - Navigation handler
- `onToggleSubmenu` - Submenu toggle handler
- `user` - User object
- `userRole` - User role
- `onLogout` - Logout handler
- `isRTL` - RTL support flag
- `sidebarRef` - React ref for sidebar element

---

### 7. **DesktopSidebar.js**
Desktop sidebar implementation:
- Fixed sidebar layout
- Vertical navigation structure
- Smooth transitions

**Props:**
- Same as MobileSidebar (except `isOpen`, `onClose`, `onToggle`)

---

## Custom Hooks

### useKeyboardNavigation.js
Provides keyboard navigation functionality:
- **Alt + Arrow Up**: Navigate to previous menu item
- **Alt + Arrow Down**: Navigate to next menu item
- Automatically focuses and navigates to items

**Parameters:**
- `menuItems` - Array of menu items
- `activeItem` - Current active item
- `setActiveItem` - Active item setter
- `handleNavClick` - Navigation handler

---

## Configuration

### menuConfig.js
Centralized menu configuration that returns menu structure based on translations.

**Function:** `getMenuItems(t)`
- **Parameter:** `t` - Translation function
- **Returns:** Array of menu item objects

**Menu Item Structure:**
```javascript
{
  id: string,           // Unique identifier
  label: string,        // Display label (translated)
  icon: Component,      // Lucide icon component
  type: 'link' | 'category',  // Item type
  submenu?: []          // Optional submenu array
}
```

---

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Each component has a single, clear responsibility
- UI components are separated from business logic
- Configuration is isolated from implementation

### 2. **Reusability**
- Components can be reused in different contexts
- Hooks can be shared across components
- Configuration can be easily modified

### 3. **Maintainability**
- Smaller files are easier to understand and modify
- Changes to one component don't affect others
- Clear structure makes onboarding new developers easier

### 4. **Testability**
- Each component can be tested in isolation
- Mocked props make unit testing straightforward
- Hooks can be tested independently

### 5. **Performance**
- React.memo optimization on MenuItem
- Memoized callbacks prevent unnecessary re-renders
- Lazy loading potential for future optimization

### 6. **Scalability**
- Easy to add new menu items via configuration
- New components can be added without affecting existing ones
- Clear patterns for extending functionality

---

## Usage Example

```javascript
import AppSidebar from '@/components/navigation/AppSidebar';

function Layout({ children }) {
  return (
    <div className="flex">
      <AppSidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
```

---

## Future Enhancements

1. **Dynamic Menu Loading**
   - Load menu items based on user permissions
   - Add role-based menu filtering

2. **Analytics Integration**
   - Track menu navigation events
   - Monitor user interaction patterns

3. **Customization**
   - Allow users to customize menu order
   - Pin favorite menu items

4. **Search Functionality**
   - Add quick search across menu items
   - Keyboard shortcuts for menu search

5. **Breadcrumb Integration**
   - Sync breadcrumbs with active menu item
   - Show navigation path in header

---

## Contributing

When adding new features or modifying the sidebar:

1. Keep components focused on single responsibilities
2. Update this documentation for any structural changes
3. Maintain TypeScript-like prop documentation
4. Follow existing naming conventions
5. Ensure RTL support is maintained
6. Test both mobile and desktop implementations

---

## Dependencies

- React (hooks: useState, useCallback, useMemo, useRef, useEffect)
- Next.js (useRouter)
- lucide-react (icons)
- Custom hooks: useIsMobile, useAuth, useUserRole, useTranslations
- Custom contexts: LanguageContext
- Redux (for logout functionality)
