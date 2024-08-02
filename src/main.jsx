import React from "react";
import ReactDOM from "react-dom/client";
import Login from "./pages/Login.jsx";
import Routes from "./routes/appRoutes.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);
