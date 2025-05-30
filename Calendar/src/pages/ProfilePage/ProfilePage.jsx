import ProfileDetailsComponent from "../../components/ProfileDetailsComponent/ProfileDetailsComponent";
import { AuthContext } from "../../components/Authentication/AuthContext";
import { useContext } from "react";

function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <p>Profile Page</p>

      <ProfileDetailsComponent userDetails={user} />
    </div>
  );
}

export default ProfilePage;
