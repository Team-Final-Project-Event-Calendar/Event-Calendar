import ProfileDetailsComponent from "../../components/ProfileDetailsComponent/ProfileDetailsComponent";
import { AuthContext } from "../../components/Authentication/AuthContext";
import { useContext } from "react";

function ProfilePage() {
  const { user } = useContext(AuthContext);
  console.log(user);

  return (
    <div>
      <ProfileDetailsComponent userDetails={user} />
    </div>
  );
}

export default ProfilePage;
