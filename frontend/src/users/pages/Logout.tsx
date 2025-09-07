import { Navigate } from "react-router";
import { clearLocalStorageExcept } from "../../utils/localStorage";

const Logout = () => {
  clearLocalStorageExcept([]);
  return (
    <Navigate to="/users/login" state={{ message: "Logout successful" }} />
  );
};

export default Logout;
