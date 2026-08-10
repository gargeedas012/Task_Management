import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { Todo } from "../../types/todo";

interface TodoState {
  todos: Todo[] | null;
  loading: boolean;
}
interface UpdateTodoPayload {
    id:string;
    todo:Todo
}
const initialState: TodoState = {
  todos: [],
  loading:false
};

const todoSlice = createSlice({
    name:"todo",
    initialState,
    reducers:{
        todoLoadingStart:(state)=>{
            state.loading=true;
        },
        addTodo:(state,action:PayloadAction<Todo>)=>{
            state.todos?.push(action.payload)
        },
        setTodos: (state, action:PayloadAction<Todo[]>) => {
            state.todos = action.payload;
        },
        clearTodos: (state) => {
            state.todos = [];
        },
        updateTodo: (state, action: PayloadAction<UpdateTodoPayload>) => {
            const index = state.todos?.findIndex(todo => todo.id === action.payload.id) ?? -1;
            if (index !== -1 && state.todos) {
                state.todos[index] = action.payload.todo;
            }
        },
        deleteTodo:(state,action: PayloadAction<string>) =>{
            state.todos?.filter(todo=>todo.id!==action.payload)
        }
    },
});
export const { todoLoadingStart,addTodo,setTodos,clearTodos,updateTodo,deleteTodo} = todoSlice.actions;
export default todoSlice.reducer;