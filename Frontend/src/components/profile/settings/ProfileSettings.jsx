import EditProfile from "../../auth/EditProfile";
import { useAuth } from "../../../store/authStore";

function ProfileSettings() {

  const currentUser = useAuth(
    (state) => state.currentUser
  );

  return (
    <EditProfile
      currentUser={currentUser}
      setEditMode={() => {}}
    />
  );
}

export default ProfileSettings;