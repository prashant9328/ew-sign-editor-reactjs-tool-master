import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//
import HomePage from "../pages/homePage";
import PageNotFound from "../pages/pageNotFound";
import SessionExpired from "../pages/sessionExpired";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="/page-not-found" Component={PageNotFound} />
        <Route path="/session-expired" Component={SessionExpired} />
      </Routes>
    </Router>
  );
};

export { AllRoutes };
