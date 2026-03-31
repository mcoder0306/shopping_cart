import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1",
    withCredentials: true
})

// Add a response interceptor
api.interceptors.response.use(
    // res => res,
    // async err => {
    //     if (err.response.status === 401) {
    //         const newToken =  await axios.post(
    //                 "http://localhost:3000/api/v1/auth/refreshToken",
    //                 {},
    //                 { withCredentials: true }
    //             );

    //         err.config.headers.Authorization = `Bearer ${newToken}`;
    //         return api(err.config); // retry request
    //     }
    //     return Promise.reject(err);
    // }
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await axios.post(
                    "http://localhost:3000/api/v1/auth/refreshToken",
                    {},
                    { withCredentials: true }
                );

                // If successful, retry the original request with the new token (handled by cookies)
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);