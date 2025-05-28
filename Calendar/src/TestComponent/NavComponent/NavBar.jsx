import React from "react";
import DrawerComponent from "./Drawer";

function NavBar() {
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "yellow",
        justifyContent: "space-between",
        padding: "20px",
      }}
    >
      <DrawerComponent />
    </div>
  );
}

export default NavBar;
