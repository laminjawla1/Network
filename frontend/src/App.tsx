import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import usersRoute from "./users/routes/usersRoute";
import NotFound from "./errors/NotFound";
import postsRoute from "./posts/routes/postsRoute";
import ProtectedRoute from "./middlewares/ProtectedRoute";
import Root from "./layouts/Root";
import SystemError from "./errors/SystemError";
import Friends from "./pages/Friends";
import Followers from "./pages/Followers";
import Following from "./pages/Following";
import Profile from "./users/pages/Profile";
import { ToastContainer } from "react-toastify";
import ChangePassword from "./users/pages/ChangePassword";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path=""
          element={
            <ProtectedRoute>
              <Root />
            </ProtectedRoute>
          }
          errorElement={<SystemError />}
        >
          <Route path="friends" element={<Friends />} />
          <Route path="followers" element={<Followers />} />
          <Route path="following" element={<Following />} />
          <Route path=":username" element={<Profile />} />
          <Route path="users/change-password" element={<ChangePassword />} />
          {postsRoute}
          <Route path="*" element={<NotFound />} />
        </Route>
        {usersRoute}
      </>
    )
  );

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />;
    </>
  );
};

export default App;
