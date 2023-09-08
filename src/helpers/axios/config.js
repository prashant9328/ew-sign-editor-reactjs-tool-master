const config = {
  apiUrl: `${process.env.REACT_APP_API_URL || ""}/api`,
  // apiUrl: process.env.REACT_APP_API_URL || window.location.origin,
};

//   if (process.env.NODE_ENV === "production") {
//     config.apiUrl = "http://liveapi.com";
//   }

//   if (window.location.hostname == "localhost") {
//     // config.apiUrl = "http://localhost:5001";
//     config.apiUrl = "https://api-qa.app.onecounsel.in";
//   }
//   if (window.location.hostname.indexOf("192.168") != -1) {
//     config.apiUrl = "http://192.168.1.42:5001";
//   }

export default config;
