export default {
  isConsented() {
    return localStorage.getItem("consent") === "1";
  },
  doConsent() {
    localStorage.setItem("consent", "1");
  },
  undoConsent() {
    localStorage.removeItem("consent");
  }
};