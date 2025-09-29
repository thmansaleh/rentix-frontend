import React from 'react'
import PoliceStation from './PoliceStation'
import Court from './Court'
import PublicProsecutions from './PublicProsecutions'
import CourtFiles from './CourtFiles'

function CourtAndPoliceStations() {
  return (
    <div className='space-y-6 '>

    <div className='flex  gap-4'>
      <PoliceStation/>
      <Court />
      <PublicProsecutions/>
    </div> 
          <CourtFiles/>

    </div>
            
  )
}

export default CourtAndPoliceStations