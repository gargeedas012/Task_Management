import { useState } from "react";
import { Button, Card,Field,Input,Text, Title3, Toast, ToastBody, ToastTitle, useToastController,  Avatar, makeStyles} from "@fluentui/react-components";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { getApiErrorMessage } from "../api/apiError";
import { useAppDispatch } from "../app/hooks";
import { login } from "../features/auth/authActions";
import { PersonRegular, MailRegular, LockClosedRegular, EyeRegular, EyeOffRegular} from "@fluentui/react-icons";

const useStyles = makeStyles({
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",

        background: `
            radial-gradient(
                circle at 10% 20%,
                rgba(99, 102, 241, 0.25),
                transparent 35%
            ),
            radial-gradient(
                circle at 90% 20%,
                rgba(168, 85, 247, 0.20),
                transparent 35%
            ),
            radial-gradient(
                circle at 50% 90%,
                rgba(59, 130, 246, 0.20),
                transparent 40%
            ),
            #f8faff
        `,
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
        borderRadius: "16px",
        boxSizing: "border-box",
        boxShadow: "0 20px 50px rgba(0, 0, 0, 0.10)",

        "@media (max-width: 480px)": {
            padding: "24px",
        },
    },
    header: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        marginBottom: "30px",
    },
    avatar: {
        width: "60px",
        height: "60px",
        marginBottom: "12px",
    },
    subtitle: {
        color: "#666",
        marginTop: "6px",
    },
    field: {
        marginBottom: "18px",
    },
    input: {
        width: "100%",
    },
    eyeButton: {
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        padding: "4px",
    },
    success: {
        display: "block",
        marginBottom: "15px",
        color: "#107c10",
    },
    registerButton: {
        width: "100%",
        height: "42px",
        borderRadius: "8px",
        fontSize: "15px",
        fontWeight: 600,
    },
    footer: {
        textAlign: "center",
        marginTop: "25px",
    },
    link: {
        color: "#6264a7",
        fontWeight: 600,
        textDecoration: "none",
    },
});
function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const { dispatchToast  }= useToastController("app-toaster")
    const dispatch=useAppDispatch()
    const styles = useStyles();
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
        <div className={styles.container}>
            <Card className={styles.card}>
                {/* Header */}
                <div className={styles.header}>
                    <Avatar image={{ src: "https://api.dicebear.com/9.x/thumbs/svg?seed=user1"}} className={styles.avatar}/>
                    <Title3>
                        Create Account
                    </Title3>
                    <Text className={styles.subtitle}>
                        Register for Interview Prep
                    </Text>
                </div>
                {/* Register Form */}
                <form onSubmit={handleRegister}>
                    <Field label="Username" required className={styles.field}>
                        <Input value={username}
                            onChange={(e) =>
                                setUsername(e.target.value)
                            }
                            placeholder="Enter username"
                            contentBefore={<PersonRegular />}
                            className={styles.input}
                        />
                    </Field>
                    <Field label="Email" required className={styles.field} >
                        <Input type="email"  value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            contentBefore={<MailRegular />}
                            className={styles.input}
                        />
                    </Field>
                    <Field label="Password" required className={styles.field} >
                        <Input type={showPassword ? "text" : "password"} value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            contentBefore={<LockClosedRegular />}
                            contentAfter={
                                <button type="button"  className={styles.eyeButton}
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? <EyeOffRegular />: <EyeRegular /> }
                                </button>
                            }
                            className={styles.input}
                        />
                    </Field>
                    {success && (
                        <Text className={styles.success}>
                            {success}
                        </Text>
                    )}
                    <Button appearance="primary" type="submit"  disabled={loading} className={styles.registerButton}>
                        {loading ? "Creating Account..." : "Register" }
                    </Button>
                </form>
                {/* Footer */}
                <div className={styles.footer}>
                    <Text>
                        Already have an account?{" "}
                    </Text>
                    <Link
                        to="/login"
                        className={styles.link}
                    >
                        Login
                    </Link>
                </div>
            </Card>
        </div>
);
}

export default Register;