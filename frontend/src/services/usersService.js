import users from "../api/users"
import { getAccessToken } from "../auth/tokenStore";

export const handleError = (error) => {
    if(error.response){
        if(error.response.status === 404) return "Resource not found.";
        if(error.response.status === 401) return "Unauthorized request.";
        if(error.response.status === 400) return error.response.data?.non_field_errors?.[0] || "Bad request";
        if(error.response.status === 500) return "Server error. Try again later.";
        
        return error.response.data?.detail || "Something went wrong.";
    }else if (error.request){
        return "Network error. Check your internet connection.";
    }else{
        return error.message || "Something went wrong."
    }
};

export const handleLogin = async (username, password) => {
    try{
        const response = await users.post("/token/", {
            username,
            password
        });

        return response.data
    }catch(err){
        if(err.response?.data?.non_field_errors){
            throw new Error(err.response.data.non_field_errors[0]);
        }
        throw new Error("Login failed. Try again.")
    }
};

export const getCurrentUser = async () => {
    try{
        const response = await users.get("/users/me/");
        
        return response.data;
    }catch(err) {
        throw new Error("Failed to fetch user data");
    }
}

export const getUsers = async () => {
    try{
        
        const response = await users.get("/users/");

        return response.data;
    }catch(err){
        throw new Error(handleError(err));
    }
}

export const createUser = async (data) => {
    try{
        const response = await users.post("/users/", data);

        return response.data;
    }catch(err) {
        throw new Error("Something went Wrong");
    }
}

export const getUserSelectedById = async (id) => {
    try{
        const response = await users.get(`/users/${id}/`);
        
        return response.data;
    }catch(err) {
        throw new Error(handleError(err));
    }
}

export const updateUser = async (id, data) => {
    try{
        const response = await users.patch(`/users/${id}/`, data);
        return response.data;
    }catch(err) {
        throw new Error(handleError(err))
    }
}