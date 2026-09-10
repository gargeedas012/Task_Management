import { Avatar,Button,makeStyles, Text,} from "@fluentui/react-components";
import { WeatherMoonRegular, AlertRegular, WeatherSunnyRegular } from "@fluentui/react-icons";
import { useTheme } from "../../../../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { useLayoutEffect, useState } from "react";

const useStyles = makeStyles({
    navbar: {
        height: "70px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backgroundColor: "var(--bg--card)",
        borderBottom: "3px solid var(--border-color)",
        boxSizing: "border-box",  
        borderLeft: "1px solid var(--border-color)"
    },
    title: {
        color: "var(--text-primary)",
    },
    actions: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    iconButton: {
        color: "var(--text-primary)",
        "&:hover": {
        backgroundColor: "var(--nav-selected-bg)",
        color: "var(--primary-color)",
    },
    },
    avatar: {
        color: "white",
    },
});

export function Navbar() {
    const styles = useStyles();
    const {theme, toggleTheme}=useTheme();
    const [ title, setTitle ] = useState("DashBoard");   
    const location = useLocation();
    useLayoutEffect(() => {
        contentchecker();
        }, [location.pathname]);
    const contentchecker = () => {
        if (location.pathname === "/dashboard") {
            setTitle("Dashboard")
            return
        }
        else if (location.pathname === "/projects") {
            setTitle("Projects")
            return;
        }
        else if (location.pathname === "/tasks") {
            setTitle("My Tasks")
            return;
        }
        else if (location.pathname === "/tasks/new") {
            setTitle("Add New Task");
            return;
        }
        else if (location.pathname === "/tasks/Edit") {
            setTitle("Edit Task");
            return;
        }
        else if (location.pathname === "/viewtask") {
            setTitle("View Task");
            return;
        }
        else if (location.pathname === "/settings") {
            setTitle("Profile")
            return;
        }
        else if (location.pathname.startsWith("/home/")) {
            setTitle("My Tasks")
            return;
        }
    }
    return (
        <nav className={styles.navbar}>
            <Text size={400} weight="semibold" className={styles.title}>
                {title}
            </Text>
            <div className={styles.actions}>
                <Button appearance="subtle" icon={theme==="light"? <WeatherSunnyRegular /> : <WeatherMoonRegular />} className={styles.iconButton}  onClick={toggleTheme}/>
                <Button appearance="subtle" icon={<AlertRegular />}  className={styles.iconButton}/>
                <Avatar name="AJ" className={styles.avatar} />
            </div>
        </nav>
    );
}

