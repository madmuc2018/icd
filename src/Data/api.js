import axios from "axios";
import Auth from "../stores/auth";

// const API = "https://fsbccoffee.ngrok.io/v1";
const API = "https://7b486727.ngrok.io/v1";

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
  getOrders: async () => {
    return (await axios.get(`${API}/fs`, authHeader())).data;
  },
  updateOrder: async (guid, nOrder) => {
    await axios.put(`${API}/fs/${guid}`, nOrder, authHeader());
  },
  addOrder: async nOrder => {
    await axios.post(`${API}/fs`, nOrder, authHeader());
  },
  grantAccess: async (guid, grantedUsers) => {
    await axios.put(`${API}/fs/${guid}/grant`, {grantedUsers}, authHeader());
  },
  revokeAccess: async (guid, userToBeRevoked) => {
    await axios.put(`${API}/fs/${guid}/revoke`, {userToBeRevoked}, authHeader());
  },
  getHistory: async guid => {
    return (await axios.get(`${API}/fs/${guid}/trace`, authHeader())).data;
  },
  getLatestOrder: async guid => {
    return (await axios.get(`${API}/fs/${guid}/latest`, authHeader())).data;
  },
  getAccessInfo: async guid => {
    return (await axios.get(`${API}/fs/${guid}/access`, authHeader())).data.grantedUsers;
  },
};