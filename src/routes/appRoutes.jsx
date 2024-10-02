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

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landpage />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
