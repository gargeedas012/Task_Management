import { useState } from "react";
import {
    Button,
    Card,
    Field,
    Input,
    Text,
    Title3,
    Toast,
    ToastBody,
    ToastTitle,
    useToastController,
} from "@fluentui/react-components";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";
import { getApiErrorMessage } from "../api/apiError";
import { useAppDispatch } from "../app/hooks";
import { login } from "../features/auth/authActions";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const { dispatchToast  }= useToastController("app-toaster")
    const dispatch=useAppDispatch()
    const HandleError = (message: string) => {
        dispatchToast(
            <Toast>
                <ToastTitle>Register Failed</ToastTitle>
                <ToastBody>{message}</ToastBody>
            </Toast>,
            {
                intent: "error",
                timeout: 3000,
            }
        );
    };
    const HandleSuccess = (message: string) => {
        dispatchToast(
            <Toast>
                <ToastTitle>Success</ToastTitle>
                <ToastBody>{message}</ToastBody>
            </Toast>,
            {
                intent: "success",
                timeout: 3000,
            }
        );
    };
    const handleRegister = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setSuccess("");

        try {
            setLoading(true);

            const response=await registerUser({
                username,
                email,
                password,
            });
            setSuccess("Registration successful!");
            HandleSuccess("You Have Successfully Register")
            await dispatch(login({ 
                email: response.result.email,
                password: password
            }))
        } catch (error: any) {
            HandleError(getApiErrorMessage(error))
        } finally {
            setLoading(false);
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
                    Create Account
                </Title3>

                <Text>
                    Register for Interview Prep
                </Text>

                <br />

                <form onSubmit={handleRegister}>
                    <Field
                        label="Username"
                        required
                    >
                        <Input
                            value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter username"
                        />
                    </Field>

                    <br />

                    <Field
                        label="Email"
                        required
                    >
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter email"
                        />
                    </Field>

                    <br />

                    <Field
                        label="Password"
                        required
                    >
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter password"
                        />
                    </Field>

                    <br />

                    {success && (
                        <Text>
                            {success}
                        </Text>
                    )}

                    <br />

                    <Button
                        appearance="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </Button>
                </form>

                <br />

                <Text>
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </Text>
            </Card>
        </div>
    );
}

export default Register;