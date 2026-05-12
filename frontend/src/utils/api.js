import axios from "axios"
import { store } from "../store/store"
import { logoutUser } from "../features/AuthSlice"

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

            // Check if user is supposed to be logged in (via localStorage)
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                return Promise.reject(error);
            }

            try {
                // Attempt to refresh the token
                await axios.post(
                    "http://localhost:3000/api/v1/auth/refreshToken",
                    {},
                    { withCredentials: true }
                );

                // If successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails (token expired, missing, or mismatched), 
                // clear storage and update Redux state immediately so the UI (Navbar) updates
                localStorage.removeItem("user");
                store.dispatch(logoutUser());
                
                // If it's a "no refresh token" error on page load, mark it as silent
                if (refreshError.response?.data?.message === "no refresh token token!!") {
                    refreshError.isSilent = true;
                }
                
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }

);