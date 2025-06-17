import React, { useContext } from "react";
import DrawerComponent from "./Drawer";
import AvatarComponent from "./AvatarCompont";
import { Button } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../Authentication/AuthContext";
import Searchbar from "../Searchbar/Searchbar";
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import CalendarComponent from "../CalendarComponent/CalendarComponent";
import { useColorMode } from "../ui/color-mode";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import "./NavLink.css";

function NavBar() {
  const { colorMode, toggleColorMode } = useColorMode("light");

  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/authentication");
  };

    const handleHomeClick = () => {
    // Clear any search results when clicking home
    window.dispatchEvent(new CustomEvent('homepageClearSearch'));
    window.dispatchEvent(new CustomEvent('clearNavSearch'));
    
    // Then navigate to homepage
    navigate("/homepage");
  };

  return (
    <div
      style={{
        display: "flex",
        backgroundColor: "#5565dd",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px 20px",
        // marginBottom: "20px",
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
              onClick={handleHomeClick}
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
          
        </div>

        {/* Right Side Navbar */}
        <div
          className="rightside-navbar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "5px",
          }}
        >  <Button
            as={NavLink}
            to="/"
            variant="ghost"
            fontSize="18px"
            marginRight = "6vw"
          >
            My Calendar
          </Button>
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
          <button
            onClick={toggleColorMode}
            style={{
              padding: "10px",
              fontSize: "20px",
              color: "whtie",
              backgroundColor: "transparent",
            }}
          >
            {colorMode === "light" ? <IoMoon /> : <LuSun />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
