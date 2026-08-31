import { makeStyles, NavItem ,Text } from "@fluentui/react-components";
import {
    HomeRegular,
    FolderRegular,
    TaskListSquareAddRegular,
    SettingsRegular,
} from "@fluentui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles({
    mobileNav: {
        display: "none",
        "@media (max-width: 700px)": {
            position: "fixed",
            display: "flex",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "65px",
            backgroundColor: "var(--bg--card)",
            borderTop: "1px solid var(--border-color)",
            zIndex: 1000,
            alignItems: "center",
            justifyContent: "space-evenly",
            padding: "15px",
            boxSizing: "border-box",
        },
    },

    navitem: {
        backgroundColor: "transparent",
        display:"flex",
        flexDirection:"column",
        color: "var(--permanent-text-color)",
        gap:0,
        alignItems:"center",
        "& svg": {
            color: "var(--permanent-text-color)",
            fill: "var(--permanent-text-color)",
        },

        "&[aria-current='page']": {
            backgroundColor: "transparent",
            color: "var(--primary-color)",
            "& svg": {
                color: "var(--primary-color)",
                fill: "var(--primary-color)",
            },
        },
    },
});

export function MobileSidebar() {
    const styles = useStyles();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className={styles.mobileNav}>
            <NavItem
                value="/dashboard"
                className={styles.navitem}
                icon={<HomeRegular fontSize={24} />}
                onClick={() => navigate("/dashboard")}
                aria-current={
                    location.pathname === "/dashboard" ? "page" : undefined
                }
            ><Text>Home</Text></NavItem>
            <NavItem
                value="/projects"
                className={styles.navitem}
                icon={<FolderRegular fontSize={24} />}
                onClick={() => navigate("/projects")}
                aria-current={
                    location.pathname === "/projects" ? "page" : undefined
                }
            ><Text>Projects</Text></NavItem>
            <NavItem
                value="/tasks"
                className={styles.navitem}
                icon={<TaskListSquareAddRegular fontSize={24} />}
                onClick={() => navigate("/tasks")}
                aria-current={
                    location.pathname === "/tasks" ? "page" : undefined
                }
            ><Text>Tasks</Text></NavItem>
            <NavItem
                value="/settings"
                className={styles.navitem}
                icon={<SettingsRegular fontSize={24} />}
                onClick={() => navigate("/settings")}
                aria-current={
                    location.pathname === "/settings" ? "page" : undefined
                }
            ><Text>Settings</Text></NavItem>
        </div>
    );
}