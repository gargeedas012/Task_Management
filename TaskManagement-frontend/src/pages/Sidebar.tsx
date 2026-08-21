import {makeStyles,Avatar, NavDrawer, NavDrawerBody,NavDrawerHeader,NavItem,Text} from "@fluentui/react-components";
import { HomeRegular, FolderRegular, TaskListSquareAddRegular, SignOutRegular, SettingsRegular ,LayerRegular} from "@fluentui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";


const useStyles= makeStyles({
    logoContainer:{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexDirection:"row",
        padding: "16px",
        boxSizing: "border-box",
    },
    logo:{
         width: "30px",
         height: "30px",
         borderRadius: "50%",
         background: "linear-gradient(135deg, #6d5dfc, #4f46e5)",
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         color: "white",
         boxShadow: "0 0 18px rgba(99, 82, 255, 0.45)",
    },
    logoText:{
      fontSize: "15px",
      fontWeight: 600,
    }
})

export function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const styles= useStyles();
    const user=useAppSelector(state=>state.auth.user)
    return (
        <NavDrawer open={true} type="inline" selectedValue={location.pathname} style={{ width: "240px", minHeight: "100vh" }}>
            <NavDrawerHeader className={styles.logoContainer}>
                <div className={styles.logo}>
                    <LayerRegular fontSize={17} />
                </div>
                <Text className={styles.logoText} size={500} weight="semibold" >
                    Task Management
                </Text>
            </NavDrawerHeader>
            <NavDrawerBody style={{ flex: 1 }}>
                <NavItem  value="/dashboard" icon={<HomeRegular fontSize={24}/>} onClick={() => navigate("/dashboard")}>
                    Dashboard
                </NavItem>
                <NavItem value="/projects" icon={<FolderRegular fontSize={24}/>} onClick={() => navigate("/projects")} >
                    Projects
                </NavItem>
                <NavItem value="/tasks" icon={<TaskListSquareAddRegular fontSize={24} />} onClick={() => navigate("/tasks")} >
                    Tasks
                </NavItem>
                <NavItem value="/logout" icon={<SettingsRegular fontSize={24} />}
                    onClick={() => {
                        // logout logic
                    }}
                >
                    Settings
                </NavItem>
            </NavDrawerBody>
                <div style={{ borderTop: "1px solid #191c27", padding: "18px 16px", display: "flex", alignItems: "center", gap: "12px",  }} >
                    {/* Avatar */}
                    <Avatar image={{src: "https://api.dicebear.com/9.x/thumbs/svg?seed=user1"}}style={{ width: "60px",height: "60px",borderRadius: "50%",}} />
                    {/* User Information */}
                    <div style={{ display: "flex", flexDirection: "column",minWidth: 0  }} >
                        <span style={{  fontSize: "13px", fontWeight: 600}}>
                          {user?.username || "Alex Johnson"}
                        </span>
                        <span style={{ color: "#737991", fontSize: "11px", marginTop: "3px" }} >
                            {user?.email || "alex@gmail.com"}
                        </span>
                    </div>
                </div>
        </NavDrawer>
    );
}