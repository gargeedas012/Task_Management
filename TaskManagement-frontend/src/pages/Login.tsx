import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useState } from "react";
import { login } from '../features/auth/authActions';
import { Button, Card, Field, Input, Text, Title3 } from "@fluentui/react-components";

export function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loading = useAppSelector(state => state.auth.loading);
    const [logindata, setlogindata] = useState({
        email: "",
        password: "",
    });
    const [error, seterror] = useState<string>("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        seterror("");
        try {
            await dispatch(login(logindata));
            navigate("/dashboard");
        } catch (error: any) {
            seterror(
                error?.response?.data?.message ||
                "Invalid email or password"
            );
        }
    };
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card
                style={{
                    width: "400px",
                    padding: "30px",
                }}
            >
                <Title3>
                    Interview Prep
                </Title3>

                <Text>
                    Login to your account
                </Text>

                <form onSubmit={handleLogin}>
                    <Field
                        label="Email"
                        required
                    >
                        <Input
                            type="email"
                            value={logindata.email}
                            onChange={(e) =>
                                setlogindata((prev) => ({ ...prev, email: e.target.value }))
                            }
                            placeholder="Enter your email"
                        />
                    </Field>

                    <br />

                    <Field
                        label="Password"
                        required
                    >
                        <Input
                            type="password"
                            value={logindata.password}
                            onChange={(e) =>
                                setlogindata((prev) => ({ ...prev, password: e.target.value }))
                            }
                            placeholder="Enter your password"
                        />
                    </Field>

                    <br />

                    {error && (
                        <Text>
                            {error}
                        </Text>
                    )}

                    <br />

                    <Button
                        appearance="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
                <br />

                <Text>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </Text>
            </Card>
        </div>
    )
}