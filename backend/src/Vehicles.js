
import { useEffect, useState } from "react";
import api from "./api";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    plateNumber: "",
    ownerName: "",
    phone: "",
    vehicleType: "Car"
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function loadVehicles() {
    api.get("/vehicles")
      .then(res => setVehicles(res.data))
      .catch(() => setError("Unable to load vehicles."));
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/vehicles/entry", form);
      setMessage(res.data.message);
      setForm({
        plateNumber: "",
        ownerName: "",
        phone: "",
        vehicleType: "Car"
      });
      await loadVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Entry failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExit(id) {
    setMessage("");
    setError("");

    try {
      const res = await api.post(`/vehicles/${id}/exit`);
      setMessage(`${res.data.message} Fee: ₹${res.data.fee}`);
      await loadVehicles();
    } catch (err) {
      setError(err.response?.data?.message || "Exit failed.");
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">VEHICLE REGISTER</p>
          <h2>Vehicle Management</h2>
          <p>Register arrivals and record exits.</p>
        </div>
      </div>

      <section className="panel">
        <h3>Register Vehicle Entry</h3>

        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle Number</label>
            <input
              name="plateNumber"
              value={form.plateNumber}
              onChange={handleChange}
              placeholder="TN 01 AB 1234"
              required
            />
          </div>

          <div className="form-group">
            <label>Owner Name</label>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Enter owner name"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
            >
              <option>Car</option>
              <option>Bike</option>
              <option>SUV</option>
              <option>Van</option>
              <option>Truck</option>
            </select>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Register Vehicle"}
          </button>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>

      <section className="panel">
        <h3>Vehicle Records</h3>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Owner</th>
                <th>Slot</th>
                <th>Entry Time</th>
                <th>Status</th>
                <th>Fee</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7">No vehicles registered yet.</td>
                </tr>
              ) : vehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>
                    {vehicle.plateNumber}
                    <small>{vehicle.vehicleType}</small>
                  </td>
                  <td>{vehicle.ownerName}</td>
                  <td>{vehicle.slotNumber}</td>
                  <td>{new Date(vehicle.entryTime).toLocaleString()}</td>
                  <td>
                    <span className={`status ${vehicle.status === "Parked" ? "parked" : "exited"}`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td>₹{Number(vehicle.fee || 0).toFixed(2)}</td>
                  <td>
                    {vehicle.status === "Parked" ? (
                      <button
                        className="exit-btn"
                        onClick={() => handleExit(vehicle.id)}
                      >
                        Record Exit
                      </button>
                    ) : "Completed"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Vehicles;
