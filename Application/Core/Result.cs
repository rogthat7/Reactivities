using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Data { get; set; }
        public string Error { get; set; }
        public int StatusCode { get; set; }

        protected Result(bool isSuccess, T data, string error, int statusCode = 200)
        {
            IsSuccess = isSuccess;
            Data = data;
            Error = error;
            StatusCode = statusCode;
        }

        public static Result<T> Success(T data) => new Result<T>(true, data, null, 200);
    
        public static Result<T> Failure(string error, int statusCode) => new Result<T>(false, default, error, statusCode);
    }
}