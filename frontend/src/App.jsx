import React from "react";
import AddTrainingCentre from "./pages/AddTrainingCentre";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import TrainingCentres from "./pages/TrainingCentres";
import CentreDetails from "./pages/CentreDetails";
import Monitoring from "./pages/Monitoring";
import Violations from "./pages/Violations";
import Reports from "./pages/Reports";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="training-centres"
            element={<TrainingCentres />}
          />

          <Route
            path="training-centres/new"
            element={<AddTrainingCentre />}
          />

          <Route
            path="training-centres/:id"
            element={<CentreDetails />}
          />

          <Route
            path="monitoring"
            element={<Monitoring />}
          />

          <Route
            path="violations"
            element={<Violations />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;