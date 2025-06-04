import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard from "./pages/Dashboard";
import ShopDashboard from "./pages/ShopDashboard";

const isSubdomain = () => {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  if (parts.length >= 2 && (parts[1] === "localhost" || parts[1] === "127")) {
    return parts[0] !== "localhost" && parts[0] !== "127";
  }
  if (parts.length >= 3) {
    return true;
  }
  return false;
};

const router = createBrowserRouter(
  isSubdomain()
    ? [
        {
          path: "/*",
          element: (
            <ProtectedRoute>
              <ShopDashboard />
            </ProtectedRoute>
          ),
        },
      ]
    : [
        {
          path: "/",
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/signin",
          element: <Signin />,
        },
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "*",
          element: <Navigate to="/dashboard" replace />,
        },
      ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "14px",
          },
          success: {
            iconTheme: {
              primary: "#10B981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
