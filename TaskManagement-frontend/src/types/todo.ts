export interface Todo {
    id?: string;
    title: string;
    userId: string;
    projectId: "string";
    description: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    category: string;
    isCompleted: boolean;
}