
function Header({ page }) {
  const descriptions = {
    Dashboard: "Your parking operation at a glance",
    "Parking Slots": "Monitor every parking space",
    Vehicles: "Manage vehicle entry and exit"
  };

  return (
    <header className="header">
      <div>
        <p className="eyebrow">PARKFLOW MANAGEMENT</p>
        <h1>{page}</h1>
        <p className="header-subtitle">{descriptions[page]}</p>
      </div>

      <span className="online">
        <span className="status-dot"></span>
        System Online
      </span>
    </header>
  );
}

export default Header;
