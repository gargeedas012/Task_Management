namespace Projects.Dtos.Task
{
    public class CreateTodoDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Priority { get; set; } = null!;
        public DateTime DueDate { get; set; }
        public string Category { get; set; } = null!;
        public bool IsCompleted { get; set; }
    }
}
