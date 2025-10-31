import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
} from "lucide-react";

// --- Helper Components & Icons ---

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 8l4 4m0 0l-4 4m4-4H3"
    />
  </svg>
);

const StatCard = ({
  title,
  value,
  unit,
  bgColor = "bg-slate-800",
  isLoading,
}) => (
  <div
    className={`${bgColor} p-6 rounded-2xl shadow-lg flex flex-col justify-between border border-slate-700`}
  >
    <p className="text-slate-400 font-medium">
      {isLoading ? (
        <Skeleton width={100} baseColor="#334155" highlightColor="#475569" />
      ) : (
        title
      )}
    </p>
    <p className="text-3xl lg:text-4xl font-bold text-white">
      {isLoading ? (
        <Skeleton
          width={120}
          height={40}
          baseColor="#334155"
          highlightColor="#475569"
        />
      ) : (
        <>
          {value} <span className="text-xl text-slate-300">{unit}</span>
        </>
      )}
    </p>
  </div>
);

const ActionCard = ({ title, description, bgColor, onClick }) => (
  <button
    onClick={onClick}
    className={`${bgColor} p-6 rounded-2xl shadow-xl text-left w-full flex justify-between items-center transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-white`}
  >
    <div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
      <p className="text-slate-200 mt-1">{description}</p>
    </div>
    <ArrowRightIcon />
  </button>
);

// --- Main Dashboard Component ---

export default function Display() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const [userName, setName] = useState("");
  const [maintenanceCalories, setMaintainanceCalories] = useState("");
  const [weight2, setWeight2] = useState("");
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
      const res = await axios.post(
        "/api/data/daily",
        {
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      toast.success("Successfully Added!");
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/data", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });

        const result = await axios.get("/api/data/daily", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        setWeight2(result.data[0]?.bodyWeight || 0);

        console.log(weight2);

        setName(res.data.name);
        setMaintainanceCalories(res.data.m_cal);
        console.log(userName);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleViewHistory = () => {
    navigate("/v1/dash/history");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCardClick = (planType) => {
    navigate("/v1/plan");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header --- */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            {isLoading ? (
              <Skeleton
                width={200}
                baseColor="#334155"
                highlightColor="#475569"
              />
            ) : (
              `Hi, ${userName}!`
            )}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            {isLoading ? (
              <Skeleton
                width={300}
                baseColor="#334155"
                highlightColor="#475569"
              />
            ) : (
              "Ready to crush your goals today?"
            )}
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton for empty state card
            <div className="md:col-span-2 bg-slate-800/80 border border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center p-10 h-96">
              <Skeleton/>
            </div>
          ) : !userName ? (
            <div className="md:col-span-2 bg-slate-800/80 border border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center p-10 h-96">
              <div className="p-4 bg-indigo-600/20 rounded-full mb-4">
                <Goal className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-bold text-white">
                Your Plan Awaits
              </h3>
              <p className="text-slate-400 mt-2 mb-6 max-w-md">
                You haven't generated a diet and gym plan yet. Create one now to
                start your journey.
              </p>
              <button
                className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 transform hover:-translate-y-1"
                onClick={() => navigate("/v1/diet")}
              >
                Get Started <MoveRight size={20} />
              </button>
            </div>
          ) : (
            <div className="lg:col-span-2 space-y-8">
              {/* --- Today's Stats Section --- */}
              <div>
                <h2 className="text-xl font-bold text-indigo-400 mb-4">
                  Today's Snapshot
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <StatCard
                    icon={<Weight size={20} className="text-blue-400" />}
                    title="Current Weight"
                    value={weight2}
                    unit="kg"
                    isLoading={false}
                  />

                  <StatCard
                    icon={<TrendingUp size={20} className="text-emerald-400" />}
                    title="Maintenance"
                    value={maintenanceCalories}
                    unit="kcal"
                    isLoading={false}
                  />
                </div>
              </div>

              {/* Log Data */}
              <div className=" bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
                <form onSubmit={submitDailyData}>
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-indigo-400">
                      Log or Edit Stats
                    </h2>
                    <button
                      type="button"
                      onClick={handleViewHistory}
                      className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-sm px-3 py-2 rounded-lg transition-colors"
                    >
                      <History size={16} />
                      View History
                    </button>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        className="w-full md:w-auto bg-slate-700 border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Bodyweight (kg)
                      </label>
                      <Weight className="absolute left-3 top-9 h-5 w-5 text-slate-500" />
                      <input
                        type="number"
                        name="bodyWeight"
                        value={form.bodyWeight}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 80.5"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Calorie Intake
                      </label>
                      <Beef className="absolute left-3 top-9 h-5 w-5 text-slate-500" />
                      <input
                        type="number"
                        name="caloriesConsumed"
                        value={form.caloriesConsumed}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 2500"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-400 mb-1">
                        Calories Burned
                      </label>
                      <Flame className="absolute left-3 top-9 h-5 w-5 text-slate-500" />
                      <input
                        type="number"
                        name="caloriesBurned"
                        value={form.caloriesBurned}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. 400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="md:col-start-2 lg:col-start-4 self-end h-11 flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-all"
                    >
                      <PlusCircle size={20} />
                      Log Stats
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* --- Right Column --- */}
          {isLoading ? (
            <Skeleton
              height={200}
              baseColor="#334155"
              highlightColor="#475569"
            />
          ) : (
            <div className="lg:col-span-1 space-y-6 lg:space-y-8">
              <ActionCard
                title="Diet Plan"
                description="View your daily meals"
                bgColor="bg-gradient-to-br from-blue-500 to-blue-700"
                onClick={() => handleCardClick("Diet Plan")}
              />
              <ActionCard
                title="Gym Plan"
                description="See your workout routine"
                bgColor="bg-gradient-to-br from-purple-500 to-purple-700"
                onClick={() => handleCardClick("Gym Plan")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
