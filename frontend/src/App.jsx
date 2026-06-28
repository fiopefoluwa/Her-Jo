import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { Home } from "./pages/Home.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { CirclePage } from "./components/CirclePage.jsx";
import { CircleSettings } from "./pages/CircleSettings.jsx";
import { GroupDetails } from "./pages/GroupDetails.jsx";
import { RecordContribution } from "./pages/RecordContribution.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

function ProtectedRoute({ Component }) {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Component />;
}

const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/dashboard", element: <ProtectedRoute Component={Dashboard} /> },
  { path: "/circle/:id", element: <ProtectedRoute Component={CirclePage} /> },
  { path: "/circle/:id/settings", element: <ProtectedRoute Component={CircleSettings} /> },
  { path: "/group/:id", element: <ProtectedRoute Component={GroupDetails} /> },
  { path: "/record-contribution/:id", element: <ProtectedRoute Component={RecordContribution} /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
