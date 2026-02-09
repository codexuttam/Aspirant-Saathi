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

export function getUser() {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export function setUser(user) {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (e) {
    // ignore
  }
}

const authUtils = { isLoggedIn, logout, getUser, setUser };
export default authUtils;
