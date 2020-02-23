using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.Controllers
{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _datingRepository;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository datingRepository, IMapper mapper)
        {
            this._datingRepository = datingRepository;
            this._mapper = mapper;
        }
        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var currrentUser = await _datingRepository.GetUser(userId);

            userParams.UserId = userId;
            if (string.IsNullOrEmpty(userParams.Gender))
                userParams.Gender = currrentUser.Gender.ToLower() == "male" ? "female" : "male";

            var users = await _datingRepository.GetUsers(userParams);
            var mappedUsers = _mapper.Map<List<UserForListDto>>(users);
            Response.AddPagination(users.PageNumer, users.PageSize, users.TotalPages, users.TotalCount);
            return Ok(mappedUsers);
        }
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _datingRepository.GetUser(id);
            var mappedUser = _mapper.Map<UserForDetailedDto>(user);
            return Ok(mappedUser);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _datingRepository.GetUser(id);
            _mapper.Map(userForUpdateDto, user);

            if (await _datingRepository.SaveAll())
                return NoContent();

            throw new Exception($"updating user {id} failed on save.");
        }
        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {

            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userLike = await _datingRepository.GetLike(id, recipientId);
            if (userLike != null)
                return BadRequest("You already liked");

            var user =  await _datingRepository.GetUser(recipientId);
            if (user == null)
                return NotFound();

            var like = new Like
            {
                LikerId = id,
                LikeeId = recipientId
            };  
            _datingRepository.Add(like);
            if (await _datingRepository.SaveAll())
                return Ok();
            return BadRequest("Like Failed");
        }
    }
}