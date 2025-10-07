using Common.Helper;
using Common.Models.CourseModels;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Security.Claims;

namespace UserSideAPI.Controllers.Course
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly IGenericService<Courses> _courseService;
        private readonly IGenericService<CourseOutlines> _courseOutlinesService;
        private readonly IGenericService<CourseEnrollments> _courseEnrollmentService;
        private readonly IGenericService<Common.Models.UserModel.Users> _userService;
        private bool isTrue { get; set; } = false;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        public EnrollmentController(IGenericService<Courses> courseService, IGenericService<CourseOutlines> courseOutlinesService,
            IGenericService<CourseEnrollments> courseEnrollmentservice, IGenericService<Common.Models.UserModel.Users> userService,
            IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _courseService = courseService;
            _courseOutlinesService = courseOutlinesService;
            _courseEnrollmentService = courseEnrollmentservice;
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("CreateEnrollment")]
        [Authorize]
        public async Task<IActionResult> CreateEnrollment([FromBody] CourseEnrollmentDTO model)
        {
            try
            {
                if (model == null || model.CourseId == 0 || string.IsNullOrWhiteSpace(model.PhoneNumber))
                    return BadRequest(new { status = "error", message = "Valid data is required." });

                // ✅ 1) Get user ID from token (recommended claim type: NameIdentifier or "userId")
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                    return Unauthorized(new { status = "error", message = "Invalid or missing user ID in token." });

                // ✅ 2) Check if already enrolled
                var exists = _courseEnrollmentService
                    .GetAll()
                    .Any(e => e.userId == userId && e.courseId == model.CourseId);

                if (exists)
                    return Conflict(new { status = "error", message = "You are already enrolled in this course." });

                // ✅ 3) Create and save enrollment
                var enrollment = new CourseEnrollments
                {
                    userId = userId,
                    courseId = model.CourseId,
                    phoneNumber = model.PhoneNumber,
                    createdDate = DateTime.UtcNow,
                    status = model.Status,
                    statusUpdatedDate = DateTime.UtcNow
                };

                _courseEnrollmentService.Add(enrollment);

                return Ok(new
                {
                    status = "success",
                    message = "Enrollment successful.",
                    enrollmentId = enrollment.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"An error occurred while creating enrollment: {ex.Message}"
                });
            }
        }

        //enrollment stats
        [HttpPost("GetEnrollmentStats")]
        public async Task<IActionResult> GetEnrollmentStats([FromBody] object? obj = null)
        {
            try
            {
                var connectionString = _configuration.GetConnectionString("DefaultConnection");

                int totalUsers = 0;
                int enrolledUsers = 0;
                decimal enrollmentPercentage = 0;

                var newEnrollments = new List<object>();
                var acceptedEnrollments = new List<object>();
                var completedEnrollments = new List<object>();
                var rejectedEnrollments = new List<object>();

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var command = new SqlCommand("GetEnrollmentStats", connection)
                    {
                        CommandType = CommandType.StoredProcedure,
                        CommandTimeout = 300
                    };

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        // 1. First result set => stats
                        if (await reader.ReadAsync())
                        {
                            totalUsers = Convert.ToInt32(reader["TotalUsers"]);
                            enrolledUsers = Convert.ToInt32(reader["EnrolledUsers"]);
                            enrollmentPercentage = Convert.ToDecimal(reader["EnrollmentPercentage"]);
                        }

                        // 2. Move to next result set => New Enrollments
                        if (await reader.NextResultAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                newEnrollments.Add(new
                                {
                                    Id = reader["Id"],
                                    UserId = reader["UserId"],
                                    CourseId = reader["CourseId"],
                                    PhoneNumber = reader["PhoneNumber"],
                                    CreatedDate = reader["CreatedDate"],
                                    Status = reader["Status"],
                                    StatusUpdatedDate = reader["StatusUpdatedDate"],
                                    CourseTitle = reader["CourseTitle"],
                                    CourseLevel = reader["CourseLevel"]
                                });
                            }
                        }

                        // 3. Accepted Enrollments
                        if (await reader.NextResultAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                acceptedEnrollments.Add(new
                                {
                                    Id = reader["Id"],
                                    UserId = reader["UserId"],
                                    CourseId = reader["CourseId"],
                                    PhoneNumber = reader["PhoneNumber"],
                                    CreatedDate = reader["CreatedDate"],
                                    Status = reader["Status"],
                                    StatusUpdatedDate = reader["StatusUpdatedDate"],
                                    CourseTitle = reader["CourseTitle"],
                                    CourseLevel = reader["CourseLevel"]
                                });
                            }
                        }

                        // 4. Completed Enrollments
                        if (await reader.NextResultAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                completedEnrollments.Add(new
                                {
                                    Id = reader["Id"],
                                    UserId = reader["UserId"],
                                    CourseId = reader["CourseId"],
                                    PhoneNumber = reader["PhoneNumber"],
                                    CreatedDate = reader["CreatedDate"],
                                    Status = reader["Status"],
                                    StatusUpdatedDate = reader["StatusUpdatedDate"],
                                    CourseTitle = reader["CourseTitle"],
                                    CourseLevel = reader["CourseLevel"]
                                });
                            }
                        }

                        // 5. Rejected Enrollments
                        if (await reader.NextResultAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                rejectedEnrollments.Add(new
                                {
                                    Id = reader["Id"],
                                    UserId = reader["UserId"],
                                    CourseId = reader["CourseId"],
                                    PhoneNumber = reader["PhoneNumber"],
                                    CreatedDate = reader["CreatedDate"],
                                    Status = reader["Status"],
                                    StatusUpdatedDate = reader["StatusUpdatedDate"],
                                    CourseTitle = reader["CourseTitle"],
                                    CourseLevel = reader["CourseLevel"]
                                });
                            }
                        }
                    }
                }

                return Ok(new
                {
                    status = "success",
                    stats = new
                    {
                        TotalUsers = totalUsers,
                        EnrolledUsers = enrolledUsers,
                        EnrollmentPercentage = enrollmentPercentage
                    },
                    NewEnrollmentRequests = newEnrollments,
                    AcceptedEnrollments = acceptedEnrollments,
                    CompletedCourses = completedEnrollments,
                    RejectedEnrollments = rejectedEnrollments
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = $"An error occurred: {ex.Message}" });
            }
        }

        //update enrollment status
        [HttpPut("UpdateEnrollmentStatus")]
        public async Task<IActionResult> UpdateEnrollmentStatus([FromBody] EnrollmentStatusDTO model)
        {
            try
            {
                if (model == null || model.EnrollmentId <= 0 || string.IsNullOrWhiteSpace(model.Status))
                    return BadRequest(new { status = "error", message = "Valid enrollment ID and status are required." });

                // ✅ 1) Fetch the enrollment record
                var enrollment = _courseEnrollmentService.GetById(model.EnrollmentId, true, "Id").FirstOrDefault();
                if (enrollment == null)
                    return NotFound(new { status = "error", message = "Enrollment not found." });

                // ✅ 2) Validate allowed status values
                var allowedStatuses = new[] { "New", "Accepted", "Rejected", "Completed" };
                if (!allowedStatuses.Contains(model.Status))
                    return BadRequest(new { status = "error", message = "Invalid status value." });

                // ✅ 3) Update enrollment
                enrollment.status = model.Status;
                enrollment.statusUpdatedDate = DateTime.UtcNow;

                _courseEnrollmentService.Update(enrollment);

                return Ok(new
                {
                    status = "success",
                    message = $"Enrollment status updated to {model.Status}."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"An error occurred while updating enrollment: {ex.Message}"
                });
            }
        }


    }
}
