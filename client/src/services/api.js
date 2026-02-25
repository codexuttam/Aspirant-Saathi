import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
})

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    // use stored token instead of embedding a raw token string
    req.headers.Authorization = `Bearer ${token}`;

  }
  return req;
});
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        // Only trigger this if we aren't already on the login page to prevent infinite loops
        if (window.location.pathname !== "/login") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default API;