# AddLegalPeriodModal Fix - Explanation

## Problem
The AddLegalPeriodModal was appearing behind the parent AddSessionModal and clicks were passing through to the modal behind it.

## Root Cause
1. **Z-index stacking context**: The Dialog component (AddSessionModal) creates its own stacking context with z-index: 50
2. **Event bubbling**: Clicks inside the modal were bubbling up to the backdrop
3. **Portal rendering**: The modal wasn't being rendered at the correct level in the DOM hierarchy

## Solution Applied

### 1. **Proper Event Handling**
```javascript
// Main container handles backdrop clicks
<div onClick={handleCancel}>
  {/* Modal content stops propagation */}
  <div onClick={(e) => e.stopPropagation()}>
    {/* All inputs and buttons work here */}
  </div>
</div>
```

### 2. **Dedicated Portal Container**
```javascript
// Create a dedicated container with high z-index
let container = document.getElementById('legal-period-modal-root')
if (!container) {
  container = document.createElement('div')
  container.id = 'legal-period-modal-root'
  container.style.position = 'relative'
  container.style.zIndex = '9999'
  document.body.appendChild(container)
}
return createPortal(modalContent, container)
```

### 3. **Layered Z-index Strategy**
- Container div: `z-index: 9999` (higher than Dialog's z-50)
- Modal overlay: Inline `style={{ zIndex: 9999 }}`
- This ensures the modal appears above ALL other content

## How It Works

1. **On Modal Open**: Creates/finds a dedicated container at the end of `document.body`
2. **Container Setup**: Sets the container to `position: relative` and `z-index: 9999`
3. **Portal Rendering**: Uses React's `createPortal` to render modal into this container
4. **Event Isolation**: The modal content uses `stopPropagation()` to prevent clicks from reaching the backdrop
5. **Backdrop Clicks**: Only clicks on the backdrop (outside the modal) trigger `handleCancel`

## Result
✅ Modal appears on top of AddSessionModal
✅ Can type in all input fields
✅ Can click buttons without closing modal
✅ Can close modal by clicking X button or outside (backdrop)
✅ Proper layering and event handling

## Technical Details

**Z-index Hierarchy:**
- Base page: 0
- Dialog (AddSessionModal): 50 (from shadcn/ui)
- Legal Period Modal Container: 9999
- Legal Period Modal Content: Inherits from container

**Event Flow:**
```
Click on input
  → stopPropagation() prevents bubbling
  → Input receives focus/change events
  → Modal stays open

Click on backdrop
  → Event reaches container's onClick
  → handleCancel() is called
  → Modal closes
```
