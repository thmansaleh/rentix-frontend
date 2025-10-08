# Potential Clients Page Implementation

## Overview
This implementation creates a complete potential clients (agreements) page with SWR data fetching, search functionality, pagination, and a shadcn table display.

## Components Created

### 1. SearchBar Component (`/src/components/SearchBar.jsx`)
- **Location**: `frontend/src/components/SearchBar.jsx`
- **Features**:
  - Search input with icon
  - Submit button
  - Clear button (appears when there's text)
  - Customizable placeholder
  - Calls `onSearch` callback with search term

### 2. Pagination Component (`/src/components/Pagination.jsx`)
- **Location**: `frontend/src/components/Pagination.jsx`
- **Features**:
  - First/Previous/Next/Last page buttons
  - Page number buttons with ellipsis for large page counts
  - Smart page number display (shows current page context)
  - Disabled states for edge cases
  - Page counter display

### 3. Potential Clients Page (`/src/app/potential-clients/page.js`)
- **Location**: `frontend/src/app/potential-clients/page.js`
- **Features**:
  - SWR data fetching with automatic revalidation
  - Real-time search functionality
  - Pagination (10 items per page)
  - Loading state with spinner
  - Error state handling
  - Empty state handling
  - Responsive table with shadcn components
  - Status badges with color coding
  - View details button for each row
  - Results counter

## Backend API Structure

### Endpoint: `GET /clients-agreements`

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `name` - Search by name (partial match)
- `phone` - Search by phone (partial match)
- `status` - Filter by status
- `type` - Filter by type
- `source` - Filter by source

**Response Structure**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Client Name",
      "phone": "1234567890",
      "note": "Some notes",
      "status": "New",
      "type": "Individual",
      "source": "Website",
      "created_by": 1,
      "created_by_name": "Employee Name",
      "created_at": "2025-10-08T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## Data Fields Displayed

1. **ID** - Unique identifier
2. **Name** - Client name
3. **Phone** - Contact phone number
4. **Type** - Agreement type (with blue badge)
5. **Status** - Current status with color-coded badges:
   - New (green)
   - Contacted (yellow)
   - Converted (blue)
   - Other (gray)
6. **Source** - How the client was acquired
7. **Created By** - Employee who created the record
8. **Created At** - Date created (formatted)
9. **Actions** - View details button

## API Service Updated

**File**: `frontend/src/app/services/api/clientsAgreements.js`

Updated `getAllClientsAgreements` to accept query parameters:
```javascript
export const getAllClientsAgreements = async (params = {}) => {
  try {
    const response = await api.get(`/clients-agreements`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching client agreements:", error);
    throw error;
  }
};
```

## Features Implemented

✅ **SWR Data Fetching**
- Automatic caching
- Revalidation on focus disabled
- Keep previous data while loading new page

✅ **Search Functionality**
- Search by name or phone
- Resets to page 1 on new search
- Clear button to reset search

✅ **Pagination**
- Server-side pagination
- 10 items per page
- Smart page number display
- Navigation buttons

✅ **Table Display**
- Shadcn table components
- Responsive design
- Color-coded status badges
- Formatted dates

✅ **Loading States**
- Loading spinner
- Error message display
- Empty state message

✅ **Reusable Components**
- SearchBar can be used anywhere
- Pagination can be used anywhere
- Both accept props for customization

## Next Steps (TODO)

1. **View Details Functionality**
   - Create a details modal or page
   - Implement `handleViewDetails` function
   - Show full client information including notes

2. **Additional Filters**
   - Add filter dropdowns for Status, Type, Source
   - Create a filter component
   - Apply multiple filters simultaneously

3. **Actions**
   - Add edit button
   - Add delete button with confirmation
   - Add create new client button

4. **Export**
   - Add export to CSV/Excel functionality
   - Print functionality

5. **Advanced Features**
   - Bulk actions
   - Sort by columns
   - Custom page size selector

## Usage Example

The page automatically loads when navigated to `/potential-clients`. 

- **Search**: Type in the search bar and click "Search" or press Enter
- **Pagination**: Click page numbers or navigation arrows
- **View Details**: Click the eye icon on any row

All components are self-contained and can be reused throughout the application.
