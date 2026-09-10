import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useState } from "react";
import { login } from '../../features/auth/authActions';
import { Button, Card, Field, Input, Text, Title3, Toast, ToastBody, ToastTitle, useToastController } from "@fluentui/react-components";
import { getApiErrorMessage } from "../../api/apiError";
import { GoogleLogin } from "@react-oauth/google";
import { GoogleLoginFun } from "../../api/authApi";
import { loginSuccess } from "../../features/auth/authSlice";
import { MailRegular ,LockClosedRegular , EyeRegular, EyeOffRegular,} from "@fluentui/react-icons";
import { Avatar ,makeStyles} from "@fluentui/react-components";

    const useStyles = makeStyles({
    card: {
        width: "100%",
        maxWidth: "420px",
        padding: "40px",
        borderRadius: "16px",
        boxSizing: "border-box",
        "@media (max-width: 480px)": {
        padding: "24px",
        },
    },

    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        background: `
        radial-gradient(circle at 10% 20%, rgba(99,102,241,0.25), transparent 35%),
        radial-gradient(circle at 90% 20%, rgba(168,85,247,0.20), transparent 35%),
        radial-gradient(circle at 50% 90%, rgba(59,130,246,0.20), transparent 40%),
        #f8faff
        `
    },
    });
export function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { dispatchToast } = useToastController("app-toaster")
    const [showPassword, setShowPassword] = useState(false);
    const styles = useStyles();
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
       
        if(logindata.email && logindata.password)
        {
          try {
            await dispatch(login(logindata));
            HandleSuccess("You Successfully Login")
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000)
            } catch (error: any) {
                HandleError(getApiErrorMessage(error))
            }
        }else{
             seterror("Email and Password is required");
        }
    };
    const handleGoogleLogin = async (credentialResponse: any) => {
        try {
            const response = await GoogleLoginFun(credentialResponse);

            console.log(response);

            HandleSuccess("You successfully logged in with Google");
            dispatch(loginSuccess({
                username: response.result.username,
                userId: response.result.userId,
                email: response.result.email,
                role: response.result.role
            }))
            setTimeout(() => {
                navigate("/dashboard");
            }, 3000);

        } catch (error: any) {
            HandleError(getApiErrorMessage(error));
        }
    };
    return (
        <div className={styles.container} >
            <Card className={styles.card}>
                {/* Header */}
                <div style={{display: "flex", flexDirection: "column",textAlign: "center",marginBottom: "30px", alignItems: "center",justifyContent: "center"}}>
                    <Title3>
                        Welcome Back
                    </Title3>
                      <Avatar image={{src: "https://api.dicebear.com/9.x/thumbs/svg?seed=user1"}}style={{ width: "60px",height: "60px",borderRadius: "50%",}} />
                    <Text style={{color: "#666"}}>
                        Login to your Task Mangement account
                    </Text>
                </div>
                {/* Login Form */}
                <form onSubmit={handleLogin}>
                    <Field label={
                        <>
                        Email {!logindata.email && <span style={{ color: "red" }}>*</span>}
                        </>
                    } >
                        <Input type="email" value={logindata.email}
                            onChange={(e) =>
                                setlogindata((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            contentBefore={<MailRegular />}
                            placeholder="Enter your email" style={{ width: "100%"}} />
                    </Field>
                    <div style={{ height: "18px" }} />
                    <Field label={
                        <>
                        Password {!logindata.password && <span style={{color:"red"}}>*</span>}
                        </>
                    }>
                        <Input type={showPassword ? "text" : "password"} value={logindata.password}
                            onChange={(e) =>
                                setlogindata((prev) => ({
                                    ...prev,
                                    password: e.target.value,
                                }))
                            }
                            contentBefore={<LockClosedRegular/>}
                            contentAfter={
                                <button type="button" onClick={()=>setShowPassword(!showPassword)} style={{border:"none", background:"transparent", cursor:"pointer" }}>{showPassword ? <EyeOffRegular /> : <EyeRegular />}</button>
                            }
                            placeholder="Enter your password"
                            style={{
                                width: "100%",
                            }}
                        />
                    </Field>
                    {error && (
                        <Text  style={{ display: "block", marginTop: "10px", color: "#d13438" }}>
                            {error}
                        </Text>
                    )}
                    <div style={{ height: "22px" }} />
                    <Button appearance="primary" type="submit" disabled={loading} style={{ width: "100%",height: "42px", borderRadius: "8px",fontSize: "15px", fontWeight: 600 }}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </form>
                {/* Divider */}
                <div style={{ display: "flex", alignItems: "center",  gap: "12px", margin: "24px 0"}} >
                    <div style={{ flex: 1, height: "1px", background: "#ddd" }} />
                    <Text style={{color: "#888", fontSize: "12px"}}>
                        OR
                    </Text>
                    <div style={{ flex: 1, height: "1px",background: "#ddd" }} />
                </div>
                {/* Google Login */}
                <div style={{ display: "flex",justifyContent: "center",marginBottom: "25px" }}>
                    <GoogleLogin onSuccess={handleGoogleLogin}
                        onError={() => {
                            HandleError("Google login failed");
                        }}
                        theme="outline"
                        size="large"
                        text="continue_with"
                        shape="rectangular"
                    />
                </div>
                {/* Register */}
                <div style={{ textAlign: "center", paddingTop: "5px", }}>
                    <Text style={{ color: "#666" }}>
                        Don't have an account?{" "}
                    </Text>
                    <Link to="/register" style={{ color: "#6264a7",fontWeight: 600,textDecoration: "none" }}>
                        Create an account
                    </Link>
                </div>
            </Card>
        </div>
    )
}