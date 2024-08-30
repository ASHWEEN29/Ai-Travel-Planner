// src/App.jsx

import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import userStore from "./context/store";
import TripForm from "./pages/Tripform";
import PlanDisplay from "./pages/PlanDisplay";

function App() {
  const navigate = useNavigate();
  const { user, setUser } = userStore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/auth");
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [navigate, setUser]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Login />} />
      <Route path="/make-trip" element={<TripForm />} />
      <Route path="/trip-plan" element={<PlanDisplay />} />
    </Routes>
  );
}

export default App;
