import { Badge, Card, Text, makeStyles } from "@fluentui/react-components";
import { ClockRegular, ChevronRightRegular, } from "@fluentui/react-icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/purple.css";
import { useEffect, useState } from "react";
import "../../css/Calender.css";
import { useAppSelector } from "../app/hooks";
import { getTaskPriorityGroup } from "../api/authApi";
import type { TaskDto, TaskPriorityGroupDto } from "../types/TaskListType";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
    page: {
        minHeight: "100vh",
        backgroundColor: "var(--bg--card)",
        padding: "24px",
        boxSizing: "border-box",

        "@media (max-width: 768px)": {
            padding: "12px",
        },
    },
    calendarCard: {
        backgroundColor: "var(--bg--card)",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #E5E7EB",

        "@media (max-width: 768px)": {
            padding: "12px",
        },
    },
    tasksCard: {
        marginTop: "20px",
        backgroundColor: "var(--bg--card)",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        border: "1px solid #E5E7EB",
    },
    taskHeader: {
        display: "flex",
        color: "var(--text-primary)",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    },
    taskRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px",
        border: "1px solid #E5E7EB",
        borderRadius: "10px",
        marginBottom: "10px",
        cursor: "pointer",
        transition: "all 0.15s ease-in-out",

        ":hover": {
            backgroundColor: "transparent",
        },
        "@media (max-width: 600px)": {
            alignItems: "flex-start",
        },
    },
    taskLeft: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
    },
    taskIcon: {
        width: "36px",
        height: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        backgroundColor: "#F3E8FF",
        color: "#7C3AED",
        flexShrink: 0,
    },
    taskInfo: {
        display: "flex",
        flexDirection: "column",
        color: "var(--text-primary)",
        gap: "3px",
    },
    project: {
        color: "var(--text-primary)",
        fontSize: "13px",
    },
    taskTime: {
        display: "flex",
        alignItems: "center",
        gap: "5px",
        color: "var(--text-primary)",
        fontSize: "12px",
        marginTop: "4px",
    },
    taskRight: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    emptyState: {
        padding: "30px",
        textAlign: "center",
        color: "var(--text-primary)",
    },
        arrowIcon: {
        color: "var(--permanent-text-color)",
        fontSize: "16px",
        cursor: "pointer",
    },
});
export function CalendarPage() {
    const styles = useStyles();
    const user=useAppSelector((state)=>state.auth.user);
    const [event, setevent]=useState<TaskPriorityGroupDto[]>([]);
    const [task, settask]=useState<TaskDto[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(
        "2026-09-08"
    );
    const navigate=useNavigate();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>("1");
    useEffect(()=>{
        const fetchTaskEvent=async()=>{
          try{
                 if (!user?.userId) return;
                 const response=await getTaskPriorityGroup(user.userId);
                 setevent(response.result);
                const filtertask=response.result.flatMap(group=>group.tasks);
                settask(filtertask);
          }catch(err)
          {
            console.log(err);
          }
        }
        fetchTaskEvent();
    },[user?.userId])
    const HandleOpenTask=(id:string | undefined)=>{
            navigate("/viewtask", {
                state: { taskId: id }
            });
    }
    const calendarEvents = task.map((task) => ({
        id: task.id,
        title: task.title,
        start: task.startDate?.split("T")[0],
    }));
    const selectedTasks = task.filter(
        (task) => task.startDate?.split("T")[0]  === selectedDate
    );
    const handleEventClick = (info: any) => {
        const tasks = task.find(
            (item) => item.id === info.event.id
        );
        if (tasks) {
            setSelectedDate(tasks.startDate?.split("T")[0]);
            setSelectedTaskId(tasks.id || null);
        }
    };
    const getPriorityColor = (
        priority: TaskDto["priority"]
    ) => {
        switch (priority) {
            case 3:
                return "danger";

            case 2:
                return "warning";

            case 1:
                return "success";

            default:
                return "informative";
        }
    };
    const formattedSelectedDate = new Date(
        `${selectedDate}T00:00:00`
    ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className={styles.page}>
            <Card className="my-calendar">
                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "prev,next",
                        center: "title",
                        right: "dayGridMonth,dayGridWeek,dayGridDay",
                    }}
                    toolbarClass="my-toolbar"
                    headerToolbarClass="my-header-toolbar"
                    toolbarTitleClass="my-toolbar-title"
                    toolbarSectionClass="my-toolbar-section"
                    dayHeaderClass="my-day-header"
                    dayCellClass="my-day-cell"
                    dayCellTopClass="my-day-cell-top"
                    eventClass="my-calendar-event"
                    height="auto"
                    contentHeight="auto"
                    events={calendarEvents}
                    eventClick={handleEventClick}
                />
            </Card>
            <Card className={styles.tasksCard}>
                <div className={styles.taskHeader}>
                    <Text
                        weight="semibold"
                        size={500}
                    >
                        Tasks for {formattedSelectedDate}
                    </Text>
                    <Text
                        size={300}
                        style={{
                            color: "#64748B",
                        }}
                    >
                        {selectedTasks.length} task
                        {selectedTasks.length !== 1
                            ? "s"
                            : ""}
                    </Text>
                </div>
                {selectedTasks.length === 0 ? (

                    <div className={styles.emptyState}>
                        <Text>
                            No tasks scheduled for this
                            date.
                        </Text>
                    </div>
                ) : (
                    selectedTasks.map((task) => {
                        const isSelected = task.id === selectedTaskId;
                        return (
                            <div
                                key={task.id}
                                className={styles.taskRow}
                                onClick={() => setSelectedTaskId(task.id || null)}
                            >
                                <div className={styles.taskLeft}>
                                    <div className={styles.taskIcon} >
                                        <ClockRegular />
                                    </div>
                                    <div className={styles.taskInfo} >
                                        <Text weight="semibold" >
                                            {task.title}
                                        </Text>
                                        <Text className={styles.project} >
                                            {task.projectName}
                                        </Text>
                                    </div>
                                </div>
                                <div className={styles.taskRight} >
                                     <ChevronRightRegular
                                        className={styles.arrowIcon}
                                        onClick={() => HandleOpenTask(task.id)}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </Card>
        </div>
    );
}