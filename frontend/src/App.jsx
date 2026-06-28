import { RouterProvider, createBrowserRouter, Navigate, useRouteError, Link } from "react-router-dom";
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
import { InvitePage } from "./pages/InvitePage.jsx";

function RootError() {
  const error = useRouteError();
  const status = error?.status ?? error?.statusCode;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-5xl font-bold text-primary mb-4">{status === 404 ? "404" : "Oops"}</p>
      <p className="text-muted-foreground mb-6">
        {status === 404 ? "Page not found." : "Something went wrong."}
      </p>
      <Link to="/" className="text-sm text-primary underline">Go home</Link>
    </div>
  );
}

function ProtectedRoute({ Component }) {
  const user = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Component />;
}

const router = createBrowserRouter([
  { path: "/", Component: Home, errorElement: <RootError /> },
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/invite/:token", Component: InvitePage },
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
