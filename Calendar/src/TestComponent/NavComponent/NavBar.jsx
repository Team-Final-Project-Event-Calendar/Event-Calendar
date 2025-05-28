import React from "react";
import DrawerComponent from "./Drawer";
import AvatarComponent from "./AvatarCompont";

function NavBar() {
  const signedIn = true;

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
        {signedIn ? (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <AvatarComponent />
            <DrawerComponent />
          </div>
        ) : (
          <a href="">Sign in</a>
        )}
      </div>
    </div>
  );
}

export default NavBar;
