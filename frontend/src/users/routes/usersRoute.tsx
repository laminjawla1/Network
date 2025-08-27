import { Route } from "react-router";
import SystemError from "../../errors/SystemError";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../../middlewares/ProtectedRoute";
import Logout from "../pages/Logout";
import NotFound from "../../errors/NotFound";

const usersRoute = (
  <Route path="users" errorElement={<SystemError />}>
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route
      path="logout"
      element={
        <ProtectedRoute>
          <Logout />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<NotFound />} />
  </Route>
);

export default usersRoute;
