import { useEffect, useState } from "react";
import { fetchDashboardData } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
function Dashboard() {
  const [data, setData] = useState([]);
  const [selectedVillage, setSelectedVillage] = useState(null);
  useEffect(() => {
    fetchDashboardData()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        console.error("API ERROR:", err);
      });
  }, []);
  useEffect(() => {
  if (data.length > 0) {
    setSelectedVillage(data[0]);
  }
}, [data]);

  // KPI Calculations
  const totalVillages = data.length;
  const criticalVillages = data.filter(v => v.stress_level === "Critical").length;
  const totalTankers = data.reduce((sum, v) => sum + v.tankers_required, 0);
  const highestRisk = data.length > 0 ? data[0].name : "N/A";

  const getStressColor = (level) => {
    switch (level) {
      case "Safe":
        return "green";
      case "Moderate":
        return "gold";
      case "Severe":
        return "orange";
      case "Critical":
        return "red";
      default:
        return "white";
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>District Water Stress Dashboard</h2>

      {/* KPI Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={cardStyle}>
          <h3>Total Villages</h3>
          <p>{totalVillages}</p>
        </div>

        <div style={cardStyle}>
          <h3>Critical Villages</h3>
          <p style={{ color: "red" }}>{criticalVillages}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Tankers Required</h3>
          <p>{totalTankers}</p>
        </div>

        <div style={cardStyle}>
          <h3>Highest Priority Village</h3>
          <p>{highestRisk}</p>
        </div>
      </div>
	  {/* KPI Cards */}
<div> ... </div>

{/* Village Selector */}
<select
  onChange={(e) => {
    const village = data.find(v => v.name === e.target.value);
    setSelectedVillage(village);
  }}
  style={{ marginBottom: "20px", padding: "8px" }}
>
  {data.map((v, index) => (
    <option key={index} value={v.name}>
      {v.name}
    </option>
  ))}
</select>

{/* Rainfall Chart */}
{selectedVillage && (
  <div style={{ width: "100%", height: 300, marginBottom: "30px" }}>
    <h3>Rainfall Trend (Last 12 Months)</h3>
    <ResponsiveContainer>
      <LineChart
        data={selectedVillage.rainfall_history.map((value, index) => ({
          month: `M${index + 1}`,
          rainfall: value
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="rainfall" stroke="#00bfff" />
      </LineChart>
    </ResponsiveContainer>
  </div>
)}

{/* Table */}
<table> ... </table>

      {/* Table */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Village</th>
            <th>WSI</th>
            <th>Stress</th>
            <th>Rainfall Risk</th>
            <th>Groundwater Trend</th>
            <th>Tankers</th>
            <th>Priority</th>
          </tr>
        </thead>
        <tbody>
          {data.map((v, index) => (
            <tr key={index}>
              <td>{v.name}</td>
              <td>{v.wsi}</td>
              <td style={{ color: getStressColor(v.stress_level), fontWeight: "bold" }}>
                {v.stress_level}
              </td>
              <td>{v.rainfall_prediction}</td>
              <td>{v.groundwater_prediction}</td>
              <td>{v.tankers_required}</td>
              <td>{v.priority_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const cardStyle = {
  flex: 1,
  padding: "20px",
  backgroundColor: "#1e1e1e",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
  textAlign: "center"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

export default Dashboard;