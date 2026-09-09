export type Priority =
    | "Critical"
    | "High"
    | "Medium"
    | "Low";

export type TaskStatus =
    | "In Progress"
    | "To Do"
    | "Review"
    | "Completed"
    | "Blocked";

export const TaskStatus = {
    Todo: "To Do",
    InProgress: "In Progress",
    Blocked: "Blocked",
    Review: "Review",
    Completed: "Completed"
} as const;

export interface TaskPriorityGroupDto {
    status: typeof TaskStatus[keyof typeof TaskStatus];
    tasks: TaskDto[];
}

export interface TaskDto {
    id?: string;
    title: string;
    description: string;
    assignedTo: string[];
    assignedBy: string;
    status: number;
    priority: number;
    startDate: string;
    dueDate: string;
    projectName: string;
}
export interface ProjectIdNameInfo {
    id: string;
    name: string;
}

export interface TeamMember1 {
    id: string;
    username: string;
    role: string;
}
