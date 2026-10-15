
import { useEffect, useState } from "react";
import api from "./api";

function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/slots")
      .then(res => setSlots(res.data))
      .catch(() => setError("Unable to load parking slots."));
  }, []);

  const occupied = slots.filter(
    slot => slot.status === "Occupied"
  ).length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">SPACE MANAGEMENT</p>
          <h2>Parking Slots</h2>
          <p>Green = available, Red = occupied</p>
        </div>
        <p>{slots.length - occupied} available · {occupied} occupied</p>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="slot-grid">
        {slots.map(slot => (
          <div
            key={slot.id}
            className={`slot ${slot.status === "Occupied" ? "occupied" : "available"}`}
          >
            <span>{slot.status}</span>
            <h2>{slot.slotNumber}</h2>

            {slot.vehicle ? (
              <p>{slot.vehicle.plateNumber}</p>
            ) : (
              <p>Ready for a vehicle</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParkingSlots;
