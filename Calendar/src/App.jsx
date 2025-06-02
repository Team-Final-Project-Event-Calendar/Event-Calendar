// app.jsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import Authentication from "./components/Authentication/Authentication";
import Admin from "./components/Authentication/Admin/Admin";
import Home from "./components/Home";
import WeatherWidget from "./components/WeatherWidget/WeatherWidget";
import NavBar from "./components/NavComponent/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import { AuthContext } from "./components/Authentication/AuthContext";
import AboutPage from "./pages/AboutPage/AboutPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MyEventsPage from "./pages/MyEventsPage/MyEventsPage";
import PublicPage from "./pages/PublicPage/PublicPage";
import PublicOnlyRoute from "./components/Authentication/RoutesProtection/PublicOnlyRoute";
import ProtectedRoute from "./components/Authentication/RoutesProtection/ProtectedRoute";

function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>}></Route>
        <Route path="/public" element={<PublicOnlyRoute> <PublicPage /> </PublicOnlyRoute>}></Route>
        <Route path="/authentication" element={<PublicOnlyRoute> <Authentication /> </PublicOnlyRoute>}></Route>
        <Route path="/authentication/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>}></Route>
        <Route path="/myevents" element={<ProtectedRoute> <MyEventsPage /> </ProtectedRoute>}></Route>

        {/* Catches-all non-existant routes and redirects them to / (HomePage) or /public (PublicPage)
         e.g. /exampleroute-asdasd */}
        <Route
          path="*"
          element={
            isLoggedIn
              ? <Navigate to="/" replace />
              : <Navigate to="/public" replace />
          }
        />
      </Routes>
    </>
  );
}

export default App;
