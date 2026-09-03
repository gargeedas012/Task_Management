export type TaskStatus =
    | "In Progress"
    | "To Do"
    | "Overdue"
    | "Completed";

export type Priority =
    | "Urgent"
    | "High"
    | "Medium"
    | "Low";

export interface Task {
    id: string;
    title: string;
    progress: number;
    status: TaskStatus;
    project: string;
    dueDate: string;
    priority: Priority;
}

export const dummyTasks: Task[] = [
    {
        id: "ER-01",
        title: "Implement checkout flow",
        progress: 60,
        status: "In Progress",
        project: "E-commerce Redesign",
        dueDate: "Sep 5, 2026",
        priority: "Urgent",
    },
    {
        id: "MAV-07",
        title: "Implement biometric authentication",
        progress: 40,
        status: "In Progress",
        project: "Mobile App v2.0",
        dueDate: "Sep 15, 2026",
        priority: "High",
    },
    {
        id: "Q4C-10",
        title: "Create email sequences",
        progress: 35,
        status: "In Progress",
        project: "Q4 Marketing Campaign",
        dueDate: "Sep 8, 2026",
        priority: "Medium",
    },
    {
        id: "ER-03",
        title: "Mobile responsive testing",
        progress: 0,
        status: "To Do",
        project: "E-commerce Redesign",
        dueDate: "Sep 10, 2026",
        priority: "Medium",
    },
    {
        id: "ER-04",
        title: "Performance optimization",
        progress: 0,
        status: "To Do",
        project: "E-commerce Redesign",
        dueDate: "Sep 12, 2026",
        priority: "Medium",
    },
    {
        id: "MAV-08",
        title: "Offline sync architecture",
        progress: 0,
        status: "To Do",
        project: "Mobile App v2.0",
        dueDate: "Sep 20, 2026",
        priority: "Urgent",
    },
    {
        id: "ER-05",
        title: "Design system documentation",
        progress: 15,
        status: "Overdue",
        project: "E-commerce Redesign",
        dueDate: "Aug 25, 2026",
        priority: "Low",
    },
    {
        id: "ER-02",
        title: "Wireframe homepage layout",
        progress: 100,
        status: "Completed",
        project: "E-commerce Redesign",
        dueDate: "Aug 10, 2026",
        priority: "High",
    },
    {
        id: "MAV-06",
        title: "Set up CI/CD pipeline",
        progress: 100,
        status: "Completed",
        project: "Mobile App v2.0",
        dueDate: "Aug 5, 2026",
        priority: "High",
    },
    {
        id: "ATS-09",
        title: "Analytics event pipeline",
        progress: 100,
        status: "Completed",
        project: "API Integration Suite",
        dueDate: "Aug 25, 2026",
        priority: "Medium",
    },
    {
        id: "Q4C-11",
        title: "Define target segments",
        progress: 100,
        status: "Completed",
        project: "Q4 Marketing Campaign",
        dueDate: "Aug 10, 2026",
        priority: "High",
    },
];