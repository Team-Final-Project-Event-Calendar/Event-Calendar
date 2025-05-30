import { AuthContext } from "../../components/Authentication/AuthContext";
import { useContext } from "react";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <p>Profile Page</p>
      <button onClick={() => console.log(user)}>Log user</button>
    </div>
  );
}

export default ProfilePage;
