import { useState } from "react";
import {
    Button,
    Card,
    Field,
    Input,
    Text,
    Title3,
} from "@fluentui/react-components";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../api/authApi";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            await registerUser({
                username,
                email,
                password,
            });
            setSuccess("Registration successful!");
            window.location.reload();
            navigate("/dashboard")
        } catch (error: any) {
            setError(
                error?.response?.data?.message ||
                "Registration failed"
            );
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

                    {error && (
                        <Text>
                            {error}
                        </Text>
                    )}

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