import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Card, toast } from "../components/common";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data.user, data.token);
      const roleRoutes = {
        admin: "/admin/dashboard",
        user: "/user/stores",
        store_owner: "/owner/dashboard",
      };
      navigate(roleRoutes[data.user.role] || "/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: 20,
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ width: "100%", maxWidth: 420, animation: "fadeIn 0.4s ease" }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>★</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              fontWeight: 800,
              color: "var(--accent)",
            }}
          >
            StoreRate
          </h1>
          <p style={{ color: "var(--text3)", marginTop: 6, fontSize: 14 }}>
            Store Rating Platform
          </p>
        </div>

        <Card>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            Welcome back
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              size="lg"
              loading={loading}
              style={{ marginTop: 8, width: "100%" }}
            >
              Sign In
            </Button>
          </form>
        </Card>

        <p
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "var(--text3)",
            fontSize: 14,
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{ color: "var(--accent)", fontWeight: 500 }}
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
