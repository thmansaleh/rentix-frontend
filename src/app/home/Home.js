import CasePetitions from "./CasePetitions"
import LastWeekSessions from "./LastWeekSessions"
import SessionsWithDecision from "./SessionsWithDecision"
import SessionWithNoDecision from "./SessionWithNoDecision"

function Home() {
  return (
    <div className="gidd grid grid-cols-4 gap-2">
        <SessionWithNoDecision />
        <SessionsWithDecision />
        <CasePetitions />
        <LastWeekSessions />

    </div>
  )
}

export default Home