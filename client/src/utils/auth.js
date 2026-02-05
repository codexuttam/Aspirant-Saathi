// simple auth helpers used by the client UI
// - isLoggedIn: checks if a JWT token exists in localStorage
// - logout: clears token and redirects to the login page

export function isLoggedIn() {
  try {
    const token = localStorage.getItem("token");
    return !!token;
  } catch (e) {
    return false;
  }
}

export function logout() {
  try {
    localStorage.removeItem("token");
  } catch (e) {
    // ignore
  }
  // redirect to home or login
  window.location.href = "/login";
}

export default { isLoggedIn, logout };
