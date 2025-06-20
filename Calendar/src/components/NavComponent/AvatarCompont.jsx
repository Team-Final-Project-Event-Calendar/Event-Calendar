/**
 * @file AvatarComponent.jsx
 * @description A React component that displays the user's avatar. If the user is logged in, their avatar and username are displayed; otherwise, a default avatar is shown.
 */

import { Avatar } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../Authentication/AuthContext";
import { Navigate, Link } from "react-router-dom";

/**
 * @function AvatarComponent
 * @description Displays the user's avatar and links to the profile page. If the user is not logged in, a default avatar is displayed.
 * @returns {JSX.Element} The rendered AvatarComponent.
 */
function AvatarComponent() {
  const { user } = useContext(AuthContext);

  return (
    <Link to="profile" style={{ paddingRight: "10px" }}>
      <Avatar.Root>
        {/* Fallback avatar with the user's username or a default name */}
        <Avatar.Fallback name={user ? user.username : "name"} />
        {/* Avatar image with the user's avatar or a default image */}
        <Avatar.Image
          src={
            user
              ? user.avatar
              : "https://t4.ftcdn.net/jpg/08/23/95/89/360_F_823958944_1c9covIC7Tl7eyJtWoTiXc0L4vP6f43q.jpg"
          }
        />
      </Avatar.Root>
    </Link>
  );
}

export default AvatarComponent;