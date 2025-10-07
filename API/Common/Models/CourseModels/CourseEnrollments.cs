using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.CourseModels
{
    public class CourseEnrollments
    {
        [Column("Id")]
        public int Id { get; set; }

        [Column("UserId")]
        public int userId { get; set; }

        [Column("CourseId")]
        public int courseId { get; set; }

        [Column("PhoneNumber")]
        public string phoneNumber { get; set; }

        [Column("CreatedDate")]
        public DateTime createdDate { get; set; }

        [Column("Status")]
        public string status { get; set; }

        [Column("StatusUpdatedDate")]
        public DateTime statusUpdatedDate { get; set; }
    }
}
