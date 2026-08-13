export interface Todo {
    id?: string;
    title: string;
    userId: string;
    projectId: "string";
    description: string;
    priority: "Low" | "Medium" | "High";
    dueDate: string;
    createdDate: string;
    category: string;
    isCompleted: boolean;
}
export interface TodoByDateDto{
    date:string;
    tasks:Todo[];
    totalTaskCount:number;
}
export interface TodoListResponse{
    todos:Todo[];
    totalCount : number;
}