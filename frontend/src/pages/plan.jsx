import React, { useState, useEffect } from "react";
import {
  Goal,
  Utensils,
  Dumbbell,
  Maximize2,
  Minimize2,
  Download,
} from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MoveRight } from "lucide-react";
import DOMPurify from "dompurify";
import { marked } from "marked";
import he from "he";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

// --- Reusable Card Component ---
const PlanCard = ({
  icon,
  title,
  content,
  onToggleFullscreen,
  isFullscreen,
  isLoading,
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
        <h2 className="text-2xl font-bold text-white">
          {isLoading ? (
            <Skeleton
              width={150}
              baseColor="#334155"
              highlightColor="#475569"
            />
          ) : (
            title
          )}
        </h2>
      </div>
      {!isLoading && (
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
      )}
    </div>

    {/* Card Content */}
    <div className="p-6 overflow-y-auto flex-1">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton count={3} baseColor="#334155" highlightColor="#475569" />
          <Skeleton width="80%" baseColor="#334155" highlightColor="#475569" />
          <Skeleton count={2} baseColor="#334155" highlightColor="#475569" />
          <Skeleton width="60%" baseColor="#334155" highlightColor="#475569" />
          <Skeleton count={4} baseColor="#334155" highlightColor="#475569" />
          <Skeleton width="90%" baseColor="#334155" highlightColor="#475569" />
          <Skeleton count={2} baseColor="#334155" highlightColor="#475569" />
        </div>
      ) : (
        <div className="prose prose-invert prose-sm sm:prose-base max-w-none text-slate-300">
          {content}
        </div>
      )}
    </div>
  </div>
);

// --- Main Page Component ---
export default function Plan() {
  const [userGoal, setUserGoal] = useState("");
  const [gymPlan, setGymPlan] = useState("");
  const [dietPlan, setDietPlan] = useState("");
  const [fullscreenCard, setFullscreenCard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/data", {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        setUserGoal(res.data.endGoal);
        setGymPlan(res.data.gymPlan);
        console.log(gymPlan);
        setDietPlan(res.data.dietPlan);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setIsLoading(false);
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
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "diet plan.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Gym Plan.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          className={`flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 ${
            fullscreenCard ? "hidden" : ""
          }`}
        >
          <div className="inline-flex items-center space-x-3 bg-slate-800 px-6 py-3 rounded-full border border-slate-700">
            <Goal className="h-8 w-8 text-indigo-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {isLoading ? (
                <Skeleton
                  width={200}
                  baseColor="#334155"
                  highlightColor="#475569"
                />
              ) : (
                `Goal: ${userGoal || "..."}`
              )}
            </h1>
          </div>
          {!isLoading && dietPlan && (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handlePdf}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={16} /> Diet PDF
              </button>
              <button
                onClick={handlePdf2}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
              >
                <Download size={16} /> Gym PDF
              </button>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center gap-2 sm:gap-4">
              <Skeleton
                width={120}
                height={36}
                baseColor="#334155"
                highlightColor="#475569"
                borderRadius={8}
              />
              <Skeleton
                width={120}
                height={36}
                baseColor="#334155"
                highlightColor="#475569"
                borderRadius={8}
              />
            </div>
          )}
        </header>

        {/* --- Main Content: Plan Cards --- */}
        <main
          className={`grid ${
            fullscreenCard ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          } gap-8`}
        >
          {isLoading ? (
            // Show skeleton cards while loading
            <>
              <PlanCard
                icon={<Utensils className="h-7 w-7 text-blue-400" />}
                title="Diet Plan"
                content={null}
                onToggleFullscreen={() => {}}
                isFullscreen={false}
                isLoading={true}
              />
              <PlanCard
                icon={<Dumbbell className="h-7 w-7 text-purple-400" />}
                title="Gym Plan"
                content={null}
                onToggleFullscreen={() => {}}
                isFullscreen={false}
                isLoading={true}
              />
            </>
          ) : !dietPlan ? (
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
            <>
              {(!fullscreenCard || fullscreenCard === "diet") && (
                <PlanCard
                  icon={<Utensils className="h-7 w-7 text-blue-400" />}
                  title="Diet Plan"
                  content={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(decodedHtml2),
                      }}
                    />
                  }
                  onToggleFullscreen={() => toggleFullscreen("diet")}
                  isFullscreen={fullscreenCard === "diet"}
                  isLoading={false}
                />
              )}

              {(!fullscreenCard || fullscreenCard === "gym") && (
                <PlanCard
                  icon={<Dumbbell className="h-7 w-7 text-purple-400" />}
                  title="Gym Plan"
                  content={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(decodedHtml),
                      }}
                    />
                  }
                  onToggleFullscreen={() => toggleFullscreen("gym")}
                  isFullscreen={fullscreenCard === "gym"}
                  isLoading={false}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
