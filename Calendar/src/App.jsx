import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Authentication from "./components/Account/Authentication";
import Nav from "./components/Nav/Nav";

function App() {
  return (
    <>
      <Nav></Nav>
      <h2>hui</h2>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route
          path="/account/authentication"
          element={<Authentication />}
        ></Route>
      </Routes>
    </>
  );
}

export default App;
