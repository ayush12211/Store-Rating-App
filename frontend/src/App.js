import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/common";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";

// Pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import UserStores from "./pages/user/UserStores";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import SettingsPage from "./pages/SettingsPage";

// Spin animation for loading buttons
const spinStyle = document.createElement("style");
spinStyle.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);

function RoleRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const map = {
    admin: "/admin/dashboard",
    user: "/user/stores",
    store_owner: "/owner/dashboard",
  };
  return <Navigate to={map[user.role] || "/login"} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/" element={<RoleRedirect />} />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Layout>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute roles={["admin"]}>
            <Layout>
              <AdminStores />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Normal User */}
      <Route
        path="/user/stores"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout>
              <UserStores />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/settings"
        element={
          <ProtectedRoute roles={["user"]}>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Store Owner */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute roles={["store_owner"]}>
            <Layout>
              <OwnerDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/owner/settings"
        element={
          <ProtectedRoute roles={["store_owner"]}>
            <Layout>
              <SettingsPage />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <ToastProvider />
      </AuthProvider>
    </BrowserRouter>
  );
}
