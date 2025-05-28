import React from "react";
import DrawerComponent from "./Drawer";
import AvatarComponent from "./AvatarCompont";

function NavBar() {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#5565dd",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "60vw",
          margin: "0 auto",
          alignItems: "center",
        }}
      >
        <a href="">About</a>
        <div
          className="rightside-navbar"
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          <AvatarComponent />
          <DrawerComponent />
        </div>
      </div>
    </div>
  );
}

export default NavBar;
