import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { Home } from "./pages/Home.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { CirclePage } from "./components/CirclePage.jsx";
import { GroupDetails } from "./pages/GroupDetails.jsx";
import { RecordContribution } from "./pages/RecordContribution.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";


export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Home,
    },
    {
      path: "/dashboard",
      Component: Dashboard,
    },
    {
      path: "/circle/:id",
      Component: CirclePage,
    },
    {
      path: "/group/:id",
      Component: GroupDetails,
    },
    {
      path: "/record-contribution/:id",
      Component: RecordContribution,
    },
    {
      path: "/login",
      Component: Login,
    },
    {
      path: "/register",
      Component: Register,
    }
  ]);

  return <RouterProvider router={router} />;
}

