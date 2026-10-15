import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

export default api;

//http://localhost:5000/api/slots
//http://localhost:5000/api/dashboard