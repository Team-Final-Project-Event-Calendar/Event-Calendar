/**
 * @file Drawer.jsx
 * @description A React component that renders a side menu using Chakra UI's Drawer component. The menu includes a header, body, and footer with options for navigation and logout.
 */

import { Button, CloseButton, Drawer, Portal } from "@chakra-ui/react";

/**
 * @function DrawerComponent
 * @description Renders a side menu with navigation options and a logout button.
 * @param {Object} props - The component props.
 * @param {Function} props.onSignIn - Callback function triggered when the logout button is clicked.
 * @returns {JSX.Element} The rendered DrawerComponent.
 */
function DrawerComponent({ onSignIn }) {
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
              <p style={{ paddingBottom: "30px" }}>Profile</p>
              <p>My Events</p>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={onSignIn}>Logout</Button>
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