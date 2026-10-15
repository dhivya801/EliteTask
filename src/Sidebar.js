
const menuItems = [
  { name: "Dashboard", icon: "▦" },
  { name: "Parking Slots", icon: "▤" },
  { name: "Vehicles", icon: "🚗" }
];

function Sidebar({ page, setPage }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-logo">P</div>
        <div>
          <h2>ParkFlow</h2>
          <p>SMART PARKING</p>
        </div>
      </div>

      <p className="sidebar-label">WORKSPACE</p>

      <nav className="menu">
        {menuItems.map(item => (
          <button
            key={item.name}
            className={`menu-item ${page === item.name ? "active" : ""}`}
            onClick={() => setPage(item.name)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.name}</span>
            {page === item.name && <span className="arrow">›</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <span className="status-dot"></span>
        <div>
          <strong>Live system</strong>
          <p>Parking management</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
