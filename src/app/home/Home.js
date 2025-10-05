import CasePetitions from "./CasePetitions"
import LastWeekSessions from "./LastWeekSessions"
import SessionsWithDecision from "./SessionsWithDecision"
import SessionWithNoDecision from "./SessionWithNoDecision"

function Home() {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4  gap-2">
        <SessionWithNoDecision />
        <SessionsWithDecision />
        <CasePetitions />
        <LastWeekSessions />

    </div>
  )
}

export default Home