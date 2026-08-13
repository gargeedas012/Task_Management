import { Fragment, useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow, Badge, Spinner, Dialog, DialogSurface, DialogBody, DialogTitle, DialogContent, DialogActions, Dropdown, Option } from "@fluentui/react-components";
import type { Todo, TodoByDateDto } from "../types/todo";
import { deleteTodo, getTodosByProjectIdWithLimit, getTodosByProjectIdWithLimitByFilter } from "../api/authApi";
import { useAppSelector } from "../app/hooks";
import TodoForm from "./TodoForm";

interface AddTodoListProps {
    projectid: string;
    refreshTrigger?: number;
}
interface TodoRowProps {
    todo: Todo;
    formatDate: (date: string) => string;
    handleEdit: (todo: Todo) => void;
    setopenDialogBox: React.Dispatch<React.SetStateAction<boolean>>;
    setselectedTodoId: React.Dispatch<React.SetStateAction<string | null>>;
}

const TodoRow = ({
    todo,
    formatDate,
    handleEdit,
    setopenDialogBox,
    setselectedTodoId
}: TodoRowProps) => {
    return (
        <TableRow>
            <TableCell>
                {todo.title}
            </TableCell>
            <TableCell>
                {todo.description}
            </TableCell>
            <TableCell>
                {todo.isCompleted ? (
                    <Badge appearance="filled">
                        Completed
                    </Badge>
                ) : (
                    <Badge appearance="outline">
                        Pending
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                {todo.priority}
            </TableCell>
            {/* Creation Date */}
            <TableCell>
                {formatDate(todo.createdDate)}
            </TableCell>
            {/* Due Date */}
            <TableCell>
                {formatDate(todo.dueDate)}
            </TableCell>
            <TableCell>
                {todo.category}
            </TableCell>
            <TableCell>
                <Button
                    appearance="primary"
                    size="small"
                    onClick={() => handleEdit(todo)}
                >
                    Edit
                </Button>

                <Button
                    appearance="secondary"
                    size="small"
                    onClick={() => {
                        setopenDialogBox(true);
                        setselectedTodoId(todo.id ?? null);
                    }}
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    );
};
const TodoList = ({ projectid, refreshTrigger }: AddTodoListProps) => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(false);
    const [openTodoDialog, setOpenTodoDialog] = useState(false);
    const [SelectedTodo, setSelectedTodo] = useState<Todo>();
    const user = useAppSelector(state => state.auth.user)
    const [openDialogBox, setopenDialogBox] = useState(false);
    const [totalcount, settotalcount] = useState(0);
    const [selectedTodoId, setselectedTodoId] = useState<string | null>(null);
    const [filterBy, setFilterBy] = useState<"month" | "day" | "All">("All");
    const [todosByDate, setTodosByDate] = useState<TodoByDateDto[]>([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [datePages, setDatePages] = useState<Record<string, number>>({});
    const [page, setPage] = useState(1);
    const [pageSize] = useState(5);
    const datePageSize = 2;
    const monthPageSize = 3;

    // GET TODOS
    const fetchTodos = async () => {
        try {
            setLoading(true);
            if (!user?.userId) return;
            const response = await getTodosByProjectIdWithLimit(projectid, page, pageSize);
            setTodos(response.result.todos);
            settotalcount(response.result.totalCount);
            console.log(response.result.totalCount);
        } catch (error) {
            console.error("Failed to fetch todos:", error);
        } finally {
            setLoading(false);
        }
    };

    // GET API WHEN COMPONENT LOADS
    useEffect(() => {
        console.log("call")
        if (filterBy === "All") {
            fetchTodos();
        } else if (selectedDate) {
            handleFilterChange(filterBy, selectedDate);
        }
    }, [filterBy, projectid, page, refreshTrigger, selectedDate]);

    //Handle filter change
    const handleFilterChange = async (
        type: "month" | "day" | "All",
        value: string
    ) => {
        if (type === "All") {
            return;
        }

        console.log("Filter Type:", type);
        console.log("Selected Value:", value);
        try {
            // value is either "YYYY-MM" or "YYYY-MM-DD"
            // Append time to force parsing as local time instead of UTC
            const dateString = type === "month" ? `${value}-01T00:00:00` : `${value}T00:00:00`;
            const dateToPass = new Date(dateString);
            
            const limit = type === "month" ? monthPageSize : pageSize;
            const response = await getTodosByProjectIdWithLimitByFilter(projectid, dateToPass, page, limit, type);
            console.log(response.result);
            setTodosByDate(response.result);
            settotalcount(response.result.length > 0 ? response.result[0].totalTaskCount : 0);
        } catch (err) {
            console.log(err)
        }
    };

    // DELETE TODO
    const handleDelete = async (id?: string) => {
        if (!id) return;
        try {
            await deleteTodo(id);
            const updatedTodos = todos.filter(
                (todo) => todo.id !== id
            );
            // Remove deleted todo from UI
            setTodos(updatedTodos);
            if (updatedTodos.length === 0 && page > 1) {
                setPage((prev) => prev - 1);
            }
            if (filterBy !== "All" && selectedDate) {
                handleFilterChange(filterBy, selectedDate);
            }
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    // EDIT TODO
    const handleEdit = async (todo: Todo) => {
        try {
            console.log("updated item", todo);
            setSelectedTodo(todo);
            setOpenTodoDialog(true);
        } catch (error) {
            console.error("Failed to update todo:", error);
        }
    };
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    if (loading) {
        return <Spinner label="Loading todos..." />;
    }
    return (
        <>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                }}
            >
                <Dropdown
                    placeholder="Select filter"
                    value={filterBy}
                    onOptionSelect={(_, data) => {
                        setFilterBy(data.optionValue as "month" | "day" | "All");
                        setSelectedDate("");
                        setPage(1);
                    }}
                >
                    <Option value="All">All</Option>
                    <Option value="month">Month</Option>
                    <Option value="day">Day</Option>
                </Dropdown>
                {
                    filterBy === "month" && (
                        <input type="month"
                            value={selectedDate}
                            onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setPage(1);
                            }} />
                    )
                }
                {filterBy === "day" && (
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setPage(1);
                        }}
                    />
                )}
            </div>
            <Table aria-label="Todo list">
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>Title</TableHeaderCell>
                        <TableHeaderCell>Description</TableHeaderCell>
                        <TableHeaderCell>Status</TableHeaderCell>
                        <TableHeaderCell>Priority</TableHeaderCell>
                        <TableHeaderCell>CreationDate</TableHeaderCell>
                        <TableHeaderCell>Due Date</TableHeaderCell>
                        <TableHeaderCell>Category</TableHeaderCell>
                        <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* ================= ALL ================= */}
                    {filterBy === "All" && (
                        todos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    No todos found
                                </TableCell>
                            </TableRow>
                        ) : (
                            todos.map((todo) => (
                                <TodoRow
                                    key={todo.id}
                                    todo={todo}
                                    formatDate={formatDate}
                                    handleEdit={handleEdit}
                                    setopenDialogBox={setopenDialogBox}
                                    setselectedTodoId={setselectedTodoId}
                                />
                            ))
                        )
                    )}
                    {/* ================= MONTH ================= */}
                    {filterBy === "month" && (
                        todosByDate.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    No todos found
                                </TableCell>
                            </TableRow>
                        ) : (
                            todosByDate.map((day) => {
                                const currentPage = datePages[day.date] || 1;
                                const startIndex = (currentPage - 1) * datePageSize;
                                const currentTasks =
                                    day.tasks.slice(
                                        startIndex,
                                        startIndex + datePageSize
                                    );
                                // Total pages for this date
                                const totalPages =
                                    Math.ceil(day.tasks.length / datePageSize);
                                return (
                                    <Fragment key={day.date}>
                                        {/* DATE HEADING */}
                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                <strong>
                                                    {formatDate(day.date)}
                                                </strong>
                                            </TableCell>
                                        </TableRow>
                                        {/* TASKS */}

                                        {currentTasks.map((todo) => (
                                            <TodoRow
                                                key={todo.id}
                                                todo={todo}
                                                formatDate={formatDate}
                                                handleEdit={handleEdit}
                                                setopenDialogBox={setopenDialogBox}
                                                setselectedTodoId={setselectedTodoId}
                                            />
                                        ))}
                                        {/* PAGINATION FOR THIS DATE */}

                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        margin: "10px 0",
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        disabled={currentPage === 1}
                                                        onClick={() => {
                                                            setDatePages((prev) => ({
                                                                ...prev,
                                                                [day.date]: currentPage - 1,
                                                            }));
                                                        }}
                                                    >
                                                        Previous
                                                    </Button>

                                                    <span>
                                                        Page {currentPage} of {totalPages}
                                                    </span>

                                                    <Button
                                                        size="small"
                                                        disabled={currentPage >= totalPages}
                                                        onClick={() => {
                                                            setDatePages((prev) => ({
                                                                ...prev,
                                                                [day.date]: currentPage + 1,
                                                            }));
                                                        }}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </Fragment>
                                )
                            }
                            )
                        )

                    )}
                    {/* ================= DAY ================= */}

                    {filterBy === "day" && (
                        todosByDate.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8}>
                                    No todos found
                                </TableCell>
                            </TableRow>
                        ) : (
                            todosByDate.map((day) =>{
                                
                                const currentPage = datePages[day.date] || 1;
                                const startIndex = (currentPage - 1) * datePageSize;
                                const currentTasks =
                                    day.tasks.slice(
                                        startIndex,
                                        startIndex + datePageSize
                                    );
                                // Total pages for this date
                                const totalPages =
                                    Math.ceil(day.tasks.length / datePageSize);      
                                return(
                                <Fragment key={day.date}>
                                    {/* DATE HEADING */}
                                    <TableRow>
                                        <TableCell colSpan={8}>
                                            <strong>
                                                {formatDate(day.date)}
                                            </strong>
                                        </TableCell>
                                    </TableRow>

                                    {/* TASKS */}

                                    {currentTasks.map((todo) => (
                                        <TodoRow
                                            key={todo.id}
                                            todo={todo}
                                            formatDate={formatDate}
                                            handleEdit={handleEdit}
                                            setopenDialogBox={setopenDialogBox}
                                            setselectedTodoId={setselectedTodoId}
                                        />
                                    ))}
                                      {/* PAGINATION FOR THIS DATE */}
                                        <TableRow>
                                            <TableCell colSpan={8}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        gap: "10px",
                                                        margin: "10px 0",
                                                    }}
                                                >
                                                    <Button
                                                        size="small"
                                                        disabled={currentPage === 1}
                                                        onClick={() => {
                                                            setDatePages((prev) => ({
                                                                ...prev,
                                                                [day.date]: currentPage - 1,
                                                            }));
                                                        }}
                                                    >
                                                        Previous
                                                    </Button>

                                                    <span>
                                                        Page {currentPage} of {totalPages}
                                                    </span>

                                                    <Button
                                                        size="small"
                                                        disabled={currentPage >= totalPages}
                                                        onClick={() => {
                                                            setDatePages((prev) => ({
                                                                ...prev,
                                                                [day.date]: currentPage + 1,
                                                            }));
                                                        }}
                                                    >
                                                        Next
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                </Fragment>
                            )
                        }
                        )
                        )
                    )}

                </TableBody>
            </Table>
            {
                filterBy === "All" && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <Button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Previous
                        </Button>

                        <span>Page {page}</span>

                        <Button
                            disabled={page * pageSize >= totalcount}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )

            }
                {
                filterBy === "month"  && (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            marginTop: "20px",
                        }}
                    >
                        <Button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Previous
                        </Button>

                        <span>Page {page}</span>

                        <Button
                            disabled={page * monthPageSize >= totalcount}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                )

            }
            <TodoForm
                open={openTodoDialog}
                onClose={() => {
                    setOpenTodoDialog(false);
                    setSelectedTodo(undefined);
                }}
                onSuccess={() => {
                    fetchTodos();
                    handleFilterChange(filterBy, selectedDate)
                }}
                projectid={projectid}
                todo={SelectedTodo}
            />
            <Dialog open={openDialogBox} onOpenChange={(_, data) => {
                setOpenTodoDialog(data.open)
            }}>
                <DialogSurface>
                    <DialogBody>
                        <DialogTitle>
                            Delete Todo
                        </DialogTitle>

                        <DialogContent>
                            Are you sure you want to delete this todo?
                        </DialogContent>

                        <DialogActions>

                            <Button
                                appearance="secondary"
                                onClick={() => setopenDialogBox(false)}
                            >
                                No
                            </Button>

                            <Button
                                appearance="primary"
                                onClick={() => {
                                    if (selectedTodoId) {
                                        handleDelete(selectedTodoId);
                                    }

                                    setopenDialogBox(false);
                                    setselectedTodoId(null);
                                }}
                            >
                                Yes
                            </Button>
                        </DialogActions>
                    </DialogBody>
                </DialogSurface>
            </Dialog>
        </>
    );
};

export default TodoList;