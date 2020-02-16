using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.Data;
using DatingApp.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;

        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            this._repo = repo;
            this._config = config;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto userRegisterDto)
        {
            string username = userRegisterDto.UserName;

            username = username.ToLower();

            if (await this._repo.IsUserExists(username))
                return BadRequest("User already exists.");

            await this._repo.Register(new Models.User() { UserName = username }, userRegisterDto.Password);
            return StatusCode(201);
        }
        [HttpPost("login")]

        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var user = await this._repo.Login(userLoginDto.UserName, userLoginDto.Password);

            if (user == null)
                return Unauthorized();

            //payload
            var claims = new[]{

                    new Claim(ClaimTypes.NameIdentifier,user.Id.ToString()),
                    new Claim(ClaimTypes.Name,user.UserName.ToString())
            };

            //key 
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._config.
                    GetSection("AppSettings:Token").Value));

            //signing key
            var credential = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            //cobining all data required in single unit to generate token
            var toeknDescriptor = new SecurityTokenDescriptor()
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credential
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            //generate token from jwt handler
            var token = tokenHandler.CreateToken(toeknDescriptor);

            //return token to client 
            return Ok(new
            {
                token = tokenHandler.WriteToken(token)
            });
        }
    }
}