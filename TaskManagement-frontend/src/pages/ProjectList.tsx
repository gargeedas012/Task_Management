import {
    Table,
    TableHeader,
    TableHeaderCell,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@fluentui/react-components";
import type { Project } from "../types/project";
import { useEffect, useState } from "react";
import { getAllProjects } from "../api/authApi";
import { useAppSelector } from "../app/hooks";
import { useNavigate } from "react-router-dom";


function ProjectList() {
    const [projects,setprojects]=useState<Project[]>([])
    const user=useAppSelector(state=>state.auth.user)
    const navigate=useNavigate();
    useEffect(() => {
            const loadProjects = async () => {
                const response = await getAllProjects(user?.userId??"");
                setprojects(response.result);
            };
        loadProjects();
    }, []);
    const handleView = (project: Project) => {
        navigate("/projectboard",{
            state:{project}
        })
    };

    const handleEdit = (project: Project) => {
        console.log("Edit:", project);
    };

    const handleDelete = (project: Project) => {
        console.log("Delete:", project);
    };

    return (
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
                            <div
                                style={{
                                    display: "flex",
                                    gap: "8px",
                                }}
                            >
                                <Button
                                    onClick={() =>
                                        handleView(project)
                                    }
                                >
                                    View
                                </Button>

                                <Button
                                    onClick={() =>
                                        handleEdit(project)
                                    }
                                >
                                    Edit
                                </Button>

                                <Button
                                    appearance="primary"
                                    onClick={() =>
                                        handleDelete(project)
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                        </TableCell>

                    </TableRow>
                ))}
            </TableBody>

        </Table>
    );
}

export default ProjectList;