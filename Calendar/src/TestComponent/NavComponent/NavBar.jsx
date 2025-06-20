/**
 * @file NavBar.jsx
 * @description A React component that renders a navigation bar with links, a sign-in button, or user-specific options like an avatar and a drawer menu.
 */

import React from "react";
import DrawerComponent from "./Drawer";
import AvatarComponent from "./AvatarCompont";
import { Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

/**
 * @function NavBar
 * @description Renders a navigation bar with conditional content based on the user's sign-in status.
 * @param {Object} props - The component props.
 * @param {boolean} props.isSignedIn - Indicates whether the user is signed in.
 * @param {Function} props.onSignIn - Callback function triggered when the sign-in button is clicked.
 * @returns {JSX.Element} The rendered NavBar component.
 */
function NavBar({ isSignedIn, onSignIn }) {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#5565dd",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        marginBottom: "20px",
      }}
    >
      {/* Navigation link to the About page */}
      <NavLink to="/about">About</NavLink>

      <div
        className="rightside-navbar"
        style={{ display: "flex", gap: "20px", alignItems: "center" }}
      >
        {isSignedIn ? (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            {/* Render avatar and drawer menu for signed-in users */}
            <AvatarComponent />
            <DrawerComponent onSignIn={onSignIn} />
          </div>
        ) : (
          // Render sign-in button for non-signed-in users
          <Button
            as={NavLink}
            to="/authentication/admin"
            onClick={onSignIn}
            variant="ghost"
          >
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
}

export default NavBar;