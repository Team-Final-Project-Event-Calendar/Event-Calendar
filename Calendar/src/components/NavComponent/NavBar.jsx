import React, { useContext } from "react";
import DrawerComponent from "./Drawer";
import AvatarComponent from "./AvatarCompont";
import { Button } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthContext";
import Searchbar from "../Searchbar/Searchbar";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import CalendarComponent from "../CalendarComponent/CalendarComponent";
import "./NavLink.css";
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
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 20px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "60vw",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        {/* Left Side Navbar */}
        <div
          className="leftSide-navbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "10px",
          }}
        >
          <span>
            <WeatherWidget />
          </span>
          <span>
            <Button
              variant="ghost"
              fontSize="19px"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </span>
        </div>

        {/* Center Side Navbar */}
        <div
          className="centerSide-navbar"
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Searchbar />
          <Button as={NavLink} to="/calendarcomponent" variant="ghost">
            Calendar
          </Button>
        </div>

        <Button as={NavLink} to="/calendarcomponent" variant="ghost">
          Calendar</Button>
      </div>
      <div
        className="rightside-navbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: "0 0 auto",
          gap: "5px",
        }}
      >
        {user?.role === "admin" && (
          <Button as={NavLink} to="/authentication/admin" variant="ghost">
            Admin Panels
          </Button>
        )}
        {isLoggedIn ? (
          <>
            <AvatarComponent />
            <DrawerComponent onLogout={handleLogout} />
          </>
        ) : (
          <>
            <a
              className="login-register"
              onClick={() => navigate("/authentication")}
            >
              Login / Register
            </a>
          </>
        )}
      </div>

      <div >
      </div>
    </div>
  );
}

export default NavBar;
