using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.Helpers;
using DatingApp.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _dataContext;

        public DatingRepository(DataContext dataContext)
        {
            this._dataContext = dataContext;
        }
        public void Add<T>(T entity) where T : class
        {
            _dataContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dataContext.Remove(entity);
        }

        public async Task<User> GetUser(int id)
        {
            return await _dataContext.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var list = _dataContext.Users.Include(u => u.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            list = list.Where(u => u.Id != userParams.UserId && u.Gender == userParams.Gender);
            string val = userParams.Likers ? "true" : (userParams.Likees ? "false" : "no");
            if (val != "no")
            {
                var listOfUserLikes = await GetUserLikes(userParams.UserId, Convert.ToBoolean(val));
                list = list.Where(u => listOfUserLikes.Contains(u.Id));
            }
            if (userParams.MinAge != 18 && userParams.MaxAge != 99)
            {
                var minDob = DateTime.Now.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Now.AddYears(-userParams.MinAge);
                list = list.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created": list = list.OrderByDescending(u => u.Created); break;
                    default: list = list.OrderByDescending(u => u.LastActive); break;
                }
            }
            return await PagedList<User>.CreateAsync(list, userParams.PageNumber, userParams.PageSize);
        }
        private async Task<IEnumerable<int>> GetUserLikes(int userId, bool likers)
        {
            var user = await _dataContext.Users.Include(u => u.Likers).Include(u => u.Likees).
                                 FirstOrDefaultAsync(u => u.Id == userId);
            if (!likers)
            {
                return user.Likees.Where(x => x.LikerId == userId).Select(x => x.LikeeId);
            }
            else
            {
                return user.Likers.Where(x => x.LikeeId == userId).Select(x => x.LikerId);
            }
        }
        public async Task<bool> SaveAll()
        {
            return await _dataContext.SaveChangesAsync() > 0;
        }
        public async Task<Photo> GetPhoto(int id)
        {
            return await _dataContext.Photos.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _dataContext.Photos.Where(p => p.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }
        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _dataContext.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }
    }
}