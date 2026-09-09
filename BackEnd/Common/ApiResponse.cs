using System.Text.Json.Serialization;

namespace BackEnd.Common
{
    public class ApiResponse<T>: ApiResponseBase
    {
        private readonly DateTime startTime;
        private bool? status;
        public ApiResponse()
        {
            startTime = DateTime.Now;
        }
        public T? Result { get; set; }
        public double ExecutionTime
        {
            get
            {
                return DateTime.Now
                    .Subtract(startTime)
                    .TotalSeconds;
            }
        }
        [JsonIgnore(Condition = JsonIgnoreCondition.Never)]
        public bool Status
        {
            get
            {
                if (status.HasValue)
                {
                    return status.Value;
                }
                return Errors.Count == 0;
            }
            set
            {
                status = value;
            }
        }
        public string Message
        {
            get
            {
                return Status
                    ? "Request completed successfully"
                    : "Request failed";
            }
        }
    }
}
