import React, { useContext } from "react";
import DrawerComponent from "./Drawer";
import AvatarComponent from "./AvatarCompont";
import { Button } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthContext";

function NavBar() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/authentication");
  };

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
      <div
        style={{
          width: "60vw",
          display: "flex",
          justifyContent: "space-between",
          margin: "0 auto",
        }}
      >
        <Button variant="ghost" onClick={() => navigate("/")}>
          Home
        </Button>
        <div
          className="rightside-navbar "
          style={{ display: "flex", gap: "20px", alignItems: "center" }}
        >
          {user?.role === "admin" && (
            <Button as={NavLink} to="/authentication/admin" variant="ghost">
              Admin Panel
            </Button>
          )}
          {isLoggedIn ? (
            <>
              <AvatarComponent />
              <DrawerComponent onLogout={handleLogout} />
            </>
          ) : (
            <>
              <a onClick={() => navigate("/authentication")}>
                Login / Register
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
