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
    navigate("/authentication/authentication");
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
      <a href="">About</a>
      <div
        className="rightside-navbar"
        style={{ display: "flex", gap: "20px", alignItems: "center" }}
      >
        {user?.role === "admin" && (
          <Button
            as={NavLink}
            to="/authentication/admin"
            colorScheme="purple"
            variant="outline"
            mr={4}
            fontWeight="bold"
            fontSize="lg"
            px={6}
            borderRadius="full"
            _hover={{ bg: "purple.600", color: "white" }}
          >
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
            <a onClick={() => navigate("/authentication")}>Login / Register</a>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
