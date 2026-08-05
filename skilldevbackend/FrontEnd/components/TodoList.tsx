import { useState } from 'react';
import type { Todo } from '../types/Todo';
import { Badge, Button, Card, CardHeader, Divider , makeStyles , Checkbox} from "@fluentui/react-components";
import { CompleteTodoResponse } from '../services/todoService';

const useStyles = makeStyles({
   container: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "16px",
        width: "100%",
        padding: "20px"
   },
    card: {
        padding: "16px",
        minHeight: "250px"
    },
});

interface Props {
    todos: Todo[];
    onDeleteTodo: (id: string) => void;
    onEditTodo: (todo: Todo) => void;
}

function TodoList({todos,onEditTodo,onDeleteTodo}: Props) {
    const styles = useStyles()  
    const [showCompleted, setShowCompleted] = useState(false);

    return (
        <div>
             <Checkbox
            label="Show Completed Todos"
            checked={showCompleted}
            onChange={(e, data) => {
                setShowCompleted(!!data.checked);
            }}
        />    
        <h2>Todo List ({todos.length})</h2>
        {todos.length === 0 ? (
            <p>No Todos Found</p>
        ) : (
            <div className={styles.container}>
            {
           
            todos.map((todo) => (
               <Card
    key={todo.id}
    className={styles.card}
>

    <CardHeader
        header={<strong>{todo.title}</strong>}
    />

    <Divider />


    <p>
        <strong>Description:</strong> {todo.description}
    </p>


    <p>
        <strong>Category:</strong> {todo.category}
    </p>


    <p>
        <strong>Priority:</strong> {todo.priority}
    </p>


    <p>
        <strong>Due Date:</strong> {todo.dueDate}
    </p>



    <Badge
        appearance={todo.isCompleted ? "filled" : "outline"}
        color={todo.isCompleted ? "success" : "warning"}
    >
        {todo.isCompleted ? "Completed" : "Pending"}
    </Badge>



    <div
        style={{
            display:"flex",
            gap:"10px",
            marginTop:"16px"
        }}
    >

        <Button
            appearance="primary"
            onClick={() => onEditTodo(todo)}
        >
            Edit
        </Button>


        <Button
            appearance="secondary"
            onClick={() => onDeleteTodo(todo.id!)}
        >
            Delete
        </Button>

    </div>


</Card>
            ))
}
</div>)}
    </div>
    );
}
export default TodoList;