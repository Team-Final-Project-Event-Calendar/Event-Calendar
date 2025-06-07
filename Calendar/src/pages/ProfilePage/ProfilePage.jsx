import ProfileDetailsComponent from "../../components/ProfileDetailsComponent/ProfileDetailsComponent";
// import { AuthContext } from "../../components/Authentication/AuthContext";
import { useContext } from "react";

function ProfilePage() {
  // const { user } = useContext(AuthContext);
  // userDetails = { user };
  return (
    <div>
      <ProfileDetailsComponent />
    </div>
  );
}

export default ProfilePage;
