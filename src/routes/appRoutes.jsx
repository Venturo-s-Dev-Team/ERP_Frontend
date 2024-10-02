import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Landpage from "../pages/Login";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landpage />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
