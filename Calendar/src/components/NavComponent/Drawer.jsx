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
            <Drawer.Body
              style={{
                justifyItems: "center",
                color: "white",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Button variant="ghost" onClick={() => navigate("/profile")}>
                Profile
              </Button>
              <Button variant="ghost" onClick={() => navigate("/myevents")}>
                My Events
              </Button>
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
