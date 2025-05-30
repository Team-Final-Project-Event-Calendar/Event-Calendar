import React from "react";
import DrawerComponent from "./Drawer";
import AvatarComponent from "./AvatarCompont";
import { Button } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

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
      <a href="">About</a>
      <div
        className="rightside-navbar"
        style={{ display: "flex", gap: "20px", alignItems: "center" }}
      >
        {isSignedIn ? (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <AvatarComponent />
            <DrawerComponent onSignIn={onSignIn} />
          </div>
        ) : (
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
