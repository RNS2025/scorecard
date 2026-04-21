import {createBrowserRouter, RouterProvider} from "react-router-dom"
import LandingPage from "./features/LandingPage.tsx";
import HomePage from "./features/HomePage.tsx";
import CreateGamePage from "./features/createGame/CreateGamePage.tsx";
import ScorecardPage from "./features/scorecard/ScorecardPage.tsx";
import SharedScorePage from "./features/scorecard/SharedScorePage.tsx";
import TvDashboardPage from "./features/dashboard/TvDashboardPage.tsx";
import DashboardList from "./features/dashboard/DashboardList.tsx";
import LeaderboardPage from "./features/leaderboard/LeaderboardPage.tsx";
import LoginPage from "./features/admin/LoginPage.tsx";
import DashboardPage from "./features/admin/dashboard/DashboardPage.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

const router = createBrowserRouter([
    { path: "/", element: <HomePage /> },
    { path: "/course", element: <LandingPage /> },
    { path: "/:courseId/creategame", element: <CreateGamePage /> },
    { path: "/:courseId/game/:gameId", element: <ScorecardPage /> },
    { path: "/:courseId/game/:gameId/score-only", element: <SharedScorePage /> },
    { path: "/:courseId/leaderboard", element: <LeaderboardPage /> },
    { path: "/dashboard", element: <DashboardList /> },
    { path: "/:courseId/dashboard", element: <TvDashboardPage /> },
    { path: "/admin", element: <LoginPage /> },
    { path: "/admin/dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App
