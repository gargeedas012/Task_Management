import { useAppDispatch, useAppSelector } from "../app/hooks"
import { logout } from "../features/auth/authSlice";
import { Button, Card, Text, Title2 } from "@fluentui/react-components";

export function Dashboard() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const Handlelogout = () => {
        dispatch(logout())
    }
    return (
        <div style={{ padding: "40px" }}>
            <Title2>
                Dashboard
            </Title2>

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