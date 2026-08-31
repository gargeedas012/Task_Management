import { useAppDispatch, useAppSelector } from "../app/hooks"
import { Button, Card, Text, Title2, makeStyles ,Avatar ,Title3} from "@fluentui/react-components";
import { logout } from "../features/auth/authActions";
import {EditRegular ,DeleteRegular , MailRegular, PersonRegular, ShieldRegular, SignOutRegular} from "@fluentui/react-icons";
const useStyles = makeStyles({
    container: {
        minHeight: "100vh",
        padding: "40px",
        boxSizing: "border-box",
        display:"flex",
        flexDirection:"column",
        gap:"20px"
    },
    header: {
        display: "flex",
        flexDirection:"column",
        "@media (max-width: 600px)": {
            flexDirection: "column",
            alignItems: "flex-start",
        },
    },
    profileCard: {
        padding: "28px",
        borderRadius: "16px",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.08)"
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
    }
});
export function Settings() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.auth.user);
    const Handlelogout = () => {
        dispatch(logout());
        window.location.reload();
    }
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
                    <Text style={{ fontWeight: 600}}>
                        {user?.email}
                    </Text>
                </div>
                <div className={styles.infoBox}>
                    <Text className={styles.infoLabel}>
                        <PersonRegular /> Username
                    </Text>
                    <Text style={{ fontWeight: 600}}>
                        {user?.username}
                    </Text>
                </div>
                <div className={styles.infoBox}>
                    <Text className={styles.infoLabel}>
                        <ShieldRegular /> Role
                    </Text>
                    <Text style={{ fontWeight: 600}}>
                        {user?.role}
                    </Text>
                </div>
            </div>
            <Button appearance="secondary" icon={<EditRegular  />}    style={{marginTop:"25px"}}>
                Edit
            </Button>
        </Card>
        <Card className={styles.profileCard}>
           <Button icon={<DeleteRegular />} style={{borderColor:"red", color:"red"}}>
                Delete Account
            </Button>
            {/* Logout */}
            <Button appearance="secondary" icon={<SignOutRegular />}    style={{marginTop:"25px"}}  onClick={Handlelogout}>
                Logout
            </Button>
        </Card>

    </div>
);
}
