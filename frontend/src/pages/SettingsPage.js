import React, { useState } from "react";
import { authAPI } from "../api";
import { Button, Input, Card, toast } from "../components/common";
import { validators } from "../utils/validators";
import { useAuth } from "../context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((er) => ({ ...er, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.currentPassword)
      errs.currentPassword = "Current password is required";
    const pwErr = validators.password(form.newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (form.newPassword !== form.confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (Object.keys(errs).length) return setErrors(errs);

    setSaving(true);
    try {
      await authAPI.updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success("Password updated successfully!");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.35s ease", maxWidth: 520 }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          Settings
        </h1>
        <p style={{ color: "var(--text3)", marginTop: 4, fontSize: 13 }}>
          Manage your account preferences
        </p>
      </div>

      {/* Profile info */}
      <Card style={{ marginBottom: 20 }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Profile
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["Name", user?.name],
            ["Email", user?.email],
            ["Role", user?.role?.replace("_", " ")],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", gap: 12 }}>
              <span
                style={{
                  width: 60,
                  fontSize: 13,
                  color: "var(--text3)",
                  flexShrink: 0,
                  paddingTop: 1,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text)",
                  textTransform: label === "Role" ? "capitalize" : "none",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 16,
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Change Password
        </h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            placeholder="Enter current password"
            value={form.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
          />
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            placeholder="8-16 chars, uppercase + special character"
            value={form.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            hint="Must be 8-16 characters with at least one uppercase letter and one special character"
          />
          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter new password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <Button type="submit" loading={saving} style={{ marginTop: 4 }}>
            Update Password
          </Button>
        </form>
      </Card>
    </div>
  );
}
