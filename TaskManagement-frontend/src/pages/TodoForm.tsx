import {
    Button,
    Dialog,
    DialogActions,
    DialogBody,
    DialogSurface,
    DialogTitle,
    Input,
    Label,
    Textarea,
    Dropdown,
    Option,
    Checkbox,
} from "@fluentui/react-components";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "../app/hooks";
import type { Todo } from "../types/todo";
import { createTodo, updateTodo } from "../api/authApi";

interface AddTodoProps {
    open: boolean;
    todo?: Todo;
    projectid:string;
    onClose: () => void;
    onSuccess?: () => void;
}
const TodoForm = ({ open, onClose ,projectid, todo, onSuccess }: AddTodoProps) => {
    const user = useAppSelector(state => state.auth.user)
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: todo?.title ?? "",
            userId: todo?.userId ?? user?.userId ?? "",
            projectId: (todo?.projectId ?? projectid ?? "") as Todo["projectId"],
            description: todo?.description ?? "",
            priority: todo?.priority ?? "Low",
            dueDate:todo?.dueDate ?? "",
            category:todo?.category ??  "",
            isCompleted:todo?.isCompleted ?? false,
        },

        validationSchema: Yup.object({
            title: Yup.string()
                .required("Title is required"),

            description: Yup.string()
                .required("Description is required"),

            priority: Yup.string()
                .oneOf(["Low", "Medium", "High"])
                .required("Priority is required"),

            dueDate: Yup.string()
                .required("Due date is required"),

            category: Yup.string()
                .required("Category is required"),
        }),

        onSubmit: async (values: Todo) => {
            if(todo)
            {
                const updatedTodo: Todo={
                    ...values,
                    id:todo.id
                }
                await updateTodo(updatedTodo);
            }else{
                await createTodo(values);
            }
            
            formik.resetForm();
            if (onSuccess) onSuccess();
            onClose();
            console.log(values);
        },
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(_, data) => {
                if (!data.open) {
                    onClose();
                }
            }}
        >
            <DialogSurface>
                <form onSubmit={formik.handleSubmit}>
                    <DialogBody>

                        <DialogTitle>
                            Add Todo
                        </DialogTitle>

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "15px",
                                marginTop: "20px",
                            }}
                        >

                            {/* Title */}
                            <Label>
                                Title
                            </Label>

                            <Input
                                placeholder="Enter todo title"
                                value={formik.values.title}
                                onChange={(_, data) =>
                                    formik.setFieldValue(
                                        "title",
                                        data.value
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched(
                                        "title",
                                        true
                                    )
                                }
                            />
                            {formik.touched.title &&
                                formik.errors.title && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.title}
                                    </span>
                                )}
                            {/* Description */}
                            <Label>
                                Description
                            </Label>
                            <Textarea
                                placeholder="Enter description"
                                value={formik.values.description}
                                onChange={(_, data) =>
                                    formik.setFieldValue(
                                        "description",
                                        data.value
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched(
                                        "description",
                                        true
                                    )
                                }
                            />
                            {formik.touched.description &&
                                formik.errors.description && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.description}
                                    </span>
                                )}
                            {/* Priority */}
                            <Label>
                                Priority
                            </Label>
                            <Dropdown
                                placeholder="Select Priority"
                                value={formik.values.priority}
                                selectedOptions={[
                                    formik.values.priority
                                ]}
                                onOptionSelect={(_, data) =>
                                    formik.setFieldValue(
                                        "priority",
                                        data.optionValue
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched(
                                        "priority",
                                        true
                                    )
                                }
                            >
                                <Option value="Low">
                                    Low
                                </Option>

                                <Option value="Medium">
                                    Medium
                                </Option>

                                <Option value="High">
                                    High
                                </Option>
                            </Dropdown>

                            {formik.touched.priority &&
                                formik.errors.priority && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.priority}
                                    </span>
                                )}


                            {/* Due Date */}
                            <Label>
                                Due Date
                            </Label>

                            <Input
                                type="date"
                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }
                                value={formik.values.dueDate}
                                onChange={(e) =>
                                    formik.setFieldValue(
                                        "dueDate",
                                        e.target.value
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched(
                                        "dueDate",
                                        true
                                    )
                                }
                            />
                            {formik.touched.dueDate &&
                                formik.errors.dueDate && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.dueDate}
                                    </span>
                                )}
                            {/* Category */}
                            <Label>
                                Category
                            </Label>
                            <Input
                                placeholder="Enter Category"
                                value={formik.values.category}
                                onChange={(_, data) =>
                                    formik.setFieldValue(
                                        "category",
                                        data.value
                                    )
                                }
                                onBlur={() =>
                                    formik.setFieldTouched(
                                        "category",
                                        true
                                    )
                                }
                            />

                            {formik.touched.category &&
                                formik.errors.category && (
                                    <span style={{ color: "red" }}>
                                        {formik.errors.category}
                                    </span>
                                )}
                            {/* Completed */}
                            <Checkbox
                                label="Completed"
                                checked={
                                    formik.values.isCompleted
                                }
                                onChange={(_, data) =>
                                    formik.setFieldValue(
                                        "isCompleted",
                                        data.checked
                                    )
                                }
                            />

                        </div>
                        <DialogActions>

                            <Button
                                appearance="secondary"
                                type="button"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            {
                                todo?( <Button
                                appearance="primary"
                                type="submit"
                            >
                                Update Todo
                            </Button>):(
                                 <Button
                                appearance="primary"
                                type="submit"
                            >
                                Add Todo
                            </Button>
                            )
                            }


                        </DialogActions>

                    </DialogBody>
                </form>
            </DialogSurface>
        </Dialog>
    );
};

export default TodoForm;