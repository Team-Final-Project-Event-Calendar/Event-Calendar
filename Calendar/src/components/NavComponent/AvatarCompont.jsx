import { Avatar } from "@chakra-ui/react";
import { useContext } from "react";
import { AuthContext } from "../Authentication/AuthContext";

function AvatarComponent() {
  const { user } = useContext(AuthContext);

  return (
    <Avatar.Root>
      <Avatar.Fallback name={user ? user.username : "name"} />
      <Avatar.Image
        src={
          user
            ? user.avatar
            : "https://t4.ftcdn.net/jpg/08/23/95/89/360_F_823958944_1c9covIC7Tl7eyJtWoTiXc0L4vP6f43q.jpg"
        }
      />
    </Avatar.Root>
  );
}

export default AvatarComponent;
