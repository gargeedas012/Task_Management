export interface DashboardStats {
    assignedTasks: number;
    assignedProjects: number;
    inProgressTasks: number;
    completedTasks: number;   
}

export interface TodayTask {
    id: string;
    title: string;
    projectName: string;
    status: string;
    priority: string;
    dueDate: string;
}

export interface UpcomingDeadline {
    id: string;
    title: string;
    projectName: string;
    dueDate: string;
}

export interface ProjectProgress {
    projectId: string;
    projectName: string;
    totalTasks: number;
    completedTasks: number;
}