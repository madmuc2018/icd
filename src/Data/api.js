import axios from "axios";
import Auth from "../stores/auth";

// const API = "https://fsbccoffee.ngrok.io/v1";
const API = "https://ad0fed8b.ngrok.io/v1";

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
  getTasks: async () => {
    return (await axios.get(`${API}/fs`, authHeader())).data;
  },
  updateTask: async (guid, nTask) => {
    const result = await axios.put(`${API}/fs/${guid}`, nTask, authHeader());
    return result.data.globalUniqueID;
  },
  includeTask: async nTask => {
    await axios.post(`${API}/fs`, nTask, authHeader());
  }
};