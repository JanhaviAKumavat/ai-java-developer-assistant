// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
//   headers: { "Content-Type": "application/json" },
//   timeout: 120000,
// });

// // Turn backend errors into readable messages
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     const message =
//       err.response?.data?.error ||
//       (err.code === "ECONNABORTED"
//         ? "The request took too long. Please try again."
//         : err.request
//         ? "Cannot reach the server. Is the backend running?"
//         : err.message);
//     return Promise.reject(new Error(message));
//   }
// );

// export default api;





import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120000,
});

// Handle backend errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      (error.code === "ECONNABORTED"
        ? "The request took too long. Please try again."
        : error.request
        ? "Cannot reach the server. Is the backend running?"
        : error.message);

    return Promise.reject(new Error(message));
  }
);

export default api;
