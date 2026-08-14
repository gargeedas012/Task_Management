import {
    Button,
    Field,
    Input,
    Textarea,
    Dropdown,
    Option,
    useToastController,
    Toast,
    ToastTitle,
    ToastBody,
} from "@fluentui/react-components";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Project } from "../types/project";
import { useAppSelector } from "../app/hooks";
import { createProject, updateProject } from "../api/authApi";
import { getApiErrorMessage } from "../api/apiError";
import { useLocation, useNavigate } from "react-router-dom";


function ProjectForm() {
    const user = useAppSelector(state => state.auth.user)
    const { dispatchToast } = useToastController("app-toaster");
    const navigate= useNavigate()
    const location=useLocation()
    const project=location.state?.project as Project
    console.log("oho",project)
    const formatDateForInput=(date?: string | null)=>{
        if(!date) return "";
        return date.split("T")[0];
    }
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
    const formik = useFormik<Project>({
        enableReinitialize: true,
        initialValues: {
            userId: user?.userId ?? project.userId ?? "",
            name: project?.name ?? "" ,
            description: project?.description ??  "",
            dueDate: formatDateForInput(project?.dueDate),
            status: project?.status ?? "Active",
        },

        validationSchema: Yup.object({
            name: Yup.string()
                .required("Project name is required")
                .min(3, "Project name must be at least 3 characters")
                .max(100, "Project name cannot exceed 100 characters"),

            description: Yup.string()
                .required("Description is required")
                .min(10, "Description must be at least 10 characters"),

            dueDate: Yup.date()
                .required("Due date is required")
                .min(new Date(), "Due date cannot be in the past"),

            status: Yup.string()
                .required("Status is required"),
        }),
        onSubmit: async (values: Project) => {
            console.log("Project:", values);
            try {
                if(project)
                {
                    try{
                        await updateProject({
                            ...values,
                            id:project.id
                        });
                        navigate("/")
                        HandleSuccess("Project Update Successfully")
                    }catch(err)
                    {
                        HandleError(getApiErrorMessage(err))
                    }
                }else{
                 await createProject(values);
                formik.resetForm();
                HandleSuccess("Project Create Successfully")
                navigate("/dashboard")
                }           
            } catch (err) {
                HandleError(getApiErrorMessage(err))
                console.log(err);
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            {/* Project Name */}
            <Field
                label="Project Name"
                // required
                validationState={
                    formik.touched.name && formik.errors.name
                        ? "error"
                        : "none"
                }
                validationMessage={
                    formik.touched.name ? formik.errors.name : undefined
                }
            >
                <Input
                    name="name"
                    placeholder="Enter project name"
                    value={formik.values.name}
                    onChange={(e) =>
                        formik.setFieldValue("name", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                />
            </Field>

            <br />

            {/* Description */}
            <Field
                label="Description"
                // required
                validationState={
                    formik.touched.description && formik.errors.description
                        ? "error"
                        : "none"
                }
                validationMessage={
                    formik.touched.description
                        ? formik.errors.description
                        : undefined
                }
            >
                <Textarea
                    name="description"
                    placeholder="Enter project description"
                    value={formik.values.description}
                    onChange={(e) =>
                        formik.setFieldValue("description", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                />
            </Field>

            <br />

            {/* Due Date */}
            <Field
                label="Due Date"
                validationState={
                    formik.touched.dueDate && formik.errors.dueDate
                        ? "error"
                        : "none"
                }
                validationMessage={
                    formik.touched.dueDate
                        ? formik.errors.dueDate
                        : undefined
                }
            >
                <Input
                    type="date"
                    name="dueDate"
                    value={formik.values.dueDate ?? ""}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                        formik.setFieldValue("dueDate", e.target.value)
                    }
                    onBlur={formik.handleBlur}
                />
            </Field>
            <br />

            {/* Status */}
            {
                project && (
                                <Field
                label="Status"
            // required
            >
                <Dropdown
                    value={formik.values.status}
                    selectedOptions={[formik.values.status]}
                    onOptionSelect={(_, data) => {
                        formik.setFieldValue(
                            "status",
                            data.optionValue
                        );
                    }}
                >
                    <Option value="Active">Active</Option>
                    <Option value="Pending">Pending</Option>
                    <Option value="Completed">Completed</Option>
                </Dropdown>
            </Field>
                )
            }
            <br />
            {
                project && (
              <Button
                appearance="primary"
                type="submit"
            >
                Update Project
            </Button>
                )
            }
            {
                !project && (
                                <Button
                appearance="primary"
                type="submit"
            >
                Create Project
            </Button>
                )
            }

        </form>
    );
}

export default ProjectForm;