using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.UserModel
{
    public class ContactUs
    {
        public int Id { get; set; }

        [Column("UserId")]
        public required int userId { get; set; }

        [Column("UserName")]
        public required string userName { get; set; }

        [Column("Message")]
        public required string message { get; set; }

        [Column("UserEmail")]
        public required string userEmail { get; set; }

        [Column("CompanyEmail")]
        public required string companyEmail { get; set; }
    }
}
