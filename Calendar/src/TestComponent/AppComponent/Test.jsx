import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CardsListComponent from "../CardsListComponent/CardsListComponent";
import NavBar from "../NavComponent/NavBar";
import HomeView from "../views/HomeView";

function Test() {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignIn = () => {
    setIsSignedIn(!isSignedIn);
  };

  return (
    <div>
      <NavBar isSignedIn={isSignedIn} onSignIn={handleSignIn} />
      <Routes>
        <Route path="/" element={<HomeView></HomeView>}></Route>
      </Routes>
    </div>
  );
}

export default Test;
