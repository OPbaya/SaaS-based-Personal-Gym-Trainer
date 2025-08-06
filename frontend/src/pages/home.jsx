import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";

import {
  Target,
  UtensilsCrossed,
  Dumbbell,
  History,
  MoveRight,
} from "lucide-react";

// --- Reusable Feature Card Component ---
const FeatureCard = ({ icon, title, description,onClick }) => (
  <div
    onClick={onClick}
    className="cursor-pointer bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-lg text-center transform transition-transform hover:-translate-y-2"
  >
    <div className="inline-block p-4 bg-indigo-600/20 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </div>
);

// --- Reusable Testimonial Card Component ---
const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
    <p className="text-slate-300 italic">"{quote}"</p>
    <div className="mt-4 text-right">
      <p className="font-bold text-white">{author}</p>
      <p className="text-sm text-indigo-400">{role}</p>
    </div>
  </div>
);

// --- Main Homepage Component ---
export default function Homepage() {
    const { user } = useUser();
    const { openSignIn, openSignUp } = useClerk();
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* --- Header/Navbar --- */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <nav className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <a href="#" className="flex items-center gap-2">
            <Dumbbell className="text-indigo-400" size={28} />
            <h1 className="text-2xl font-bold text-white">FitSutra</h1>
          </a>
          <div className="hidden md:flex gap-6 items-center">
            <a
              href="#features"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-slate-300 hover:text-white transition-colors"
            >
              Testimonials
            </a>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <UserButton />
              <button
                onClick={() => navigate("/v1/dash")}
                className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:cursor-pointer"
                variant="outline"
              >
                Dashboard
              </button>
              {/* <button onClick={() => openSignIn()}>Sign In</button>
              <button onClick={() => openSignUp()}>Sign Up</button> */}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link>
                <button
                  onClick={openSignIn}
                  className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:cursor-pointer"
                  variant="outline"
                >
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      <main>
        {/* --- Hero Section --- */}
        <section className="text-center py-24 px-4">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Your Ultimate Fitness Journey <br /> Starts Here
          </h2>
          <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-400">
            Track your progress, get personalized diet and gym plans, and
            achieve your health goals faster than ever before.
          </p>
          {/* <button className="mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
            Get Started <MoveRight size={20} />
          </button> */}
          {user ? (
            <div className="items-center space-x-4">
              <button onClick={() => navigate("/v1/dash")}
              className="cursor-pointer mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                Dashboard <MoveRight size={20} />
              </button>
            </div>
          ) : (
            <div className="items-center space-x-4">
              <button onClick={openSignIn}
              className="cursor-pointer mt-8 bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                Get Started <MoveRight size={20} />
              </button>
              {/* <button onClick={() => openSignIn()}>Sign In</button>
              <button onClick={() => openSignUp()}>Sign Up</button> */}
            </div>
          )}
        </section>

        {/* --- Features Section --- */}
        <section id="features" className="py-20 px-4 bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              Everything You Need to Succeed
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Target size={32} className="text-indigo-400" />}
                title="Track Your Data"
                onClick={() => navigate("/v1/dash")}
                description="Easily log your daily weight, calorie intake, and calories burned to stay on top of your goals."
              />
              <FeatureCard
                icon={<UtensilsCrossed size={32} className="text-blue-400" />}
                title="Personalized Diet"
                onClick={() => navigate("/v1/diet")}
                description="Receive custom meal plans tailored to your body, activity level, and fitness objectives."
              />
              <FeatureCard
                icon={<Dumbbell size={32} className="text-purple-400" />}
                title="Custom Workouts"
                onClick={() => navigate("/v1/diet")}
                description="Get effective gym routines designed to help you build muscle, lose weight, or improve fitness."
              />
              <FeatureCard
                icon={<History size={32} className="text-emerald-400" />}
                title="View Log History"
                onClick={() => navigate("/v1/dash/history")}
                description="Review your progress with a detailed history of all your logged data to stay motivated."
              />
            </div>
          </div>
        </section>

        {/* --- Testimonials Section --- */}
        <section id="testimonials" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-white mb-12">
              What Our Users Say
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TestimonialCard
                quote="This app completely changed how I approach my fitness. The personalized plans are a game-changer!"
                author="Sarah J."
                role="Fitness Enthusiast"
              />
              <TestimonialCard
                quote="Finally, an all-in-one platform to track my meals and workouts. The progress history keeps me accountable."
                author="Mike R."
                role="Weight Loss Journey"
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="bg-slate-800/50 text-center py-8">
        <p className="text-slate-400">
          &copy; {new Date().getFullYear()} FitSutra. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
