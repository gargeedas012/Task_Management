import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { Todo } from "../../types/todo";
import type { Project } from "../../types/project";

interface TodoState {
  todos: Todo[];
  selectedProject: Project | null;
  selectedTodo: Todo | null;
  loading: boolean;
}
const initialState: TodoState = {
  todos: [],
  selectedProject: null,
  selectedTodo: null,
  loading: false,
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
        deleteTodo:(state,action: PayloadAction<string>) =>{
            state.todos?.filter(todo=>todo.id!==action.payload)
        }
    },
});
export const { todoLoadingStart,addTodo,setTodos,clearTodos,deleteTodo} = todoSlice.actions;
export default todoSlice.reducer;