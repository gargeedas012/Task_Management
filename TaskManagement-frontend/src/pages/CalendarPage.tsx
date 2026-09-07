import { Badge, Card, Text, makeStyles, } from "@fluentui/react-components";
import { ClockRegular, ChevronRightRegular, } from "@fluentui/react-icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/monarch/theme.css";
import "@fullcalendar/react/themes/monarch/palettes/purple.css";
import { useState } from "react";
import "../../css/Calender.css";

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
});
interface CalendarTask {
    id: string;
    title: string;
    start: string;
    end?: string;
    project: string;
    priority: "Low" | "Medium" | "High";
    time?: string;
}
const tasks: CalendarTask[] = [
    {
        id: "1",
        title: "Complete Dashboard",
        start: "2026-09-08",
        project: "Task Management",
        priority: "Medium",
        time: "10:00 AM",
    },
    {
        id: "2",
        title: "API Integration",
        start: "2026-09-12",
        project: "Task Management",
        priority: "High",
        time: "11:30 AM",
    },
    {
        id: "3",
        title: "Create Login Page",
        start: "2026-09-15",
        project: "Website Development",
        priority: "Low",
        time: "09:00 AM",
    },
    {
        id: "4",
        title: "Database Optimization",
        start: "2026-09-18",
        project: "Backend API",
        priority: "High",
        time: "02:00 PM",
    },
    {
        id: "5",
        title: "Testing",
        start: "2026-09-20",
        project: "Task Management",
        priority: "Medium",
        time: "03:00 PM",
    },
    {
        id: "6",
        title: "Deployment",
        start: "2026-09-25",
        project: "Task Management",
        priority: "High",
        time: "04:00 PM",
    },
];
export function CalendarPage() {
    const styles = useStyles();
    const [selectedDate, setSelectedDate] = useState<string>(
        "2026-09-08"
    );
    const calendarEvents = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        start: task.start,
        end: task.end,
    }));
    const selectedTasks = tasks.filter(
        (task) => task.start === selectedDate
    );
    const handleDateClick = (info: any) => {
        setSelectedDate(info.dateStr);
    };
    const handleEventClick = (info: any) => {
        const task = tasks.find(
            (item) => item.id === info.event.id
        );

        if (task) {
            setSelectedDate(task.start);
        }
    };
    const getPriorityColor = (
        priority: CalendarTask["priority"]
    ) => {
        switch (priority) {
            case "High":
                return "danger";

            case "Medium":
                return "warning";

            case "Low":
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
                events={[
                    { title: "Complete Dashboard", start: "2026-09-08" },
                    { title: "API Integration", start: "2026-09-12" },
                    { title: "Create Login Page", start: "2026-09-15" },
                    { title: "Database Optimization", start: "2026-09-18" },
                    { title: "Testing", start: "2026-09-20" },
                    { title: "Deployment", start: "2026-09-25" },
                ]}
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
                    selectedTasks.map((task) => (
                        <div
                            key={task.id}
                            className={styles.taskRow}
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
                                        {task.project}
                                    </Text>
                                    {task.time && (<div className={styles.taskTime}  >
                                        <ClockRegular fontSize={13} />
                                        {task.time}
                                    </div>
                                    )}
                                </div>
                            </div>
                            <div className={styles.taskRight} >
                                <Badge appearance="tint" color={getPriorityColor(task.priority)}  >
                                    {task.priority}
                                </Badge>
                                <ChevronRightRegular />
                            </div>
                        </div>
                    ))
                )}
            </Card>
        </div>
    );
}