import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../modules/auth/hooks/useAuth";
import { DASHBOARD, PROJECTS, CONVERSATIONS } from "../../routes/routes";

export default function AppLayout() {
  const { user, handleLogout, isLoggingOut } = useAuth();

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Project Management</span>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to={DASHBOARD}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Dashboard
          </NavLink>

          <NavLink
            to={PROJECTS}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            Projects
          </NavLink>

          <NavLink
            to={CONVERSATIONS}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="10" r="1" fill="currentColor" />
              <circle cx="12" cy="10" r="1" fill="currentColor" />
              <circle cx="15" cy="10" r="1" fill="currentColor" />
            </svg>
            AI Assistant
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          {user?.avatar_url && (
            <img
              src={user.avatar_url}
              alt={user.name ?? "User avatar"}
              className="sidebar-avatar"
            />
          )}
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user?.name ?? "User"}</span>
            <span className="sidebar-user-email">{user?.email ?? ""}</span>
          </div>
          <button
            id="logout-btn"
            className="logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Sign out"
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
