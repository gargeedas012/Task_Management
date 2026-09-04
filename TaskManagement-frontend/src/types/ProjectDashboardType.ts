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
export interface WeeklyActivityDto
{
    week: string;
    started:number;
    completed:number;
}
export const Priority = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical:3
} as const;
export type Priority = typeof Priority[keyof typeof Priority];
export interface PriorityDistributionDto
{
    priority: Priority;
    count: number;
}