import type { ApiResponse } from '../types/api';
import type { LoginRequest, RegisterRequest, TokenResponseDto } from '../types/auth'
import type { GetProjectInfoDto, Project, RecentProject } from '../types/project';
import type { DashboardStats, PriorityDistributionDto, ProjectInfoDto, TaskDashboardDto, WeeklyActivityDto } from '../types/ProjectDashboardType';
import type { ProjectIdNameInfo, TaskPriorityGroupDto } from '../types/TaskListType';
import type { Todo, TodoByDateDto, TodoListResponse, TodoResponse } from '../types/todo';
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





//user
export const GetProjectInfo = async (userId: string): Promise<ApiResponse<DashboardStats>> => {
    const response = await api.get("/User/GetProjectInfo", { params: { userId } });
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
export const getrecentTodos = async (userId: string):Promise<ApiResponse<TodoResponse[]>>=>{
    const response = await api.get("/Todo/getRecentTodos", { params: { userId: userId } });
    return response.data;
};
export const getTodayUpcomingTaskInfo = async (id: string): Promise<ApiResponse<TaskDashboardDto>> => {
    const response=await api.get("Todo/GetTaskInfo",{ params: { userId: id } });
        return response.data;
}
export const getWeeklyActivity=async (userId:string):Promise<ApiResponse<WeeklyActivityDto[]>>=>{
    const response=await api.get("Todo/GetWeeklyActivity",{ params: { userId: userId } });
    return response.data;
}
export const getPriorityCount=async (userId:string):Promise<ApiResponse<PriorityDistributionDto[]>>=>{
    const response=await api.get("Todo/GetPriorityCount",{ params: { userId: userId } });
    return response.data;
}
export const getTaskPriorityGroup=async (userId:string , projectId?:string):Promise<ApiResponse<TaskPriorityGroupDto[]>>=>{
    const response=await api.get("Todo/GetTaskPriorityGroup",{ params: { userId: userId  , projectId: projectId} });
    return response.data;
}







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
export const getAllRecentProjects=async (userId:string):Promise<ApiResponse<RecentProject>>=>{
    const response=await api.get("Project/getRecentProjects",{ params: { userId: userId } });
    return response.data;
}

export const getProjectAssigneeInfo=async (userId:string):Promise<ApiResponse<ProjectInfoDto[]>>=>{
    const response=await api.get("Project/GetProjectAssigneInfo",{ params: { userId: userId } });
    return response.data;
}
export const getProjectsNameByUserIdAsync=async (userId:string):Promise<ApiResponse<ProjectIdNameInfo[]>>=>{
    const response=await api.get("Project/GetProjectsNameByUserIdAsync",{ params: { userId: userId } });
    return response.data;
}

