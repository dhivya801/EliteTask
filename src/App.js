
import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Dashboard from "./Dashboard";
import ParkingSlots from "./ParkingSlots";
import Vehicles from "./Vehicles";

function App() {
  const [page, setPage] = useState("Dashboard");

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} />

      <div className="main">
        <Header page={page} />

        <main className="content">
          {page === "Dashboard" && <Dashboard />}
          {page === "Parking Slots" && <ParkingSlots />}
          {page === "Vehicles" && <Vehicles />}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
