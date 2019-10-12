import axios from "axios";
import Auth from "../stores/auth";

// const API = "https://fsbccoffee.ngrok.io/v1";
const API = "https://803f71b5.ngrok.io/v1";

function authHeader() {
  return { headers: {"Authorization": `Bearer ${Auth.getToken()}`} };
}

export default {
  register: async (username, password, role) => {
    await axios.post(`${API}/user/register`, {username, password, role});
  },
  login: async (username, password) => {
    const {data: {token}} = await axios.post(`${API}/user/login`, {username, password});
    if (!token) {
      throw new Error("Invalid login response from server") ;
    }
    return token;
  },
  getAssignments: async () => {
    return (await axios.get(`${API}/fs`, authHeader())).data;
  },
  updateAssignment: async (guid, nAssignment) => {
    await axios.put(`${API}/fs/${guid}`, nAssignment, authHeader());
  },
  includeAssignment: async nAssignment => {
    await axios.post(`${API}/fs`, nAssignment, authHeader());
  }
};