using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var result = await next();
            int userId = int.Parse(result.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userService = result.HttpContext.RequestServices.GetService<IDatingRepository>();
            var user = await userService.GetUser(userId);
            user.LastActive = DateTime.Now;
            await userService.SaveAll();
        }
    }
}