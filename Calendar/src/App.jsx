// app.jsx
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import Authentication from "./components/Authentication/Authentication";
import Admin from "./components/Authentication/Admin/Admin";
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
import CalendarComponent from "./components/CalendarComponent/CalendarComponent";
function App() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/homepage" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>}></Route>
        <Route path="/public" element={<PublicOnlyRoute> <PublicPage /> </PublicOnlyRoute>}></Route>
        <Route path="/authentication" element={<PublicOnlyRoute> <Authentication /> </PublicOnlyRoute>}></Route>
        <Route path="/authentication/admin" element={<ProtectedRoute> <Admin /> </ProtectedRoute>}></Route>
        <Route path="/about" element={<AboutPage />}></Route>
        <Route path="/profile" element={<ProtectedRoute> <ProfilePage /> </ProtectedRoute>}></Route>
        <Route path="/myevents" element={<ProtectedRoute> <MyEventsPage /> </ProtectedRoute>}></Route>
        <Route path='/' element={<ProtectedRoute> <CalendarComponent /> </ProtectedRoute>}></Route>

      
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
