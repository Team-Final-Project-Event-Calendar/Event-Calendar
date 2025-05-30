import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function DrawerComponent({ onLogout }) {
  const navigate = useNavigate();
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <Button variant="outline" size="xs">
          Side menu
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner padding="4">
          <Drawer.Content rounded="md">
            <Drawer.Header>
              <Drawer.Title style={{ color: "pink" }}>Side menu</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body style={{ justifyItems: "center", color: "white" }}>
              <Button
                variant="ghost"
                colorScheme="blue"
                width="100%"
                mb={2}
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
              <p>My Events</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={onLogout}>Logout</Button>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
export default DrawerComponent;
