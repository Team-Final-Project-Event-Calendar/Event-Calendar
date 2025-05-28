import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react"; 
import { AuthContext } from "./Authentication/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { isLoggedIn, logout, user } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); 
    navigate("/authentication/authentication"); 
  }
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Home Page</h1>
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
        <Button
          onClick={handleLogout}
          colorScheme="red"
          variant="solid"
          mr={4}
          fontWeight="bold"
          fontSize="lg"
          px={6}
          borderRadius="full"
          _hover={{ bg: "red.500" }} 
        >
          Logout
        </Button>
      ) : (
        <Button
          as={NavLink}
          to="/authentication/authentication"
          colorScheme="teal"
          variant="solid"
          mr={4}
          fontWeight="bold"
          fontSize="lg"
          px={6}
          borderRadius="full"
          _hover={{ bg: "teal.500" }}
        >
          Login / Register
        </Button>
      )}
    </div>
  );
}

export default Home;