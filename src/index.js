import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";

//
import { store } from "./redux/store";
import { AllRoutes } from "./routes";
// import reportWebVitals from "./reportWebVitals";

//
import "./index.css";
import "./styles";
import "react-toastify/dist/ReactToastify.css";
import Modal from 'react-modal';
Modal.setAppElement('#root');

//
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
    />
    <AllRoutes />
  </Provider>
);

// reportWebVitals();
