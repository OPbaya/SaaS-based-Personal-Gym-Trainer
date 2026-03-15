import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import WeightChart from "../components/WeightChart.jsx";

export default function Graph() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getToken } = useAuth();

  const fetchData = async () => {
    try {
      const token = await getToken();

      const res = await axios.get("/api/data/daily", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.map(({ date, bodyWeight }) => ({ date, bodyWeight })).reverse();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Body Weight Progress</h2>
      {loading ? (
        <p>Loading...</p>
      ) : filteredData.length === 0 ? (
        <p>No weight data available yet.</p>
      ) : (
        <WeightChart data={filteredData} />
      )}
    </div>
  );
}
