import { Avatar, makeStyles } from "@fluentui/react-components"
import {  Button,  Text } from "@fluentui/react-components";
import { LayerRegular, ArrowTrendingRegular, TargetRegular, CheckmarkCircleRegular,CalendarRegular, ChevronRightRegular  } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import {  getPriorityCount, getProjectAssigneeInfo, GetProjectInfo, getTodayUpcomingTaskInfo, getWeeklyActivity } from "../api/authApi";
import { useAppSelector } from "../app/hooks";
import { Priority, type DashboardStats, type PriorityDistributionDto, type ProjectInfoDto, type TaskDashboardDto, type WeeklyActivityDto } from "../types/ProjectDashboardType";
import ReactECharts from "echarts-for-react";

const useStyle = makeStyles({
    welcomeCard: {
        width: "100%",
        minHeight: "120px",
        padding: "22px 24px",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: "linear-gradient(135deg, #4f46e5, #7c22ff)",
        color: "white",
        boxSizing: "border-box",
    },
    dateBox: {
    minWidth: "100px",
    padding: "10px 14px",
    borderRadius: "10px",

    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "3px",

    backgroundColor: "rgba(255,255,255,0.12)",
  },
  //4cards
    container: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "90%",
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
    primaryText:{
        color:"var(--text-primary)"
    },
    //upcoming and in-progress tasks
        taskSection: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
            "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
            },
        },
        sectionHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
            color: "var(--text-primary)",
        },

        secondaryText: {
            color: "var(--permanent-text-color)",
            fontSize: "15px",
        },

        card1: {
            backgroundColor: "var(--bg--card)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            transition: "box-shadow 0.2s ease, transform 0.2s ease",
            "&:hover": {
                boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
            },
        },

        todayCard: {
            overflow: "hidden",
        },

        emptyTask: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "110px",
            justifyContent: "center",
            gap: "8px",
            color: "var(--permanent-text-color)",
        },

        upcomingCard: {
            overflow: "hidden",
        },

        deadline: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "13px 14px",
            borderBottom: "1px solid var(--border-color)",
            transition: "background-color 0.15s ease",
            cursor: "pointer",
            "&:last-child": {
                borderBottom: "none",
            },
            "&:hover": {
                backgroundColor: "var(--nav-hover-bg)",
            },
        },
        days: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "35px",
            color: "var(--primary-color)",
            background: "#e6e3fc",
            borderRadius: "8px",
            padding: "2px 2px",
        },

        deadlineInfo: {
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: "3px",
        },

        title: {
            color: "var(--text-primary)",
            fontSize: "13px",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },

        project: {
            color: "var(--permanent-text-color)",
            fontSize: "11px",
        },

        icon: {
            color: "var(--permanent-text-color)",
            fontSize: "16px",
        },
        //project progress with assignee
        projectProgressSection: {
        marginTop: "20px",
        },

        projectTable: {
        backgroundColor: "var(--bg--card)",
        border: "1px solid var(--border-color)",
        borderRadius: "12px",
        overflow: "hidden",
        },

        projectHeader: {
        display: "grid",
        gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 30px",
        padding: "10px 16px",
        fontSize: "13px",
        color: "var(--permanent-text-color)",
        borderBottom: "1px solid var(--border-color)",
        fontWeight: 500,
        },

        projectRow: {
        display: "grid",
        gridTemplateColumns: "2fr 1.5fr 1fr 1.5fr 30px",
        alignItems: "center",
        minHeight: "58px",
        padding: "8px 16px",
        borderBottom: "1px solid var(--border-color)",

        "&:last-child": {
            borderBottom: "none",
        },

        "&:hover": {
            backgroundColor: "var(--nav-hover-bg)",
        },
        },

        projectName: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        "& > div": {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
        },
        },

        projectIndicator: {
        width: "4px",
        height: "28px",
        borderRadius: "4px",
        },

        progressContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        },

        progressBar: {
        width: "115px",
        height: "8px",
        borderRadius: "10px",
        backgroundColor: "var(--nav-hover-bg)",
        overflow: "hidden",
        },

        progress: {
        height: "100%",
        backgroundColor: "var(--primary-color)",
        borderRadius: "10px",
        },

        taskInfo: {
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        fontSize: "11px",
        color: "var(--permanent-text-color)",

        "& small": {
            color: "var(--primary-color)",
        },
        },

        assignees: {
        display: "flex",
        alignItems: "center",
        },

        moreAssignees: {
        width: "28px",
        height: "28px",
        borderRadius: "50%",
        backgroundColor: "var(--nav-hover-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "10px",
        color: "var(--permanent-text-color)",
        marginLeft: "-4px",
        },

        rowArrow: {
        color: "var(--permanent-text-color)",
        fontSize: "15px",
        },
        //task status and weekly activity
        analytics: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
            "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
            },
        },
        //priority and status distribution
        Priorityanalytics: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
            "@media (max-width: 768px)": {
                gridTemplateColumns: "1fr",
            },
        }
});
export function Dashboard() {
    const styles = useStyle();
    const user = useAppSelector((state) => state.auth.user);
    const [response, setResponse] = useState<DashboardStats | null>(null);
    const [projects, setProjects] = useState<ProjectInfoDto[]>([]);
    const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityDto[]>([]);
    const [tasks, setTasks] = useState<TaskDashboardDto | null>(null);
    const [priorityDistribution, setPriorityDistribution] = useState<PriorityDistributionDto[]>([]);
    const [loading, setLoading] = useState(true);
    const now = new Date();
    const hour = now.getHours();

    const greeting =
        hour < 12
            ? "Good morning,"
            : hour < 18
            ? "Good afternoon,"
            : "Good evening,";
    const formattedDate = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const getProgressColor = (count: number) => {
        if (count >= 30  && count <60 ) return "#6454EE";    
        if (count >= 60  && count <=100 ) return "#09AD7B";     
        if (count >= 0  && count < 30) return "#FDA64F";       
        return "#EF4444";                     
    };
    const priorityNames = ["Low", "Medium", "High","Critical"];
    const priorityColors = ["#10B981", "#0EA5E9", "#F59E0B","#EF4444"];
    const today = new Date();
    const taskStatus = {
         tooltip: {
        trigger: "item"
    },
         color: [
        "#6366F1", // To Do
        "#F59E0B", // In Progress
        "#22C55E", // Completed
        "#EF4444", // Assigned
        ],
        legend: {
            orient: 'vertical',
            right: "5%",
            top: "center",
            icon: "circle", 
            selectedMode: false,
            textStyle: {
                fontSize: 12,
                fontWeight: 500,
                fontFamily: "Arial",
                color: "var(--permanent-text-color)"
            },

            data: ['To Do', 'In Progress', 'Completed', 'Under Review']
        },
        series: [
            {
            type: 'pie',
            radius: ['50%', '70%'],
            center: ["40%", "50%"],
            avoidLabelOverlap: false,
            label: {
                show: false
            },
            labelLine: {
                show: false
            },
            emphasis: {
            label: {
                show: false
            }
            },
            itemStyle: {
                borderColor: "#fff",
                borderWidth: 4,
                borderRadius: 0
            },
           data: [
                { value: response?.todoTasks ?? 0, name: "To Do" },
                { value: response?.inProgressTasks ?? 0, name: "In Progress" },
                { value: response?.completedTasks ?? 0, name: "Completed" },
                { value: response?.reviewTasks ?? 0, name: "Under Review" },
            ]
            }
        ]
        };
    const weekActivity = {
        xAxis: {
            type: "category",
            boundaryGap: false,
            data:weeklyActivity?.map((item) => item.week) ?? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
             axisLine: {
                show: true,
                 lineStyle: {
                    color: "#CECECE"
                    }
                },
                lineStyle: {
                    color: "#E5E7EB"
                },
                axisTick: {
                    show: true
                },
                axisLabel: {
                    fontSize: 10,
                    color: "#9CA3AF",
                }
        },
        yAxis: {
            type: "value",
            min: 0,
            max: 3,
            interval: 2,
            axisLine: {
                show: true,
                 lineStyle: {
                    color: "#CECECE"
                    }
                },
            axisTick: {
                show: true
            },
            axisLabel: {
                fontSize: 8,
                color: "#9CA3AF"
            },
            splitLine: {
                show: true,
                lineStyle: {
                    type: "dashed",
                    color: "#E5E7EB"
                }
            }
        },
        grid: {
            left: 50,
            right: 10,
            top: 15,
            bottom: 35
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "#FFFFFF",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            textStyle: {
                color: "#374151",
                fontSize: 10
            },
            axisPointer: {
                type: "line"
            }
        },
        legend: {
            bottom: 0,
            left: 0,
            icon: "circle",
            itemWidth: 6,
            itemHeight: 6,
            itemGap: 15,
            textStyle: {
                fontSize: 9,
                color: "#585b5f"
            },
            data: ["Completed", "Started"]
        },
        series: [
            {
                name: "Completed",
                type: "line",
                smooth: true,
                color:"#B0AFFF",
                data: weeklyActivity?.map((item) => item.completed) ?? [0, 0, 0, 0, 0, 0, 0, 0],
                symbol: "circle",
                symbolSize: 4,
                lineStyle: {
                    width: 1.5
                },
                itemStyle: {
                    color: "#6366F1"
                },
                areaStyle: {
                    opacity: 0.08
                }
            },
            {
                name: "Started",
                type: "line",
                color:"#FFCD80",
                smooth: true,
                data: weeklyActivity?.map((item) => item.started) ?? [0, 0, 0, 0, 0, 0, 0, 0],
                symbol: "circle",
                symbolSize: 4,
                lineStyle: {
                    width: 1.5
                },
                itemStyle: {
                    color: "#F59E0B"
                },
                areaStyle: {
                    opacity: 0.08
                }
            }
        ]
    };
    const priorityDistributionOption ={
        xAxis: {
            type: 'category',
           data: priorityDistribution?.map(item => priorityNames[item.priority]) ?? [],
        },
        yAxis: {
            type: 'value',
            interval: 1,
            axisLine: {
            show: true,
        },
        splitLine: {
            show: false
        }
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "#FFFFFF",
            borderColor: "#E5E7EB",
            borderWidth: 1,
            textStyle: {
                color: "#374151",
                fontSize: 10
            },
            axisPointer: {
                type: "line"
            }
        },
       series: [
        {
            type: "bar",
            barWidth: 40,
            data: priorityDistribution?.map(item => ({
                value: item.count,
                itemStyle: {
                color: priorityColors[item.priority]
                }
            })) ?? []
            }
        ]
    }
    const workloadDistributionOption={
        xAxis: {
        type: "value",
        min: 0,
        max: 100,
        interval: 25,
        axisLine: {
        show: true
        },
        axisTick: {
        show: false
        },
        splitLine: {
        show: false,
        },
        axisLabel: {
        formatter: "{value}%"
    }
    },
    yAxis: {
        type: "category",
        data: projects?.map(project => project.name) ?? [],
          axisLabel: {
            formatter: (value: string) => {
            const words = value.split(" ");
            return words.length > 1
                ? words.slice(0, 2).join(" ") + "\n" + words.slice(2).join(" ")
                : value;
            }
        },
        axisLine: {
        show: true
        },
        axisTick: {
        show: true
        }
    },
    series: [
        {
        type: "bar",
        barWidth: 20,
        data: projects?.map(project => ({
            value:
            project.totalTasks === 0
                ? 0
                : ((project.todoTasks + project.reviewTasks) /
                    project.totalTasks) *
                100,
            itemStyle: {
            color: getProgressColor((project.todoTasks + project.reviewTasks) / project.totalTasks * 100),
            borderRadius: [0, 5, 5, 0]
            }
        })) ?? [],
            label: {
            show: true,
            position: "right",
             formatter: (params: any) => `${params.value.toFixed(2)}%`
            }
        }
    ],
    tooltip: {
        trigger: "axis",
        axisPointer: {
        type: "shadow"
        },
    }
    }
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.userId) return;
            setLoading(true);
            try {
                const [projectInfo, taskInfo, assigneeInfo, weeklyActivity, priorityDistribution] = await Promise.all([
                    GetProjectInfo(user.userId).catch(() => null),
                    getTodayUpcomingTaskInfo(user.userId).catch(() => null),
                    getProjectAssigneeInfo(user.userId).catch(() => null),
                    getWeeklyActivity(user.userId).catch(() => null),
                    getPriorityCount(user.userId).catch(() => null)
                ]);

                if (projectInfo) setResponse(projectInfo.result);
                if (taskInfo) setTasks(taskInfo.result);
                if (assigneeInfo) setProjects(assigneeInfo.result || []);
                if (weeklyActivity) setWeeklyActivity(weeklyActivity.result || []);
                if (priorityDistribution) setPriorityDistribution(priorityDistribution.result || []);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.userId]);


    return (
        <div className={styles.container}>
            {/* Greeting */}
           <div className={styles.welcomeCard}>
                <div>
                    <span>
                        {greeting}
                    </span>
                    <h1>
                        {user?.username} 👋
                    </h1>
                </div>
                <div className={styles.dateBox}>
                    <div style={{display:"flex", alignItems:"center", gap:"5px"}}>
                        <CalendarRegular fontSize={20} style={{color:"white"}}/>
                        <span>Today</span>
                    </div>                  
                <strong>{formattedDate}</strong>
                </div>
            </div>
            {/* 4 cards */}
            <div className={styles.cards}>
                <div className={styles.card}>
                    <div className={styles.logo}>
                        <LayerRegular fontSize={30} style={{color:"#4F39F6"}}/>
                    </div>
                    <Text size={400} weight="semibold"  style={{color:"var(--permanent-text-color)", fontSize:"12"}}>Assigned Project</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.assignedProjects ?? 0}</Text>
                </div>
                <div className={styles.card}>
                    <div className={styles.logo} style={{ background: "#d4f5ea" }}>
                        <ArrowTrendingRegular fontSize={30} style={{color:"#009966"}}/>
                    </div>
                    <Text size={400} weight="semibold" style={{color:"var(--permanent-text-color)", fontSize:"12"}} >Assigned Tasks</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.assignedTasks ?? 0}</Text>
                </div>
                <div className={styles.card}>
                    <div className={styles.logo} style={{ background: "#d6ebf7"}}>
                        <TargetRegular fontSize={30} style={{color:"#0084D1"}}/>
                    </div>
                    <Text size={400} weight="semibold" style={{color:"var(--permanent-text-color)",fontSize:"12"}} >In Progress Tasks</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.inProgressTasks ?? 0}</Text>
                </div>
                <div className={styles.card}>
                    <div className={styles.logo} style={{ background: "#e3d9f0", }}>
                        <CheckmarkCircleRegular fontSize={30} style={{color:"#7F22FE"}}/>
                    </div>
                    <Text size={400} weight="semibold" style={{color:"var(--permanent-text-color)",fontSize:"12"}}>Completed Tasks</Text>
                    <Text size={800} weight="bold" className={styles.primaryText} style={{fontSize:"24"}}>{response?.completedTasks ?? 0}</Text>
                </div>
            </div>
            {/* upcoming and in-progress tasks */}
            <div className={styles.taskSection}>
            <div>
                <div className={styles.sectionHeader}>
                    <Text weight="semibold" style={{fontSize:"15px"}}>
                        Today's Tasks
                    </Text>
                    <Text size={200} className={styles.secondaryText} weight="semibold">
                        {formattedDate}
                    </Text>
                </div>
                <div className={`${styles.card1} ${styles.todayCard}`}>
                        {loading ? (
                            <div className={styles.emptyTask}>
                                <span className={styles.secondaryText}>Loading tasks...</span>
                            </div>
                        ) : !tasks?.todayTasks || tasks.todayTasks.length === 0 ? (
                            <div className={styles.emptyTask}>
                                <CheckmarkCircleRegular fontSize={30} style={{color:"#11d100"}}/>
                                <span className={styles.secondaryText}>No tasks due today</span>
                            </div>
                        ) : (
                            tasks?.todayTasks?.map(task => (
                                <div
                                    key={task.id}
                                    className={styles.deadline}
                                >
                                    <div className={styles.deadlineInfo}>
                                        <span className={styles.title}>
                                            {task.title}
                                        </span>

                                        <span className={styles.project}>
                                            {task.projectName}
                                        </span>
                                    </div>

                                    <ChevronRightRegular
                                        className={styles.icon}
                                    />
                                </div>
                            ))
                        )}
                </div>
            </div>
            <div>
                <div className={styles.sectionHeader}>
                    <Text weight="semibold" style={{fontSize:"15px"}}> Upcoming Deadlines</Text>
                    <Text
                        size={200}
                        className={styles.secondaryText}
                    >
                        Next 7 days
                    </Text>
                </div>
                <div className={`${styles.card1} ${styles.upcomingCard}`}>
                    {loading ? (
                        <div className={styles.emptyTask}>
                            <span className={styles.secondaryText}>Loading deadlines...</span>
                        </div>
                    ) : !tasks?.upcomingTasks || tasks.upcomingTasks.length === 0 ? (
                            <div className={styles.emptyTask}>
                                <CheckmarkCircleRegular fontSize={30} style={{color:"#11d100"}}/>
                                <span className={styles.secondaryText}>No tasks due in the next 7 days</span>
                            </div>
                        ) : (
                    tasks?.upcomingTasks?.map(task => (
                        <div
                            key={task.id}
                            className={styles.deadline}
                        >
                                <div className={styles.days}>
                                    <Text weight="semibold" style={{fontSize:"18px"}}>
                                        {Math.ceil((new Date(task.dueDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))}
                                    </Text>
                                    <span style={{fontSize:"10px"}}>days</span>
                                </div>
                            <div className={styles.deadlineInfo}>
                              
                                <span className={styles.title}>
                                    {task.title}
                                </span>

                                <span className={styles.project}>
                                    {task.projectName}
                                </span>
                            </div>
                            <ChevronRightRegular
                                className={styles.icon}
                            />
                        </div>
                    )))}
                </div>
            </div>
            </div>
            {/* project progress with assignee */}
            <div className={styles.projectProgressSection}>
                    <div className={styles.sectionHeader}>
                        <Text weight="semibold" style={{fontSize:"15px"}}> Project Progress </Text>
                        <Button appearance="subtle">
                        View all projects
                        <ChevronRightRegular />
                        </Button>
                    </div>
                    <div className={styles.projectTable}>
                        {/* Header */}
                        <div className={styles.projectHeader}>
                        <span>Project</span>
                        <span>Progress</span>
                        <span>Tasks</span>
                        <span>Assignees</span>
                        <span></span>
                        </div>
                        {/* Project */}
                        {loading ? (
                            <div className={styles.emptyTask}>
                                <span className={styles.secondaryText}>Loading project progress...</span>
                            </div>
                        ) : projects && projects.length === 0 ? (
                            <div className={styles.emptyTask}>
                                <span className={styles.secondaryText}>No project progression data available</span>
                            </div>
                        ) : (
                        projects?.map((project) => (
                        <div className={styles.projectRow} key={project.id}>

                            <div className={styles.projectName}>
                            <span className={styles.projectIndicator} style={{backgroundColor: getProgressColor(
                                        project.totalTasks > 0
                                            ? Math.round((project.completedTasks / project.totalTasks) * 100)
                                            : 0
                                    )}}/>
                            <div>
                                <Text weight="semibold" style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                                    {project.name}
                                </Text>
                                <span style={{ fontSize: "13px", color: "var(--permanent-text-color)" }}>
                                {project.completedTasks}/{project.totalTasks} tasks
                                </span>
                            </div>
                            </div>

                            <div className={styles.progressContainer}>
                            <div className={styles.progressBar}>
                                <div
                                className={styles.progress}
                                style={{
                                    width: `${project.totalTasks > 0 ? Math.round((project.completedTasks / project.totalTasks) * 100) : 0}%`,
                                    backgroundColor: getProgressColor(
                                        project.totalTasks > 0
                                            ? Math.round((project.completedTasks / project.totalTasks) * 100)
                                            : 0
                                    ),
                                }}
                                />
                            </div>

                            <span>{project.totalTasks > 0? Math.round((project.completedTasks / project.totalTasks) * 100) : 0}%</span>
                            </div>

                            <div className={styles.taskInfo}>
                            <span style={{ fontSize: "11px", color: "var(--permanent-text-color)" }}>
                                {project.completedTasks}/{project.totalTasks} tasks
                            </span>
                                <Text weight="semibold" style={{ color: getProgressColor(
                                            project.totalTasks > 0
                                                ? Math.round((project.completedTasks / project.totalTasks) * 100)
                                                : 0
                                        ), fontSize: "13px" }}>{project.inProgressTasks} in progress</Text>
                            </div>

                            <div className={styles.assignees}>
                            {project.members.slice(0, 3).map((person) => (
                                <Avatar
                                key={person}
                                name={person}
                                size={28}
                                color="colorful"
                                />
                            ))}
                            {project.members.length > 3 && (
                                <span className={styles.moreAssignees}>
                                +{project.members.length - 3}
                                </span>
                            )}
                            </div>
                            <ChevronRightRegular className={styles.rowArrow} />

                        </div>
                        )))}
                    </div>
            </div>
            {/*ask Status Distribution and Weekly Activity */}
            <div className={styles.analytics}>
                <div className={styles.card}>
                    <Text weight="semibold" style={{fontSize:"15px", color:"var(--text-primary)"}}>Task Status Distribution</Text>
                    <span style={{fontSize:"12px", color:"var(--permanent-text-color)"}}>Breakdown of all {response?.assignedTasks ?? 0} assigned tasks</span>
                    <ReactECharts option={taskStatus}
                        style={{ height: "300px", width: "100%" }}
                    />
                </div>
                <div className={styles.card}>
                    <Text weight="semibold" style={{fontSize:"15px", color:"var(--text-primary)"}}>Weekly Activity</Text>
                    <span style={{fontSize:"12px", color:"var(--permanent-text-color)"}}>Tasks completed vs. started — last 8 weeks</span>
                    <ReactECharts option={weekActivity}
                        style={{ height: "300px", width: "100%" }}
                    />
                </div>
            </div>
            {/* prority and status distribution */}
            <div className={styles.Priorityanalytics}>
                <div className={styles.card}>
                    <Text weight="semibold" style={{fontSize:"15px", color:"var(--text-primary)"}}>Priority Breakdown</Text>
                    <span style={{fontSize:"12px", color:"var(--permanent-text-color)"}}>Number of tasks by urgency level</span>
                    <ReactECharts option={priorityDistributionOption}
                        style={{ height: "300px", width: "100%" }}
                    />
                </div>
                <div className={styles.card}>
                    <Text weight="semibold" style={{fontSize:"15px", color:"var(--text-primary)"}}>Project Workload Distribution</Text>
                    <span style={{fontSize:"12px", color:"var(--permanent-text-color)"}}>Tasks assigned to each project</span>
                    <ReactECharts option={workloadDistributionOption}
                        style={{ height: "300px", width: "100%" }}
                    />
                </div>
            </div>
        </div>
    );
}