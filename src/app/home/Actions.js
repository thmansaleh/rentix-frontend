import React, { useState } from 'react'
import { Edit } from 'lucide-react'
import AppealDecisionModal from './AppealDecisionModal'
import { usePermission } from '@/hooks/useAuth'

function Actions({ theme = 'blue', onEdit, sessionId, caseId }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { hasPermission: canEditSession } = usePermission('Edit Session')

  const themeColors = {
    blue: 'hover:text-blue-600',
    orange: 'hover:text-orange-600',
    purple: 'hover:text-purple-600',
    green: 'hover:text-green-600'
  }

  const hoverColor = themeColors[theme] || themeColors.blue

  const handleEditClick = () => {
    if (onEdit) {
      onEdit()
    } else if (caseId) {
      setIsModalOpen(true)
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="flex justify-end gap-2 pt-2">
        {canEditSession && (
          <Edit 
            className={`w-4 h-4 text-gray-400 ${hoverColor} cursor-pointer transition-colors`}
            onClick={handleEditClick}
          />
        )}
        {/* Future actions can be added here */}
      </div>

      {/* Appeal Decision Modal */}
      {caseId && (
        <AppealDecisionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          caseId={caseId}
          onSuccess={() => {
            // Refresh the data if needed
            if (onEdit) {
              onEdit()
            }
          }}
        />
      )}
    </>
  )
}

export default Actions