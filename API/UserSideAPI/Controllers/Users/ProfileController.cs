using Common.Models.DTO;
using Common.Models.UserModel;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace UserSideAPI.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IGenericService<ContactUs> _contactUsService;
        private readonly IEmailService _emailService;
        private readonly IWebHostEnvironment _environment;

        // Hardcoded company email (can also be passed from frontend if needed)
        private const string CompanyEmail = "abdulmanan2744@gmail.com";

        public ProfileController(IEmailService emailService, IGenericService<ContactUs> contactUsService,
            IWebHostEnvironment environment)
        {
            _emailService = emailService;
            _contactUsService = contactUsService;
            _environment = environment;
        }

        [HttpPost("SendMessagetoCompany")]
        public async Task<IActionResult> SendMessagetoCompany([FromBody] ContactMessageDTO dto)
        {
            try
            {
                // Send the user's message to the company email
                await _emailService.SendEmailAsync(
                    CompanyEmail,
                    subject: $"New Contact from {dto.Name}",
                    body: $"Name: {dto.Name}\nEmail: {dto.Email}\nMessage:\n{dto.Message}"
                );

                // Send auto-reply to user
                var autoResponseSubject = "Thank you for contacting us";
                var autoResponseBody =
                    $"Dear {dto.Name},\n\n" +
                    "Thank you for reaching out to us. We have received your message below:\n\n" +
                    $"{dto.Message}\n\n" +
                    "We will get back to you as soon as possible.\n\n" +
                    "Best regards,\n" +
                    "The Company Team";

                await _emailService.SendEmailAsync(dto.Email, autoResponseSubject, autoResponseBody);

                return Ok(new { status = "success", message = "Message sent successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = $"An error occurred: {ex.Message}" });
            }
        }

    }
}
