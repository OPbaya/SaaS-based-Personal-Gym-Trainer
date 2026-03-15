import React from "react";
import { Route, Routes } from "react-router-dom";
import DietPlan from "./pages/dietPlan.jsx";
import Display from "./pages/display.jsx";
import Plan from "./pages/plan.jsx";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import Layout from "./components/Layout.jsx";
import HistoryPage from "./pages/history.jsx"
import Homepage from "./pages/home.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";
import Profile from "./pages/profile.jsx";
import Graph from "./pages/graph.jsx";

const App = () => {
  // const { getToken } = useAuth();
  // useEffect(() => {
  //   getToken().then((token) => console.log("Token:", token));
  // }, []);
  return (
    <div>
      {/* <Layout /> */}
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/v1" element={<Layout />}>
          <Route
            path="/v1/graph"
            element={
              <ProtectedRoute>
                <Graph />
              </ProtectedRoute>
            }
          />
          <Route
            path="/v1/diet"
            element={
              <ProtectedRoute>
                <DietPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/v1/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/v1/dash"
            element={
              <ProtectedRoute>
                <Display />
              </ProtectedRoute>
            }
          />
          <Route
            path="/v1/dash/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/v1/plan"
            element={
              <ProtectedRoute>
                <Plan />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
