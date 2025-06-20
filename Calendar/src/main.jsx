/**
 * @file main.jsx
 * @description The entry point of the React application. It sets up the root rendering, wraps the application with necessary providers, and initializes routing.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "./components/ui/provider.jsx";
import AuthProvider from "./components/Authentication/AuthContext.jsx";
import "./index.css";
import "./dark-theme.css";

/**
 * @function main
 * @description Renders the root of the React application. It wraps the application with:
 * - `StrictMode` for highlighting potential problems in the application.
 * - `AuthProvider` for managing authentication context.
 * - `Provider` for Chakra UI and color mode management.
 * - `BrowserRouter` for enabling client-side routing.
 */
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Provider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AuthProvider>
  </StrictMode>
);