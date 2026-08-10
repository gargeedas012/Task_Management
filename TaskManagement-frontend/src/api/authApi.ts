import type { ApiResponse } from '../types/api';
import type { LoginRequest, RegisterRequest, TokenResponseDto } from '../types/auth'
import type { Todo } from '../types/todo';
import api from './axios'

export const registerUser = async (data: RegisterRequest): Promise<void> => {
    await api.post("/Auth/register", data);
};
export const loginUser = async (data: LoginRequest): Promise<ApiResponse<TokenResponseDto>> => {
    const response = await api.post("/Auth/login", data);
    return response.data;
}
export const refreshToken = async (): Promise<ApiResponse<TokenResponseDto>> => {
    const response = await api.post("/Auth/refresh");
    return response.data;
}
export const getCurrentUser = async (): Promise<ApiResponse<TokenResponseDto>> => {
    const response = await api.get("/Auth/me");
    return response.data;
};
export const logoutUser = async (): Promise<void> => {
    await api.post("/Auth/logout");
};  
//Todo Funtionality
export const getTodos = async (data: string):Promise<ApiResponse<Todo[]>>=>{
    const response = await api.get("/Todo/SearchByUserId", { params: { userId: data } });
    return response.data;
};
export const createTodo = async (data: Todo):Promise<ApiResponse<string>> => {
    const response= await api.post("/Todo",data);
    return response.data;
}
export const updateTodo = async (data: Todo):Promise<ApiResponse<Todo>> => {
     console.log("come")
       const response = await api.put(`/Todo/${data.id}`, {
        title: data.title,
        userId:data.userId,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
        category: data.category,
        isCompleted: data.isCompleted
    });
    return response.data;
}
export const deleteTodo = async (id: string):Promise<ApiResponse<string>> => {
    const response = await api.delete(`/Todo/${id}`);
    return response.data;
}