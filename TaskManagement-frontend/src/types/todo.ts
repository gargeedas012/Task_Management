export interface Todo {
  id?: string;
  title: string;
  userId: string;
  projectId: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  createdDate: string;
  category: string;
  isCompleted: boolean;
}
export interface TodoByDateDto {
  date: string;
  tasks: Todo[];
  totalTaskCount: number;
}
export interface TodoListResponse {
  todos: Todo[];
  totalCount: number;
}
export interface TodoResponse {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  todoDueDate: string;
  category: string;
  isCompleted: boolean;
  priority: string;
  projectName: string;
}

export interface TaskComment {
  id: string;
  author: string;
  initials: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface NewTodo {
  id?: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string[];
  assignedBy: string;
  status: number;
  priority: number;
  startDate: string;
  dueDate: string;
  updatedDate: string;
  createdDate: string;
  comments: TaskComment[];
}
