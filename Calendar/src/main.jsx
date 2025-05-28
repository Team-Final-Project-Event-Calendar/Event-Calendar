import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "./components/ui/provider.jsx";
import Test from "./TestComponent/AppComponent/Test.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        {/* <Test></Test> */}
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
