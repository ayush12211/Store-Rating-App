import React, { useState, useEffect } from "react";
import { adminAPI } from "../../api";
import { StatCard, Card, toast } from "../../components/common";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getDashboard()
      .then((res) => setStats(res.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 26,
            fontWeight: 800,
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--text3)", marginTop: 4, fontSize: 14 }}>
          Platform overview at a glance
        </p>
      </div>

      {loading ? (
        <p style={{ color: "var(--text3)" }}>Loading stats...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          <StatCard
            icon="👥"
            label="Total Users"
            value={stats?.totalUsers}
            color="var(--blue)"
          />
          <StatCard
            icon="🏪"
            label="Total Stores"
            value={stats?.totalStores}
            color="var(--green)"
          />
          <StatCard
            icon="★"
            label="Total Ratings"
            value={stats?.totalRatings}
            color="var(--accent)"
          />
        </div>
      )}

      <div
        style={{
          marginTop: 36,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {[
          {
            icon: "➕",
            title: "Add New User",
            desc: "Create admin, user, or store owner accounts",
            href: "#add-user",
          },
          {
            icon: "🏪",
            title: "Manage Stores",
            desc: "Add and view all registered stores",
            href: "#stores",
          },
          {
            icon: "📊",
            title: "View All Users",
            desc: "Browse, filter and inspect user details",
            href: "#users",
          },
        ].map((item) => (
          <Card
            key={item.title}
            style={{ cursor: "pointer", transition: "border-color 0.2s" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 15,
                marginBottom: 4,
              }}
            >
              {item.title}
            </div>
            <div style={{ color: "var(--text3)", fontSize: 13 }}>
              {item.desc}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
