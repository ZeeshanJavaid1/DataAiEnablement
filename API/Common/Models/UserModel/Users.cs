using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.UserModel
{
    public class Users
    {
        public int Id { get; set; }

        [Column("UserName")]
        public string userName { get; set; }

        [Column("Email")]
        public required string email { get; set; }

        [Column("Password")]
        public required string password { get; set; }

        [Column("CreatedDate")]
        public DateTime createdDate { get; set; } = DateTime.UtcNow;

        [Column("IsAdmin")]
        public bool IsAdmin { get; set; }   // BIT maps to bool in C#

        [Column("AdminKey")]
        public string? AdminKey { get; set; }
    }
}
