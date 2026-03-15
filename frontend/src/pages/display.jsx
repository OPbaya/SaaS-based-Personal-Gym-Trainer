import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import WeightChart from "../components/WeightChart.jsx";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

import {
  Goal,
  MoveRight,
  Flame,
  PlusCircle,
  History,
  Calendar,
  Weight,
  Beef,
  TrendingUp,
  Dumbbell,
  Utensils,
  BarChart2,
  ChevronRight,
} from "lucide-react";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ title, value, unit, icon, isLoading }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 flex items-center gap-4">
    <div className="w-11 h-11 rounded-xl bg-slate-700 flex items-center justify-center text-indigo-400 shrink-0">
      {icon}
    </div>
    <div>
      {isLoading ? (
        <Skeleton
          width={80}
          height={24}
          baseColor="#1e2535"
          highlightColor="#2e3a50"
        />
      ) : (
        <p className="text-2xl font-bold text-white">
          {value}{" "}
          <span className="text-sm font-normal text-slate-400">{unit}</span>
        </p>
      )}
      <p className="text-sm text-slate-400 mt-0.5">
        {isLoading ? (
          <Skeleton width={100} baseColor="#1e2535" highlightColor="#2e3a50" />
        ) : (
          title
        )}
      </p>
    </div>
  </div>
);

// ─── Action Card ──────────────────────────────────────────────────────────────
const ActionCard = ({ title, description, colorClass, icon, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-5 rounded-2xl border border-white/10 ${colorClass} hover:-translate-y-1 transition-transform text-left`}
  >
    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="font-bold text-white">{title}</h3>
      <p className="text-sm text-white/70">{description}</p>
    </div>
    <ChevronRight size={18} className="text-white/50" />
  </button>
);

// ─── Field Input ──────────────────────────────────────────────────────────────
const FieldInput = ({ label, name, value, onChange, placeholder, icon }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
        {icon}
      </span>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-xl pl-9 pr-3 py-2.5 outline-none focus:border-indigo-500 placeholder:text-slate-500"
      />
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Display() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [userName, setName] = useState("");
  const [maintenanceCalories, setMaintainanceCalories] = useState("");
  const [weight2, setWeight2] = useState("");
  const [weightHistory, setWeightHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    date: "",
    bodyWeight: "",
    caloriesConsumed: "",
    caloriesBurned: "",
  });

  const submitDailyData = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "/api/data/daily",
        { ...form },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        },
      );
      toast.success("Stats logged!");
    } catch (error) {
      toast.error("Failed to log stats.");
      console.error(error);
    }
  };

  //for graph
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, dailyRes] = await Promise.all([
          axios.get("/api/data", {
            headers: { Authorization: `Bearer ${await getToken()}` },
          }),
          axios.get("/api/data/daily", {
            headers: { Authorization: `Bearer ${await getToken()}` },
          }),
        ]);
        setData(dailyRes.data);
        setName(profileRes.data.name);
        setMaintainanceCalories(profileRes.data.m_cal);
        setWeight2(dailyRes.data[0]?.bodyWeight || 0);
        setWeightHistory(dailyRes.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  //for graph
  const filteredData = data
    .map(({ date, bodyWeight }) => ({ date, bodyWeight }))
    .reverse();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {isLoading ? (
              <Skeleton
                width={200}
                baseColor="#1e2535"
                highlightColor="#2e3a50"
              />
            ) : (
              `Hi, ${userName}!`
            )}
          </h1>
          <p className="text-slate-400 mt-1">
            {isLoading ? (
              <Skeleton
                width={260}
                baseColor="#1e2535"
                highlightColor="#2e3a50"
              />
            ) : (
              "Here's your progress for today."
            )}
          </p>
        </header>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left Column (spans 2) ── */}
          {isLoading ? (
            <div className="lg:col-span-2 flex flex-col gap-4">
              <Skeleton
                height={90}
                baseColor="#1e2535"
                highlightColor="#2e3a50"
                borderRadius={16}
              />
              <Skeleton
                height={180}
                baseColor="#1e2535"
                highlightColor="#2e3a50"
                borderRadius={16}
              />
              <Skeleton
                height={320}
                baseColor="#1e2535"
                highlightColor="#2e3a50"
                borderRadius={16}
              />
            </div>
          ) : !userName ? (
            /* ── Empty State ── */
            <div className="lg:col-span-2 bg-slate-800 border border-dashed border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center text-center p-16 gap-4">
              <div className="p-4 bg-indigo-500/10 rounded-full">
                <Goal size={40} className="text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Your Journey Starts Here
              </h3>
              <p className="text-slate-400 max-w-sm">
                You haven't generated a plan yet. Create your personalised diet
                and gym plan to begin tracking.
              </p>
              <button
                onClick={() => navigate("/v1/diet")}
                className="mt-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Build My Plan <MoveRight size={18} />
              </button>
            </div>
          ) : (
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* ── Stat Cards ── */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={<Weight size={18} />}
                  title="Current Weight"
                  value={weight2}
                  unit="kg"
                  isLoading={false}
                />
                <StatCard
                  icon={<TrendingUp size={18} />}
                  title="Maintenance"
                  value={maintenanceCalories}
                  unit="kcal"
                  isLoading={false}
                />
              </div>

              {/* ── Log Form ── */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <form onSubmit={submitDailyData}>
                  {/* Form Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <h2 className="text-lg font-bold text-white">Log Stats</h2>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => navigate("/v1/dash/history")}
                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <History size={14} /> History
                      </button>
                      <div className="relative">
                        <Calendar
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          style={{ colorScheme: "dark" }}
                          className="bg-slate-700 border border-slate-600 text-slate-200 text-sm rounded-lg pl-8 pr-3 py-1.5 outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <FieldInput
                      label="Bodyweight"
                      name="bodyWeight"
                      value={form.bodyWeight}
                      onChange={handleChange}
                      placeholder="80.5 kg"
                      icon={<Weight size={14} />}
                    />
                    <FieldInput
                      label="Calories In"
                      name="caloriesConsumed"
                      value={form.caloriesConsumed}
                      onChange={handleChange}
                      placeholder="2500 kcal"
                      icon={<Beef size={14} />}
                    />
                    <FieldInput
                      label="Calories Burned"
                      name="caloriesBurned"
                      value={form.caloriesBurned}
                      onChange={handleChange}
                      placeholder="400 kcal"
                      icon={<Flame size={14} />}
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
                  >
                    <PlusCircle size={16} /> Log Stats
                  </button>
                </form>
              </div>

              {/* ── Weight Progress Chart ── */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart2 size={18} className="text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">
                    Weight Progress
                  </h2>
                </div>
                <WeightChart data={filteredData} />
              </div>
            </div>
          )}

          {/* ── Right Column ── */}
          {!isLoading && (
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
                Quick Access
              </p>
              <ActionCard
                title="Diet Plan"
                description="View your daily meals"
                colorClass="bg-gradient-to-br from-blue-500 to-blue-700"
                icon={<Utensils size={18} />}
                onClick={() => navigate("/v1/plan")}
              />
              <ActionCard
                title="Gym Plan"
                description="See your workout routine"
                colorClass="bg-gradient-to-br from-purple-500 to-purple-700"
                icon={<Dumbbell size={18} />}
                onClick={() => navigate("/v1/plan")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
