import React, { useEffect, useState } from "react";
import {
    Card,
    Dropdown,
    Input,
    Option,
    Toast,
    ToastBody,
    ToastTitle,
    makeStyles,
    useToastController,
} from "@fluentui/react-components";
import {
    CalendarRegular,
    ChevronDownRegular,
    ChevronRightRegular,
    DismissRegular,
    TextBoldRegular,
    TextItalicRegular,
    TextUnderlineRegular,
    TextStrikethroughRegular,
    TextBulletListRegular,
    TextNumberListLtrRegular,
    TextQuoteRegular,
    LinkRegular,
} from "@fluentui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { createTodo, getProjectsNameByUserIdAsync } from "../api/authApi";
import { getApiErrorMessage } from "../api/apiError";
import type { ProjectIdNameInfo } from "../types/TaskListType";

interface TeamMember {
    id: string;
    name: string;
    initials: string;
    color: string;
    role?: string;
}

const AVAILABLE_MEMBERS: TeamMember[] = [
    { id: "1", name: "Alex Johnson", initials: "AJ", color: "#4f46e5", role: "Senior Frontend Developer" },
    { id: "2", name: "Sarah Brown", initials: "SB", color: "#0284c7", role: "UI/UX Designer" },
    { id: "3", name: "Michael Thompson", initials: "MT", color: "#6366f1", role: "Backend Engineer" },
    { id: "4", name: "Emily Davis", initials: "ED", color: "#ec4899", role: "Product Manager" },
    { id: "5", name: "David Wilson", initials: "DW", color: "#10b981", role: "QA Lead" },
];

interface CommentItem {
    id: string;
    author: string;
    initials: string;
    avatarColor: string;
    isMe: boolean;
    timestamp: string;
    text: string;
}

const INITIAL_COMMENTS: CommentItem[] = [
    {
        id: "c1",
        author: "Alex Johnson",
        initials: "AJ",
        avatarColor: "#4f46e5",
        isMe: true,
        timestamp: "May 16, 2026, 10:30 AM",
        text: "This task is critical for the upcoming release. Please make sure to follow the guidelines.",
    },
    {
        id: "c2",
        author: "Sarah Brown",
        initials: "SB",
        avatarColor: "#0284c7",
        isMe: false,
        timestamp: "May 16, 2026, 11:15 AM",
        text: "Got it! I'll start working on it.",
    },
    {
        id: "c3",
        author: "Michael Thompson",
        initials: "MT",
        avatarColor: "#6366f1",
        isMe: false,
        timestamp: "May 16, 2026, 11:45 AM",
        text: "Let me know if you need any help.",
    },
];

const useStyles = makeStyles({
    pageWrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "100%",
        boxSizing: "border-box",
        maxWidth: "1400px",
        margin: "0 auto",
    },
    topHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
        paddingBottom: "8px",
    },
    breadcrumb: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "15px",
    },
    breadcrumbLink: {
        color: "#64748b",
        textDecoration: "none",
        fontWeight: 500,
        "&:hover": {
            color: "#4f46e5",
        },
    },
    breadcrumbCurrent: {
        color: "var(--text-primary)",
        fontWeight: 700,
        fontSize: "16px",
    },
    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    cancelButton: {
        height: "38px",
        padding: "0 18px",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg--card)",
        color: "var(--text-primary)",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
        },
    },
    createButton: {
        height: "38px",
        padding: "0 20px",
        borderRadius: "8px",
        backgroundColor: "#4f46e5",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "14px",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(79, 70, 229, 0.35)",
        transition: "all 0.15s ease",
        "&:hover": {
            backgroundColor: "#4338ca",
        },
        "&:disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
        },
    },
    mainGrid: {
        display: "grid",
        gridTemplateColumns: "1.6fr 1fr",
        gap: "24px",
        alignItems: "start",
        "@media (max-width: 1024px)": {
            gridTemplateColumns: "1fr",
        },
    },
    card: {
        backgroundColor: "var(--bg--card)",
        border: "1px solid var(--border-color)",
        borderRadius: "16px",
        padding: "28px",
        boxSizing: "border-box",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "22px",
    },
    cardTitle: {
        fontSize: "17px",
        fontWeight: 700,
        color: "var(--text-primary)",
        margin: 0,
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    fieldLabel: {
        fontSize: "13px",
        fontWeight: 600,
        color: "var(--text-primary)",
    },
    requiredAsterisk: {
        color: "#ef4444",
        marginLeft: "3px",
    },
    twoColRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "18px",
        "@media (max-width: 600px)": {
            gridTemplateColumns: "1fr",
        },
    },
    threeColRow: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "16px",
        "@media (max-width: 768px)": {
            gridTemplateColumns: "1fr",
        },
    },
    textInput: {
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        fontSize: "14px",
        "& input": {
            padding: "10px 14px",
        },
        "&:focus-within": {
            border: "1px solid var(--primary-color)",
        },
    },
    dropdownControl: {
        width: "100%",
        borderRadius: "8px",
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        fontSize: "14px",
        minHeight: "42px",
    },
    // Rich Text Editor
    editorContainer: {
        border: "1px solid var(--border-color)",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "var(--bg-primary)",
    },
    editorToolbar: {
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "8px 12px",
        borderBottom: "1px solid var(--border-color)",
        backgroundColor: "var(--bg--card)",
        flexWrap: "wrap",
    },
    toolbarDropdown: {
        fontSize: "13px",
        fontWeight: 500,
        color: "var(--text-primary)",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        padding: "4px 8px",
        borderRadius: "4px",
        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
        },
    },
    toolbarDivider: {
        width: "1px",
        height: "18px",
        backgroundColor: "var(--border-color)",
        margin: "0 4px",
    },
    toolbarButton: {
        width: "28px",
        height: "28px",
        borderRadius: "4px",
        border: "none",
        background: "transparent",
        color: "var(--permanent-text-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 600,
        transition: "all 0.15s ease",
        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
            color: "var(--text-primary)",
        },
    },
    toolbarButtonActive: {
        backgroundColor: "var(--nav-selected-bg)",
        color: "var(--primary-color)",
    },
    editorTextarea: {
        width: "100%",
        minHeight: "130px",
        padding: "14px",
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        color: "var(--text-primary)",
        fontSize: "14px",
        fontFamily: "inherit",
        resize: "vertical",
        boxSizing: "border-box",
        "&::placeholder": {
            color: "#94a3b8",
        },
    },
    // Assignee Chips
    chipsContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "6px",
    },
    assigneeChip: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "5px 12px 5px 6px",
        borderRadius: "20px",
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        fontSize: "13px",
        fontWeight: 500,
        color: "var(--text-primary)",
    },
    chipAvatar: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        color: "#ffffff",
        fontSize: "11px",
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    chipDismiss: {
        border: "none",
        background: "transparent",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        color: "#94a3b8",
        fontSize: "12px",
        "&:hover": {
            color: "#ef4444",
        },
    },
    // Comments
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
    commentInputWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "10px",
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        padding: "4px 6px 4px 12px",
    },
    commentInput: {
        flex: 1,
        border: "none",
        outline: "none",
        backgroundColor: "transparent",
        fontSize: "13px",
        color: "var(--text-primary)",
        "&::placeholder": {
            color: "#94a3b8",
        },
    },
    postButton: {
        height: "32px",
        padding: "0 14px",
        borderRadius: "6px",
        border: "1px solid #4f46e5",
        backgroundColor: "transparent",
        color: "#4f46e5",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
            backgroundColor: "#4f46e5",
            color: "#ffffff",
        },
    },
    errorText: {
        color: "#ef4444",
        fontSize: "12px",
        marginTop: "2px",
    },
});

export function TaskForm() {
    const user = useAppSelector((state) => state.auth.user);
    const styles = useStyles();
    const navigate = useNavigate();
    const { dispatchToast } = useToastController("app-toaster");

    // Form fields
    const [projects, setProjects] = useState<ProjectIdNameInfo[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("In Progress");
    const [priority, setPriority] = useState<"Low" | "Medium" | "High">("High");
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState<string>(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    );

    // Rich text editor formatting state
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrike, setIsStrike] = useState(false);

    // Assignees & Assigned By
    const [assignees, setAssignees] = useState<TeamMember[]>([
        AVAILABLE_MEMBERS[0],
        AVAILABLE_MEMBERS[1],
        AVAILABLE_MEMBERS[2],
    ]);
    const [assignedBy, setAssignedBy] = useState<string>(user?.username || "Alex Johnson");

    // Comments
    const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
    const [newCommentText, setNewCommentText] = useState<string>("");

    // Validation & loading
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Current formatted date for metadata
    const todayFormatted = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    useEffect(() => {
        const fetchProjects = async () => {
            if (user?.userId) {
                try {
                    const res = await getProjectsNameByUserIdAsync(user.userId);
                    if (res?.result && Array.isArray(res.result)) {
                        setProjects(res.result);
                        if (res.result.length > 0) {
                            setSelectedProjectId(res.result[0].id);
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch user projects", err);
                }
            }
        };
        fetchProjects();
    }, [user?.userId]);

    const handleAddAssignee = (memberId: string) => {
        const member = AVAILABLE_MEMBERS.find((m) => m.id === memberId);
        if (member && !assignees.some((a) => a.id === member.id)) {
            setAssignees([...assignees, member]);
        }
    };

    const handleRemoveAssignee = (memberId: string) => {
        setAssignees(assignees.filter((a) => a.id !== memberId));
    };

    const handlePostComment = () => {
        if (!newCommentText.trim()) return;

        const newComment: CommentItem = {
            id: `c_${Date.now()}`,
            author: user?.username || "Alex Johnson",
            initials: (user?.username || "Alex Johnson")
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase(),
            avatarColor: "#4f46e5",
            isMe: true,
            timestamp: new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
            }).format(new Date()),
            text: newCommentText.trim(),
        };

        setComments([...comments, newComment]);
        setNewCommentText("");
    };

    const handleValidate = () => {
        const errs: { [key: string]: string } = {};
        if (!selectedProjectId && projects.length > 0) errs.projectId = "Project is required";
        if (!title.trim()) errs.title = "Task title is required";
        if (!description.trim()) errs.description = "Task description is required";
        if (!startDate) errs.startDate = "Start date is required";
        if (!dueDate) errs.dueDate = "Due date is required";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!handleValidate()) {
            dispatchToast(
                <Toast>
                    <ToastTitle>Validation Error</ToastTitle>
                    <ToastBody>Please fill in all required fields.</ToastBody>
                </Toast>,
                { intent: "error", timeout: 3000 }
            );
            return;
        }

        setIsSubmitting(true);
        try {
            await createTodo({
                title: title.trim(),
                userId: user?.userId ?? "",
                projectId: selectedProjectId || (projects[0]?.id ?? ""),
                description: description.trim(),
                priority: priority,
                dueDate: dueDate,
                createdDate: startDate,
                category: status,
                isCompleted: status === "Completed",
            });

            dispatchToast(
                <Toast>
                    <ToastTitle>Success</ToastTitle>
                    <ToastBody>Task has been created successfully!</ToastBody>
                </Toast>,
                { intent: "success", timeout: 3000 }
            );

            setTimeout(() => {
                navigate("/tasks");
            }, 1000);
        } catch (err) {
            dispatchToast(
                <Toast>
                    <ToastTitle>Failed to Create Task</ToastTitle>
                    <ToastBody>{getApiErrorMessage(err)}</ToastBody>
                </Toast>,
                { intent: "error", timeout: 3500 }
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.pageWrapper}>
            {/* Top Breadcrumb & Actions Bar */}
            <div className={styles.topHeader}>
                <div className={styles.breadcrumb}>
                    <Link to="/tasks" className={styles.breadcrumbLink}>
                        My Tasks
                    </Link>
                    <ChevronRightRegular fontSize={14} style={{ color: "#94a3b8" }} />
                    <span className={styles.breadcrumbCurrent}>Add New Task</span>
                </div>

                <div className={styles.headerActions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={() => navigate("/tasks")}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className={styles.createButton}
                        disabled={isSubmitting}
                        onClick={() => handleSubmit()}
                    >
                        {isSubmitting ? "Creating..." : "Create Task"}
                    </button>
                </div>
            </div>

            {/* Main Content Form */}
            <form onSubmit={handleSubmit} className={styles.mainGrid}>
                {/* Left Column: Task Details */}
                <Card className={styles.card}>
                    <h2 className={styles.cardTitle}>Task Details</h2>

                    {/* Project */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Project <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <Dropdown
                            className={styles.dropdownControl}
                            placeholder="Select Project"
                            value={
                                projects.find((p) => p.id === selectedProjectId)?.name ||
                                (projects.length > 0 ? "Select Project" : "Default Project")
                            }
                            selectedOptions={[selectedProjectId]}
                            onOptionSelect={(_, data) => {
                                if (data.optionValue) {
                                    setSelectedProjectId(data.optionValue);
                                    if (errors.projectId) {
                                        setErrors((prev) => ({ ...prev, projectId: "" }));
                                    }
                                }
                            }}
                        >
                            {projects.map((proj) => (
                                <Option key={proj.id} value={proj.id} text={proj.name}>
                                    {proj.name}
                                </Option>
                            ))}
                        </Dropdown>
                        {errors.projectId && (
                            <span className={styles.errorText}>{errors.projectId}</span>
                        )}
                    </div>

                    {/* Title */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Title <span className={styles.requiredAsterisk}>*</span>
                        </label>
                        <Input
                            className={styles.textInput}
                            placeholder="Enter task title"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                if (errors.title) {
                                    setErrors((prev) => ({ ...prev, title: "" }));
                                }
                            }}
                        />
                        {errors.title && <span className={styles.errorText}>{errors.title}</span>}
                    </div>

                    {/* Description with Rich Text Toolbar */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.fieldLabel}>
                            Description <span className={styles.requiredAsterisk}>*</span>
                        </label>

                        <div className={styles.editorContainer}>
                            <div className={styles.editorToolbar}>
                                <button type="button" className={styles.toolbarDropdown}>
                                    <span>Normal</span>
                                    <ChevronDownRegular fontSize={12} />
                                </button>

                                <div className={styles.toolbarDivider} />

                                <button
                                    type="button"
                                    className={`${styles.toolbarButton} ${isBold ? styles.toolbarButtonActive : ""}`}
                                    onClick={() => setIsBold(!isBold)}
                                    title="Bold"
                                >
                                    <TextBoldRegular fontSize={14} />
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.toolbarButton} ${isItalic ? styles.toolbarButtonActive : ""}`}
                                    onClick={() => setIsItalic(!isItalic)}
                                    title="Italic"
                                >
                                    <TextItalicRegular fontSize={14} />
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.toolbarButton} ${isUnderline ? styles.toolbarButtonActive : ""}`}
                                    onClick={() => setIsUnderline(!isUnderline)}
                                    title="Underline"
                                >
                                    <TextUnderlineRegular fontSize={14} />
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.toolbarButton} ${isStrike ? styles.toolbarButtonActive : ""}`}
                                    onClick={() => setIsStrike(!isStrike)}
                                    title="Strikethrough"
                                >
                                    <TextStrikethroughRegular fontSize={14} />
                                </button>

                                <div className={styles.toolbarDivider} />

                                <button
                                    type="button"
                                    className={styles.toolbarButton}
                                    title="Bullet List"
                                    onClick={() => setDescription((prev) => prev + "\n• ")}
                                >
                                    <TextBulletListRegular fontSize={14} />
                                </button>
                                <button
                                    type="button"
                                    className={styles.toolbarButton}
                                    title="Numbered List"
                                    onClick={() => setDescription((prev) => prev + "\n1. ")}
                                >
                                    <TextNumberListLtrRegular fontSize={14} />
                                </button>
                                <button
                                    type="button"
                                    className={styles.toolbarButton}
                                    title="Quote"
                                    onClick={() => setDescription((prev) => prev + "\n> ")}
                                >
                                    <TextQuoteRegular fontSize={14} />
                                </button>
                                <button
                                    type="button"
                                    className={styles.toolbarButton}
                                    title="Insert Link"
                                >
                                    <LinkRegular fontSize={14} />
                                </button>
                            </div>

                            <textarea
                                className={styles.editorTextarea}
                                placeholder="Enter task description..."
                                value={description}
                                style={{
                                    fontWeight: isBold ? 700 : 400,
                                    fontStyle: isItalic ? "italic" : "normal",
                                    textDecoration: `${isUnderline ? "underline" : ""} ${isStrike ? "line-through" : ""}`.trim() || "none",
                                }}
                                onChange={(e) => {
                                    setDescription(e.target.value);
                                    if (errors.description) {
                                        setErrors((prev) => ({ ...prev, description: "" }));
                                    }
                                }}
                            />
                        </div>
                        {errors.description && (
                            <span className={styles.errorText}>{errors.description}</span>
                        )}
                    </div>

                    {/* Status & Priority */}
                    <div className={styles.twoColRow}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                                Status <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <Dropdown
                                className={styles.dropdownControl}
                                value={status}
                                selectedOptions={[status]}
                                onOptionSelect={(_, data) => {
                                    if (data.optionValue) setStatus(data.optionValue);
                                }}
                            >
                                <Option value="In Progress" text="In Progress">🟡 In Progress</Option>
                                <Option value="Todo" text="Todo">⚪ Todo</Option>
                                <Option value="Blocked" text="Blocked">🔴 Blocked</Option>
                                <Option value="Review" text="Review">🔵 Review</Option>
                                <Option value="Completed" text="Completed">🟢 Completed</Option>
                            </Dropdown>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                                Priority <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <Dropdown
                                className={styles.dropdownControl}
                                value={priority}
                                selectedOptions={[priority]}
                                onOptionSelect={(_, data) => {
                                    if (data.optionValue) {
                                        setPriority(data.optionValue as "Low" | "Medium" | "High");
                                    }
                                }}
                            >
                                <Option value="High" text="High">🚩 High</Option>
                                <Option value="Medium" text="Medium">🚩 Medium</Option>
                                <Option value="Low" text="Low">🚩 Low</Option>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Start Date & Due Date */}
                    <div className={styles.twoColRow}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                                Start Date <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <Input
                                type="date"
                                className={styles.textInput}
                                contentBefore={<CalendarRegular />}
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    if (errors.startDate) {
                                        setErrors((prev) => ({ ...prev, startDate: "" }));
                                    }
                                }}
                            />
                            {errors.startDate && (
                                <span className={styles.errorText}>{errors.startDate}</span>
                            )}
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>
                                Due Date <span className={styles.requiredAsterisk}>*</span>
                            </label>
                            <Input
                                type="date"
                                className={styles.textInput}
                                contentBefore={<CalendarRegular />}
                                value={dueDate}
                                onChange={(e) => {
                                    setDueDate(e.target.value);
                                    if (errors.dueDate) {
                                        setErrors((prev) => ({ ...prev, dueDate: "" }));
                                    }
                                }}
                            />
                            {errors.dueDate && (
                                <span className={styles.errorText}>{errors.dueDate}</span>
                            )}
                        </div>
                    </div>

                    {/* Metadata: Created By, Created Date, Updated Date */}
                    <div className={styles.threeColRow}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Created By</label>
                            <Input
                                className={styles.textInput}
                                readOnly
                                disabled
                                value={user?.username || "Alex Johnson"}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Created Date</label>
                            <Input
                                className={styles.textInput}
                                readOnly
                                disabled
                                contentAfter={<CalendarRegular />}
                                value={todayFormatted}
                            />
                        </div>

                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Updated Date</label>
                            <Input
                                className={styles.textInput}
                                readOnly
                                disabled
                                contentAfter={<CalendarRegular />}
                                value={todayFormatted}
                            />
                        </div>
                    </div>
                </Card>

                {/* Right Column: Assign To & Comments */}
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Assign To Card */}
                    <Card className={styles.card}>
                        <h2 className={styles.cardTitle}>Assign To</h2>

                        {/* Assignees */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Assignees</label>
                            <Dropdown
                                className={styles.dropdownControl}
                                placeholder="Select team members..."
                                onOptionSelect={(_, data) => {
                                    if (data.optionValue) {
                                        handleAddAssignee(data.optionValue);
                                    }
                                }}
                            >
                                {AVAILABLE_MEMBERS.map((member) => (
                                    <Option
                                        key={member.id}
                                        value={member.id}
                                        text={`${member.name} (${member.role})`}
                                    >
                                        {member.name} ({member.role})
                                    </Option>
                                ))}
                            </Dropdown>

                            {/* Assignee Chips */}
                            <div className={styles.chipsContainer}>
                                {assignees.map((member) => (
                                    <div key={member.id} className={styles.assigneeChip}>
                                        <div
                                            className={styles.chipAvatar}
                                            style={{ backgroundColor: member.color }}
                                        >
                                            {member.initials}
                                        </div>
                                        <span>{member.name}</span>
                                        <button
                                            type="button"
                                            className={styles.chipDismiss}
                                            onClick={() => handleRemoveAssignee(member.id)}
                                            title="Remove"
                                        >
                                            <DismissRegular />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assigned By */}
                        <div className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>Assigned By</label>
                            <Dropdown
                                className={styles.dropdownControl}
                                value={assignedBy}
                                selectedOptions={[assignedBy]}
                                onOptionSelect={(_, data) => {
                                    if (data.optionValue) setAssignedBy(data.optionValue);
                                }}
                            >
                                {AVAILABLE_MEMBERS.map((member) => (
                                    <Option key={member.id} value={member.name} text={member.name}>
                                        {member.name}
                                    </Option>
                                ))}
                            </Dropdown>
                        </div>
                    </Card>

                    {/* Comments Card */}
                    <Card className={styles.card}>
                        <h2 className={styles.cardTitle}>Comments</h2>

                        <div className={styles.commentsList}>
                            {comments.map((cmt, idx) => (
                                <React.Fragment key={cmt.id}>
                                    <div className={styles.commentItem}>
                                        <div
                                            className={styles.commentAvatar}
                                            style={{ backgroundColor: cmt.avatarColor }}
                                        >
                                            {cmt.initials}
                                        </div>
                                        <div className={styles.commentContent}>
                                            <div className={styles.commentHeader}>
                                                <span className={styles.commentAuthor}>
                                                    {cmt.author}
                                                </span>
                                                {cmt.isMe && (
                                                    <span className={styles.youBadge}>You</span>
                                                )}
                                                <span className={styles.commentTime}>
                                                    {cmt.timestamp}
                                                </span>
                                            </div>
                                            <span className={styles.commentText}>{cmt.text}</span>
                                        </div>
                                    </div>
                                    {idx < comments.length - 1 && (
                                        <div className={styles.commentDivider} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Add Comment Input */}
                        <div className={styles.commentInputWrapper}>
                            <input
                                type="text"
                                className={styles.commentInput}
                                placeholder="Add a comment..."
                                value={newCommentText}
                                onChange={(e) => setNewCommentText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handlePostComment();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                className={styles.postButton}
                                onClick={handlePostComment}
                            >
                                Post
                            </button>
                        </div>
                    </Card>
                </div>
            </form>
        </div>
    );
}

export default TaskForm;
