import React, { useState, useEffect } from "react";
import { ownerAPI } from "../../api";
import { Card, StatCard, Table, toast } from "../../components/common";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  useEffect(() => {
    ownerAPI
      .getDashboard()
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === "ASC" ? "DESC" : "ASC"));
    else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const sortedUsers = data?.ratingUsers
    ? [...data.ratingUsers].sort((a, b) => {
        const valA = a[sortBy] ?? "";
        const valB = b[sortBy] ?? "";
        const cmp = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
        });
        return sortOrder === "ASC" ? cmp : -cmp;
      })
    : [];

  const columns = [
    { key: "name", label: "User Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "rating",
      label: "Rating",
      sortable: true,
      render: (v) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                style={{
                  color: s <= v ? "var(--accent)" : "var(--border)",
                  fontSize: 15,
                }}
              >
                ★
              </span>
            ))}
          </div>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{v}</span>
        </div>
      ),
    },
    {
      key: "submittedAt",
      label: "Date",
      sortable: true,
      render: (v) => (
        <span style={{ color: "var(--text3)", fontSize: 13 }}>
          {new Date(v).toLocaleDateString()}
        </span>
      ),
    },
  ];

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
          Store Dashboard
        </h1>
        <p style={{ color: "var(--text3)", marginTop: 4, fontSize: 14 }}>
          {data?.store ? data.store.name : "Loading..."}
        </p>
      </div>

      {loading ? (
        <p style={{ color: "var(--text3)" }}>Loading dashboard...</p>
      ) : !data?.store ? (
        <Card>
          <p
            style={{ color: "var(--text3)", textAlign: "center", padding: 20 }}
          >
            No store is assigned to your account. Contact an administrator.
          </p>
        </Card>
      ) : (
        <>
          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginBottom: 28,
            }}
          >
            <StatCard
              icon="★"
              label="Average Rating"
              value={data.store.avgRating ?? "N/A"}
              color="var(--accent)"
            />
            <StatCard
              icon="👥"
              label="Total Ratings"
              value={data.ratingUsers.length}
              color="var(--blue)"
            />
          </div>

          {/* Store Info */}
          <Card style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Store Information
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 14,
              }}
            >
              {[
                ["Name", data.store.name],
                ["Email", data.store.email],
                ["Address", data.store.address],
              ].map(([label, value]) => (
                <div key={label}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ color: "var(--text)", fontSize: 14 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Rating distribution */}
          {data.ratingUsers.length > 0 && (
            <Card style={{ marginBottom: 24 }}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 16,
                }}
              >
                Rating Distribution
              </h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = data.ratingUsers.filter(
                    (r) => r.rating === star,
                  ).length;
                  const pct = data.ratingUsers.length
                    ? Math.round((count / data.ratingUsers.length) * 100)
                    : 0;
                  return (
                    <div
                      key={star}
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span
                        style={{
                          color: "var(--accent)",
                          fontSize: 16,
                          width: 20,
                        }}
                      >
                        ★
                      </span>
                      <span
                        style={{
                          width: 14,
                          fontSize: 13,
                          color: "var(--text2)",
                        }}
                      >
                        {star}
                      </span>
                      <div
                        style={{
                          flex: 1,
                          height: 8,
                          background: "var(--bg3)",
                          borderRadius: 4,
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: "var(--accent)",
                            borderRadius: 4,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          width: 36,
                          fontSize: 12,
                          color: "var(--text3)",
                          textAlign: "right",
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Ratings Table */}
          <Card style={{ padding: 0 }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                User Ratings
              </h2>
            </div>
            <Table
              columns={columns}
              data={sortedUsers}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
              emptyMsg="No ratings submitted yet"
            />
          </Card>
        </>
      )}
    </div>
  );
}
