import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, makeStyles, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem} from "@fluentui/react-components";
import { SearchRegular,  ChevronDownRegular,  ChevronRightRegular, FlagRegular, AppsListDetailRegular, FilterRegular, AddRegular } from "@fluentui/react-icons";
import { useAppSelector } from "../app/hooks";
import { type ProjectIdNameInfo, type TaskPriorityGroupDto ,type TaskStatus , type Priority} from "../types/TaskListType";
import { getProjectsNameByUserIdAsync, getTaskPriorityGroup } from "../api/authApi";

const useStyles = makeStyles({
    pageContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        boxSizing: "border-box",
    },
    pageHeader: {
        fontSize: "20px",
        fontWeight: 700,
        color: "var(--text-primary)",
        margin: 0,
    },
    toolbar: {
        minHeight: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
        padding: "10px 16px",
        boxSizing: "border-box",
        borderRadius: "10px",
        backgroundColor: "var(--bg--card)",
        border: "1px solid var(--border-color)",
        flexWrap: "wrap",
        "@media (max-width: 600px)": {
            padding: "10px 12px",
            gap: "10px",
        },
    },
    toolbarLeft: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        flex: 1,
    },
    searchInput: {
        width: "240px",
        height: "36px",
        borderRadius: "8px",
        backgroundColor: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
        fontSize: "13px",
        "&:focus-within": {
            border: "1px solid var(--primary-color)",
            outline: "none",
        },
        "&::after": {
            border: "none",
        },
        "@media (max-width: 600px)": {
            width: "100%",
        },
    },
    priorityFilterButton: {
        height: "36px",
        padding: "0 14px",
        borderRadius: "8px",
        border: "1.5px solid var(--primary-color)",
        backgroundColor: "var(--bg--card)",
        color: "var(--primary-color)",
        fontSize: "12px",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
            backgroundColor: "var(--nav-selected-bg)",
        },
    },
    toolbarRight: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginLeft: "auto",
    },
    taskCount: {
        color: "var(--permanent-text-color)",
        fontSize: "12px",
        fontWeight: 500,
    },
    iconButton: {
        width: "32px",
        height: "32px",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--permanent-text-color)",
        cursor: "pointer",
        transition: "background 0.15s ease",
        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
            color: "var(--text-primary)",
        },
    },
    tableCard: {
        backgroundColor: "var(--bg--card)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        overflow: "hidden",
        width: "100%",
    },
    tableScrollWrapper: {
        overflowX: "auto",
        width: "100%",
    },
    tableHeaderRow: {
        display: "grid",
        gridTemplateColumns: "100px minmax(200px, 2fr) 140px 180px 130px 120px 40px",
        minWidth: "850px",
        padding: "10px 20px",
        backgroundColor: "var(--bg-primary)",
        borderBottom: "1px solid var(--border-color)",
        fontSize: "11px",
        fontWeight: 600,
        color: "var(--permanent-text-color)",
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        boxSizing: "border-box",
    },
    statusGroupHeader: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minHeight: "42px",
        padding: "0 20px",
        minWidth: "850px",
        backgroundColor: "var(--bg-primary)",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
        cursor: "pointer",
        userSelect: "none",
        transition: "background-color 0.15s ease",
        boxSizing: "border-box",
        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
        },
    },
    statusDot: {
        width: "7px",
        height: "7px",
        borderRadius: "50%",
    },
    statusGroupName: {
        fontSize: "13px",
        fontWeight: 700,
    },
    statusBadge: {
        minWidth: "20px",
        height: "20px",
        borderRadius: "10px",
        padding: "0 6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.08)",
        color: "var(--permanent-text-color)",
        fontSize: "11px",
        fontWeight: 600,
    },
    taskRow: {
        display: "grid",
        gridTemplateColumns: "100px minmax(200px, 2fr) 140px 180px 130px 120px 40px",
        minWidth: "850px",
        minHeight: "56px",
        padding: "8px 20px",
        alignItems: "center",
        borderBottom: "1px solid var(--border-color)",
        transition: "background-color 0.15s ease",
        boxSizing: "border-box",
        "&:last-child": {
            borderBottom: "none",
        },
        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
        },
    },
    taskIdBadge: {
        display: "inline-block",
        padding: "3px 8px",
        borderRadius: "6px",
        backgroundColor: "rgba(79, 57, 246, 0.1)",
        color: "var(--primary-color)",
        border: "1px solid rgba(79, 57, 246, 0.25)",
        fontSize: "11px",
        fontWeight: 700,
        letterSpacing: "0.2px",
    },
    titleContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
    },
    taskTitle: {
        fontSize: "13px",
        fontWeight: 600,
        color: "var(--text-primary)",
    },
    taskProgress: {
        fontSize: "11px",
        color: "#9ca3af",
    },
    statusPill: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "6px",
        padding: "4px 12px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: 500,
        border: "1px solid",
        cursor: "pointer",
        transition: "opacity 0.15s ease",
        width: "fit-content",
        "&:hover": {
            opacity: 0.85,
        },
    },
    statusInProgress: {
        color: "#D97706",
        backgroundColor: "#FFFBEB",
        border: "1px solid #FCD34D",
    },
    statusToDo: {
        color: "#64748B",
        backgroundColor: "#F8FAFC",
        border: "1px solid #CBD5E1",
    },
    statusOverdue: {
        color: "#EF4444",
        backgroundColor: "#FEF2F2",
        border: "1px solid #FCA5A5",
    },
    statusCompleted: {
        color: "#059669",
        backgroundColor: "#ECFDF5",
        border: "1px solid #6EE7B7",
    },
    projectName: {
        fontSize: "13px",
        color: "var(--permanent-text-color)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        marginRight:"10px"
    },
    dueDate: {
        fontSize: "12px",
        color: "var(--permanent-text-color)",
        fontWeight: 500,
    },
    dueDateOverdue: {
        color: "#EF4444",
        fontWeight: 600,
    },
    priorityContainer: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        fontWeight: 600,
    },
    priorityUrgent: {
        color: "#EF4444",
    },
    priorityHigh: {
        color: "#F97316",
    },
    priorityMedium: {
        color: "#0EA5E9",
    },
    priorityLow: {
        color: "#10B981",
    },
    arrowIcon: {
        color: "var(--permanent-text-color)",
        fontSize: "16px",
        cursor: "pointer",
    },
    emptyState: {
        padding: "40px 20px",
        textAlign: "center",
        color: "var(--permanent-text-color)",
        fontSize: "14px",
    },
});

const statusConfig: Record<TaskStatus, { color: string; label: string; dotColor: string; pillClass: string }> = {
    "In Progress": {
        color: "#D97706",
        label: "In Progress",
        dotColor: "#F59E0B",
        pillClass: "statusInProgress",
    },
    "To Do": {
        color: "#4F46E5",
        label: "To Do",
        dotColor: "#6366F1",
        pillClass: "statusToDo",
    },
    "Review": {
        color: "#DC2626",
        label: "Overdue",
        dotColor: "#EF4444",
        pillClass: "statusOverdue",
    },
    "Completed": {
        color: "#059669",
        label: "Completed",
        dotColor: "#10B981",
        pillClass: "statusCompleted",
    },
     "Blocked": {
        color: "#059669",
        label: "Completed",
        dotColor: "#10B981",
        pillClass: "statusCompleted",
    },
};
const statusOrder: TaskStatus[] = [ "To Do","In Progress","Blocked", "Review", "Completed"];
const priorityMap: Record<string, number> = {
     "Low": 0,
    "Medium": 1,
     "High":2,
    "Critical":3,
};
const priorityOptions = ["Low","Medium", "High", "Critical" ,"All Priorities"];

export default function TaskList() {
    const styles = useStyles();
    const navigate = useNavigate();
    const [tasklist,settasklist]=useState<TaskPriorityGroupDto[]>([]);
    const [project, setproject]=useState<ProjectIdNameInfo[]>([]);
    const [search, setSearch] = useState("");
    const [selectedProject,setSelectedProject]=useState("All Projects");
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [_loading, setLoading] = useState(true);
    const [selectedPriority, setSelectedPriority] = useState("All Priorities");
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
    const user=useAppSelector((state)=>state.auth.user);
    const formatDueDate = (dueDate: string) => {
        return new Date(dueDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    const toggleGroup = (status: string) => {
        setCollapsedGroups((prev) => ({
            ...prev,
            [status]: !prev[status],
        }));
    };
    useEffect(() => {
        const fetchTaskList = async ()=>{
            if(!user?.userId) return;
            setLoading(true);
            try{
                const [ tasklistResponse , projectNameResponse ] = await Promise.all([
                    getTaskPriorityGroup(user.userId, selectedProjectId ?? undefined).catch(()=>null),
                    getProjectsNameByUserIdAsync(user.userId).catch(()=>null)
                ]);
                if(tasklistResponse){
                    settasklist(tasklistResponse.result);
                }
                if(projectNameResponse){
                    setproject(projectNameResponse.result);
                }
            }catch(error){
                console.error("Error fetching task list:", error);
            }finally{
                setLoading(false);
            }
        }
        fetchTaskList();
    }, [user?.userId ,selectedProjectId]);

    // Filter tasks
    const filteredTasks = tasklist.flatMap(group=>group.tasks).filter((task)=>{
        const searchMatch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.projectName.toLowerCase().includes(search.toLowerCase());
        const priorityMatch =
            selectedPriority === "All Priorities" ||
            task.priority === priorityMap[selectedPriority];
        return searchMatch && priorityMatch;
    });
    const HandleOpenTask=(id:string | undefined)=>{
            navigate("/viewtask", {
                state: { taskId: id }
            });
    }
    const getPriorityClass = (priority: Priority) => {
        switch (priority) {
            case "Critical":
                return styles.priorityUrgent;
            case "High":
                return styles.priorityHigh;
            case "Medium":
                return styles.priorityMedium;
            case "Low":
                return styles.priorityLow;
            default:
                return "";
        }
    };

    const getStatusPillClass = (status: TaskStatus) => {
        switch (status) {
            case "In Progress":
                return styles.statusInProgress;
            case "To Do":
                return styles.statusToDo;
            case "Review":
                return styles.statusOverdue;
            case "Completed":
                return styles.statusCompleted;
            default:
                return "";
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* TOOLBAR */}
            <div className={styles.toolbar}>
                <div className={styles.toolbarLeft}>
                    <Input
                        type="text"
                        className={styles.searchInput}
                        contentBefore={<SearchRegular fontSize={18} />}
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Menu>
                        <MenuTrigger disableButtonEnhancement>
                            <button className={styles.priorityFilterButton}>
                                <span>{selectedPriority}</span>
                                <ChevronDownRegular fontSize={14} />
                            </button>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                {priorityOptions.map((priority) => (
                                    <MenuItem
                                        key={priority}
                                        onClick={() => setSelectedPriority(priority)}
                                    >
                                        {priority}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </MenuPopover>
                    </Menu>
                    <Menu>
                    <MenuTrigger disableButtonEnhancement>
                        <button className={styles.priorityFilterButton}>
                            <span>{selectedProject || "All Projects"}</span>
                            <ChevronDownRegular fontSize={14} />
                        </button>
                    </MenuTrigger>

                    <MenuPopover>
                        <MenuList>
                            <MenuItem onClick={() => {setSelectedProject("All Projects"), setSelectedProjectId(null)}}>
                                All Projects
                            </MenuItem>

                            {project.map((p) => (
                                <MenuItem
                                    key={p.id}
                                    onClick={() =>{ setSelectedProject(p.name), setSelectedProjectId(p.id)}}
                                >
                                    {p.name}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </MenuPopover>
                </Menu>
                </div>

                <div className={styles.toolbarRight}>
                    <button
                        className={styles.priorityFilterButton}
                        style={{
                            backgroundColor: "#4f46e5",
                            color: "#ffffff",
                            border: "none",
                            gap: "6px",
                            cursor: "pointer",
                        }}
                        onClick={() => navigate("/tasks/new")}
                    >
                        <AddRegular fontSize={16} />
                        Add Task
                    </button>
                    <span className={styles.taskCount}>
                        {filteredTasks.length} tasks
                    </span>
                    <div className={styles.iconButton} title="Group view">
                        <AppsListDetailRegular fontSize={18} />
                    </div>
                    <div className={styles.iconButton} title="Filters">
                        <FilterRegular fontSize={18} />
                    </div>
                </div>
            </div>

            {/* TASKS TABLE */}
            <div className={styles.tableCard}>
                <div className={styles.tableScrollWrapper}>
                    {/* TABLE HEADER */}
                    <div className={styles.tableHeaderRow}>
                        <span>TASK ID</span>
                        <span>TITLE</span>
                        <span>STATUS</span>
                        <span>PROJECT</span>
                        <span>DUE DATE</span>
                        <span>PRIORITY</span>
                        <span></span>
                    </div>
                    {/* GROUPED STATUS SECTIONS */}
                    {statusOrder.map((status) => {
                        const statusTasks = filteredTasks.filter(
                            (task) => statusOrder[task.status] === status
                        );
                        if (statusTasks.length === 0 && search !== "") {
                            return null;
                        }
                        const isCollapsed = collapsedGroups[status];
                        const config = statusConfig[status];
                        return (
                            <div key={status}>
                                {/* GROUP HEADER */}
                                <div className={styles.statusGroupHeader}
                                    onClick={() => toggleGroup(status)}
                                >
                                    {isCollapsed ? (
                                        <ChevronRightRegular fontSize={14} style={{ color: "#9CA3AF" }} />
                                    ) : (
                                        <ChevronDownRegular fontSize={14} style={{ color: "#9CA3AF" }} />
                                    )}

                                    <span
                                        className={styles.statusDot}
                                        style={{ backgroundColor: config.dotColor }}
                                    />
                                    <span
                                        className={styles.statusGroupName}
                                        style={{ color: config.color }}
                                    >
                                        {status}
                                    </span>

                                    <span className={styles.statusBadge}>
                                        {statusTasks.length}
                                    </span>
                                </div>
                                {/* GROUP TASK ROWS */}
                                {!isCollapsed &&
                                    statusTasks.map((task) => {
                                        const isDueOverdue =
                                            statusOrder[task.status] === "Review" ||
                                            statusOrder[task.status] === "Completed";

                                        return (
                                            <div className={styles.taskRow} >
                                                {/* TASK ID */}
                                                <div>
                                                    <span className={styles.taskIdBadge}>
                                                       GM11
                                                    </span>
                                                </div>

                                                {/* TITLE & PROGRESS */}
                                                <div className={styles.titleContainer}>
                                                    <span className={styles.taskTitle}>
                                                        {task.title}
                                                    </span>
                                                </div>

                                                {/* STATUS PILL (Interactive Dropdown) */}
                                                <div>
                                                         <button
                                                                className={`${styles.statusPill} ${getStatusPillClass(
                                                                    statusOrder[task.status]
                                                                )}`}
                                                            >
                                                                <span>{statusOrder[task.status]}</span>
                                                                
                                                            </button>
                                                        {/* <Menu> */}
                                                        {/* <MenuTrigger disableButtonEnhanscement>
                                                        </MenuTrigger> */}
                                                        {/* <MenuPopover>
                                                            <MenuList>
                                                                {statusOrder.map((s) => (
                                                                    <MenuItem
                                                                        key={s}
                                                                        onClick={() => {
                                                                            if (task.id) {
                                                                                handleStatusChange(task.id, s);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {s}
                                                                    </MenuItem>
                                                                ))}
                                                            </MenuList>
                                                        </MenuPopover> */}
                                                    {/* </Menu> */}
                                                </div>

                                                {/* PROJECT */}
                                                <span className={styles.projectName}>
                                                    {task.projectName}
                                                </span>

                                                {/* DUE DATE */}
                                                <span
                                                    className={`${styles.dueDate} ${isDueOverdue ? styles.dueDateOverdue : ""
                                                        }`}
                                                >
                                                    {formatDueDate(task.dueDate)}
                                                </span>

                                                {/* PRIORITY */}
                                                <div
                                                    className={`${styles.priorityContainer} ${getPriorityClass(
                                                       priorityOptions[task.priority] as Priority
                                                    )}`}
                                                >
                                                    <FlagRegular fontSize={14} />
                                                    <span>{priorityOptions[task.priority] as Priority}</span>
                                                </div>

                                                {/* ARROW */}
                                                <ChevronRightRegular
                                                        className={styles.arrowIcon}
                                                        onClick={() => HandleOpenTask(task.id)}
                                                    />
                                                   
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })}
                    {filteredTasks.length === 0 && (
                        <div className={styles.emptyState}>
                            No tasks found matching your search or filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}