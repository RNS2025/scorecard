import {Route, Routes} from "react-router-dom"
import LandingPage from "./features/LandingPage.tsx";
import CreateGamePage from "./features/createGame/CreateGamePage.tsx";
import ScorecardPage from "./features/scorecard/ScorecardPage.tsx";
import LeaderboardPage from "./features/leaderboard/LeaderboardPage.tsx";
import LoginPage from "./features/admin/LoginPage.tsx";
import DashboardPage from "./features/admin/dashboard/DashboardPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";


function App() {

  return (
      <Routes>
          <Route index path="/" element={<LandingPage />} />

          <Route path="/:courseId/creategame" element={<CreateGamePage />} />
          <Route path="/:courseId/game/:gameId" element={<ScorecardPage />} />
          <Route path="/:courseId/leaderboard" element={<LeaderboardPage />} />

          <Route path="/admin" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                  <DashboardPage />
              </ProtectedRoute>
          } />
      </Routes>
  )
}

export default App
