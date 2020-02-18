using System.Collections.Generic;
using System.IO;
using System.Linq;
using DatingApp.Data;
using DatingApp.Models;
using Newtonsoft.Json;

public class Seed
{

    public static void SeedUsers(DataContext dataContext)
    {
        if (!dataContext.Users.Any())
        {
            var data = File.ReadAllText("Data/UserSeedData.json");
            var listUsers = JsonConvert.DeserializeObject<List<User>>(data);
            byte[] passwordHash, passwordSalt;
            foreach (User user in listUsers)
            {
                CreatePasswordHash("password", out passwordHash, out passwordSalt);
                user.PasswordSalt = passwordSalt;
                user.PasswordHash = passwordHash;
                user.UserName = user.UserName.ToLower();
                dataContext.Add(user);
            }
            dataContext.SaveChanges();
        }
    }
    private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
    {
        using (var hamac = new System.Security.Cryptography.HMACSHA512())
        {
            passwordSalt = hamac.Key;
            passwordHash = hamac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }
}