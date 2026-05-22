// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TeamPage from "./pages/TeamPage";
import BoardPage from "./pages/BoardPage";
import MeetingsPage from "./pages/MeetingsPage";
import Layout from "./components/Layout";

function PrivateRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="teams/:teamId" element={<TeamPage />} />
        <Route path="teams/:teamId/board" element={<BoardPage />} />
        <Route path="teams/:teamId/meetings" element={<MeetingsPage />} />
      </Route>
    </Routes>
  );
}