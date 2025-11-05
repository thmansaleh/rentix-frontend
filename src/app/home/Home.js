'use client';

import CasePetitions from "./CasePetitions"
import LastWeekSessions from "./LastWeekSessions"
import AppealsAndChallenges from "./AppealsAndChallenges"
import SessionWithNoDecision from "./SessionWithNoDecision"

function Home() {
  return (
    <div className="w-full min-h-screen">
     

      {/* Responsive Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
        {/* Each card wrapper with consistent height */}
        <div className="flex flex-col h-full">
          <SessionWithNoDecision />
        </div>
        
        <div className="flex flex-col h-full">
          <AppealsAndChallenges />
        </div>
        
        <div className="flex flex-col h-full">
          <CasePetitions />
        </div>
        
        <div className="flex flex-col h-full">
          <LastWeekSessions />
        </div>
      </div>
    </div>
  )
}

export default Home