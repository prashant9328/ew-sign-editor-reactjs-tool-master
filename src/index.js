import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from "react-redux";
import { store } from "./redux/store";
import { AllRoutes } from "./routes";
import './index.css';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
   <AllRoutes />
  </Provider>
);

reportWebVitals();
