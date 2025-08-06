import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

import {
  User,
  Mail,
  Cake,
  Weight,
  Ruler,
  Target,
  Edit,
  Save,
  X,
  HeartPulse,
  Activity,
  Utensils,
  Vegan,
  Dumbbell,
  Goal,
  Flame,
} from "lucide-react";

// --- Reusable component for displaying a piece of profile info ---
const InfoField = ({ icon, label, value }) => (
  <div>
    <label className="text-sm font-medium text-slate-400">{label}</label>
    <div className="mt-1 flex items-center gap-3">
      {icon}
      <p className="text-white text-lg">{value}</p>
    </div>
  </div>
);

// --- Reusable component for an input field in edit mode ---
const EditField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) => (
  <div>
    <label htmlFor={name} className="text-sm font-medium text-slate-400">
      {label}
    </label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
      />
    </div>
  </div>
);

// --- Reusable component for a select dropdown in edit mode ---
const SelectField = ({ icon, label, name, value, onChange, children }) => (
  <div>
    <label htmlFor={name} className="text-sm font-medium text-slate-400">
      {label}
    </label>
    <div className="mt-1 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition appearance-none"
      >
        {children}
      </select>
    </div>
  </div>
);

// --- Reusable component for a textarea in edit mode ---
const TextareaField = ({ icon, label, name, value, onChange }) => (
  <div>
    <label htmlFor={name} className="text-sm font-medium text-slate-400">
      {label}
    </label>
    <div className="mt-1 relative">
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
      />
    </div>
  </div>
);

// --- Main Profile Page Component ---
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { getToken } = useAuth();
  const { user } = useUser();
  console.log("User:", user);
  console.log("Primary Email:", user.primaryEmailAddress?.emailAddress);
  // Mock user data with all the new fields
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    goalWeight: "",
    healthConditions: "",
    dailyActivityLevel: "",
    wantsGym: "",
    endGoal: "",
    currentDiet: "",
    isVegetarian: "",
    m_cal: "",
  });

  
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/api/data", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        const mergedData = {
          ...res.data,
          email: user?.primaryEmailAddress?.emailAddress || "",
        };

        setProfileData(mergedData)
        console.log(setProfileData);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    
    fetchPlans();
  }, []);
  
    const [editData, setEditData] = useState(profileData);
    useEffect(() => {
      setEditData(profileData);
    }, [profileData]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value === "true" }));
  };
  
  const handleSave = () => {
    console.log("Saving data:", editData);
    setProfileData(editData);
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white">Your Profile</h1>
          <p className="text-slate-400 mt-2 text-lg">
            View and manage your personal and fitness information.
          </p>
        </header>

        <div className="bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-indigo-400">
              Personal Information
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Edit size={16} /> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            // --- EDIT MODE ---
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <EditField
                  icon={<User size={18} className="text-slate-400" />}
                  label="Full Name"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                />
                <EditField
                  icon={<Mail size={18} className="text-slate-400" />}
                  label="Email Address"
                  name="email"
                  value={editData.email}
                  // onChange={handleInputChange}
                  type="email"
                />
                <EditField
                  icon={<Cake size={18} className="text-slate-400" />}
                  label="Age"
                  name="age"
                  value={editData.age}
                  onChange={handleInputChange}
                  type="number"
                />
                <SelectField
                  icon={<User size={18} className="text-slate-400" />}
                  label="Gender"
                  name="gender"
                  value={editData.gender}
                  onChange={handleInputChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </SelectField>
                <EditField
                  icon={<Weight size={18} className="text-slate-400" />}
                  label="Weight (kg)"
                  name="weight"
                  value={editData.weight}
                  onChange={handleInputChange}
                  type="number"
                />
                <EditField
                  icon={<Ruler size={18} className="text-slate-400" />}
                  label="Height (cm)"
                  name="height"
                  value={editData.height}
                  onChange={handleInputChange}
                  type="number"
                />
                <EditField
                  icon={<Target size={18} className="text-slate-400" />}
                  label="Goal Weight (kg)"
                  name="goalWeight"
                  value={editData.goalWeight}
                  onChange={handleInputChange}
                  type="number"
                />
                <SelectField
                  icon={<Activity size={18} className="text-slate-400" />}
                  label="Activity Level"
                  name="dailyActivityLevel"
                  value={editData.dailyActivityLevel}
                  onChange={handleInputChange}
                >
                  <option>Sedentary</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>High</option>
                </SelectField>
                <SelectField
                  icon={<Goal size={18} className="text-slate-400" />}
                  label="Primary Goal"
                  name="endGoal"
                  value={editData.endGoal}
                  onChange={handleInputChange}
                >
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Fitness</option>
                  <option>Weight Gain</option>
                </SelectField>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextareaField
                  label="Health Conditions"
                  name="healthConditions"
                  value={editData.healthConditions}
                  onChange={handleInputChange}
                />
                <TextareaField
                  label="Current Diet"
                  name="currentDiet"
                  value={editData.currentDiet}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    Gym Access
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="wantsGym"
                        value="true"
                        checked={editData.wantsGym === true}
                        onChange={handleRadioChange}
                      />{" "}
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="wantsGym"
                        value="false"
                        checked={editData.wantsGym === false}
                        onChange={handleRadioChange}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400 mb-2 block">
                    Vegetarian?
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="isVegetarian"
                        value="true"
                        checked={editData.isVegetarian === true}
                        onChange={handleRadioChange}
                      />{" "}
                      Yes
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="isVegetarian"
                        value="false"
                        checked={editData.isVegetarian === false}
                        onChange={handleRadioChange}
                      />{" "}
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-700">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-slate-600 hover:bg-slate-500 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  <X size={18} /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  <Save size={18} /> Save Changes
                </button>
              </div>
            </div>
          ) : (
            // --- VIEW MODE ---
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InfoField
                  icon={<User size={20} className="text-slate-500" />}
                  label="Full Name"
                  value={profileData.name}
                />
                <InfoField
                  icon={<Mail size={20} className="text-slate-500" />}
                  label="Email Address"
                  value={profileData.email}
                />
                <InfoField
                  icon={<Cake size={20} className="text-slate-500" />}
                  label="Age"
                  value={`${profileData.age} years`}
                />
                <InfoField
                  icon={<User size={20} className="text-slate-500" />}
                  label="Gender"
                  value={profileData.gender}
                />
                <InfoField
                  icon={<Weight size={20} className="text-slate-500" />}
                  label="Weight"
                  value={`${profileData.weight} kg`}
                />
                <InfoField
                  icon={<Ruler size={20} className="text-slate-500" />}
                  label="Height"
                  value={`${profileData.height} cm`}
                />
                <InfoField
                  icon={<Target size={20} className="text-slate-500" />}
                  label="Goal Weight"
                  value={`${profileData.goalWeight} kg`}
                />
                <InfoField
                  icon={<Activity size={20} className="text-slate-500" />}
                  label="Activity Level"
                  value={profileData.dailyActivityLevel}
                />
                <InfoField
                  icon={<Goal size={20} className="text-slate-500" />}
                  label="Primary Goal"
                  value={profileData.endGoal}
                />
                <InfoField
                  icon={<Dumbbell size={20} className="text-slate-500" />}
                  label="Gym Access"
                  value={profileData.wantsGym ? "Yes" : "No"}
                />
                <InfoField
                  icon={<Vegan size={20} className="text-slate-500" />}
                  label="Vegetarian"
                  value={profileData.isVegetarian ? "Yes" : "No"}
                />
                <InfoField
                  icon={<Flame size={20} className="text-slate-500" />}
                  label="Maintenance Calories"
                  value={`${profileData.m_cal} kcal/day`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoField
                  icon={<HeartPulse size={20} className="text-slate-500" />}
                  label="Health Conditions"
                  value={profileData.healthConditions}
                />
                <InfoField
                  icon={<Utensils size={20} className="text-slate-500" />}
                  label="Current Diet"
                  value={profileData.currentDiet}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
