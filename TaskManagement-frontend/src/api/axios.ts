import axios from "axios";

const api=axios.create({
    baseURL:"http://localhost:5148/api",
    withCredentials:true
});

export default api;