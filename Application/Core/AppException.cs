public class AppException (string message, int statusCode = 500, string details = null) 
{
    public int StatusCode { get; set ;} = statusCode;
    public string Details { get; set; } = details;
    public string Message { get; set; } = message;
}