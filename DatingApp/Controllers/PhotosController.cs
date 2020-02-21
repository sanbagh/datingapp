using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.Data;
using DatingApp.DTOs;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IDatingRepository _datingRepo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _clodinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IDatingRepository datingRepo, IMapper mapper, IOptions<CloudinarySettings> clodinaryConfig)
        {
            this._mapper = mapper;
            this._clodinaryConfig = clodinaryConfig;
            this._datingRepo = datingRepo;
            Account ac = new Account(_clodinaryConfig.Value.CloudName,
                            clodinaryConfig.Value.ApiKey, _clodinaryConfig.Value.ApiSecret);
            _cloudinary = new Cloudinary(ac);
        }
        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photo = await _datingRepo.GetPhoto(id);
            var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
            return Ok(photoToReturn);
        }
        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId,
               [FromForm] PhotoForCreationDto photoForCreationDto)
        {

            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _datingRepo.GetUser(userId);
            var file = photoForCreationDto.File;
            ImageUploadResult uploadResult = new ImageUploadResult();

            if (file != null && file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500)
                        .Crop("fill").Gravity("face")
                    };
                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if (!user.Photos.Any(p => p.IsMain))
                photo.IsMain = true;
            user.Photos.Add(photo);

            if (await _datingRepo.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new { userId = userId, id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add photo");
        }
        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _datingRepo.GetUser(userId);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await _datingRepo.GetPhoto(id);
            if (photo.IsMain)
                return BadRequest("This is already a main photo");

            var alreadyMainPhoto = await _datingRepo.GetMainPhotoForUser(userId);
            alreadyMainPhoto.IsMain = false;
            photo.IsMain = true;

            if (await _datingRepo.SaveAll())
                return NoContent();

            return BadRequest("Error in uploading photo.");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            if (userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var user = await _datingRepo.GetUser(userId);
            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();

            var photo = await _datingRepo.GetPhoto(id);
            if (photo.IsMain)
                return BadRequest("Can't delete main photo");
            if (!string.IsNullOrEmpty(photo.PublicId))
            {
                DeletionResult result = _cloudinary.Destroy(new DeletionParams(photo.PublicId));
                if (result.Result == "ok")
                    _datingRepo.Delete(photo);
            }
            else
            {
                _datingRepo.Delete(photo);
            }
            if (await _datingRepo.SaveAll())
                return Ok();
            return BadRequest("Can't delete photo");

        }
    }
}