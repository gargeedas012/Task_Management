import {
    Card,
    Badge,
    Text,
    makeStyles,
} from "@fluentui/react-components";

import type { NewProject } from "../types/project";
import { useEffect, useState } from "react";
import { getAllProjects } from "../api/authApi";
import { useAppSelector } from "../app/hooks";

import {
    CalendarRegular,
    PersonRegular,
} from "@fluentui/react-icons";


const useStyles = makeStyles({
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "16px",

        "@media (max-width: 768px)": {
            gridTemplateColumns: "1fr",
        },
    },

    card: {
        position: "relative",
        padding: "20px 16px 14px",
        borderRadius: "12px",
        backgroundColor: "var(--bg--card)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
        minHeight: "230px",
        
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "10px",
        marginBottom: "5px",
    },
    title: {
        fontSize: "18px",
        color: "var(--text-primary)",
    },

    description: {
        fontSize: "15px",
        lineHeight: "1.6",
        color: "var(--permanent-text-color)",
        minHeight: "38px",
    },

    manager: {
        display: "flex",
        alignItems: "center",
        gap: "8px",

    },

    avatar: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-primary)",
        color: "var(--primary-color)",
        border:"1px solid var(--primary-color)"
    },

    managerInfo: {
        display: "flex",
        flexDirection: "column",
    },

    label: {
        fontSize: "12px",
        color: "var(--permanent-text-color)",
    },

    value: {
        color: "var(--text-primary)",
        fontWeight: 500,
    },

    details: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid var(--border-color)",
        paddingTop: "12px",
        marginTop: "8px",
        gap: "10px",
    },

    detailItem: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        gap: "3px",
    },

    icon: {
        fontSize: "16px",
        color: "var(--text-primary)",
    },

    detailValue: {
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--text-primary)",
        textAlign: "center",
    },

    detailLabel: {
        fontSize: "9px",
        color: "var(--text-secondary)",
        textAlign: "center",
    },

    priority: {
        marginTop: "10px",
        display: "flex",
        justifyContent: "flex-end",
    },

    progressContainer: {
        marginTop: "8px",
    },

    progressBackground: {
        height: "5px",
        backgroundColor: "#eeeeee",
        borderRadius: "10px",
        overflow: "hidden",
    },

    progressBar: {
        height: "100%",
        borderRadius: "10px",
    },
     Completed: {
        backgroundColor: "#ECFDF5",
        color: "#047857",
        border: "1px solid #A7F3D0",
    },

    NotStarted: {
        backgroundColor: "#F8FAFC",
        color: "#64748B",
        border: "1px solid #E2E8F0",
    },

    OnHold: {
        backgroundColor: "#FEF2F2",
        color: "#B91C1C",
        border: "1px solid #FECACA",
    },

    InProgress: {
        backgroundColor: "#EFF6FF",
        color: "#2563EB",
        border: "1px solid #BFDBFE",
    },
});


function ProjectList() {

    const [project, setProjects] = useState<NewProject[]>([]);
    const user = useAppSelector(
        state => state.auth.user
    );
    const styles = useStyles();
    useEffect(() => {
        const loadProjects = async () => {
            const response = await getAllProjects(
                user?.userId ?? ""
            );
            setProjects(response.result);
        };
        if (user?.userId) {
            loadProjects();
        }
    }, [user?.userId]);


    const formatDate = (date?: string | null) => {
        if (!date) {
            return "No due date";
        }
        return new Date(date).toLocaleDateString(
            "en-US",
            {
                month: "short",
                day: "numeric",
                year: "numeric",
            }
        );
    };

    const getStatus = (status:number) => {
        switch (status) {
            case 0:
                return "Not Started";
            case 1:
                return "In Progress";
            case 2:
                return "On Hold";
            case 3:
                return "Completed";
            default:
                return "Not Found";
        }
    };
    const getStatusColor = (status:number) => {
        switch (status) {
            case 0:
                return "#64748B";
            case 1:
                return "#2563EB";
            case 2:
                return "#B91C1C";
            case 3:
                return "#047857";
            default:
                return "Not Found";
        }
    };
        const getPriority = (status:number) => {
        switch (status) {
            case 0:
                return "Low";
            case 1:
                return "Medium";
            case 2:
                return "High";
            case 3:
                return "Critical";
            default:
                return "Not Found";
        }
    };

    return (
        <div className={styles.grid}>
            {project.map((item) => {
                const progress = ( item.completedTask>0?Math.round((item.completedTask/item.totalTask)*100):0 );
                return (
                    <Card key={item.id} className={styles.card} style={{borderTop:`5px solid ${getStatusColor(item.status)}`}}>
                        {/* Header */}
                        <div className={styles.header}>
                            <Text weight="bold" className={styles.title}>
                                {item.name}
                            </Text>
                            <Badge
                                 className={
                                    item.status === 3
                                        ? styles.Completed
                                        : item.status === 2
                                        ? styles.OnHold
                                        : item.status === 0
                                        ? styles.NotStarted
                                        : styles.InProgress
                                }
                            >
                                {getStatus(item.status)}
                            </Badge>
                        </div>
                        {/* Description */}
                        <Text weight="semibold" className={styles.description}>
                            {item.description}
                        </Text>
                        {/* Project Manager */}
                        <div className={styles.manager}>
                            <div className={styles.avatar}>
                                <PersonRegular />
                            </div>
                            <div className={styles.managerInfo}>
                                <span className={styles.label}>
                                    Project Manager
                                </span>
                                <Text weight="semibold" className={styles.value}>
                                    {item.projectManager}
                                </Text>
                            </div>
                        </div>
                        {/* Progress */}
                        <div className={styles.progressContainer}>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "5px",
                                }}
                            >

                                <span className={styles.label}>
                                    Project Progress
                                </span>

                                <span className={styles.value}>
                                    {progress}%
                                </span>

                            </div>
                            <div className={styles.progressBackground}>
                                <div
                                    className={styles.progressBar}
                                    style={{
                                        width: `${progress}%`,
                                        backgroundColor:
                                            item.status === 3
                                                ? "#047857"
                                            : item.status ===2
                                                ? "#B91C1C"
                                            :item.status === 1
                                                ? "#2563EB"
                                            :"#B45309"
                                    }}
                                />
                            </div>
                        </div>
                        {/* Bottom Details */}
                        <div className={styles.details}>
                             <div className={styles.priority}>
                            <Badge
                                size="small"
                                color={
                                    item.priority === 3
                                        ? "danger"
                                        : item.priority === 2
                                        ? "success"
                                        : item.priority === 1
                                        ? "informative"
                                        : "warning"
                                }
                            >
                                {getPriority(item.priority)} 
                            </Badge>
                        </div>
                            {/* Start Date */}
                            <div className={styles.detailItem}>
                                <CalendarRegular
                                    className={styles.icon}
                                />
                                <span className={styles.detailValue}>
                                    {formatDate(item.startDate)}
                                </span>

                                <span className={styles.detailLabel}>
                                    Start Date
                                </span>
                            </div>
                            {/* Due Date */}
                            <div className={styles.detailItem}>
                                <CalendarRegular
                                    className={styles.icon}
                                />
                                <span className={styles.detailValue}>
                                    {formatDate(item.dueDate)}
                                </span>
                                <span className={styles.detailLabel}>
                                    Due Date
                                </span>
                            </div>
                        </div>
                    </Card>
                );

            })}

        </div>
    );
}

export default ProjectList;