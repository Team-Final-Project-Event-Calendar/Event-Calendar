/**
 * @file ProfilePage.jsx
 * @description A React component that renders the profile page, displaying the user's profile details using the `ProfileDetailsComponent`.
 */

import ProfileDetailsComponent from "../../components/ProfileDetailsComponent/ProfileDetailsComponent";
// import { AuthContext } from "../../components/Authentication/AuthContext";
import { useContext } from "react";

/**
 * @function ProfilePage
 * @description Displays the profile page with the user's profile details.
 * @returns {JSX.Element} The rendered ProfilePage component.
 */
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