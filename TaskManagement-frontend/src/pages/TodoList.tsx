import { useEffect, useState } from "react";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableHeaderCell,
    TableRow,
    Badge,
    Spinner,
} from "@fluentui/react-components";

import type { Todo } from "../types/todo";
import { getTodos, deleteTodo, updateTodo } from "../api/authApi";
import { useAppSelector } from "../app/hooks";
import TodoForm from "./TodoForm";

const TodoList = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [openTodoDialog , setOpenTodoDialog]=useState(false);
    const [SelectedTodo, setSelectedTodo]=useState<Todo>();
    const user = useAppSelector(state => state.auth.user)

    // GET TODOS
    const fetchTodos = async () => {
        try {
            setLoading(true);

            if (!user?.userId) return;
            const response = await getTodos(user.userId);

            setTodos(response.result);
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        } finally {
            setLoading(false);
        }
    };

    // GET API WHEN COMPONENT LOADS
    useEffect(() => {
        fetchTodos();
    }, []);

    // DELETE TODO
    const handleDelete = async (id?: string) => {
        if (!id) return;

        try {
            await deleteTodo(id);

            // Remove deleted todo from UI
            setTodos((previousTodos) =>
                previousTodos.filter((todo) => todo.id !== id)
            );
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    // EDIT TODO
      const handleEdit = async (todo: Todo) => {
        try {
            console.log("updated item",todo);
              setSelectedTodo(todo);
              setOpenTodoDialog(true);
        } catch (error) {
          console.error("Failed to update todo:", error);
        }
      };
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return <Spinner label="Loading todos..." />;
    }

    return (
         <>
        <Table aria-label="Todo list">

            <TableHeader>
                <TableRow>
                    <TableHeaderCell>Title</TableHeaderCell>
                    <TableHeaderCell>Description</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Priority</TableHeaderCell>
                    <TableHeaderCell>Due Date</TableHeaderCell>
                    <TableHeaderCell>Category</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
            </TableHeader>

            <TableBody>

                {todos.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7}>
                            No todos found
                        </TableCell>
                    </TableRow>
                ) : (
                    todos.map((todo) => (
                        <TableRow key={todo.id}>

                            <TableCell>
                                {todo.title}
                            </TableCell>

                            <TableCell>
                                {todo.description}
                            </TableCell>

                            <TableCell>
                                {todo.isCompleted ? (
                                    <Badge appearance="filled">
                                        Completed
                                    </Badge>
                                ) : (
                                    <Badge appearance="outline">
                                        Pending
                                    </Badge>
                                )}
                            </TableCell>

                            <TableCell>
                                {todo.priority}
                            </TableCell>

                            <TableCell>
                                {formatDate(todo.dueDate)}
                            </TableCell>

                            <TableCell>
                                {todo.category}
                            </TableCell>

                            <TableCell>
                                <Button
                                    appearance="primary"
                                    size="small"
                                  onClick={() => handleEdit(todo)}
                                >
                                    Edit
                                </Button>

                                <Button
                                    appearance="secondary"
                                    size="small"
                                    onClick={() => handleDelete(todo.id)}
                                >
                                    Delete
                                </Button>
                            </TableCell>

                        </TableRow>
                    ))
                )}

            </TableBody>
        </Table>
<TodoForm
  open={openTodoDialog}
  onClose={() => {
    setOpenTodoDialog(false);
    setSelectedTodo(undefined);
    fetchTodos();
  }}
  todo={SelectedTodo}
/>
   </>
    );
};

export default TodoList;