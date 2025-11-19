"use client";

import React, { useState } from 'react'
import Meetings from '../potential-clients/meetings/Meetings'
import { AddMeetingModal } from './AddMeetingModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTranslations } from '@/hooks/useTranslations'

function MeetingsPage() {
  const { t } = useTranslations();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSuccess = () => {
    // Trigger refresh by updating the key
    setRefreshTrigger(prev => prev + 1);
  };

  const addButton = (
    <Button 
      onClick={() => setIsAddModalOpen(true)}
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
      {t('meetings.addModal.title')}
    </Button>
  );

  return (
    <>
      <Meetings key={refreshTrigger} headerAction={addButton} />
      
      <AddMeetingModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </>
  )
}

export default MeetingsPage
