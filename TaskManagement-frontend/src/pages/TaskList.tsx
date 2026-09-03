import { useState } from "react";
import { dummyTasks, type TaskStatus } from "../../dummydata/project";
import { Input, makeStyles } from "@fluentui/react-components";
import { SearchRegular } from "@fluentui/react-icons";

const useStyles = makeStyles({
     taskstoolbar: {
       height: "60px",
       display: "flex",
       alignItems: "center",
       gap: "10px",
       padding: "0 25px",
       boxSizing: "border-box",
       borderRadius:"10px",
       backgroundColor: "var(--bg--card)",
       border: "1px solid var(--border-color)",
    },
        searchInput: {
            width: "300px",
            height: "25px",
            borderRadius: "8px",
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-color)",

            "&:focus-within": {
                border: "1px solid var(--primary-color)",
                outline: "none",
            },

            "&::after": {
                border: "none",
            },
        },
})
export default function TaskList() {

    const [search, setSearch] = useState("");
    const [selectedPriority, setSelectedPriority] =
        useState("All Priorities");
    const styles = useStyles();
    // ---------------- FILTER ----------------

    const filteredTasks = dummyTasks.filter((task) => {

        const searchMatch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            task.id.toLowerCase().includes(search.toLowerCase());

        const priorityMatch =
            selectedPriority === "All Priorities" ||
            task.priority === selectedPriority;

        return searchMatch && priorityMatch;
    });

    // ---------------- STATUS GROUPS ----------------
    return (
        <div>
            {/* TOOLBAR */}
            <div className={styles.taskstoolbar}>
                <Input
                    type="text"
                    className={styles.searchInput}
                    contentBefore={<SearchRegular fontSize={18} />}
                    placeholder=" Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    value={selectedPriority}
                    onChange={(e) =>
                        setSelectedPriority(e.target.value)
                    }
                >
                    <option>All Priorities</option>
                    <option>Urgent</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>

                <span className="task-count">
                    {filteredTasks.length} tasks
                </span>

            </div>

            {/* TABLE */}

            <div className="tasks-table">

                {/* TABLE HEADER */}

                <div className="task-row table-header">

                    <span>TASK ID</span>
                    <span>TITLE</span>
                    <span>STATUS</span>
                    <span>PROJECT</span>
                    <span>DUE DATE</span>
                    <span>PRIORITY</span>
                    <span></span>

                </div>

                {/* GROUP BY STATUS */}

                {(["To Do", "In Progress", "Overdue", "Completed"] as TaskStatus[]).map((status) => {

                    const statusTasks = filteredTasks.filter(
                        task => task.status === status
                    );

                    if (statusTasks.length === 0) {
                        return null;
                    }

                    return (
                        <div key={status}>

                            {/* GROUP HEADER */}

                            <div className={`status-header ${status
                                .toLowerCase()
                                .replace(" ", "-")}`}>

                                <span className="collapse-icon">
                                    ⌄
                                </span>

                                <span className="status-dot" />

                                <span>{status}</span>

                                <span className="status-number">
                                    {statusTasks.length}
                                </span>

                            </div>

                            {/* TASKS */}

                            {statusTasks.map((task) => (

                                <div
                                    className="task-row task-data"
                                    key={task.id}
                                >

                                    {/* ID */}

                                    <span>
                                        <span className="task-id">
                                            {task.id}
                                        </span>
                                    </span>

                                    {/* TITLE */}

                                    <span className="title-column">

                                        <span className="task-title">
                                            {task.title}
                                        </span>

                                        {task.progress > 0 &&
                                            task.progress < 100 && (
                                                <span className="progress">
                                                    {task.progress}%
                                                </span>
                                            )}

                                    </span>

                                    {/* STATUS */}

                                    <span>
                                        <span
                                            className={`status-pill ${status
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {task.status}
                                            <small>⌄</small>
                                        </span>
                                    </span>

                                    {/* PROJECT */}

                                    <span className="project">
                                        {task.project}
                                    </span>

                                    {/* DATE */}

                                    <span
                                        className={
                                            task.status === "Overdue" ||
                                            task.status === "Completed"
                                                ? "date overdue-date"
                                                : "date"
                                        }
                                    >
                                        {task.dueDate}
                                    </span>

                                    {/* PRIORITY */}

                                    <span
                                        className={`priority ${task.priority.toLowerCase()}`}
                                    >
                                        ⚑ {task.priority}
                                    </span>

                                    {/* ARROW */}

                                    <span className="arrow">
                                        ›
                                    </span>

                                </div>

                            ))}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}