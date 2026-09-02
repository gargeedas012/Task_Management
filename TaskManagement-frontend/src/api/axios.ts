import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5148/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint
                await axios.post(
                    "http://localhost:5148/api/Auth/refresh",
                    {},
                    { withCredentials: true }
                );

                // Retry original request with new token cookie
                return api(originalRequest);
            } catch (refreshError) {
                // Redirect to login if refresh fails
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;