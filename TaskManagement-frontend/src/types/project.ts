export interface Project {
    id?: string;
    userId: string;
    name: string;
    description: string;
    dueDate: string | null;
    status: string;
}