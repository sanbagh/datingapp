using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace DatingApp.Helpers
{
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse httpResponse, string message)
        {
            httpResponse.Headers.Add("Application-Error", message);
            httpResponse.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            httpResponse.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        public static void AddPagination(this HttpResponse httpResponse, int pageNumber, int pageSize
        , int totalPages, int totalCount)
        {
            var PaginationHeader = new PaginationHeader(pageNumber, pageSize, totalPages, totalCount);
            var camelCaseFormatter  = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            httpResponse.Headers.Add("Pagination", JsonConvert.SerializeObject(PaginationHeader,camelCaseFormatter));
            httpResponse.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
        public static int CalculateAge(this DateTime datetime)
        {

            int age = DateTime.Today.Year - datetime.Year;
            if (datetime.AddYears(age) > DateTime.Today)
                age--;
            return age;
        }
    }
}