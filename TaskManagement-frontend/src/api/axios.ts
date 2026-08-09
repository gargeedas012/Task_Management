import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:5148/api/Auth",
    withCredentials:true
});

export default api;