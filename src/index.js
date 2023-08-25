import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AllRoutes } from "./routes";
import reportWebVitals from "./reportWebVitals";

//
import "./index.css";
import "./styles";

//
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <AllRoutes />
  </Provider>
);

reportWebVitals();
