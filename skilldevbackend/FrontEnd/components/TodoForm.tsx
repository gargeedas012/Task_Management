import { useState, useEffect } from "react";
import type { Todo } from "../types/Todo";
import { Button, Input, Textarea, Checkbox, makeStyles, Card, Dropdown, Option } from "@fluentui/react-components";

interface Props{
    onAddTodo: (todo: Todo) => void;
    onUpdateTodo: (id: string, todo: Todo) => void;
    editTodo: Todo | null;
}
const useStyles = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "350px",
        margin: "50px auto",
    },
    card: {
        padding: "16px"
    }
    });

function TodoForm({ onAddTodo, onUpdateTodo, editTodo }: Props) {
    const [form, setForm] = useState<Todo>({
        title: "",
        description: "",
        priority: "Low",
        dueDate: "",
        category: "",
        isCompleted: false
    });
    const styles = useStyles();
    useEffect(() => {
        if (editTodo) {
            setForm(editTodo);
        }else {
            setForm({
                title: "",
                description: "",
                priority: "Low",
                dueDate: "",
                category: "",
                isCompleted: false
            });
        }
    }, [editTodo]);

    const handleSubmit = () => {
        if(editTodo){
            onUpdateTodo(editTodo.id!, form);
        }else{
            onAddTodo(form);
        }
        setForm({
            id: "",
            title: "",
            description: "",
            priority: "Low",
            dueDate: "",
            category: "",
            isCompleted: false
        });
    };
    return (
        <Card>
        <div className={styles.container}>
            <h1>
                Todo Application
            </h1>
            <Input name="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" />
            <Textarea name="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" />
    {
        editTodo && (
            <Checkbox checked={form.isCompleted} onChange={(e, data) => setForm({ ...form, isCompleted: data.checked === true })} label="Completed" />
        )
    }
    <Dropdown
        placeholder="Select Priority"
        selectedOptions={form.priority ? [form.priority] : []}
        onOptionSelect={(event, data) => {
            setForm({
                ...form,
                priority: data.optionValue as Todo["priority"]
            });
        }}
    >
    <Option value="Low">
        Low
    </Option>

    <Option value="Medium">
        Medium
    </Option>

    <Option value="High">
        High
    </Option>

</Dropdown>
            <Input type="date" name="dueDate" value={form.dueDate} onChange={(e) => setForm({...form,dueDate: e.target.value})}/>
            <Input name="category" placeholder="Enter Category" value={form.category} onChange={(e) => setForm({ ...form,
            category: e.target.value})}/>
            <Button appearance="primary" onClick={handleSubmit}>{editTodo ? "Update Todo" : "Add Todo"}</Button>
        </div>
        </Card>
    )
    
}
export default TodoForm;