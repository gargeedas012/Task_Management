import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Button, Card, Text, Title2, makeStyles ,Avatar ,Title3} from "@fluentui/react-components";
import { logout } from "../features/auth/authActions";
import { useNavigate } from "react-router-dom";
import { AddRegular, ArrowRightRegular, MailRegular, PersonRegular, ShieldRegular, SignOutRegular} from "@fluentui/react-icons";

const useStyles = makeStyles({
    container: {
        minHeight: "100vh",
        padding: "40px",
        boxSizing: "border-box",
        background: `
            radial-gradient(
                circle at 10% 20%,
                rgba(99, 102, 241, 0.18),
                transparent 35%
            ),
            radial-gradient(
                circle at 90% 20%,
                rgba(168, 85, 247, 0.15),
                transparent 35%
            ),
            radial-gradient(
                circle at 50% 90%,
                rgba(59, 130, 246, 0.15),
                transparent 40%
            ),
            #f8faff
        `,

        "@media (max-width: 600px)": {
            padding: "20px",
        },
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        "@media (max-width: 600px)": {
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "15px",
        },
    },
    title: {
        margin: 0,
    },
    subtitle: {
        color: "#666",
        marginTop: "5px",
    },
    actions: {
        display: "flex",
        gap: "10px",
        marginBottom: "30px",
        "@media (max-width: 500px)": {
            flexDirection: "column",
        },
    },
    actionButton: {
        minWidth: "150px",
        "@media (max-width: 500px)": {
            width: "100%",
        },
    },
    profileCard: {
        padding: "28px",
        borderRadius: "16px",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.08)",
        marginBottom: "25px",
    },
    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px",
    },
    avatar: {
        width: "60px",
        height: "60px",
    },
    userInfo: {
        display: "flex",
        flexDirection: "column",
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "15px",
        "@media (max-width: 700px)": {
            gridTemplateColumns: "1fr",
        },
    },
    infoBox: {
        padding: "18px",
        borderRadius: "12px",
        backgroundColor: "#f7f7fb",
    },
    infoLabel: {
        display: "block",
        color: "#777",
        fontSize: "13px",
        marginBottom: "6px",
    },
    infoValue: {
        fontWeight: 600,
    },
    logout: {
        marginTop: "25px",
    },
});
export function Dashboard() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const navigate = useNavigate();
    const Handlelogout = () => {
        dispatch(logout());
        window.location.reload();
    }
    const styles = useStyles();
return (
    <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
            <div>
                <Title2 className={styles.title}>
                    Dashboard
                </Title2>
                <Text className={styles.subtitle}>
                    Manage your projects and tasks
                </Text>
            </div>
        </div>
        {/* Actions */}
        <div className={styles.actions}>
            <Button
                appearance="primary"
                icon={<AddRegular />}
                className={styles.actionButton}
                onClick={() => navigate("/projects")}
            >
                Add Project
            </Button>
            <Button
                appearance="secondary"
                icon={<ArrowRightRegular />}
                className={styles.actionButton}
                onClick={() => navigate("/viewproject")}
            >
                View Projects
            </Button>
        </div>
        {/* Profile */}
        <Card className={styles.profileCard}>
            <div className={styles.profileHeader}>
                <Avatar
                    image={{
                        src: "https://api.dicebear.com/9.x/thumbs/svg?seed=user1",
                    }}
                    className={styles.avatar}
                />
                <div className={styles.userInfo}>
                    <Title3>
                        Welcome, {user?.username}
                    </Title3>
                    <Text className={styles.subtitle}>
                        Your account information
                    </Text>
                </div>
            </div>
            {/* User Information */}
            <div className={styles.infoGrid}>
                <div className={styles.infoBox}>
                    <Text className={styles.infoLabel}>
                        <MailRegular /> Email
                    </Text>
                    <Text className={styles.infoValue}>
                        {user?.email}
                    </Text>
                </div>
                <div className={styles.infoBox}>
                    <Text className={styles.infoLabel}>
                        <PersonRegular /> Username
                    </Text>
                    <Text className={styles.infoValue}>
                        {user?.username}
                    </Text>
                </div>
                <div className={styles.infoBox}>
                    <Text className={styles.infoLabel}>
                        <ShieldRegular /> Role
                    </Text>
                    <Text className={styles.infoValue}>
                        {user?.role}
                    </Text>
                </div>
            </div>
            {/* Logout */}
            <Button appearance="secondary" icon={<SignOutRegular />} className={styles.logout} onClick={Handlelogout}>
                Logout
            </Button>
        </Card>

    </div>
);
}