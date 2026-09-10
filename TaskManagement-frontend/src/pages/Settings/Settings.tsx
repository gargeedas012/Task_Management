import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { Button, Card, Text, Title2, makeStyles ,Avatar ,Title3} from "@fluentui/react-components";
import { logout } from "../../features/auth/authActions";
import {EditRegular ,DeleteRegular , MailRegular, PersonRegular, ShieldRegular, SignOutRegular} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
const useStyles = makeStyles({
    container: {
        minHeight: "100vh",
        padding: "40px",
        boxSizing: "border-box",
        background: "var(--bg--card)",
        display:"flex",
        flexDirection:"column",
        gap:"20px",
    },
    header: {
        display: "flex",
        flexDirection:"column",
        color:"var(--text-primary)",
        "@media (max-width: 600px)": {
            flexDirection: "column",
            alignItems: "flex-start",
        },
    },
    profileCard: {
        padding: "28px",
        borderRadius: "16px",
        background: "var(--bg--card)",
        border: "1px solid var(--border-color)"
    },
    profileHeader: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        color:"var(--text-primary)",
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
        background: "var(--bg--card)",
        "@media (max-width: 800px)": {
            gridTemplateColumns: "1fr",
        },
    },
    infoBox: {
        padding: "18px",
        borderRadius: "12px",
         background: "var(--bg--card)",
          border: "1px solid var(--border-color)"
    },
    textlabel:{
         color:"var(--text-primary)",
    },
    infoLabel: {
        display: "block",
        color: "var(--permanent-text-color)",
        fontSize: "13px",
        marginBottom: "6px",
    }
});
export function Settings() {
    const dispatch = useAppDispatch();
    const navigate=useNavigate();
    const user = useAppSelector(state => state.auth.user);
    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };
    const styles = useStyles();
return (
    <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
                <Title2>
                    Profile
                </Title2>
                <Text>
                    Manage your personal information
                </Text>
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
                    <Text>
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
                    <Text style={{ fontWeight: 600}} className={styles.textlabel}>
                        {user?.email}
                    </Text>
                </div>
                <div className={styles.infoBox}>
                    <Text className={styles.infoLabel}>
                        <PersonRegular /> Username
                    </Text>
                    <Text style={{ fontWeight: 600}} className={styles.textlabel}> 
                        {user?.username}
                    </Text>
                </div>
                <div className={styles.infoBox}>
                    <Text className={styles.infoLabel}>
                        <ShieldRegular /> Role
                    </Text>
                    <Text style={{ fontWeight: 600}} className={styles.textlabel}>
                        {user?.role}
                    </Text>
                </div>
            </div>
            <Button appearance="secondary" icon={<EditRegular  />}    style={{marginTop:"25px", background: "var(--bg--card)" ,border: "1px solid var(--border-color)" ,color:"var(--text-primary)"}}>
                Edit
            </Button>
        </Card>
        <Card className={styles.profileCard}>
           <Button icon={<DeleteRegular />} style={{ background: "var(--bg--card)" ,border: "1px solid var(--border-color)",color:"var(--text-primary)"}}>
                Delete Account
            </Button>
            {/* Logout */}
            <Button appearance="secondary" icon={<SignOutRegular />}    style={{marginTop:"25px" ,background: "var(--bg--card)" ,border: "1px solid var(--border-color)", color:"var(--text-primary)"}}  onClick={handleLogout}>
                Logout
            </Button>
        </Card>

    </div>
);
}
