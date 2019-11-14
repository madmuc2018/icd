import axios from 'axios';
import Auth from '../stores/auth';

// const API = "https://fsbccoffee.ngrok.io/v1";
const API = 'https://cd-app-usask.herokuapp.com/v1';

function authHeader() {
  return { headers: { Authorization: `Bearer ${Auth.getToken()}` } };
}

function axiosError(e, defaultMessage) {
  if (e.response && e.response.data && e.response.data.message) {
    throw new Error(e.response.data.message);
  }
  throw new Error(defaultMessage ? defaultMessage : 'Invalid response from server');
}

export default {
  register: async(username, password, role) => {
    try {
      await axios.post(`${API}/user/register`, { username, password, role });
    } catch (e) {
      axiosError(e);
    }
  },
  login: async(username, password) => {
    try {
      const { data: { token, role } } = await axios.post(`${API}/user/login`, { username, password });
      if (!token) {
        throw new Error('Invalid login response from server');
      }
      return { token, role };
    } catch (e) {
      axiosError(e);
    }
  },
  getTaskLatest: async guid => {
    try {
      const result = await axios.get(`${API}/fs/${guid}/latest`, authHeader());
      return result.data;
    } catch (e) {
      axiosError(e);
    }
  },
  getTasks: async() => {
    try {
      return (await axios.get(`${API}/fs`, authHeader())).data;
    } catch (e) {
      axiosError(e);
    }
  },
  updateTask: async(guid, nTask) => {
    try {
      const result = await axios.put(`${API}/fs/${guid}`, nTask, authHeader());
      return result.data.globalUniqueID;
    } catch (e) {
      axiosError(e);
    }
  },
  includeTask: async nTask => {
    try {
      await axios.post(`${API}/fs/publish`, nTask, authHeader());
    } catch (e) {
      axiosError(e);
    }
  },
  getPublishedTasks: async() => {
    try {
      return (await axios.get(`${API}/fs/published`, authHeader())).data;
    } catch (e) {
      axiosError(e);
    }
  },
  collect: async link => {
    try {
      return (await axios.post(`${API}/collector`, { link })).data;
    } catch (e) {
      axiosError(e);
    }
  },
};
