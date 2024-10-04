import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Landpage from "../pages/LandPage/landpage";
import Login from "../pages/Login/Login";
import Balancete from "../pages/Balancete/balancete";
import Home from "../pages/Dashboard/dashboard";
import HomeAdmin from "../pages/Dashboard Admin/dashboardAdmin";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="login" element={<Login />} />
        <Route path="/balancete" element={<Balancete />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/dashboardAdmin" element={<HomeAdmin />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
