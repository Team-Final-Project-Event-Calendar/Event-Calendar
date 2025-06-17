import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "./components/ui/provider.jsx";
import AuthProvider from "./components/Authentication/AuthContext.jsx";
import "./index.css";
import "./dark-theme.css";

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
