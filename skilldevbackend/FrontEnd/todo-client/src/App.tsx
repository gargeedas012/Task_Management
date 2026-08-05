import { useEffect, useState } from "react";
import TodoForm from "../../components/TodoForm";
import TodoList from "../../components/TodoList";
import type { Todo } from "../../types/Todo";

import {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    CompleteTodoResponse
} from "../../services/todoService";
import { Checkbox } from "@fluentui/react-components";


function App() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [editTodo, setEditTodo] = useState<Todo | null>(null);
    const [showCompleted, setShowCompleted] = useState(false);


    useEffect(() => {
        loadTodos();
    }, [showCompleted]);

    
    const loadTodos = async()=>{
        if(showCompleted){
            const data = await CompleteTodoResponse(true);
            setTodos(data);
        }else{
            const data = await getTodos();
            setTodos(data);
        }
    };

    // CREATE TODO
    const handleAddTodo = async(todo:Todo)=>{
       console.log("Adding Todo:", todo);
        await createTodo(todo);
        // reload data from MongoDB
        loadTodos();
    };

    // UPDATE TODO
    const handleUpdateTodo = async(
        id:string,
        updatedTodo:Todo
    )=>{
        await updateTodo({
            ...updatedTodo,
            id:id
        });
        setEditTodo(null);
        loadTodos();

    };

    // EDIT BUTTON CLICK
    const handleEditTodo=(todo:Todo)=>{
        setEditTodo(todo);
    };

    // DELETE TODO
    const handleDeleteTodo = async(id:string)=>{
       console.log("Deleting Todo with ID:", id);
        await deleteTodo(id);
        loadTodos();
    };

    return (

        <div>  
            <Checkbox
            label="Show Completed Todos"
            checked={showCompleted}
            onChange={(e, data) => {
                setShowCompleted(!!data.checked);
            }}
        />       
            <TodoForm
                onAddTodo={handleAddTodo}
                onUpdateTodo={handleUpdateTodo}
                editTodo={editTodo}
            />
            <TodoList
                todos={todos}
                onEditTodo={handleEditTodo}
                onDeleteTodo={handleDeleteTodo}
            />
        </div>

    );

}


export default App;