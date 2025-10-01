// Example usage of the refactored AddExecutionModal

import { useState } from 'react'
import AddExecutionModal from './AddExecutionModal'
import { Button } from '@/components/ui/button'

const ExampleUsage = ({ caseId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <div>
      <Button onClick={handleOpenModal}>
        Add New Execution
      </Button>

      <AddExecutionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        caseId={caseId}
      />
    </div>
  )
}

export default ExampleUsage