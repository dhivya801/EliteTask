import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>ParkFlow <span>●</span></h3>
        <p>Smart parking. Smooth journeys.</p>
      </div>
      <div className="footer-right">
        <span>● System Operational</span>
        <p>© {new Date().getFullYear()} ParkFlow Management</p>
      </div>
    </footer>
  );
}

export default Footer;