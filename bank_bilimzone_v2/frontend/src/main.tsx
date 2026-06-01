import React from "react";
import ReactDOM from "react-dom/client";
import { BankApp } from "./pages/BankApp/BankApp";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BankApp />
  </React.StrictMode>
);
