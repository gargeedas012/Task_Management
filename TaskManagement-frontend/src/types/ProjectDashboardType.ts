export interface DashboardStats {
    assignedTasks: number;
    assignedProjects: number;
    inProgressTasks: number;
    completedTasks: number;   
    todoTasks: number;
    reviewTasks: number;
}
export interface TaskInfoDto {
  id: string;
  title: string;
  projectName: string;
  status: number;
  priority: number;
  dueDate: string;
}
export interface TaskDashboardDto {
  todayTasks: TaskInfoDto[];
  upcomingTasks: TaskInfoDto[];
}
export interface ProjectInfoDto {
    id: string;
    name: string;
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    todoTasks: number;
    reviewTasks: number;
    status: string;
    members: string[];
}
