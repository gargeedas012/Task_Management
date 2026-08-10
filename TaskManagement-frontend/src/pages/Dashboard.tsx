import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Button, Card, Text, Title2 } from "@fluentui/react-components";
import { logout } from "../features/auth/authActions";
import { useState } from "react";
import TodoForm from "./TodoForm";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const [openTodoDialog, setOpenTodoDialog] = useState(false);
    const navigate = useNavigate();
    const Handlelogout = () => {
        dispatch(logout());
        window.location.reload();
    }
    return (
        <div style={{ padding: "40px" }}>
            <Title2>
                Dashboard
            </Title2>
            <br />

            <div style={{ display: "flex", gap: "10px" }}>
                <Button
                    appearance="primary"
                    onClick={() => setOpenTodoDialog(true)}
                >
                    + Add Todo
                </Button>

                <Button
                    appearance="primary"
                    onClick={() => navigate("/view")}
                >
                    View Todo
                </Button>
            </div>
            <TodoForm open={openTodoDialog} onClose={() => setOpenTodoDialog(false)} />
            <br />
            <br />
            <Card style={{ padding: "20px" }}>
                <Text size={400}>
                    Welcome, {user?.username}
                </Text>
                <br />
                <Text>
                    Email: {user?.email}
                </Text>
                <br />
                <Text>
                    Role: {user?.role}
                </Text>
                <br />
                <Button
                    appearance="primary"
                    onClick={Handlelogout}
                >
                    Logout
                </Button>
            </Card>
        </div>
    )
}