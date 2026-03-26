import todos from "../api/todos";

const handleError = (error) => {
    if(error.response){
        if(error.response.status === 404) return {generalError: "Resource not found."};
        if(error.response.status === 401) return {generalError: "Unauthorized request."};
        if(error.response.status === 400) return error.response.data;
        if(error.response.status === 500) return {generalError: "Server error. Try again"};

        return {generalError : "Something went wrong."};
    }else if(error.request){
        return {generalError: "Connection error"};
    }else{
        return {generalError: error.message || "Something lang."};
    }
}
export const getTodos = async (page, search=null, field=null) => {
    try{
        const response = await todos.get('/todos/', {
            params: {
                page: page,
                ...(search && { search }),
                ...(field && { field }),
            }
        });
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
        return response.data;
    } catch (err) {
        const parsedError = handleError(err);

        if(typeof parsedError === "object"){
            throw parsedError;
        }else {
            throw new Error(parsedError);
        }
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