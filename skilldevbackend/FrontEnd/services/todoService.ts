import axios from "axios";
import type { Todo } from "../types/Todo";


const API_URL = "https://localhost:5001/api/Todo";


export const getTodos = async () =>{
    const response = await axios.get<Todo[]>(API_URL);
    return response.data;
}

export const createTodo = async (todo: Todo) => {
    const response = await axios.post<Todo>(API_URL, {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate,
        category: todo.category,
        isCompleted: todo.isCompleted
    });
    return response.data;
}

export const updateTodo = async (todo: Todo) => {
    const response = await axios.put<Todo>(`${API_URL}/${todo.id}`, {
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        dueDate: todo.dueDate,
        category: todo.category,
        isCompleted: todo.isCompleted
    });
    return response.data;
}

export const deleteTodo = async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}

export const CompleteTodoResponse = async (isCompleted: boolean) => {
    console.log("Fetching Todos with isCompleted:", isCompleted);
    const response = await axios.get<Todo[]>(`${API_URL}/GetIncompleteTodos`,
        {
            params: {
                isCompleted: isCompleted
            }
        }
    );
    return response.data;
}