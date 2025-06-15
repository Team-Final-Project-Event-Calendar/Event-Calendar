// App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/contacts" element={<Contacts></Contacts>}></Route>
        <Route
          path="/authentication"
          element={
            <PublicOnlyRoute>
              <Authentication />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/preferences"
          element={
            <PreferencesPage />
          }
        />

        <Route path="/public" element={<PublicPage />} />

        <Route path="/users/:id" element={<UserProfile />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <CalendarComponent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/authentication/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myevents"
          element={
            <ProtectedRoute>
              <MyEventsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eventdetails/:id"
          element={
            <SharedRoute>
              <EventDetails />
            </SharedRoute>
          }
        />

        <Route
          path="/event-series"
          element={
            <ProtectedRoute>
              <EventSeriesPage />
            </ProtectedRoute>
          }
        />

        <Route path="/about" element={<AboutPage />} />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <CalendarComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
