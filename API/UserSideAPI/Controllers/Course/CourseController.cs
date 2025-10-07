using Azure.Core;
using Common.Helper;
using Common.Models.CourseModels;
using Common.Models.UserModel;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Security.Claims;

namespace UserSideAPI.Controllers.Course
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly IGenericService<Courses> _courseService;
        private readonly IGenericService<CourseOutlines> _courseOutlinesService;
        private readonly IGenericService<CourseEnrollments> _courseEnrollmentService;
        private readonly IGenericService<Common.Models.UserModel.Users> _userService;
        private bool isTrue { get; set; } = false;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        public CourseController(IGenericService<Courses> courseService, IGenericService<CourseOutlines>  courseOutlinesService,
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



        // ✅ POST: Create Course with Image + Outlines
        [HttpPost("CreateCourse")]
        public async Task<IActionResult> CreateCourse([FromForm] CourseCreateDTO model)
        {
            try
            {
                if (model == null)
                    return BadRequest(new { status = "error", message = "Invalid course data." });

                string? imagePath = null;

                // 1) Save Image if uploaded
                if (model.Image != null && model.Image.Length > 0)
                {
                    var apiRoot = Directory.GetCurrentDirectory();
                    var commonImgRoot = Path.GetFullPath(Path.Combine(apiRoot, "..", "Common", "Images"));

                    imagePath = ImageHelper.SaveImage(
                        file: model.Image,
                        rootPath: commonImgRoot,
                        parentFolder: null,
                        subFolder: "CourseImages"
                    );
                }

                // 2) Save Course
                var newCourse = new Courses
                {
                    title = model.Title,
                    subTitle = model.Subtitle,
                    courseDescription = model.Description,
                    duration = model.Duration,
                    durationType = model.DurationType,
                    level = model.Level,
                    prerequisites = model.Prerequisites,
                    audience = model.Audience,
                    audienceType = model.AudienceType,
                    price = model.Price,
                    outcome = model.Outcome,
                    imageUrl = imagePath,
                    createdAt = DateTime.UtcNow
                };

                _courseService.Add(newCourse);

                // ✅ Fetch the latest created course (assumes createdAt is unique enough)
                var latestCourse = _courseService.GetAll()
                                                 .OrderByDescending(c => c.createdAt)
                                                 .FirstOrDefault();

                if (latestCourse == null)
                    return StatusCode(500, new { status = "error", message = "Failed to retrieve the created course." });

                int courseId = latestCourse.Id;

                // 3) Save Course Outlines if provided
                if (model.Outlines != null && model.Outlines.Count > 0)
                {
                    foreach (var outline in model.Outlines)
                    {
                        var courseOutline = new CourseOutlines
                        {
                            courseId = courseId,
                            outlineText = outline
                        };
                        _courseOutlinesService.Add(courseOutline);
                    }
                }

                return Ok(new
                {
                    status = "success",
                    message = "Course created successfully.",
                    courseId = courseId,
                    imageUrl = imagePath
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"Error while creating course: {ex.Message}"
                });
            }
        }


        [HttpGet("GetAllCourses")]
        public IActionResult GetAllCourses()
        {
            try
            {
                // ✅ Use path relative to Common/Images
                string apiRoot = Directory.GetCurrentDirectory();
                string commonImgRoot = Path.GetFullPath(Path.Combine(apiRoot, "..", "Common", "Images"));

                var courses = _courseService.GetAll();

                var result = courses.Select(c =>
                {
                    string imageBase64 = ConvertImageToBase64(commonImgRoot, c.imageUrl, out string contentType);

                    return new
                    {
                        c.Id,
                        c.title,
                        c.subTitle,
                        c.courseDescription,
                        c.duration,
                        c.durationType,
                        c.level,
                        c.prerequisites,
                        c.audience,
                        c.price,
                        c.audienceType,
                        c.outcome,
                        c.imageUrl,
                        ImageBytes = imageBase64,
                        ContentType = contentType,
                        c.createdAt,
                        outlines = _courseOutlinesService
                            .GetAll()
                            .Where(o => o.courseId == c.Id)
                            .Select(o => o.outlineText)
                            .ToList()
                    };
                }).ToList();

                return Ok(new { status = "success", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"Error while fetching courses: {ex.Message}"
                });
            }
        }

        // ✅ FIXED: Edit Course
        [HttpPut("EditCourse/{id}")]
        public async Task<IActionResult> EditCourse(int id, [FromForm] CourseCreateDTO model)
        {
            try
            {
                var course = _courseService.GetAll().FirstOrDefault(c => c.Id == id);
                if (course == null)
                    return NotFound(new { status = "error", message = "Course not found." });

                // ✅ Update image if a new one is provided
                if (model.Image != null && model.Image.Length > 0)
                {
                    var apiRoot = Directory.GetCurrentDirectory();
                    var commonImgRoot = Path.GetFullPath(Path.Combine(apiRoot, "..", "Common", "Images"));

                    // Optional: Delete old image
                    if (!string.IsNullOrEmpty(course.imageUrl))
                    {
                        var oldImagePath = Path.Combine(commonImgRoot, course.imageUrl.Replace("/", Path.DirectorySeparatorChar.ToString()));
                        if (System.IO.File.Exists(oldImagePath))
                        {
                            System.IO.File.Delete(oldImagePath);
                        }
                    }

                    var newImagePath = ImageHelper.SaveImage(
                        file: model.Image,
                        rootPath: commonImgRoot,
                        parentFolder: null,
                        subFolder: "CourseImages"
                    );

                    course.imageUrl = newImagePath;
                }

                // ✅ Update all fields
                course.title = model.Title;
                course.subTitle = model.Subtitle;
                course.courseDescription = model.Description;
                course.duration = model.Duration;
                course.durationType = model.DurationType;
                course.level = model.Level;
                course.prerequisites = model.Prerequisites;
                course.audience = model.Audience;
                course.audienceType = model.AudienceType;
                course.price = model.Price;
                course.outcome = model.Outcome;

                // ✅ CRITICAL FIX: First update the course, then handle outlines
                bool updateSuccess = _courseService.Update(course);

                if (!updateSuccess)
                {
                    return StatusCode(500, new { status = "error", message = "Failed to update course." });
                }

                // ✅ Now handle outlines: Delete ALL existing outlines first
                var existingOutlines = _courseOutlinesService.GetAll()
                    .Where(o => o.courseId == id)
                    .ToList();

                foreach (var outline in existingOutlines)
                {
                    _courseOutlinesService.Delete(outline.Id);
                }

                // ✅ Then add the NEW outlines from the form
                if (model.Outlines != null && model.Outlines.Count > 0)
                {
                    foreach (var outlineText in model.Outlines)
                    {
                        if (!string.IsNullOrWhiteSpace(outlineText)) // Skip empty strings
                        {
                            var courseOutline = new CourseOutlines
                            {
                                courseId = id,
                                outlineText = outlineText
                            };
                            _courseOutlinesService.Add(courseOutline);
                        }
                    }
                }

                return Ok(new
                {
                    status = "success",
                    message = "Course updated successfully.",
                    courseId = course.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"Error while updating course: {ex.Message}",
                    details = ex.InnerException?.Message
                });
            }
        }

        // ✅ FIXED: Delete Course
        [HttpDelete("DeleteCourse/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            try
            {
                var course = _courseService.GetAll().FirstOrDefault(c => c.Id == id);
                if (course == null)
                    return NotFound(new { status = "error", message = "Course not found." });

                // ✅ CRITICAL FIX: Delete enrollments first (if any)
                var enrollments = _courseEnrollmentService.GetAll()
                    .Where(e => e.courseId == id)
                    .ToList();

                foreach (var enrollment in enrollments)
                {
                    _courseEnrollmentService.Delete(enrollment.Id);
                }

                // ✅ Delete related outlines
                var outlines = _courseOutlinesService.GetAll()
                    .Where(o => o.courseId == id)
                    .ToList();

                foreach (var outline in outlines)
                {
                    _courseOutlinesService.Delete(outline.Id);
                }

                // ✅ Delete image file (optional)
                if (!string.IsNullOrEmpty(course.imageUrl))
                {
                    var apiRoot = Directory.GetCurrentDirectory();
                    var commonImgRoot = Path.GetFullPath(Path.Combine(apiRoot, "..", "Common", "Images"));
                    var imagePath = Path.Combine(commonImgRoot, course.imageUrl.Replace("/", Path.DirectorySeparatorChar.ToString()));

                    if (System.IO.File.Exists(imagePath))
                    {
                        System.IO.File.Delete(imagePath);
                    }
                }

                // ✅ Finally, delete the course itself
                bool deleteSuccess = _courseService.Delete(course.Id);

                if (!deleteSuccess)
                {
                    return StatusCode(500, new { status = "error", message = "Failed to delete course from database." });
                }

                return Ok(new
                {
                    status = "success",
                    message = "Course deleted successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"Error while deleting course: {ex.Message}",
                    details = ex.InnerException?.Message
                });
            }
        }


        //most sold courses
        [HttpGet("GetMostSoldCourses")]
        public IActionResult GetMostSoldCourses()
        {
            try
            {
                var enrollments = _courseEnrollmentService.GetAll();
                var courses = _courseService.GetAll();
                
                var mostSold = enrollments
                .GroupBy(e => e.courseId)
                .Select(g => new
                {
                    CourseId = g.Key,
                    Enrollments = g.Count()
                })
                .OrderByDescending(x => x.Enrollments)
                .Take(5) // top 5 courses
                .ToList();

            var result = (from s in mostSold
                          join c in courses on s.CourseId equals c.Id
                          select new
                          {
                              c.Id,
                              c.title,
                              c.price,
                              c.imageUrl,
                              Enrollments = s.Enrollments
                          }).ToList();
                return Ok(new { status = "success", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "error",
                    message = $"Error while fetching courses: {ex.Message}"
                });
            }
        }


        private string ConvertImageToBase64(string basePath, string imageUrl, out string contentType)
        {
            contentType = "application/octet-stream";

            if (string.IsNullOrWhiteSpace(imageUrl))
                return null;

            try
            {
                var sanitizedPath = imageUrl
                    .Replace("/", Path.DirectorySeparatorChar.ToString())
                    .TrimStart(Path.DirectorySeparatorChar);

                var imagePath = Path.Combine(basePath, sanitizedPath);

                if (!System.IO.File.Exists(imagePath))
                    return null;

                new FileExtensionContentTypeProvider().TryGetContentType(imagePath, out contentType);
                var bytes = System.IO.File.ReadAllBytes(imagePath);
                return Convert.ToBase64String(bytes);
            }
            catch
            {
                return null;
            }
        }


    }
}
