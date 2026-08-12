import { useState } from "react";
import { Button, Card, Title2, Text } from "@fluentui/react-components";
import TodoList from "./TodoList";
import TodoForm from "./TodoForm";
import type { Project } from "../types/project";
import { useLocation } from "react-router-dom";



function ProjectBoard() {
    const [openTodoDialog, setOpenTodoDialog] = useState(false);
    const [refreshList, setRefreshList] = useState(0);
    const location=useLocation();
    const project=location.state?.project as Project
    console.log("project come",project);
    const handleAddTodo = () => {
        setOpenTodoDialog(true);
    };
    const handleCloseTodo = () => {
        setOpenTodoDialog(false);
    };
    const handleSuccessTodo = () => {
        setRefreshList(prev => prev + 1);
    };
    return (
        <div
            style={{
                padding: "30px",
            }}
        >
            <Card>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}
                >
                    <div style={{ marginBottom: "20px" }}>
                        <Title2>
                            {project?.name ?? ""}
                        </Title2>

                        <Text>
                            {project?.description ?? ""}
                        </Text>
                    </div>

                    <Button
                        appearance="primary"
                        onClick={handleAddTodo}
                    >
                        Add Todo
                    </Button>
                </div>

                {/* Todo List */}
                <TodoList projectid={project.id ?? ""} refreshTrigger={refreshList} />
            </Card>
            {/* Todo Form Dialog */}
            <TodoForm
                open={openTodoDialog}
                projectid={project.id ?? ""}
                onClose={handleCloseTodo}
                onSuccess={handleSuccessTodo}
            />

        </div>
    );
}

export default ProjectBoard;