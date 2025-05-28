import React from "react";
import DrawerComponent from "./Drawer";

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
      <div className="logo-container"></div>
      <DrawerComponent />
    </div>
  );
}

export default NavBar;
