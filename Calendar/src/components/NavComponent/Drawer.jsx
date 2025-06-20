/**
 * @file DrawerComponent.jsx
 * @description A React component that renders a user panel inside a drawer. The panel includes navigation buttons for various sections of the application and a logout button.
 */

import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { MdEvent } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosContacts } from "react-icons/io";
import { GrMultiple } from "react-icons/gr";
import { MdOutlineInfo } from "react-icons/md";

/**
 * @function DrawerComponent
 * @description Renders a user panel inside a drawer with navigation buttons and a logout option.
 * @param {Object} props - The component props.
 * @param {Function} props.onLogout - Callback function triggered when the logout button is clicked.
 * @returns {JSX.Element} The rendered DrawerComponent.
 */
function DrawerComponent({ onLogout }) {
  const navigate = useNavigate();
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="ghost" size="sm" fontSize="17px" padding={2}>
          Menu ≡
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner padding="7vh 8vw">
          <Drawer.Content rounded="md" maxH="70vh">
            <Drawer.Header>
              <Drawer.Title
                alignItems={"flex-start"}
                display="flex"
                justifyContent="center"
              >
                <span
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "wheat",
                    backgroundColor: "#242124",
                    borderRadius: 10,
                    padding: "3px 62px",
                  }}
                >
                  {" "}
                  User Panel{" "}
                </span>
              </Drawer.Title>
            </Drawer.Header>

            <Drawer.Body
              style={{
                justifyItems: "center",
                color: "white",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                marginLeft: "20px",
              }}
            >
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/profile")}
              >
                <CgProfile />
                Profile
              </Button>
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/contacts")}
              >
                <IoIosContacts />
                Contacts
              </Button>
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/myevents")}
              >
                <MdEvent /> My Events
              </Button>
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/event-series")}
              >
                <GrMultiple />
                My Event Series
              </Button>
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/preferences")}
              >
                <FaGear /> Preferences
              </Button>
               <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/about")}
              >
                <MdOutlineInfo /> About
              </Button>

            </Drawer.Body>

            <Drawer.Footer>
              <Button onClick={onLogout}>Logout</Button>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
export default DrawerComponent;
