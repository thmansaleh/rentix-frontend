# AddTaskModal - Simplified Usage

The AddTaskModal component has been refactored to be self-contained and reusable across multiple pages. It now handles all internal state, data fetching, and form submission internally.

## New Interface

```jsx
<AddTaskModal 
  isOpen={isModalOpen}
  onOpenChange={setIsModalOpen}
  caseId={caseId}
  onTaskCreated={onTaskCreated} // Optional callback
/>
```

## Required Props

- `isOpen` (boolean): Controls whether the modal is open
- `onOpenChange` (function): Callback to handle modal open/close state
- `caseId` (string|number): The ID of the case to create tasks for

## Optional Props

- `onTaskCreated` (function): Callback function called after a task is successfully created. Useful for refreshing parent component data.

## Usage Examples

### Basic Usage
```jsx
import React, { useState } from 'react'
import AddTaskModal from './AddTaskModal'

function MyPage({ caseId }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Add Task
      </button>
      
      <AddTaskModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        caseId={caseId}
      />
    </div>
  )
}
```

### With Task Creation Callback
```jsx
import React, { useState } from 'react'
import { useCaseTasks } from '@/hooks/useCaseTasks'
import AddTaskModal from './AddTaskModal'

function TasksPage({ caseId }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { tasks, mutate } = useCaseTasks(caseId) // Using SWR hook

  const handleTaskCreated = () => {
    // Refresh the tasks list
    mutate()
    console.log('Task created, refreshing list...')
  }

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        Add New Task
      </button>
      
      <AddTaskModal 
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        caseId={caseId}
        onTaskCreated={handleTaskCreated}
      />
      
      {/* Render tasks list */}
      {tasks?.map(task => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  )
}
```

## What the Modal Handles Internally

The modal now handles all of these internally:
- ✅ Form state management (`formData`, `setFormData`)
- ✅ Employee data fetching and loading states
- ✅ Priority and task type options
- ✅ Form validation
- ✅ File handling (upload, preview, removal)
- ✅ API submission with loading states
- ✅ Success/error toast notifications
- ✅ Form reset after submission
- ✅ Modal close after successful submission

## Migration from Old Interface

### Before (Complex):
```jsx
<AddTaskModal
  isOpen={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  formData={formData}
  onInputChange={handleInputChange}
  onSubmit={handleAddTask}
  employees={employees}
  loadingEmployees={loadingEmployees}
  employeesError={employeesError}
  priorityOptions={priorityOptions}
  taskTypeOptions={taskTypeOptions}
  isSubmitting={isSubmitting}
  setFieldValue={(field, value) => handleInputChange(field, value)}
/>
```

### After (Simple):
```jsx
<AddTaskModal
  isOpen={isDialogOpen}
  onOpenChange={setIsDialogOpen}
  caseId={caseId}
  onTaskCreated={mutate} // Optional
/>
```

## Benefits

1. **Reusability**: Can be used on any page that needs to create tasks
2. **Reduced boilerplate**: No need to manage form state, employee fetching, etc. in parent components
3. **Consistent behavior**: All instances of the modal behave the same way
4. **Easier maintenance**: All modal logic is in one place
5. **Better separation of concerns**: Parent components only handle their own business logic