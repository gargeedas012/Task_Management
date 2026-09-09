namespace BackEnd.Common
{
    public class ApiResponseBase
    {
        public List<ApiError> Errors { get; set; } = new List<ApiError>();
    }
}
