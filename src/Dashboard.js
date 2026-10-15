
import { useEffect, useState } from "react";
import api from "./api";

function Dashboard() {
  const [data, setData] = useState({
    totalSlots: 0,
    occupiedSlots: 0,
    availableSlots: 0,
    activeVehicles: 0,
    revenue: 0
  });

  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then(res => setData(res.data))
      .catch(() => setError("Start the backend server first."));
  }, []);

  const cards = [
    ["Total Slots", data.totalSlots, "blue"],
    ["Occupied Slots", data.occupiedSlots, "red"],
    ["Available Slots", data.availableSlots, "green"],
    ["Vehicles Parked", data.activeVehicles, "amber"]
  ];

  return (
    <div>
      <section className="welcome">
        <p className="eyebrow">PARKING OVERVIEW</p>
        <h2>Everything parked in its place.</h2>
        <p>Monitor spaces and manage vehicle arrivals easily.</p>
      </section>

      {error && <p className="error">{error}</p>}

      <div className="section-heading">
        <div>
          <h2>Live Overview</h2>
          <p>Current parking status</p>
        </div>
        <span className="online">LIVE DATA</span>
      </div>

      <div className="stats">
        {cards.map(card => (
          <div className="stat-card" key={card[0]}>
            <p>{card[0]}</p>
            <h2 className={card[2]}>{card[1]}</h2>
          </div>
        ))}
      </div>

      <section className="revenue">
        <div>
          <p className="eyebrow">RECORDED PARKING FEES</p>
          <h2>₹{Number(data.revenue).toFixed(2)}</h2>
          <p>Fees from vehicles that have exited</p>
        </div>
        <span className="revenue-icon">₹</span>
      </section>
    </div>
  );
}

export default Dashboard;
