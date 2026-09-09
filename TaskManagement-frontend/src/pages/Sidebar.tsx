import { makeStyles, Avatar, NavDrawer, NavDrawerBody, NavDrawerHeader, NavItem, Text } from "@fluentui/react-components";
import { HomeRegular, FolderRegular, TaskListSquareAddRegular, SettingsRegular, LayerRegular, CalendarRegular } from "@fluentui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";


const useStyles = makeStyles({
    logoContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexDirection: "row",
        padding: "16px",
        boxSizing: "border-box",
        "@media (max-width: 480px)": {
            justifyContent: "center",
            padding: "16px 8px",
        },
    },
    logo: {
        width: "35px",
        height: "35px",
        borderRadius: "40%",
        background: "linear-gradient(135deg, #6d5dfc, #4f46e5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 18px rgba(99, 82, 255, 0.45)",
    },
    sidebar: {
        width: "240px",
        minWidth: "240px",
        background: "var(--bg--card)",
        borderRight: "1px solid var(--border-color)",
        "@media (max-width: 700px)": {
            width: "70px",
            minWidth: "70px",
        },
    },
    logoText: {
        fontSize: "15px",
        fontWeight: 600,
        "@media (max-width: 700px)": {
            display: "none",
        },
        color: "var(--text-primary)"
    },
    navitem: {
        backgroundColor: "transparent",
        borderRadius: "10px",
        color: "var(--permanent-text-color)",
        "& svg": {
            color: "var(--permanent-text-color)",
            fill: "var(--permanent-text-color)",
        },
        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
        },
        "&[aria-current='page']": {
            backgroundColor: "var(--nav-selected-bg)",
            border: "1px solid var(--nav-selected-border)",
            color: "var(--primary-color)",
            position: "relative",
            "& span": {
                color: "var(--primary-color)",
            },
            "& svg": {
                color: "var(--primary-color)",
                fill: "var(--primary-color)",
            },
        },
        "&[aria-current='page']:hover": {
            backgroundColor: "var(--nav-selected-bg)",
        },
        "&[aria-current='page']::after": {
            content: '""',
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "6px",
            height: "6px",
            backgroundColor: "var(--primary-color)",
            borderRadius: "50%",
            display: "block",
        },
        "&[aria-current='page']::before": {
            display: "none",
        },
    },
})
export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const styles = useStyles();
    const user = useAppSelector(state => state.auth.user);
    const selectedNav = location.pathname.startsWith("/tasks") || location.pathname === "/addtask" ? "/tasks" : location.pathname;

    return (
        <NavDrawer open={true} type="inline" selectedValue={selectedNav} style={{ minHeight: "100vh" }} className={styles.sidebar}>
            <NavDrawerHeader className={styles.logoContainer}>
                <div className={styles.logo}>
                    <LayerRegular fontSize={25} style={{
                        color: "#aeb6c2",
                        fill: "#aeb6c2",
                    }} />
                </div>
                <Text className={styles.logoText} size={500} weight="semibold" >
                    Task Management
                </Text>
            </NavDrawerHeader>
            <NavDrawerBody style={{ marginRight: "10px", marginTop: "10px" }}>
                <div style={{ padding: "8px 16px", fontSize: "10px", fontWeight: "bold", color: "#6b7280", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "4px" }}>
                    Main Menu
                </div>
                <NavItem value="/dashboard" className={styles.navitem} icon={<HomeRegular fontSize={24} />} onClick={() => navigate("/dashboard")}>
                    <span>Dashboard</span>
                </NavItem>
                <NavItem value="/projects" className={styles.navitem} icon={<FolderRegular fontSize={24} />} onClick={() => navigate("/projects")} >
                    <span>Projects</span>
                </NavItem>
                <NavItem value="/tasks" className={styles.navitem} icon={<TaskListSquareAddRegular fontSize={24} />} onClick={() => navigate("/tasks")} >
                    <span >Tasks</span>
                </NavItem>
                <NavItem value="/calender" className={styles.navitem} icon={<CalendarRegular  fontSize={24} />} onClick={() => navigate("/calender")}>
                    <span >Calender</span>
                </NavItem>
                <NavItem value="/settings" className={styles.navitem} icon={<SettingsRegular fontSize={24} />} onClick={() => navigate("/settings")}>
                    <span >Settings</span>
                </NavItem>
            </NavDrawerBody>
            <div style={{ borderTop: "1px solid var(--border-color)", padding: "18px 16px", display: "flex", alignItems: "center", gap: "12px" }} >
                {/* Avatar */}
                <Avatar image={{ src: "https://api.dicebear.com/9.x/thumbs/svg?seed=user1" }} className={styles.logo} />
                {/* User Information */}
                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                    <span style={{ fontSize: "13px", fontWeight: 600 , color:"var(--permanent-text-color)"}}>
                        {user?.username || "Alex Johnson"}
                    </span>
                    <span style={{ color:"var(--permanent-text-color)" , fontSize: "11px", marginTop: "3px" }}>
                        {user?.email || "alex@gmail.com"}
                    </span>
                </div>
            </div>
        </NavDrawer>
    );
}