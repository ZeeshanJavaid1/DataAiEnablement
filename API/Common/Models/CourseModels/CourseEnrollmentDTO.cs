using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.CourseModels
{
    public class CourseEnrollmentDTO
    {
        public int CourseId { get; set; }
        public string PhoneNumber { get; set; }

        public string Status { get; set; }
    }
}
