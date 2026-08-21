import type { ApiResponse } from '../types/api';
import type { LoginRequest, RegisterRequest, TokenResponseDto } from '../types/auth'
import type { Project } from '../types/project';
import type { Todo, TodoByDateDto, TodoListResponse } from '../types/todo';
import api from './axios'


export const registerUser = async (data: RegisterRequest): Promise<ApiResponse<TokenResponseDto>> => {
   const response= await api.post("/Auth/register", data);
   return response.data;
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
export const GoogleLoginFun = async (
    credentialResponse: any
): Promise<ApiResponse<TokenResponseDto>> => {

    const response = await api.post(
        "/Auth/google",
        {
            idToken: credentialResponse.credential
        },
        {
            withCredentials: true
        }
    );

    return response.data;
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
        projectId:data.projectId,
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
export const getTodosByProject = async (
    id: string
): Promise<ApiResponse<Todo[]>> => {
    const response = await api.get(
        "Todo/GetTodosByProjectId",
        {
            params: {
                projectId: id
            }
        }
    );

    return response.data;
};
export const getTodosByProjectIdWithLimit = async (
    projectId: string,
    page: number,
    pageSize: number
):Promise<ApiResponse<TodoListResponse>> => {
    const response = await api.get(
        "/Todo/TodosByProjectIdWithLimit",
        {
            params: {
                projectId,
                page,
                pageSize 
            }
        }
    );

    return response.data;
};
export const getTodosByProjectIdWithLimitByFilter = async (
    projectId: string,
    startDate:Date,
    page: number,
    pageSize: number,
    filterType:string,    
):Promise<ApiResponse<TodoByDateDto[]>> => {
    const response = await api.get(
        "/Todo/TodosByDate",
        {
            params: { projectId, startDate, page, pageSize, filterType }
        }
    );
    return response.data;
};



//project todo
export const createProject= async (data:Project):Promise<ApiResponse<string>>=>{
    const response=await api.post("/Project",data);
    return response.data;
}
export const getAllProjects=async (data:string):Promise<ApiResponse<Project[]>>=>{
    const response=await api.get("Project/SearchByUserId",{ params: { userId: data } });
    return response.data;
}
export const updateProject=async (data :Project):Promise<ApiResponse<string>> =>{
    console.log("ohreog", data.id)
    const response=await api.put(`/Project/${data.id}`,data);
    return response.data;
}
export const deleteProject = async (data: string):Promise<ApiResponse<string>>=>{
    const response=await api.delete(`Project/${data}`);
    return response.data;
}
