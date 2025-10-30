'use client';

import { usePermission } from "@/hooks/useAuth";
import CasePetitions from "./CasePetitions"
import LastWeekSessions from "./LastWeekSessions"
import AppealsAndChallenges from "./AppealsAndChallenges"
import SessionWithNoDecision from "./SessionWithNoDecision"

function Home() {
  const { hasPermission, role } = usePermission('Edit Session');
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2">
        <SessionWithNoDecision />
        <AppealsAndChallenges />
        <CasePetitions />
        <LastWeekSessions />

    </div>
  )
}

export default Home