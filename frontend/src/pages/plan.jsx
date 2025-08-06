import React, { useState, useEffect } from "react";
import { Goal, Utensils, Dumbbell, Maximize2, Minimize2 } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm"; // For tables, strikethrough, etc.
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import DOMPurify from "dompurify";
import {marked} from  'marked'
import he from "he";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


// --- Reusable Card Component ---
const PlanCard = ({
  icon,
  title,
  content,
  onToggleFullscreen,
  isFullscreen,
}) => (
  <div
    className={`bg-slate-800 rounded-2xl shadow-lg border border-slate-700 flex flex-col ${
      isFullscreen ? "fixed inset-0 z-50 m-0 h-screen w-screen" : "h-[32rem]"
    }`}
  >
    {/* Card Header */}
    <div className="p-6 border-b border-slate-700 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {icon}
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <button
        onClick={onToggleFullscreen}
        className="p-2 rounded-full hover:bg-slate-700 transition-colors"
        aria-label={isFullscreen ? "Minimize" : "Maximize"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-5 w-5 text-slate-300" />
        ) : (
          <Maximize2 className="h-5 w-5 text-slate-300" />
        )}
      </button>
    </div>

    {/* Card Content */}
    <div className="p-6 overflow-y-auto flex-1">
      <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-300">
        {content}
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
export default function Plan() {
  const [userGoal, setUserGoal] = useState("");
  // const safeHtml = DOMPurify.sanitize(htmlData);

  const [gymPlan, setGymPlan] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [fullscreenCard, setFullscreenCard] = useState(null); // 'diet' or 'gym'
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("/api/data", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        setUserGoal(res.data.endGoal);
        setGymPlan(res.data.gymPlan);
        console.log(gymPlan)
        setDietPlan(res.data.dietPlan);
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };

    fetchPlans();
  }, []);

  const toggleFullscreen = (card) => {
    setFullscreenCard(fullscreenCard === card ? null : card);
  };
  const handlePdf = async () => {
    try {
      const res = await axios.get("/api/data/download", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        responseType: "blob", // important to handle binary data
      });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create a temporary anchor tag to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "diet plan.pdf"); // 👈 desired filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // cleanup
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };
  const handlePdf2 = async () => {
    try {
      const res = await axios.get("/api/data/download2", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
        responseType: "blob", // important to handle binary data
      });
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));

      // Create a temporary anchor tag to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Gym Plan.pdf"); // 👈 desired filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // cleanup
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const decodedHtml = he.decode(gymPlan || "");
  const decodedHtml2 = he.decode(dietPlan || "");


  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* --- Header: Main Goal --- */}
        <header
          className={`text-center mb-10 ${fullscreenCard ? "hidden" : "block"}`}
        >
          <div className="inline-flex items-center space-x-3 bg-slate-800 px-6 py-3 rounded-full border border-slate-700">
            <Goal className="h-8 w-8 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Goal: {userGoal}
            </h1>
          </div>
        </header>

        {/* --- Main Content: Plan Cards --- */}
        <div className="p-4">
          <button
            type="button"
            onClick={handlePdf}
            className=" cursor-pointer flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-sm px-3 py-2 rounded-lg transition-colors"
          >
            <Goal size={16} />
            Download diet Plan
          </button>
        </div>
        <div className="p-4">
          <button
            type="button"
            onClick={handlePdf2}
            className=" cursor-pointer flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-sm px-3 py-2 rounded-lg transition-colors"
          >
            <Goal size={16} />
            Download Gym Plan
          </button>
        </div>

        <main
          className={`grid ${
            fullscreenCard ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          } gap-8`}
        >
          {!dietPlan ? (
            <div className="text-center py-24 px-4">
              <h3 className="text-3xl p-5">
                No gym and diet plan. make one now
              </h3>
              <button
                className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
                onClick={() => navigate("/diet")}
              >
                Get Started <MoveRight size={20} />
              </button>
            </div>
          ) : (
            <>
              {(!fullscreenCard || fullscreenCard === "diet") && (
                <PlanCard
                  icon={<Utensils className="h-7 w-7 text-blue-400" />}
                  title="Diet Plan"
                  content={
                    <div
                      className="prose prose-invert text-white"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(decodedHtml2),
                      }}
                    />
                  }
                  onToggleFullscreen={() => toggleFullscreen("diet")}
                  isFullscreen={fullscreenCard === "diet"}
                />
              )}

              {(!fullscreenCard || fullscreenCard === "gym") && (
                <PlanCard
                  icon={<Dumbbell className="h-7 w-7 text-purple-400" />}
                  title="Gym Plan"
                  content={
                    <div
                      className="prose prose-invert text-white"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(decodedHtml),
                      }}
                    />
                  }
                  onToggleFullscreen={() => toggleFullscreen("gym")}
                  isFullscreen={fullscreenCard === "gym"}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
