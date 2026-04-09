import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../api";
import {
  Table,
  Button,
  Input,
  Modal,
  Card,
  StarRating,
  toast,
} from "../../components/common";
import { validateForm } from "../../utils/validators";

const initialForm = { name: "", email: "", address: "", ownerId: "" };

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: "", email: "", address: "" });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [addModal, setAddModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchStores = useCallback(() => {
    setLoading(true);
    adminAPI
      .getStores({ ...filters, sortBy, sortOrder })
      .then((res) => setStores(res.data))
      .catch(() => toast.error("Failed to load stores"))
      .finally(() => setLoading(false));
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === "ASC" ? "DESC" : "ASC"));
    else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleFormChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (formErrors[e.target.name])
      setFormErrors((er) => ({ ...er, [e.target.name]: null }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const errs = validateForm({
      name: form.name,
      email: form.email,
      address: form.address,
    });
    if (Object.keys(errs).length) return setFormErrors(errs);

    setSaving(true);
    try {
      await adminAPI.createStore(form);
      toast.success("Store created successfully!");
      setAddModal(false);
      setForm(initialForm);
      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create store");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "name", label: "Store Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "address",
      label: "Address",
      sortable: true,
      render: (v) => (
        <span
          title={v}
          style={{
            maxWidth: 200,
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {v}
        </span>
      ),
    },
    {
      key: "avgRating",
      label: "Rating",
      sortable: false,
      render: (v) =>
        v ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "var(--accent)", fontSize: 16 }}>★</span>
            <span style={{ fontWeight: 600 }}>{v}</span>
          </div>
        ) : (
          <span style={{ color: "var(--text3)", fontSize: 13 }}>
            No ratings
          </span>
        ),
    },
  ];

  return (
    <div style={{ animation: "fadeIn 0.35s ease" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
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
            {stores.length} stores registered
          </p>
        </div>
        <Button onClick={() => setAddModal(true)}>➕ Add Store</Button>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <Input
            placeholder="Filter by Name"
            name="name"
            value={filters.name}
            onChange={(e) =>
              setFilters((f) => ({ ...f, name: e.target.value }))
            }
          />
          <Input
            placeholder="Filter by Email"
            name="email"
            value={filters.email}
            onChange={(e) =>
              setFilters((f) => ({ ...f, email: e.target.value }))
            }
          />
          <Input
            placeholder="Filter by Address"
            name="address"
            value={filters.address}
            onChange={(e) =>
              setFilters((f) => ({ ...f, address: e.target.value }))
            }
          />
          <Button
            variant="ghost"
            onClick={() => setFilters({ name: "", email: "", address: "" })}
          >
            Clear
          </Button>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <Table
          columns={columns}
          data={stores}
          loading={loading}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          emptyMsg="No stores found"
        />
      </Card>

      {/* Add Store Modal */}
      <Modal
        open={addModal}
        onClose={() => {
          setAddModal(false);
          setForm(initialForm);
          setFormErrors({});
        }}
        title="Add New Store"
        width={480}
      >
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Input
            label="Store Name"
            name="name"
            placeholder="Min 20, max 60 characters"
            value={form.name}
            onChange={handleFormChange}
            error={formErrors.name}
            hint={`${form.name.length}/60`}
          />
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="store@example.com"
            value={form.email}
            onChange={handleFormChange}
            error={formErrors.email}
          />
          <Input
            label="Address"
            name="address"
            placeholder="Full store address (max 400 chars)"
            value={form.address}
            onChange={handleFormChange}
            error={formErrors.address}
          />
          <Input
            label="Owner ID (optional)"
            name="ownerId"
            placeholder="User ID of store owner"
            value={form.ownerId}
            onChange={handleFormChange}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button type="submit" loading={saving} style={{ flex: 1 }}>
              Create Store
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setAddModal(false)}
              style={{ flex: 1 }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
