using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.CourseModels
{
    public class EnrollmentStatsDto
    {
        public int TotalUsers { get; set; }
        public int EnrolledUsers { get; set; }
        public decimal EnrollmentPercentage { get; set; }

        public List<CourseEnrollments> NewEnrollmentRequests { get; set; }
        public List<CourseEnrollments> AcceptedEnrollments { get; set; }
        public List<CourseEnrollments> CompletedCourses { get; set; }
        public List<CourseEnrollments> RejectedEnrollments { get; set; }
    }
}
