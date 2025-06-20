/**
 * @file App.jsx
 * @description The main application component that defines the structure and routing for the application. It includes navigation, footer, and route protection for various pages.
 */

import { Route, Routes } from "react-router-dom";
import Authentication from "./components/Authentication/Authentication";
import Admin from "./components/Authentication/Admin/Admin";
import NavBar from "./components/NavComponent/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import AboutPage from "./pages/AboutPage/AboutPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import MyEventsPage from "./pages/MyEventsPage/MyEventsPage";
import PublicPage from "./pages/PublicPage/PublicPage";
import PublicOnlyRoute from "./components/Authentication/RoutesProtection/PublicOnlyRoute";
import ProtectedRoute from "./components/Authentication/RoutesProtection/ProtectedRoute";
import CalendarComponent from "./components/CalendarComponent/CalendarComponent";
import EventDetails from "./pages/EventDetails/EventDetails";
import Contacts from "./components/Contacts/Contacts";
import UserProfile from "./components/UserProfile/UserProfile";
import EventSeriesPage from "./components/EventSeriesForm/EventSeriesPage";
import PreferencesPage from "./pages/PreferencesPage/PreferencesPage";
import SharedRoute from "./components/Authentication/RoutesProtection/SharedRoute";
import Footer from "./components/Footer/Footer";

/**
 * @function App
 * @description The root component of the application. It sets up the navigation bar, footer, and routes for different pages with route protection.
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <div
      className="app-header-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: "100vh",
      }}
    >
      {/* Navigation bar */}
      <NavBar />

      <div
        className="app-body-container"
        style={{
          marginBottom: "100px",
          marginTop: "auto",
          minWidth: "60vw",
        }}
      >
        <Routes>
          {/* Contacts page */}
          <Route path="/contacts" element={<Contacts />} />

          {/* Authentication page (public only) */}
          <Route
            path="/authentication"
            element={
              <PublicOnlyRoute>
                <Authentication />
              </PublicOnlyRoute>
            }
          />

          {/* Preferences page */}
          <Route path="/preferences" element={<PreferencesPage />} />

          {/* Public events page */}
          <Route path="/public" element={<PublicPage />} />

          {/* User profile page */}
          <Route path="/users/:id" element={<UserProfile />} />

          {/* Calendar page (protected) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CalendarComponent />
              </ProtectedRoute>
            }
          />

          {/* Home page (protected) */}
          <Route
            path="/homepage"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          {/* Admin authentication page (protected) */}
          <Route
            path="/authentication/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Profile page (protected) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* My Events page (protected) */}
          <Route
            path="/myevents"
            element={
              <ProtectedRoute>
                <MyEventsPage />
              </ProtectedRoute>
            }
          />

          {/* Event details page (shared route) */}
          <Route
            path="/eventdetails/:id"
            element={
              <SharedRoute>
                <EventDetails />
              </SharedRoute>
            }
          />

          {/* Event series page (protected) */}
          <Route
            path="/event-series"
            element={
              <ProtectedRoute>
                <EventSeriesPage />
              </ProtectedRoute>
            }
          />

          {/* About page */}
          <Route path="/about" element={<AboutPage />} />

          {/* Fallback route (protected) */}
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <CalendarComponent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;