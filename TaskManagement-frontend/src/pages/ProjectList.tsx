import {
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Popover,
    PopoverTrigger,
    PopoverSurface,
    Toast,
    ToastTitle,
    ToastBody,
    useToastController,
} from "@fluentui/react-components";
import type { Project } from "../types/project";
import { useEffect, useState } from "react";
import { deleteProject, getAllProjects } from "../api/authApi";
import { useAppSelector } from "../app/hooks";
import { data, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../api/apiError";


function ProjectList() {
    const [projects, setprojects] = useState<Project[]>([])
     const { dispatchToast } = useToastController("app-toaster");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const user = useAppSelector(state => state.auth.user)
    const [openProjectId, setOpenProjectId] = useState<string | null>(null);

    const navigate = useNavigate();
    useEffect(() => {
        const loadProjects = async () => {
            const response = await getAllProjects(user?.userId ?? "");
            setprojects(response.result);
        };
        loadProjects();
    }, [refreshTrigger]);
    const handleView = (project: Project) => {
        navigate("/projectboard", {
            state: { project }
        })
    };

    const handleEdit = (project: Project) => {
        console.log("Edit:", project);
        navigate("/projects", {
            state: { project }
        })
    };

    const handleDelete = async(projectId: string) => {
        console.log("Delete:", projectId);
        try{
            await deleteProject(projectId)
             HandleSuccess("project is deleted successfully")
        }catch(err)
        {
            HandleError(getApiErrorMessage(err))
        }
    };
    const HandleError = (message: string) => {
        dispatchToast(
            <Toast>
                <ToastTitle>Project Create Failed</ToastTitle>
                <ToastBody>{message}</ToastBody>
            </Toast>,
            {
                intent: "error",
                timeout: 3000,
            }
        );
    };
    const HandleSuccess = (message: string) => {
        dispatchToast(
            <Toast>
                <ToastTitle>Success</ToastTitle>
                <ToastBody>{message}</ToastBody>
            </Toast>,
            {
                intent: "success",
                timeout: 3000,
            }
        );
    };
    return (
        <div style={{ overflowX: "auto", width: "100%" }}>
            <Table arial-label="Project list">

                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Name</TableHeaderCell>
                        <TableHeaderCell>Description</TableHeaderCell>
                        <TableHeaderCell>Created Date</TableHeaderCell>
                        <TableHeaderCell>Due Date</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Action</TableHeaderCell>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {projects.map((project) => (
                        <TableRow key={project.id}>

                            <TableCell>
                                {project.name}
                            </TableCell>

                            <TableCell>
                                {project.description}
                            </TableCell>


                            <TableCell>
                                {project.dueDate
                                    ? new Date(
                                        project.dueDate
                                    ).toLocaleDateString()
                                    : "-"}
                            </TableCell>

                            <TableCell>
                                {project.status}
                            </TableCell>

    <TableCell>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>

            <Button onClick={() => handleView(project)}>
                View
            </Button>

            <Button onClick={() => handleEdit(project)}>
                Edit
            </Button>

            <Popover
                open={openProjectId === project.id}
                onOpenChange={(_, data) => 
                    setOpenProjectId(data.open ? project.id! : null)
                }
            >
                <PopoverTrigger disableButtonEnhancement>
                    <Button>
                        Delete
                    </Button>
                </PopoverTrigger>

                <PopoverSurface>
                    <p>Are you sure you want to delete this project?</p>

                    <Button
                        appearance="primary"
                        onClick={() => {
                            handleDelete(project.id!);
                            setOpenProjectId(null);
                        setRefreshTrigger((prev)=>prev+1)
                        }}
                    >
                        Yes
                    </Button>

                    <Button
                        onClick={() => {  setOpenProjectId(null)

                        }
                        }
                    >
                        No
                    </Button>
                </PopoverSurface>
            </Popover>

        </div>
    </TableCell>

                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    );
}

export default ProjectList;