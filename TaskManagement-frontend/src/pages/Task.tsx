import {
    Avatar,
    Badge,
    Button,
    Card,
    Slider,
    Text,
    makeStyles,
} from "@fluentui/react-components";

import {
    CheckmarkCircleRegular,
    ChatRegular,
    ClockRegular,
    SendRegular,
} from "@fluentui/react-icons";
import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getTask } from "../api/authApi";
import { type NewTodo } from "../types/todo";

const useStyles = makeStyles({
    page: {
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary, #f5f7fb)",
        padding: "28px",
    },

    container: {
        maxWidth: "1100px",
        margin: "0 auto",
    },

    taskCard: {
        padding: "18px",
        borderRadius: "14px",
        border: "1px solid #e2e5ea",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        backgroundColor: "var(--bg--card, white)",
    },

    taskTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "20px",
    },

    titleSection: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    title: {
        fontSize: "16px",
        fontWeight: "600",
        color: "var(--text-primary, #101828)",
    },

    project: {
        fontSize: "12px",
        color: "#98A2B3",
    },

    completeButton: {
        backgroundColor: "#009f68",
        color: "white",
        borderRadius: "9px",
        padding: "8px 14px",
        fontSize: "12px",
        fontWeight: "600",

        ":hover": {
            backgroundColor: "#008c5c",
        },
    },

    metaContainer: {
        display: "grid",
        gridTemplateColumns: "1.2fr 1.2fr 1fr 1fr",
        gap: "20px",
        marginTop: "18px",
        padding: "14px",
        borderRadius: "14px",
        backgroundColor: "var(--bg--card)",
        border:"1px solid var(--border-color)",

        "@media (max-width: 700px)": {
            gridTemplateColumns: "1fr 1fr",
        },

        "@media (max-width: 450px)": {
            gridTemplateColumns: "1fr",
        },
    },

    metaItem: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
    },

    label: {
        fontSize: "10px",
        color: "var(--permanent-text-color)",
        textTransform: "uppercase",
        letterSpacing: "0.4px",
    },

    description: {
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },

    descriptionText: {
        fontSize: "13px",
        lineHeight: "1.7",
        color: "var(--text-primary, #344054)",
    },

    progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "14px",
        marginBottom: "6px",
    },

    progress: {
        height: "4px",
        width: "100%",
    },

    sliderContainer: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginTop: "8px",
    },

    updateButton: {
        borderRadius: "10px",
        backgroundColor: "#b9b3ff",
        color: "white",
        minWidth: "55px",
    },

    activityCard: {
        marginTop: "18px",
        padding: "16px",
        borderRadius: "14px",
        border: "1px solid #e2e5ea",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        backgroundColor: "var(--bg--card, white)",
    },

    activityHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "16px",
    },

    commentRow: {
        display: "flex",
        gap: "10px",
        marginBottom: "16px",
    },
     commentsList: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    commentItem: {
        display: "flex",
        gap: "12px",
    },
    commentAvatar: {
        width: "32px",
        height: "32px",
        borderRadius: "50%",
        color: "#ffffff",
        fontSize: "12px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    commentContent: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        flex: 1,
    },
    commentHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
    },
    commentAuthor: {
        fontSize: "13px",
        fontWeight: 600,
        color: "var(--text-primary)",
    },
    youBadge: {
        fontSize: "11px",
        fontWeight: 600,
        padding: "1px 8px",
        borderRadius: "10px",
        backgroundColor: "rgba(79, 70, 229, 0.12)",
        color: "#4f46e5",
    },
    commentTime: {
        fontSize: "11px",
        color: "#94a3b8",
        marginLeft: "auto",
    },
    commentText: {
        fontSize: "13px",
        lineHeight: "1.5",
        color: "var(--permanent-text-color)",
    },
    commentDivider: {
        height: "1px",
        backgroundColor: "var(--border-color)",
        width: "100%",
    },
});
interface CommentItem {
    id: string;
    author: string;
    initials: string;
    isMe: boolean;
    timestamp: string;
    text: string;
}


export default function TaskShow() {
    const styles = useStyles();
    const location = useLocation();
    const { taskId } = location.state || {};
    const [task , settask]=useState<NewTodo>();
    const user=useAppSelector((state)=>state.auth.user)
    const [comments, setComments] = useState<CommentItem[]>([]);
    useEffect(()=>{
        const  featchTask= async()=>{
            if(!user?.userId) return;
            try{
                const response=await getTask(user?.userId,taskId);
                settask(response.result);
                setComments(response.result.comments);
                console.log(response.result);
            }catch(err)
            {
                console.log(err)
            }
        }
        featchTask();
    },[user?.userId, taskId])
    const navigate=useNavigate();
    const HandleEdit=(id:string,task:NewTodo)=>{
        if(id==null) return;
        navigate("/tasks/Edit",{
            state:{id:id, task:task}
        })
    }
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
                return "Todo";
            case 1:
                return "In Progress";
            case 2:
                return "Blocked";
            case 3:
                return "Review";
            default:
                return "Completed";
        }
    };
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* TASK CARD */}
                <Card className={styles.taskCard}>
                    <div className={styles.taskTop}>
                        <div className={styles.titleSection}>
                            <Text className={styles.title}>
                               {task?.title}
                            </Text>
                        </div>
                        <Button
                            className={styles.completeButton}
                            icon={<CheckmarkCircleRegular />}
                            onClick={() => {
                                if (task?.id) {
                                    HandleEdit(task.id, task);
                                }
                            }}
                        >
                            Edit 
                        </Button>
                    </div>
                    {/* META */}
                    <div className={styles.metaContainer}>

                        <div className={styles.metaItem}>
                            <Text className={styles.label}>
                                Priority
                            </Text>

                            <Badge appearance="tint" color="danger">
                                {getPriority(task?.priority || -1)}
                            </Badge>
                        </div>

                        <div className={styles.metaItem}>
                            <Text className={styles.label}>
                                Status
                            </Text>

                            <Badge appearance="tint" color="brand">
                                {getStatus(task?.status || -1)}
                            </Badge>
                        </div>

                        <div className={styles.metaItem}>
                            <Text className={styles.label}>
                                Deadline
                            </Text>

                            <Text size={200} className={styles.label}>
                                {formatDate(task?.dueDate)}{" "}
                            </Text>
                        </div>

                        <div className={styles.metaItem}>
                            <Text className={styles.label}>
                                Created
                            </Text>

                            <Text size={200} className={styles.label}>
                                {formatDate(task?.createdDate)}
                            </Text>
                        </div>

                    </div>

                    {/* DESCRIPTION */}
                    <div className={styles.description}>
                        <Text className={styles.label}>
                            Description
                        </Text>

                        <Text className={styles.descriptionText}>
                           {task?.description}
                        </Text>
                    </div>

                </Card>

                {/* ACTIVITY CARD */}
                <Card className={styles.activityCard}>

                    <div className={styles.activityHeader}>
                        <ChatRegular />
                        <Text weight="semibold" style={{color:"var(--text-primary)"}}>
                            Activity
                        </Text>
                        <Text size={200} style={{ color: "var(--text-primary)" }}>
                            {task?.comments.length}
                        </Text>
                    </div>
                         <div className={styles.commentsList}>
                             {comments?.length > 0 ? comments.map((cmt, idx) => (
                                 <React.Fragment key={cmt.id}>
                                     <div className={styles.commentItem}>
                                         <Avatar initials={cmt.initials} color="colorful"/>
                                         <div className={styles.commentContent}>
                                             <div className={styles.commentHeader}>
                                                 <span className={styles.commentAuthor}>
                                                     {cmt.id}
                                                 </span>
                                                 {cmt.isMe && (
                                                     <span className={styles.youBadge}>You</span>
                                                 )}
                                                 <span className={styles.commentTime}>
                                                     {formatDate(cmt.timestamp)}
                                                 </span>
                                             </div>
                                             <span className={styles.commentText}>{cmt.text}</span>
                                         </div>
                                     </div>
                                     {idx < comments.length - 1 && (
                                         <div className={styles.commentDivider} />
                                     )}
                                 </React.Fragment>
                             )) : <div>No comments yet</div>}
                         </div>
                     </Card>                           
            </div>
        </div>
    );
}