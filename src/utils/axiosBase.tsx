import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:3001/api',
    timeout: 5000,
});

export default apiClient;