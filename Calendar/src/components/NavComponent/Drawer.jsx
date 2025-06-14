import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { MdEvent } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { IoIosContacts } from "react-icons/io";
import { GrMultiple } from "react-icons/gr";


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
                alignItems={"center"}
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
              }}
            >
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/profile")}
              >
                <CgProfile />Profile
              </Button>
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/contacts")}
              >
                <IoIosContacts />Contacts
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
                <GrMultiple />My Event Series
              </Button>
              <Button
                variant="ghost"
                fontSize={18}
                onClick={() => navigate("/preferences")}
              >
                <FaGear /> Preferences
              </Button>
            </Drawer.Body>

            <Drawer.Footer>
              <Button onClick={onLogout}>Logout</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="md" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
export default DrawerComponent;
