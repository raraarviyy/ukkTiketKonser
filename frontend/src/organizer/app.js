import React, { useState, Component } from "react";
import OrganizerSidebar, {
  OrganizerMobileToggle,
} from "./components/OrganizerSidebar";
import { OrganizerProvider } from "./context/OrganizerContext";
import OrganizerDashboard from "./dashboard/index";
import OrganizerEvents from "./events/index";
import OrganizerRevenue from "./revenue/index";
import OrganizerReviews from "./reviews/index";
import OrganizerProfile from "./profile/index";
import { THEME } from "../theme";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, color: "red", background: "#111", height: "100vh", paddingTop: 100 }}>
          <h2>Waduh, ada error di halaman ini:</h2>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function OrganizerLayout() {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  const renderPage = () => {
    if (activePage === "dashboard") return <OrganizerDashboard />;
    if (activePage === "events") return <OrganizerEvents />;
    if (activePage === "revenue") return <OrganizerRevenue />;
    if (activePage === "reviews") return <OrganizerReviews />;
    if (activePage === "profile") return <OrganizerProfile />;
    return <OrganizerDashboard />;
  };

  return (
    <div
      style={{
        backgroundColor: THEME.bg,
        color: THEME.text,
        minHeight: "100vh",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: ${THEME.bg}; }
        
        .org-main {
          flex: 1;
          min-width: 0;
          padding: 32px;
          transition: padding-left 0.3s ease;
          min-height: 100vh;
        }

        /* Untuk Desktop: Beri jarak kiri sebesar lebar sidebar (260px) */
        @media (min-width: 901px) {
          .org-main { padding-left: 292px; } /* 260px sidebar + 32px padding */
        }

        /* Untuk HP/Tablet: Beri jarak atas karena ada tombol menu */
        @media (max-width: 900px) {
          .org-main { padding-top: 80px; padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      <OrganizerSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="org-main">
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <OrganizerMobileToggle onOpen={() => setMobileOpen(true)} />
          <span style={{ fontSize: "0.85rem", color: THEME.muted, fontWeight: 600 }}>
            Panel Organizer Auralis
          </span>
        </div>

        <ErrorBoundary>
          {renderPage()}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function OrganizerApp() {
  return (
    <OrganizerProvider>
      <OrganizerLayout />
    </OrganizerProvider>
  );
}