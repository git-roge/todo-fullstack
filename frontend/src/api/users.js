import axios from "axios";

const users = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type" : "application/json",
    }
})

users.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access")

        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => Promise.reject(error)
);

let sessionExpiredShown = false;

users.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if(originalRequest.url?.includes("/token")){
            return Promise.reject(error);
        }
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refresh = localStorage.getItem("refresh");

                if(!refresh){
                    throw new Error("No refresh token");
                }

                const res = await users.post("/token/refresh/", {
                    refresh: refresh,
                });
                const newAccess = res.data.access;

                localStorage.setItem("access", newAccess);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return users(originalRequest);

            }catch(refreshError){
                if(!sessionExpiredShown){
                    sessionExpiredShown = true;
                    alert("Session expired, you need to login again.");
                    localStorage.clear();

                    window.location.href = "/login";
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
)
export default users