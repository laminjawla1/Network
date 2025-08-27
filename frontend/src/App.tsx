import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import usersRoute from "./users/routes/usersRoute";
import NotFound from "./errors/NotFound";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {usersRoute}
        <Route path="*" element={<NotFound />} />
      </>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
