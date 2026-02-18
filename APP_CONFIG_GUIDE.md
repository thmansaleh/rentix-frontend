# App Configuration Guide

## Centralized App Configuration

All app name, branding, and company information is now centralized in one location:

**File:** `frontend/src/lib/appConfig.js`

## What's Configured

### Application Identity
- **App Name**: `LEXCORA`
- **Full Name**: `Lexcora ERP System`
- **Description** (multilingual):
  - Arabic: نظام إدارة متكامل
  - English: Legal Management System

### Company Information
- Company Name: `Almstkshf.com`
- Support Email: `rased@almstkshf.com`
- Support Phone: `0585952035`

### Branding Assets
- Logo: `/log_in_card_logo.png`
- Background Image: `/background.jpg`

### Footer & Support Text
- Footer text (multilingual)
- Support text (multilingual)

## Where It's Used

The app configuration is automatically used in:

1. **Mobile Header** (`frontend/src/app/components/MobileHeader.js`)
   - Logo
   - App name

2. **Sidebar Header** (`frontend/src/app/components/navigation/components/SidebarHeader.js`)
   - Logo
   - App name
   - Description (multilingual)

3. **Login Page** (`frontend/src/app/login/page.js`)
   - Logo
   - App name
   - Footer text
   - Support information

## How to Change

To change the app name or any other configuration:

1. Open `frontend/src/lib/appConfig.js`
2. Edit the values in the `appConfig` object
3. Save the file
4. Changes will be reflected automatically throughout the app

### Example: Change App Name

```javascript
export const appConfig = {
  name: 'YOUR_NEW_APP_NAME',  // Change this
  fullName: 'Your New Full Name',
  // ... rest of config
};
```

### Example: Change Company Info

```javascript
export const appConfig = {
  // ...
  company: {
    name: 'Your Company Name',
    supportEmail: 'support@yourcompany.com',
    supportPhone: '+1234567890',
  },
  // ...
};
```

## Benefits

✅ **Single Source of Truth** - Change once, update everywhere
✅ **Easy Maintenance** - No need to search multiple files
✅ **Type Safety** - Centralized configuration is easier to validate
✅ **Consistency** - Ensures all pages use the same values
✅ **Scalability** - Easy to add new configuration options

## Future Enhancements

You can extend the configuration to include:
- Theme colors
- API endpoints
- Feature flags
- Regional settings
- Currency formats
- Date formats
- And more...
