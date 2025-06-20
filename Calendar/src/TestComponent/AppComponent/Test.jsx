/**
 * @file Test.jsx
 * @description A React component that renders a test page with a navigation bar and conditional routing based on the user's sign-in status.
 */

import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CardsListComponent from "../CardsListComponent/CardsListComponent";
import NavBar from "../NavComponent/NavBar";
import HomeView from "../views/HomeView";

/**
 * @function Test
 * @description A test component that manages user sign-in state and conditionally renders content based on the sign-in status.
 * @returns {JSX.Element} The rendered Test component.
 */
function Test() {
  /**
   * @constant {boolean} isSignedIn
   * @description Tracks whether the user is signed in.
   * @default false
   */
  const [isSignedIn, setIsSignedIn] = useState(false);

  /**
   * @function handleSignIn
   * @description Toggles the user's sign-in state.
   */
  const handleSignIn = () => {
    setIsSignedIn(!isSignedIn);
  };

  return (
    <div>
      {/* Render the navigation bar with sign-in state and handler */}
      <NavBar isSignedIn={isSignedIn} onSignIn={handleSignIn} />
      <Routes>
        {/* Conditionally render content based on the sign-in status */}
        <Route
          path="/"
          element={
            isSignedIn ? <h1>Successfully signed in</h1> : <HomeView></HomeView>
          }
        ></Route>
      </Routes>
    </div>
  );
}

export default Test;