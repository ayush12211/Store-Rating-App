import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>★</div>
          <div style={{ color: "var(--text3)", fontSize: 14 }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    const roleRoutes = {
      admin: "/admin/dashboard",
      user: "/user/stores",
      store_owner: "/owner/dashboard",
    };
    return <Navigate to={roleRoutes[user.role] || "/login"} replace />;
  }

  return children;
}
