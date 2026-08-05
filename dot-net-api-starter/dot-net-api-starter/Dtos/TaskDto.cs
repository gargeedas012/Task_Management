using System;
using Projects.Models;

namespace Projects.Dtos
{
    public class SaveTaskReq
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime? DueDate { get; set; }
        public TaskStatusEnum Status { get; set; }
        public string AssignedTo { get; set; }
    }

    public class TaskSearchReq
    {
        public string Term { get; set; }
        public TaskStatusEnum? Status { get; set; }
        public int Start { get; set; } = 0;
        public int Length { get; set; } = 10;
    }
}
