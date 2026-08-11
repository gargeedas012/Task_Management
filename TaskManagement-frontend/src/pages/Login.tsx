import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useState } from "react";
import { login } from '../features/auth/authActions';
import { Button, Card, Field, Input, Text, Title3, Toast, ToastBody, ToastTitle, useToastController } from "@fluentui/react-components";
import { getApiErrorMessage } from "../api/apiError";

export function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { dispatchToast  }= useToastController("app-toaster")

    const HandleError = (message: string) => {
        dispatchToast(
            <Toast>
                <ToastTitle>Login Failed</ToastTitle>
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
            HandleSuccess("You Successfully Login")
            setTimeout(()=>{
                navigate("/dashboard");
            },3000)
        } catch (error: any) {
            HandleError(getApiErrorMessage(error))
            // seterror(
            //     error?.response?.data?.message ||
            //     "Invalid email or password"
            // );
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