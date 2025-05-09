import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

//
import HomePage from "../pages/homePage";
import PageNotFound from "../pages/pageNotFound";
import SessionExpired from "../pages/sessionExpired";
import UnexpectedError from "pages/unexpectedError";

const AllRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={HomePage} />
        <Route path="*" Component={PageNotFound} />
        <Route path="/session-expired" Component={SessionExpired} />
        {/* <Route path="/session-expired" Component={SessionExpired} /> */}
        <Route path="/unexpected-error?/:rest" Component={UnexpectedError} />

      </Routes>
    </Router>
  );
};

export { AllRoutes };
