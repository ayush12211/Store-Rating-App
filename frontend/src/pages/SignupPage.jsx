import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext";
import { Button, Input, Textarea, Card, toast } from "../components/common";
import { validateForm } from "../utils/validators";

export default function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((er) => ({ ...er, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(form);
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await authAPI.signup(form);
      login(data.user, data.token);
      navigate("/user/stores");
      toast.success("Account created successfully!");
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (Array.isArray(serverErrors) && serverErrors.length) {
        const mapped = {};
        serverErrors.forEach((e) => {
          mapped[e.path || e.param] = e.msg;
        });
        setErrors(mapped);
        const firstError = serverErrors[0]?.msg;
        if (firstError) toast.error(firstError);
      } else if (!err.response) {
        toast.error(
          "Cannot reach server. Make sure backend and database are running.",
        );
      } else {
        toast.error(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Registration failed",
        );
      }
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
      <div
        style={{
          position: "fixed",
          top: "10%",
          right: "15%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ width: "100%", maxWidth: 460, animation: "fadeIn 0.4s ease" }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>★</div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 26,
              fontWeight: 800,
              color: "var(--accent)",
            }}
          >
            StoreRate
          </h1>
        </div>

        <Card>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            Create your account
          </h2>
          <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 24 }}>
            Join the platform to rate stores
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <Input
              label="Full Name"
              name="name"
              placeholder="Min 20, max 60 characters"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              hint={`${form.name.length}/60 characters`}
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Textarea
              label="Address"
              name="address"
              placeholder="Your full address (max 400 characters)"
              value={form.address}
              onChange={handleChange}
              error={errors.address}
              rows={2}
              hint={`${form.address.length}/400 characters`}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="8-16 chars, uppercase + special"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              hint="Must include uppercase letter and special character"
            />
            <Button
              type="submit"
              size="lg"
              loading={loading}
              style={{ marginTop: 8, width: "100%" }}
            >
              Create Account
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
