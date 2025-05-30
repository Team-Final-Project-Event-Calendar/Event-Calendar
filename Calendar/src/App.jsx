// app.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./components/Authentication/Authentication";
import Nav from "./components/Nav/Nav";
import Admin from "./components/Authentication/Admin/Admin";
import Home from "./components/Home";
import WeatherWidget from "./components/WeatherWidget/WeatherWidget";

function App() {
  return (
    <>
      <Nav></Nav>
      <WeatherWidget />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/authentication/authentication"
          element={<Authentication />}
        ></Route>
        <Route path="/authentication/admin" element={<Admin />}></Route>
      </Routes>
    </>
  );
}

export default App;
