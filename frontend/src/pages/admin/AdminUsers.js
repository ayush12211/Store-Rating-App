import React, { useState, useEffect, useCallback } from "react";
import { adminAPI } from "../../api";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Card,
  Badge,
  RoleBadge,
  StatCard,
  toast,
} from "../../components/common";
import { validateForm } from "../../utils/validators";

const ROLE_OPTIONS = ["", "admin", "user", "store_owner"];

const initialForm = {
  name: "",
  email: "",
  address: "",
  password: "",
  role: "user",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("ASC");
  const [addModal, setAddModal] = useState(false);
  const [detailModal, setDetailModal] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = { ...filters, sortBy, sortOrder };
    adminAPI
      .getUsers(params)
      .then((res) => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"))
      .finally(() => setLoading(false));
  }, [filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === "ASC" ? "DESC" : "ASC"));
    else {
      setSortBy(field);
      setSortOrder("ASC");
    }
  };

  const handleFilterChange = (e) =>
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));

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
      password: form.password,
    });
    if (!form.role) errs.role = "Role is required";
    if (Object.keys(errs).length) return setFormErrors(errs);

    setSaving(true);
    try {
      await adminAPI.createUser(form);
      toast.success("User created successfully!");
      setAddModal(false);
      setForm(initialForm);
      fetchUsers();
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        const mapped = {};
        serverErrors.forEach((e) => {
          mapped[e.path || e.param] = e.msg;
        });
        setFormErrors(mapped);
      } else {
        toast.error(err.response?.data?.message || "Failed to create user");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetail = async (user) => {
    try {
      const { data } = await adminAPI.getUser(user.id);
      setDetailModal(data);
    } catch {
      toast.error("Failed to load user details");
    }
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
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
      key: "role",
      label: "Role",
      sortable: true,
      render: (v) => <RoleBadge role={v} />,
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => handleViewDetail(row)}>
          View
        </Button>
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
            Users
          </h1>
          <p style={{ color: "var(--text3)", marginTop: 4, fontSize: 13 }}>
            {users.length} users found
          </p>
        </div>
        <Button onClick={() => setAddModal(true)}>➕ Add User</Button>
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
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Filter by Email"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <Input
            placeholder="Filter by Address"
            name="address"
            value={filters.address}
            onChange={handleFilterChange}
          />
          <Select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="store_owner">Store Owner</option>
          </Select>
          <Button
            variant="ghost"
            onClick={() =>
              setFilters({ name: "", email: "", address: "", role: "" })
            }
          >
            Clear
          </Button>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <Table
          columns={columns}
          data={users}
          loading={loading}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          emptyMsg="No users found"
        />
      </Card>

      {/* Add User Modal */}
      <Modal
        open={addModal}
        onClose={() => {
          setAddModal(false);
          setForm(initialForm);
          setFormErrors({});
        }}
        title="Add New User"
        width={500}
      >
        <form
          onSubmit={handleAdd}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Input
            label="Full Name"
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
            placeholder="email@example.com"
            value={form.email}
            onChange={handleFormChange}
            error={formErrors.email}
          />
          <Input
            label="Address"
            name="address"
            placeholder="Full address (max 400 chars)"
            value={form.address}
            onChange={handleFormChange}
            error={formErrors.address}
          />
          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="8-16 chars, uppercase + special"
            value={form.password}
            onChange={handleFormChange}
            error={formErrors.password}
          />
          <Select
            label="Role"
            name="role"
            value={form.role}
            onChange={handleFormChange}
            error={formErrors.role}
          >
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </Select>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Button type="submit" loading={saving} style={{ flex: 1 }}>
              Create User
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

      {/* Detail Modal */}
      <Modal
        open={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="User Details"
        width={440}
      >
        {detailModal && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              ["Name", detailModal.name],
              ["Email", detailModal.email],
              ["Address", detailModal.address],
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
            <div>
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
                Role
              </div>
              <RoleBadge role={detailModal.role} />
            </div>
            {detailModal.role === "store_owner" &&
              detailModal.avgRating !== null && (
                <div>
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
                    Store Rating
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ fontSize: 22, color: "var(--accent)" }}>
                      ★
                    </span>
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {detailModal.avgRating ?? "No ratings yet"}
                    </span>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
}
