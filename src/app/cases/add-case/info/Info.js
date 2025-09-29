import Bar from "./Bar"
import Branch from "./Branch"
import CaseClassifications from "./CaseClassifications"
import CaseType from "./CaseType"
import Files from "./Files"
import Inputs from "./Inputs"

function Info() {
  return (
    <div className="space-y-6 p-4">
      <Bar />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <CaseType />
        </div>
        <div className="space-y-2">
          <CaseClassifications />
        </div>
        <div className="space-y-2">
          <Branch />
        </div>
      </div>
      <Inputs/>
      <Files/>
    </div>
  )
}

export default Info