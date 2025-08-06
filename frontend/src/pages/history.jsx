import React, {useState, useEffect} from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
// --- The History Page Component ---
const HistoryPage = () => {
  // Mock data for demonstration. In a real app, this would come from an API.
  // Added a 'maintenance' property to each entry.

  const [history, setHistory] = useState([]);
  const { getToken } = useAuth();

  const [main, setMaintain] = useState("");



  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/data/daily", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });

        const maintain = await axios.get("http://localhost:3000/api/data", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        setMaintain(maintain.data.m_cal)
        setHistory(res.data)
        console.log(setMaintain);
        // setDietPlan(res.data.dietPlan);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Your Log History</h1>
        <p className="text-slate-400 mt-1">
          A complete record of your daily progress.
        </p>
      </header>
      <div className="bg-slate-800 rounded-2xl shadow-lg border border-slate-700 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-700">
            <tr>
              <th className="p-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                Date
              </th>
              <th className="p-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                Weight
              </th>
              <th className="p-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                Intake
              </th>
              <th className="p-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                Burned
              </th>
              <th className="p-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                Maintenance
              </th>
              <th className="p-4 text-sm font-semibold text-slate-300 whitespace-nowrap">
                Net Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => {
              const net = entry.caloriesConsumed - entry.caloriesBurned;
              const difference = net - main;
              const isSurplus = difference > 0;
              return (
                <tr
                  key={entry.date}
                  className="border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors"
                >
                  <td className="p-4 text-slate-300">
                    {new Date(entry.date).toISOString().split("T")[0]}
                  </td>
                  <td className="p-4 text-slate-300">
                    {/* {entry.bodyWeight.toFixed(1)} kg */}
                    {entry.bodyWeight
                      ? `${entry.bodyWeight.toFixed(1)} kg`
                      : "N/A"}
                  </td>
                  <td className="p-4 text-slate-300">
                    {entry.caloriesConsumed
                      ? `${entry.caloriesConsumed} kcal`
                      : "No data"}
                  </td>
                  <td className="p-4 text-slate-300">
                    {entry.caloriesBurned
                      ? `${entry.caloriesBurned} kcal`
                      : "No data"}
                  </td>
                  <td className="p-4 text-slate-300">{main} kcal</td>
                  <td
                    className={`p-4 font-bold ${
                      isSurplus ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {isSurplus ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )}
                      {Math.abs(difference)} kcal{" "}
                      {isSurplus ? "Surplus" : "Deficit"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
