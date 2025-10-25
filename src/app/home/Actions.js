import React, { useState } from 'react'
import { Edit } from 'lucide-react'
import EditSessionModal from '../cases/sessions/EditSessionModal'
import { usePermission } from '@/hooks/useAuth'

function Actions({ theme = 'blue', onEdit, sessionId }) {
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
    } else if (sessionId) {
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

      {/* Edit Session Modal */}
      {sessionId && (
        <EditSessionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          sessionId={sessionId}
        />
      )}
    </>
  )
}

export default Actions