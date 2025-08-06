import React, { useState } from "react";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

// --- Shared Navigation Items ---
// Centralized for easier management and to avoid duplication.
const navItems = [
  { icon: <LayoutDashboard size={20} />, text: "Dashboard", path: "/v1/dash" },
  { icon: <Dumbbell size={20} />, text: "Diet & Gym Plan", path: "/v1/plan" },
  { icon: <User size={20} />, text: "Contact Trainer", path: "/v1/diet" },
  { icon: <Settings size={20} />, text: "Profile", path: "/v1/profile" },
];

// --- Reusable Sidebar Item ---
const SidebarItem = ({ icon, text, active, isSidebarOpen, onClick }) => (
  <li
    onClick={onClick}
    className={`
      relative flex items-center py-3 px-4 my-1 font-medium rounded-lg cursor-pointer
      transition-colors group
      ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-slate-700 text-slate-300"
      }
    `}
  >
    {icon}
    <span
      className={`overflow-hidden transition-all ${
        isSidebarOpen ? "w-40 ml-3" : "w-0"
      }`}
    >
      {text}
    </span>
    {!isSidebarOpen && (
      <div
        className={`
        absolute left-full rounded-md px-2 py-1 ml-6
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
      >
        {text}
      </div>
    )}
  </li>
);

// --- Sidebar Component ---
const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
    const { openSignIn, openSignUp } = useClerk();


  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-40 transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <nav className="h-full flex flex-col bg-slate-800 border-r border-slate-700 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <h1
            className={`overflow-hidden transition-all font-bold text-2xl text-white ${
              isSidebarOpen ? "w-32" : "w-0"
            }`}
          >
            FitSutra
          </h1>
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
          >
            {isSidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>

        <ul className="flex-1 px-3">
          {navItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              text={item.text}
              active={location.pathname === item.path}
              isSidebarOpen={isSidebarOpen}
              onClick={() => navigate(item.path)}
            />
          ))}
        </ul>

        <div className="border-t border-slate-700 flex p-3">
          {/* <img
            src="https://placehold.co/100x100/6366f1/e0e7ff?text=A"
            alt="User avatar"
            className="w-10 h-10 rounded-md"
          /> */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <UserButton />
              {/* <button onClick={() => openSignIn()}>Sign In</button>
              <button onClick={() => openSignUp()}>Sign Up</button> */}
            </div>
          </div>
          <div className={`flex justify-between items-center overflow-hidden transition-all ${
              isSidebarOpen ? "w-40 ml-3" : "w-0"
            }`}>
            <LogOut size={20} className="text-slate-400 hover:text-white cursor-pointer"
            />
          </div>
        </div>
      </nav>
    </aside>
  );
};

// --- Header Component for Mobile ---
const MobileHeader = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
      <div className="p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl text-white">FitSutra</h1>
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg text-white"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {isMenuOpen && (
        <nav className="px-4 pb-4">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
                className={`flex items-center gap-3 p-3 rounded-lg font-medium ${
                  location.pathname === item.path
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300"
                }`}
              >
                {item.icon}
                {item.text}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

// --- Main Layout Component ---
// This component now acts as a wrapper for pages, providing the consistent UI.
const FitnessLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="hidden lg:block">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      </div>
      <MobileHeader />
      <main
        className={`transition-all duration-300 pt-20 lg:pt-8 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet /> {/* Child routes will be rendered here */}
        </div>
      </main>
    </div>
  );
};

export default FitnessLayout;