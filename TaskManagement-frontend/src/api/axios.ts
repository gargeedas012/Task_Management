import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Skip token refresh logic for authentication endpoints to prevent infinite loops
        const isAuthUrl = originalRequest?.url?.includes("/Auth/");

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
            originalRequest._retry = true;

            try {
                // Call refresh token endpoint
               await axios.post(
                    `${import.meta.env.VITE_API_URL}/Auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Retry original request with new token cookie
                return api(originalRequest);
            } catch (refreshError) {
                // Only redirect to login if user was on a protected page and refresh failed
                if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;