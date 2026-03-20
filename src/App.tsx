import {Route, Routes} from "react-router-dom"
import LandingPage from "./features/LandingPage.tsx";
import CreateGamePage from "./features/createGame/CreateGamePage.tsx";
import ScorecardPage from "./features/scorecard/ScorecardPage.tsx";


function App() {

  return (
      <Routes>
          <Route index path="/" element={<LandingPage />} />

          <Route path="/:courseId/creategame" element={<CreateGamePage />} />
          <Route path="/:courseId/game/:gameId" element={<ScorecardPage />} />
      </Routes>
  )
}

export default App
