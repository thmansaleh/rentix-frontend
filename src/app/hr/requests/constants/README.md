# Request Types Synchronization

## Problem
The filter dropdown in the requests page had hardcoded request types that didn't match the actual types used in the RequestModal, causing filtering issues.

## Solution
Created a centralized constants file to ensure request types are consistent across the application.

## Changes Made

### 1. Created Constants File
**File**: `frontend/src/app/hr/requests/constants/requestTypes.js`

Centralized request types definition with:
- ✅ Bilingual labels (Arabic/English)
- ✅ `isLeave` flag for leave types
- ✅ Single source of truth

### 2. Updated Components

#### **Page Component** (`page.js`)
- ✅ Imports `getRequestTypes()` from constants
- ✅ Filter dropdown now uses actual request types
- ✅ Dynamically renders all available types

#### **Request Modal** (`components/RequestModal.js`)
- ✅ Imports `getRequestTypes()` from constants
- ✅ Uses same types for consistency
- ✅ No duplication of type definitions

## Request Types Available

| Value (Arabic) | English Label | Type |
|---------------|---------------|------|
| اجازة سنوية | Annual Leave | Leave |
| اجازة مرضية | Sick Leave | Leave |
| اجازة ابوية | Paternity Leave | Leave |
| اجازة امومية | Maternity Leave | Leave |
| شهادة راتب | Salary Certificate | Document |
| شهادة خبرة | Experience Certificate | Document |
| شهادة لا مانع | No Objection Certificate | Document |
| بدل اجازة سنوية | Annual Leave Allowance | Allowance |
| اخرى | Other | Other |

## Benefits

✅ **Single Source of Truth**: One place to maintain request types
✅ **Consistency**: Modal and filter use identical values
✅ **Maintainability**: Easy to add/remove types
✅ **Bilingual Support**: Automatic language switching
✅ **Type Safety**: `isLeave` flag for conditional logic

## Usage

```javascript
import { getRequestTypes } from './constants/requestTypes'

// In component
const requestTypes = getRequestTypes(isArabic)

// Use in dropdown
{requestTypes.map((type) => (
  <SelectItem key={type.value} value={type.value}>
    {type.label}
  </SelectItem>
))}
```

## Future Improvements

Consider moving this to a global constants file if request types are used in other parts of the application.
