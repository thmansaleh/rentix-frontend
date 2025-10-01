import React from 'react'
import { Button } from '@/components/ui/button'
import { useFormikContext } from './FormikContext'

function SubmitButton() {
  const { isSubmitting, dirty } = useFormikContext();

  return (
    <div className='flex justify-end'>
      <Button 
        type="submit" 
        disabled={isSubmitting || !dirty}
        className="min-w-[120px]"
      >
        {isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </Button>
    </div>
  )
}

export default SubmitButton