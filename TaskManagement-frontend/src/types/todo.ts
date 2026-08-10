export interface Todo {
    id?: string;
    title: string;
    userId: string;
    description: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    category: string;
    isCompleted: boolean;
}