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

export interface NewProject {
  id?: string;
  name: string;
  description: string;
  projectManager: string;
  startDate: string;
  dueDate?: string | null;
  status: number;
  priority: number;
  createdDate: string;
  totalTask:number;
  completedTask:number;
}
