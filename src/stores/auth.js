export default {
  getToken() {
    return localStorage.getItem("token");
  },
  setToken(token) {
    localStorage.setItem("token", typeof token === "string" ? token : JSON.stringify(token));
  },
  loggedIn() {
    const token = localStorage.getItem("token");
    return token && token.trim();
  },
  logout() {
    localStorage.removeItem("token");
  }
};