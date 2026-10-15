
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const file = path.join(__dirname, "data", "parkingData.json");

app.use(cors());
app.use(express.json());

function readData() {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function saveData(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.json({ message: "Parking backend is running" });
});

app.get("/api/dashboard", (req, res) => {
  const data = readData();
  const totalSlots = data.slots.length;
  const occupiedSlots = data.slots.filter(
    s => s.status === "Occupied"
  ).length;

  const availableSlots = totalSlots - occupiedSlots;
  const activeVehicles = data.vehicles.filter(
    v => v.status === "Parked"
  ).length;

  const revenue = data.vehicles.reduce(
    (sum, v) => sum + Number(v.fee || 0), 0
  );

  res.json({
    totalSlots,
    occupiedSlots,
    availableSlots,
    activeVehicles,
    revenue
  });
});

app.get("/api/slots", (req, res) => {
  const data = readData();

  const slots = data.slots.map(slot => ({
    ...slot,
    vehicle: data.vehicles.find(
      v => v.id === slot.vehicleId
    ) || null
  }));

  res.json(slots);
});

app.get("/api/vehicles", (req, res) => {
  const data = readData();
  res.json(data.vehicles.slice().reverse());
});

app.post("/api/vehicles/entry", (req, res) => {
  const { plateNumber, ownerName, phone, vehicleType } = req.body;

  if (![plateNumber, ownerName, phone, vehicleType]
    .every(value => String(value || "").trim())) {
    return res.status(400).json({
      message: "Please fill in all fields."
    });
  }

  const data = readData();
  const plate = String(plateNumber).trim().toUpperCase();

  const duplicate = data.vehicles.find(
    v => v.plateNumber === plate && v.status === "Parked"
  );

  if (duplicate) {
    return res.status(409).json({
      message: "This vehicle is already parked."
    });
  }

  const slot = data.slots.find(
    s => s.status === "Available"
  );

  if (!slot) {
    return res.status(409).json({
      message: "Parking lot is full."
    });
  }

  const id = data.vehicles.length
    ? Math.max(...data.vehicles.map(v => v.id)) + 1
    : 1;

  const vehicle = {
    id,
    plateNumber: plate,
    ownerName: ownerName.trim(),
    phone: phone.trim(),
    vehicleType,
    slotNumber: slot.slotNumber,
    entryTime: new Date().toISOString(),
    exitTime: null,
    status: "Parked",
    fee: 0
  };

  slot.status = "Occupied";
  slot.vehicleId = id;
  data.vehicles.push(vehicle);
  saveData(data);

  res.status(201).json({
    message: `Vehicle parked in slot ${slot.slotNumber}.`,
    vehicle
  });
});

app.post("/api/vehicles/:id/exit", (req, res) => {
  const data = readData();

  const vehicle = data.vehicles.find(
    v => v.id === Number(req.params.id)
  );

  if (!vehicle) {
    return res.status(404).json({
      message: "Vehicle not found."
    });
  }

  if (vehicle.status !== "Parked") {
    return res.status(400).json({
      message: "Vehicle has already exited."
    });
  }

  const exitTime = new Date();
  const entryTime = new Date(vehicle.entryTime);

  const hours = Math.max(
    1,
    Math.ceil((exitTime - entryTime) / 3600000)
  );

  const fee = hours * Number(data.settings.hourlyRate || 30);

  vehicle.exitTime = exitTime.toISOString();
  vehicle.status = "Exited";
  vehicle.fee = fee;

  const slot = data.slots.find(
    s => s.slotNumber === vehicle.slotNumber
  );

  if (slot) {
    slot.status = "Available";
    slot.vehicleId = null;
  }

  saveData(data);

  res.json({
    message: "Vehicle exit recorded.",
    vehicle,
    hours,
    fee
  });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
