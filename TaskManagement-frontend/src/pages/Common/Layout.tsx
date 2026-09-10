import { Outlet } from "react-router-dom";
import { Sidebar } from "../Common/Sidebar/Sidebar";
import { makeStyles } from "@fluentui/react-components";
import { Navbar } from "../Common/Navber/Navbar";
import {MobileSidebar} from "../Common/Sidebar/MobileSidebar";
import { useIsMobile } from "../useIsMobile";

const useStyles = makeStyles({
    container: {
        display: "flex",
        height: "100vh",
    },
    content:{
        display:"flex",
        flex:1,
        flexDirection:"column"
    },
    main: {
        flex: 1,
        padding: "30px",
        boxSizing: "border-box",
        overflowY: "auto",
        overflowX: "hidden",
        background: "var(--bg-primary)",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
            display: "none",
        },
        "@media (max-width: 800px)": {
            padding: "16px",
        },      
    },
});
export function Layout()
{
    const styles = useStyles();
    const isMobile=useIsMobile();
    return(
        <div className={styles.container}>
            {isMobile ? <MobileSidebar /> : <Sidebar />}
            <div className={styles.content}>
                <Navbar/>
                <main className={styles.main}>
                <Outlet/>
            </main>
            </div>
        </div>
    )
}
