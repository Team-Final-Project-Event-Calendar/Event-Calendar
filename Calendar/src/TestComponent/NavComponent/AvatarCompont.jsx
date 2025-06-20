/**
 * @file AvatarComponent.jsx
 * @description A React component that renders an avatar with a fallback name and an image using Chakra UI's Avatar component.
 */

import { Avatar } from "@chakra-ui/react";

/**
 * @function AvatarComponent
 * @description Displays an avatar with a fallback name and an image.
 * @returns {JSX.Element} The rendered AvatarComponent.
 */
function AvatarComponent() {
  return (
    <Avatar.Root>
      <Avatar.Fallback name="Segun Adebayo" />
      <Avatar.Image src="https://bit.ly/sage-adebayo" />
    </Avatar.Root>
  );
}

export default AvatarComponent;