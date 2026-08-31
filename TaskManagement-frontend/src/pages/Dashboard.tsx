import { makeStyles } from "@fluentui/react-components"
import { Badge, Button, Card, Text } from "@fluentui/react-components";
import { LayerRegular, ArrowTrendingRegular, TargetRegular, CheckmarkCircleRegular, } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { getAllRecentProjects, GetProjectInfo, getrecentTodos } from "../api/authApi";
import { useAppSelector } from "../app/hooks";
import { type RecentProject, type GetProjectInfoDto } from "../types/project";
import type { Todo, TodoResponse } from "../types/todo";

const useStyle = makeStyles({
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "70%",
       marginLeft:"auto",
       marginRight:"auto",
        boxSizing: "border-box",
    },
    card: {
        backgroundColor: "var(--bg--card)",
        minHeight: "120px",
        minWidth:"120px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        borderRadius: "20px",
        gap: "3px",
        padding:"25px",
        border: "1px solid var(--border-color)"
    },
    logo: {
        width: "45px",
        height: "45px",
        borderRadius: "40%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        background: "#e6e3fc"
    },
    cards: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "12px",

        "@media (max-width: 1024px)": {
            gridTemplateColumns: "repeat(2, 1fr)",
        },

        "@media (max-width: 600px)": {
            gridTemplateColumns: "1fr",
        },
    },
    projectHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    projectGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "14px",

        "@media (max-width: 900px)": {
            gridTemplateColumns: "1fr",
        },
    },
    projectCard: {
        background:"var(--bg--card)",
        padding: "20px",
        border: "1px solid var(--border-color)",
        borderRadius: "18px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        boxSizing: "border-box",
    },
    projectTitleRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "10px",
    },
    progress: {
        width: "100%",
        height: "5px",
        backgroundColor: "#999fb6",
        borderRadius: "20px",
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#6d5dfc",
        borderRadius: "8px",
    },
    projectDetails: {
        display: "flex",
        gap: "15px",
        color: "var(--permanent-text-color)",
        fontSize: "13px",
        flexWrap: "wrap",
    },
    bottom: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        border: "1px solid var(--border-color)",
        borderRadius: "18px",
        overflow: "hidden",
    },
    taskCard: {
        minHeight: "74px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 14px",
        boxSizing: "border-box",
        backgroundColor: "var(--bg--card)",
        gap: "10px",
        border: "1px solid var(--border-color)"
    },

    taskInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "3px",
        flex: 1,
        padding:"6px",
        marginLeft:"8px"
    },
    primaryText:{
        color:"var(--text-primary)"
    }
});
export function Dashboard() {
    const styles = useStyle();
    const user = useAppSelector((state) => state.auth.user);
    const [response, setResponse] = useState<GetProjectInfoDto | null>(null);
    const [recentProject, setRecentProject] = useState<RecentProject[]>([]);
    const [recentTodos, setrecentTodos]= useState<TodoResponse[]>([]);
    useEffect(() => {
        const fetchProjectInfo = async () => {
            if (!user?.userId) return;

            try {
                const result = await GetProjectInfo(user.userId);
                setResponse(result.result);
            } catch (error) {
                console.error("Failed to fetch project info:", error);
                setResponse(null);
            }
        };
        const fetchRecentProject = async () => {
            if (!user?.userId) return;
            try {
                const result = await getAllRecentProjects(user.userId);
                setRecentProject(Array.isArray(result.result) ? result.result : []);
            } catch (err) {
                setRecentProject([]);
            }
        };
        const fetchRecentTodos = async () => {
            if (!user?.userId) return;
            try {
                const result = await getrecentTodos(user.userId);
                setrecentTodos(Array.isArray(result.result) ? result.result : []);
            } catch (err) {
                setRecentProject([]);
            }
        };
        fetchProjectInfo();
        fetchRecentProject();
        fetchRecentTodos();
    }, [user?.userId]);

    const statusStyle = {
    Active: {
        backgroundColor: "#d4f5ea",
        color: "#007A55",
        borderColor: "#aaf0db"
    },
    Pending: {
        backgroundColor: "#ffe7d7",
        color: "#BB4D00",
        borderColor: "#f1ba93"
    },
    Completed: {
        backgroundColor: "#ecdcff",
        color: "#7008E7",
        borderColor: "#c79df7"
    }
    };
    return (
        <div className={styles.container}>
            {/* 4 cards */}
            <div className={styles.cards}>
                <div className={styles.card}>
                    <div className={styles.logo}>
                        <LayerRegular fontSize={30} style={{color:"#4F39F6"}}/>
                    </div>
                    <Text size={400} weight="semibold"  style={{color:"var(--permanent-text-color)", fontSize:"12"}}>Total Project</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.totalProjects}</Text>
                </div>
                <div className={styles.card}>
                    <div className={styles.logo} style={{ background: "#d4f5ea" }}>
                        <ArrowTrendingRegular fontSize={30} style={{color:"#009966"}}/>
                    </div>
                    <Text size={400} weight="semibold" style={{color:"var(--permanent-text-color)", fontSize:"12"}} >Active Projects</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.activeProjects}</Text>
                </div>
                <div className={styles.card}>
                    <div className={styles.logo} style={{ background: "#d6ebf7"}}>
                        <TargetRegular fontSize={30} style={{color:"#0084D1"}}/>
                    </div>
                    <Text size={400} weight="semibold" style={{color:"var(--permanent-text-color)",fontSize:"12"}} >Total Task</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.totalTasks}</Text>
                </div>
                <div className={styles.card}>
                    <div className={styles.logo} style={{ background: "#e3d9f0", }}>
                        <CheckmarkCircleRegular fontSize={30} style={{color:"#7F22FE"}}/>
                    </div>
                    <Text size={400} weight="semibold" style={{color:"var(--permanent-text-color)",fontSize:"12"}}>Completed Task</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.completedTask}</Text>
                </div>
            </div>
            {/* Middle */}
            <div className={styles.projectHeader}>
                <Text size={500} weight="bold" className={styles.primaryText} >Recent Projects</Text>
                <Button appearance="transparent" style={{color:"#4F39F6"}}>
                    View all →
                </Button>
            </div>
            <div>
                <div className={styles.projectGrid}>
                    {recentProject.map((project) => (
                        <Card key={project.id} className={styles.projectCard}>
                            <div className={styles.projectTitleRow} >
                                <Text size={500} weight="semibold" className={styles.primaryText}>
                                    {project.name}
                                </Text>
                                <Badge style={statusStyle[project.status as keyof typeof statusStyle]}>
                                    {project.status}
                                </Badge>
                            </div>
                            <Text style={{ color: "var(--permanent-text-color)", }}>
                                {project.description}
                            </Text>
                            <div className={styles.progress}>
                                <div
                                    className={styles.progressBar}
                                    style={{
                                        width: `${project.totalTasks >0 ?(project.completedTasks/project.totalTasks) * 100 : 0 }%`,
                                    }}
                                />
                            </div>
                            <div className={styles.projectDetails}>
                                <span>
                                    {`${project.totalTasks >0 ?(project.completedTasks/project.totalTasks) * 100 : 0 }%`} done
                                </span>
                                <span>·</span>
                                <span>{project.completedTasks}/{project.totalTasks}</span>
                                <span>·</span>
                                <span>
                                    📅 {project.projectDueDate}
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
            {/* Bottom */}
            <div className={styles.projectHeader}>
                <Text size={500} weight="bold" className={styles.primaryText}>Recent Tasks</Text>
                <Button appearance="transparent" style={{color:"#4F39F6"}}>
                    View all →
                </Button>
            </div>
            <div className={styles.bottom}>
                <div style={{ display: "flex", flexDirection: "column" , borderRadius:"30%" }}>
                    {recentTodos.slice(0, 5).map((task) => (
                        <div className={styles.taskCard}>
                            <div className={styles.taskInfo}>
                                <Text size={500} weight="semibold" style={{fontSize:"14"}} className={styles.primaryText}>{task.title}</Text>
                                <Text size={400} weight="semibold" style={{color:"var(--permanent-text-color)",fontSize:"12"}}>{task.projectName
                                    }</Text>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <Badge
                                    appearance="tint"
                                    color={
                                        task.priority === "High"
                                            ? "danger"
                                            : task.priority === "Low"
                                                ? "warning"
                                                : "success"
                                    }
                                >
                                    {task.priority}
                                </Badge>
                                <Text weight="semibold" style={{color:"var(--permanent-text-color)"}}>
                                    {task.todoDueDate}
                                </Text>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}