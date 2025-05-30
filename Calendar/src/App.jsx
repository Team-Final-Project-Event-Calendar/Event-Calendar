// app.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./components/Authentication/Authentication";
import Admin from "./components/Authentication/Admin/Admin";
import Home from "./components/Home";
import WeatherWidget from "./components/WeatherWidget/WeatherWidget";
import NavBar from "./components/NavComponent/NavBar";
import HomePage from "./pages/HomePage/HomePage";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/authentication" element={<Authentication />}></Route>
        <Route path="/authentication/admin" element={<Admin />}></Route>
      </Routes>

      <WeatherWidget />
    </>
  );
}

export default App;
