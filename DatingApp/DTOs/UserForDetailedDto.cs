using System.Collections.Generic;
using DatingApp.Models;

namespace DatingApp.DTOs
{
    public class UserForDetailedDto : UserForListDto
    {
        public string LookingFor { get; set; }
        public string Introduction { get; set; }
        public string Interests { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }

    }
}