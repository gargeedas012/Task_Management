export interface Project {
    id?: string;
    userId: string;
    name: string;
    description: string;
    dueDate: string | null;
    status: string;
}
export interface RecentProject{
        id?: string,
        name: string,
        description:string,
        status: string,
        progress: number,
        completedTasks: number,
        totalTasks: number,
        dueDate: string,
        projectDueDate:string
}

export interface GetProjectInfoDto{
    totalProjects:Number,
    activeProjects:Number,
    totalTasks:Number,
    completedTask:Number
}