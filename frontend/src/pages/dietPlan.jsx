import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export default function DietPlan() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    weight: "",
    height: "",
    goalWeight: "",
    healthConditions: "",
    dailyActivityLevel: "moderate",
    wantsGym: false,
    endGoal: "muscle gain",
    currentDiet: "",
    isVegetarian: false,
  });

  const [dietPlan, setDietPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDietPlan("");

    try {
      const res = await axios.post(
        "/api/data", 
        {
          ...form,
          healthConditions: form.healthConditions
          .split(",")
          .map((c) => c.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      setDietPlan(res.data.data.dietPlan || "No data");
    } catch (error) {
      setError("Failed to generate diet plan.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-zinc-900 shadow-lg rounded-md mt-10 text-white">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Generate Your Diet Plan
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* yet to change in backend */}
        <label for="Your Name">Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            required
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            required
          />
          <input
            type="number"
            name="height"
            placeholder="Height in cm"
            value={form.height}
            onChange={handleChange}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            required
          />
          <input
            type="number"
            name="goalWeight"
            placeholder="Your weight Goal"
            value={form.goalWeight}
            onChange={handleChange}
            className="p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
            required
          />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={form.gender === "male"}
              onChange={handleChange}
            />
            Male
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={form.gender === "female"}
              onChange={handleChange}
            />
            Female
          </label>
        </div>
        <input
          type="text"
          name="healthConditions"
          placeholder="Health Conditions (comma-separated)"
          value={form.healthConditions}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
        />
        Your Activity Level:
        <select
          name="dailyActivityLevel"
          value={form.dailyActivityLevel}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Lightly Active</option>
          <option value="moderate">Moderately Active</option>
          <option value="high">Very Active</option>
        </select>
        <div className="flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="wantsGym"
              checked={form.wantsGym}
              onChange={handleChange}
            />
            Wants to go to gym
          </label>
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              name="isVegetarian"
              checked={form.isVegetarian}
              onChange={handleChange}
            />
            Vegetarian
          </label>
        </div>
        Your End Goal:
        <select
          name="endGoal"
          value={form.endGoal}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
        >
          <option value="muscle gain">muscle gain</option>
          <option value="weight loss">weight loss</option>
          <option value="fitness">fitness</option>
          <option value="other">other</option>
        </select>
        <input
          type="text"
          name="currentDiet"
          placeholder="Current Diet"
          value={form.currentDiet}
          onChange={handleChange}
          className="w-full p-2 bg-zinc-800 border border-zinc-700 rounded text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Generating..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-400 mt-4">{error}</p>}

      {dietPlan && (
        <div className="mt-8 p-4 bg-zinc-800 text-white rounded">
          <h3 className="text-green-500 text-xl font-semibold mb-2">
            Your Diet plan and Gym plan is created. Click to view
          </h3>
          <button
            className=" mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/v1/plan")}
          >
            {" "}
            View Plans
          </button>
        </div>
      )}
    </div>
  );
}
