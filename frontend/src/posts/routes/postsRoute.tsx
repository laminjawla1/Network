import { Route } from "react-router";
import SystemError from "../../errors/SystemError";
import ProtectedRoute from "../../middlewares/ProtectedRoute";
import Posts from "../pages/Posts";
import NotFound from "../../errors/NotFound";

const postsRoute = (
  <Route path="/" errorElement={<SystemError />}>
    <Route
      index
      element={
        <ProtectedRoute>
          <Posts />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Route>
);

export default postsRoute;
