import React, { useState, useEffect, useCallback } from "react";
import { storeAPI } from "../../api";
import {
  Button,
  Input,
  Card,
  Modal,
  StarRating,
  Badge,
  toast,
} from "../../components/common";

function StoreCard({ store, onRated }) {
  const [rateModal, setRateModal] = useState(false);
  const [rating, setRating] = useState(store.userRating || 0);
  const [hovered, setHovered] = useState(0);
  const [saving, setSaving] = useState(false);
  const isEdit = !!store.userRating;

  const handleSubmit = async () => {
    if (!rating) return toast.error("Please select a rating");
    setSaving(true);
    try {
      if (isEdit) {
        await storeAPI.updateRating(store.id, { rating });
        toast.success("Rating updated!");
      } else {
        await storeAPI.rate(store.id, { rating });
        toast.success("Rating submitted!");
      }
      setRateModal(false);
      onRated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = "var(--accent)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = "var(--border)")
        }
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 4,
              }}
            >
              {store.name}
            </h3>
            <p style={{ color: "var(--text3)", fontSize: 13 }}>
              {store.address}
            </p>
          </div>
          {store.avgRating && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                flexShrink: 0,
              }}
            >
              <span style={{ color: "var(--accent)", fontSize: 18 }}>★</span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 16,
                }}
              >
                {store.avgRating}
              </span>
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 8,
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "var(--text3)" }}>
              Your rating:
            </span>
            {store.userRating ? (
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    style={{
                      color:
                        s <= store.userRating
                          ? "var(--accent)"
                          : "var(--border)",
                      fontSize: 16,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            ) : (
              <span style={{ color: "var(--text3)", fontSize: 13 }}>
                Not rated
              </span>
            )}
          </div>
          <Button
            variant={isEdit ? "ghost" : "primary"}
            size="sm"
            onClick={() => {
              setRating(store.userRating || 0);
              setRateModal(true);
            }}
          >
            {isEdit ? "✏️ Modify" : "★ Rate"}
          </Button>
        </div>
      </Card>

      <Modal
        open={rateModal}
        onClose={() => setRateModal(false)}
        title={isEdit ? "Modify Rating" : "Rate Store"}
        width={380}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            alignItems: "center",
            padding: "8px 0",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 17,
                marginBottom: 4,
              }}
            >
              {store.name}
            </div>
            <div style={{ color: "var(--text3)", fontSize: 13 }}>
              {store.address}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(star)}
                style={{
                  fontSize: 36,
                  cursor: "pointer",
                  transition: "all 0.1s",
                  color:
                    star <= (hovered || rating)
                      ? "var(--accent)"
                      : "var(--border)",
                  transform:
                    star <= (hovered || rating) ? "scale(1.1)" : "scale(1)",
                  userSelect: "none",
                }}
              >
                ★
              </span>
            ))}
          </div>
          {rating > 0 && (
            <div style={{ color: "var(--text2)", fontSize: 14 }}>
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, width: "100%" }}>
            <Button
              onClick={handleSubmit}
              loading={saving}
              disabled={!rating}
              style={{ flex: 1 }}
            >
              {isEdit ? "Update Rating" : "Submit Rating"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setRateModal(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const fetchStores = useCallback(() => {
    setLoading(true);
    storeAPI
      .getAll({ ...search, sortBy, sortOrder })
      .then((res) => setStores(res.data))
      .catch(() => toast.error("Failed to load stores"))
      .finally(() => setLoading(false));
  }, [search, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 800,
          }}
        >
          Stores
        </h1>
        <p style={{ color: "var(--text3)", marginTop: 4, fontSize: 13 }}>
          Browse and rate registered stores
        </p>
      </div>

      {/* Search & Sort */}
      <Card style={{ marginBottom: 24, padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <Input
            placeholder="Search by name..."
            value={search.name}
            onChange={(e) => setSearch((s) => ({ ...s, name: e.target.value }))}
          />
          <Input
            placeholder="Search by address..."
            value={search.address}
            onChange={(e) =>
              setSearch((s) => ({ ...s, address: e.target.value }))
            }
          />
          <select
            style={{
              background: "var(--bg3)",
              border: "1.5px solid var(--border)",
              color: "var(--text)",
              borderRadius: "var(--radius-sm)",
              padding: "10px 14px",
              fontSize: 14,
            }}
            value={`${sortBy}:${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split(":");
              setSortBy(by);
              setSortOrder(order);
            }}
          >
            <option value="name:ASC">Name A→Z</option>
            <option value="name:DESC">Name Z→A</option>
            <option value="address:ASC">Address A→Z</option>
            <option value="createdAt:DESC">Newest First</option>
          </select>
          <Button
            variant="ghost"
            onClick={() => setSearch({ name: "", address: "" })}
          >
            Clear
          </Button>
        </div>
      </Card>

      {loading ? (
        <p style={{ color: "var(--text3)", textAlign: "center", padding: 40 }}>
          Loading stores...
        </p>
      ) : stores.length === 0 ? (
        <div
          style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏪</div>
          <p>No stores found</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRated={fetchStores} />
          ))}
        </div>
      )}
    </div>
  );
}
