import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  ShoppingCart,
  Ticket,
  Wallet,
  BarChart3,
  Bell,
  Star,
  ClipboardList,
  UserCircle,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuGroups = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        label: "Organizer",
        path: "/admin/organizers",
        icon: Building2,
      },
      {
        label: "Concert",
        path: "/admin/concerts",
        icon: CalendarDays,
      },
      {
        label: "User",
        path: "/admin/users",
        icon: Users,
      },
      {
        label: "Order",
        path: "/admin/orders",
        icon: ShoppingCart,
      },
      {
        label: "Ticket",
        path: "/admin/tickets",
        icon: Ticket,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        label: "Settlement",
        path: "/admin/settlements",
        icon: Wallet,
      },
      {
        label: "Reports",
        path: "/admin/reports",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        label: "Notifications",
        path: "/admin/notifications",
        icon: Bell,
      },
      {
        label: "Reviews",
        path: "/admin/reviews",
        icon: Star,
      },
      {
        label: "Audit Log",
        path: "/admin/audit-log",
        icon: ClipboardList,
      },
      {
        label: "Profile",
        path: "/admin/profile",
        icon: UserCircle,
      },
    ],
  },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="
            fixed inset-0 z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen flex-col
          border-r border-white/10
          bg-[#090d18]
          transition-[width,transform]
          duration-300
          ease-in-out
          ${collapsed ? "w-[82px]" : "w-[260px]"}
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div
          className="
            flex h-[76px]
            shrink-0
            items-center
            border-b border-white/10
            px-4
          "
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className="
                flex h-10 w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-br
                from-purple-500
                to-blue-500
                shadow-lg
                shadow-purple-500/20
              "
            >
              <Ticket size={21} strokeWidth={2.2} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate text-[16px] font-bold text-white">
                  TicketHub
                </h1>

                <p
                  className="
                    text-[10px]
                    font-medium
                    uppercase
                    tracking-[0.18em]
                    text-slate-500
                  "
                >
                  Super Admin
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setMobileOpen(false)}
            className="
              rounded-lg
              p-2
              text-slate-400
              transition
              hover:bg-white/5
              hover:text-white
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        <div
          className="
            sidebar-scrollbar
            flex-1
            overflow-y-auto
            px-3
            py-5
          "
        >
          {menuGroups.map((group) => (
            <div key={group.title} className="mb-6">
              {!collapsed && (
                <p
                  className="
                    mb-2
                    px-3
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-slate-600
                  "
                >
                  {group.title}
                </p>
              )}

              {collapsed && (
                <div className="mb-3 h-px bg-white/5" />
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.path}
                      className="group relative"
                    >
                      <NavLink
                        to={item.path}
                        onClick={() => setMobileOpen(false)}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) => `
                          relative
                          flex h-11
                          items-center
                          rounded-xl
                          text-sm
                          font-medium
                          transition-all
                          duration-200
                          ${
                            isActive
                              ? `
                                bg-gradient-to-r
                                from-purple-500/20
                                to-blue-500/10
                                text-white
                                shadow-inner
                                shadow-purple-500/5
                              `
                              : `
                                text-slate-400
                                hover:bg-white/[0.04]
                                hover:text-white
                              `
                          }
                          ${
                            collapsed
                              ? "justify-center px-0"
                              : "gap-3 px-3"
                          }
                        `}
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={`
                                flex h-8 w-8
                                shrink-0
                                items-center
                                justify-center
                                rounded-lg
                                transition-all
                                duration-200
                                ${
                                  isActive
                                    ? `
                                      bg-purple-500/15
                                      text-purple-400
                                    `
                                    : `
                                      text-slate-500
                                      group-hover:text-slate-300
                                    `
                                }
                              `}
                            >
                              <Icon
                                size={18}
                                strokeWidth={2}
                              />
                            </span>

                            {!collapsed && (
                              <span className="truncate">
                                {item.label}
                              </span>
                            )}

                            {isActive && !collapsed && (
                              <span
                                className="
                                  ml-auto
                                  h-1.5 w-1.5
                                  rounded-full
                                  bg-purple-400
                                  shadow-[0_0_8px_rgba(168,85,247,0.8)]
                                "
                              />
                            )}
                          </>
                        )}
                      </NavLink>

                      {collapsed && (
                        <div
                          className="
                            pointer-events-none
                            absolute
                            left-[calc(100%+14px)]
                            top-1/2
                            z-[9999]
                            hidden
                            -translate-y-1/2
                            translate-x-[-6px]
                            whitespace-nowrap
                            rounded-lg
                            border
                            border-white/10
                            bg-[#151b2b]
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-white
                            opacity-0
                            shadow-xl
                            shadow-black/30
                            transition-all
                            duration-200
                            group-hover:translate-x-0
                            group-hover:opacity-100
                            lg:block
                          "
                        >
                          {item.label}

                          <span
                            className="
                              absolute
                              right-full
                              top-1/2
                              -translate-y-1/2
                              border-y-[5px]
                              border-r-[6px]
                              border-y-transparent
                              border-r-[#151b2b]
                            "
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div
          className="
            shrink-0
            border-t
            border-white/10
            p-3
          "
        >
          <div className="group relative">
            <button
              type="button"
              onClick={handleLogout}
              className={`
                flex h-11
                w-full
                items-center
                rounded-xl
                text-sm
                font-medium
                text-slate-400
                transition-all
                duration-200
                hover:bg-rose-500/10
                hover:text-rose-400
                ${
                  collapsed
                    ? "justify-center"
                    : "gap-3 px-3"
                }
              `}
            >
              <span
                className="
                  flex h-8 w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                "
              >
                <LogOut size={18} />
              </span>

              {!collapsed && <span>Logout</span>}
            </button>

            {collapsed && (
              <div
                className="
                  pointer-events-none
                  absolute
                  left-[calc(100%+14px)]
                  top-1/2
                  z-[9999]
                  hidden
                  -translate-y-1/2
                  translate-x-[-6px]
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-white/10
                  bg-[#151b2b]
                  px-3
                  py-2
                  text-xs
                  font-medium
                  text-white
                  opacity-0
                  shadow-xl
                  shadow-black/30
                  transition-all
                  duration-200
                  group-hover:translate-x-0
                  group-hover:opacity-100
                  lg:block
                "
              >
                Logout

                <span
                  className="
                    absolute
                    right-full
                    top-1/2
                    -translate-y-1/2
                    border-y-[5px]
                    border-r-[6px]
                    border-y-transparent
                    border-r-[#151b2b]
                  "
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          onClick={() => setCollapsed(!collapsed)}
          className="
            absolute
            -right-3
            top-[84px]
            hidden
            h-6 w-6
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            bg-[#151b2b]
            text-slate-400
            shadow-lg
            transition
            hover:text-white
            lg:flex
          "
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </aside>

      <button
        type="button"
        aria-label="Open sidebar"
        onClick={() => setMobileOpen(true)}
        className="
          fixed
          left-4
          top-4
          z-30
          flex
          h-10 w-10
          items-center
          justify-center
          rounded-xl
          border
          border-white/10
          bg-[#111827]/90
          text-slate-300
          shadow-lg
          backdrop-blur
          transition
          hover:bg-[#151b2b]
          hover:text-white
          lg:hidden
        "
      >
        <Menu size={20} />
      </button>
    </>
  );
}
