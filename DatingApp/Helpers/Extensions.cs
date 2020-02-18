using System;
using Microsoft.AspNetCore.Http;

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
        public static int CalculateAge(this DateTime datetime)
        {

            int age = DateTime.Today.Year - datetime.Year;
            if (datetime.AddYears(age) > DateTime.Today)
                age--;
            return age;
        }
    }
}