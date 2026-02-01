import axios from "axios";

const API = axios.create({
  baseURL: "https://todo-manager-app-rzm0.onrender.com/api/tasks"
});

export default API;
