import todos from "../api/todos";

const handleError = (err) => {
    if (err.response) {
        // backend returned a 400/500
        console.log(err.response)
        return Promise.reject(err.response.data);
        } else {
        // network error, timeout, etc
        return Promise.reject({ general: err.response.message });
        }
}
export const getTodos = async (page) => {
    try{
        const response = await todos.get(`/todos/?page=${page}`);
        return response.data;
    }catch(err) {
        return handleError(err);
    }
}

export const deleteTodo = async (id) => {
    try{
        const response = await todos.delete(`/todos/${id}/`);
        return response.data;
    }catch(err){
        return handleError(err);
    }
}

export const createTodo = async (data) => {
    try {
        const response = await todos.post("/todos/", data);
        return response.data; // return only data
    } catch (err) {
        return handleError(err);
    }
}

export const updateTodo = async (id, data) => {
    try{
        const response = await todos.patch(`/todos/${id}/`, data);
        return response.data;
    }catch(err) {
        return handleError(err);
    }
}