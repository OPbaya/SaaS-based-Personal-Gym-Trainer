import { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const FILTERS = [
  { label: "1M", months: 1 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "All", months: null },
];

export default function WeightChart({ data }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const selected = FILTERS.find((f) => f.label === activeFilter);
    if (!selected.months) return data;

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - selected.months);

    return data.filter((item) => new Date(item.date) >= cutoff);
  }, [data, activeFilter]);

  if (!data || data.length === 0) return null;

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB");
  };

  const chartData = {
    labels: filteredData.map((item) => formatDate(item.date)),
    datasets: [
      {
        label: "Body Weight (kg)",
        data: filteredData.map((item) => item.bodyWeight),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        callbacks: {
          title: (context) => `📅 ${context[0].label}`,
          label: (context) => `⚖️ Weight: ${context.parsed.y} kg`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { callback: (value) => `${value} kg` },
      },
      x: {
        ticks: { maxRotation: 45 },
      },
    },
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => setActiveFilter(f.label)}
            style={{
              padding: "6px 16px",
              borderRadius: "9999px",
              border: "1px solid rgb(59, 130, 246)",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "14px",
              backgroundColor:
                activeFilter === f.label ? "rgb(59, 130, 246)" : "transparent",
              color: activeFilter === f.label ? "#fff" : "rgb(59, 130, 246)",
              transition: "all 0.2s ease",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      {filteredData.length === 0 ? (
        <div
          style={{
            height: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#9ca3af",
            fontSize: "14px",
          }}
        >
          No data available for this period.
        </div>
      ) : (
        <div style={{ height: "400px" }}>
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}
