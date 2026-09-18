import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  UserCog,
  X,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const statusConfig = {
  active: {
    label: "Active",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  suspended: {
    label: "Suspended",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  },
};

const roleConfig = {
  User: {
    label: "User",
    className: "bg-slate-500/10 text-slate-300",
  },
  Organizer: {
    label: "Organizer",
    className: "bg-purple-500/10 text-purple-400",
  },
  "Super Admin": {
    label: "Super Admin",
    className: "bg-cyan-500/10 text-cyan-400",
  },
};

const formatNumber = (value) =>
  new Intl.NumberFormat("id-ID").format(value);

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.active;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function RoleBadge({ role }) {
  const config = roleConfig[role] || roleConfig.User;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function AdminUsers() {
  const {
    users,
    suspendUser,
    activateUser,
    changeUserRole,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [menuId, setMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const activeUsers = users.filter(
    (user) => user.status === "active"
  ).length;

  const suspendedUsers = users.filter(
    (user) => user.status === "suspended"
  ).length;

  const organizerUsers = users.filter(
    (user) => user.role === "Organizer"
  ).length;

  const handleRoleChange = (id, role) => {
    changeUserRole(id, role);
    setMenuId(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
          <Users size={13} />
          User Management
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          User Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Kelola seluruh pengguna platform, status akun, dan hak akses
          berdasarkan role.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Users"
          value={formatNumber(users.length)}
          icon={Users}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Active Users"
          value={formatNumber(activeUsers)}
          icon={Check}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Suspended"
          value={formatNumber(suspendedUsers)}
          icon={ShieldCheck}
          iconClass="bg-rose-500/10 text-rose-400"
        />

        <StatCard
          title="Organizer"
          value={formatNumber(organizerUsers)}
          icon={UserCog}
          iconClass="bg-cyan-500/10 text-cyan-400"
        />

        <StatCard
          title="Regular User"
          value={formatNumber(
            users.filter((user) => user.role === "User").length
          )}
          icon={UserRound}
          iconClass="bg-slate-500/10 text-slate-300"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1422] p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-lg">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama atau email..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/40"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowRoleFilter(!showRoleFilter);
                  setShowStatusFilter(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-40"
              >
                {roleFilter === "all" ? "Semua Role" : roleFilter}
                <ChevronDown
                  size={15}
                  className={`transition ${
                    showRoleFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showRoleFilter && (
                <>
                  <button
                    type="button"
                    aria-label="Close role filter"
                    onClick={() => setShowRoleFilter(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />

                  <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                    {[
                      { value: "all", label: "Semua Role" },
                      { value: "User", label: "User" },
                      { value: "Organizer", label: "Organizer" },
                      { value: "Super Admin", label: "Super Admin" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setRoleFilter(item.value);
                          setShowRoleFilter(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                          roleFilter === item.value
                            ? "bg-purple-500/10 text-purple-400"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item.label}

                        {roleFilter === item.value && (
                          <Check size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowRoleFilter(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-40"
              >
                {statusFilter === "all"
                  ? "Semua Status"
                  : statusConfig[statusFilter]?.label}

                <ChevronDown
                  size={15}
                  className={`transition ${
                    showStatusFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showStatusFilter && (
                <>
                  <button
                    type="button"
                    aria-label="Close status filter"
                    onClick={() => setShowStatusFilter(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />

                  <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                    {[
                      { value: "all", label: "Semua Status" },
                      { value: "active", label: "Active" },
                      { value: "suspended", label: "Suspended" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(item.value);
                          setShowStatusFilter(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                          statusFilter === item.value
                            ? "bg-purple-500/10 text-purple-400"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item.label}

                        {statusFilter === item.value && (
                          <Check size={14} />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Semua User
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredUsers.length} user ditemukan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.015] text-left">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  User
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Role
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Status
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Joined
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-sm font-bold text-purple-400">
                          {user.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-600">
                            <Mail size={12} />
                            <span className="truncate">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={user.status} />
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs text-slate-400">
                        {user.joinedAt}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuId(
                              menuId === user.id ? null : user.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {menuId === user.id && (
                          <>
                            <button
                              type="button"
                              aria-label="Close menu"
                              onClick={() => setMenuId(null)}
                              className="fixed inset-0 z-10 cursor-default"
                            />

                            <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedUser(user);
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                              >
                                <Eye size={15} />
                                Lihat Detail
                              </button>

                              {user.status === "active" ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    suspendUser(user.id);
                                    setMenuId(null);
                                  }}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                                >
                                  <ShieldCheck size={15} />
                                  Suspend User
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    activateUser(user.id);
                                    setMenuId(null);
                                  }}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                                >
                                  <Check size={15} />
                                  Activate User
                                </button>
                              )}

                              <div className="my-1 border-t border-white/5" />

                              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                                Change Role
                              </p>

                              {["User", "Organizer"].map((role) => (
                                <button
                                  key={role}
                                  type="button"
                                  onClick={() =>
                                    handleRoleChange(user.id, role)
                                  }
                                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                                    user.role === role
                                      ? "bg-purple-500/10 text-purple-400"
                                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                                  }`}
                                >
                                  {role}

                                  {user.role === role && (
                                    <Check size={14} />
                                  )}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
                        <Users size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        User tidak ditemukan
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Coba gunakan kata kunci atau filter yang berbeda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Detail User
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Informasi akun dan hak akses pengguna
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-lg font-bold text-purple-400">
                  {selectedUser.name
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    {selectedUser.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedUser.email}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <RoleBadge role={selectedUser.role} />
                    <StatusBadge status={selectedUser.status} />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    User ID
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    #{selectedUser.id}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Joined
                  </p>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {selectedUser.joinedAt}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                    Email
                  </p>

                  <p className="mt-2 break-all text-sm font-semibold text-white">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-semibold text-slate-400">
                  Ubah Role
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {["User", "Organizer"].map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        changeUserRole(selectedUser.id, role);

                        setSelectedUser({
                          ...selectedUser,
                          role,
                        });
                      }}
                      className={`rounded-xl border px-4 py-3 text-xs font-semibold transition ${
                        selectedUser.role === role
                          ? "border-purple-500/30 bg-purple-500/10 text-purple-400"
                          : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {selectedUser.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => {
                      suspendUser(selectedUser.id);
                      setSelectedUser({
                        ...selectedUser,
                        status: "suspended",
                      });
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                  >
                    <ShieldCheck size={15} />
                    Suspend User
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      activateUser(selectedUser.id);
                      setSelectedUser({
                        ...selectedUser,
                        status: "active",
                      });
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    <Check size={15} />
                    Activate User
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}