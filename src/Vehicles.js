
import { useState, useEffect } from "react";
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
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadVehicles = async () => {
    try {
      const res = await api.get("/vehicles");
      setVehicles(res.data);
    } catch {
      setMessage("Unable to load vehicles. Check the backend.");
      setIsError(true);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("/vehicles/entry", form);
      setMessage(res.data.message);
      setIsError(false);
      setForm({
        plateNumber: "",
        ownerName: "",
        phone: "",
        vehicleType: "Car"
      });
      await loadVehicles();
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async (id) => {
    setMessage("");

    try {
      const res = await api.post(`/vehicles/${id}/exit`);
      setMessage(`${res.data.message} Fee: ₹${res.data.fee}`);
      setIsError(false);
      await loadVehicles();
    } catch (error) {
      setMessage(error.response?.data?.message || "Vehicle exit failed.");
      setIsError(true);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">PARKING OPERATIONS</p>
          <h2>Vehicle Management</h2>
          <p>Register vehicles and manage parking fees.</p>
        </div>
      </div>

      <div className="panel">
        <h3>🚗 Register New Vehicle</h3>

        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle Number</label>
            <input
              name="plateNumber"
              placeholder="TN 01 AB 1234"
              value={form.plateNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Owner Name</label>
            <input
              name="ownerName"
              placeholder="Enter owner name"
              value={form.ownerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
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
            {loading ? "Registering..." : "+ Park Vehicle"}
          </button>
        </form>

        {message && (
          <p className={isError ? "error" : "success"}>
            {message}
          </p>
        )}
      </div>

      <div className="panel">
        <div className="section-heading">
          <div>
            <h2>Vehicle Records</h2>
            <p>Entry details, parking status and fee collection.</p>
          </div>
          <span className="online">
            {vehicles.filter(v => v.status === "Parked").length} Parked
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Owner Details</th>
                <th>Slot</th>
                <th>Entry Time</th>
                <th>Status</th>
                <th>Parking Fee</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7">No vehicle records available.</td>
                </tr>
              ) : (
                vehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td>
                      <strong>{vehicle.plateNumber}</strong>
                      <small>{vehicle.vehicleType}</small>
                    </td>

                    <td>
                      {vehicle.ownerName}
                      <small>{vehicle.phone}</small>
                    </td>

                    <td>{vehicle.slotNumber}</td>

                    <td>
                      {new Date(vehicle.entryTime).toLocaleString()}
                    </td>

                    <td>
                      <span className={`status ${
                        vehicle.status === "Parked" ? "parked" : "exited"
                      }`}>
                        {vehicle.status}
                      </span>
                    </td>

                    <td>
                      <strong className={
                        vehicle.status === "Parked" ? "amber" : "green"
                      }>
                        {vehicle.status === "Parked"
                          ? "Pending"
                          : `₹${Number(vehicle.fee || 0)}`}
                      </strong>
                    </td>

                    <td>
                      {vehicle.status === "Parked" ? (
                        <button
                          className="exit-btn"
                          onClick={() => handleExit(vehicle.id)}
                        >
                          Exit Vehicle
                        </button>
                      ) : (
                        <span className="green">✓ Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Vehicles;
