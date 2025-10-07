using Common.Models.DTO;
using Common.Models.UserModel;
using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;

namespace UserSideAPI.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // private readonly IUserService _userService;
        private readonly IGenericService<Common.Models.UserModel.Users> _userService;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        // Store codes temporarily (use a database in production)
        private static Dictionary<string, string> VerificationCodes = new Dictionary<string, string>();

        public AuthController(IGenericService<Common.Models.UserModel.Users> userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("DefaultConnection");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] Login model)
        {
            if (model == null)
            {
                return BadRequest(new { message = "Invalid login request." });
            }

            // Encrypt the entered password
            string encryptedPassword = EncryptPassword(model.Password);
            

            // Fetch all users
            var users = _userService.GetAll();

            // Find the user by email/username
            var user = users.FirstOrDefault(u => u.email == model.Username || u.userName == model.Username);
            if (user == null)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            // Validate password
            if (user.password != encryptedPassword)
            {
                return Unauthorized(new { message = "Invalid username or password." });
            }

            // If logging in as admin, check admin key
            if (model.IsAdmin)
            {
                string encryptedAdminKey = EncryptPassword(model.AdminKey);
                if (!user.IsAdmin)
                {
                    return Unauthorized(new { message = "This account is not an admin." });
                }

                if (string.IsNullOrEmpty(encryptedAdminKey) || encryptedAdminKey != user.AdminKey)
                {
                    return Unauthorized(new { message = "Invalid admin key." });
                }
            }

            // Generate JWT token
            var tokenString = GenerateJwtToken(user);
            var expiryDate = DateTime.UtcNow.AddMinutes(60); // Token expires in 60 minutes
            StoreToken(user.Id, tokenString, expiryDate);

            return Ok(new
            {
                Token = tokenString,
                Expiry = expiryDate,
                User = new
                {
                    user.Id,
                    user.userName,
                    user.email,
                    user.IsAdmin
                }
            });
        }


        //[HttpPost("login")]
        //public IActionResult Login([FromBody] Login model)
        //{
        //    if (model == null)
        //    {
        //        return BadRequest(new { message = "Invalid login request." });
        //    }
        //    // Encrypt the entered password
        //    string encryptedPassword = EncryptPassword(model.Password);

        //    // Fetch the user from the database using the provided username/email
        //    var users = _userService.GetAll();

        //    // Find the user by email/username
        //    var user = users.FirstOrDefault(u => u.email == model.Username);
        //    if (user == null)
        //    {
        //        return Unauthorized(new { message = "Invalid username or password." });
        //    }

        //    else if (user.password != encryptedPassword)
        //    {
        //        return Unauthorized(new { message = "Invalid username or password." });
        //    }

        //    var tokenString = GenerateJwtToken(user);
        //    var expiryDate = DateTime.UtcNow.AddMinutes(60); // Token expires in 60 minutes
        //    StoreToken(user.Id, tokenString, expiryDate);

        //    return Ok(new { Token = tokenString });
        //}

        private string GenerateJwtToken(Common.Models.UserModel.Users user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString()),
                    new Claim(ClaimTypes.Email, user.email),
                }),
                Expires = DateTime.UtcNow.AddMinutes(5), // Token expires in 1 minute
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Issuer"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private void StoreToken(int userId, string token, DateTime expiryDate)
        {
            var query = "INSERT INTO AuthStore (auth_token, user_id, expiry_date) VALUES (@AuthToken, @UserId, @ExpiryDate)";

            using (var connection = new SqlConnection(_connectionString))
            {
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@AuthToken", token);
                    command.Parameters.AddWithValue("@UserId", userId);
                    command.Parameters.AddWithValue("@ExpiryDate", expiryDate);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }



        [HttpPost("SendCode")]
        public IActionResult SendCode([FromBody] SendCodeRequest request)
        {
            string code = new Random().Next(100000, 999999).ToString(); // Generate 6-digit code

            if (!string.IsNullOrEmpty(request.EmailOrPhone))
            {
                if (request.EmailOrPhone.Contains("@"))
                {
                    // Send Email
                    try
                    {
                        var mail = new MailMessage();
                        mail.From = new MailAddress("aquib.ch.77@gmail.com");
                        mail.To.Add(request.EmailOrPhone);
                        mail.Subject = "Verification Code";
                        mail.Body = $"Your verification code is: {code}";

                        using (var smtp = new SmtpClient("smtp.gmail.com", 587))
                        {
                            smtp.Credentials = new System.Net.NetworkCredential("aquib.ch.77@gmail.com", "wrhk pefr ubml sqqo");
                            smtp.EnableSsl = true;
                            smtp.Send(mail);
                        }

                        VerificationCodes[request.EmailOrPhone] = code;
                        return Ok(new { message = "Verification code sent to your email." });
                    }
                    catch (Exception ex)
                    {
                        return StatusCode(500, new { message = "Failed to send email.", error = ex.Message });
                    }
                }
                else
                {
                    // Send SMS (e.g., using Twilio)
                    // Implementation here
                    return Ok(new { message = "SMS functionality not implemented." });
                }
            }

            return BadRequest(new { message = "Invalid email or phone number." });
        }

        [HttpPost("VerifyCode")]
        public IActionResult VerifyCode([FromBody] VerifyCodeRequest request)
        {
            if (VerificationCodes.TryGetValue(request.EmailOrPhone, out var storedCode))
            {
                if (storedCode == request.Code)
                {
                    VerificationCodes.Remove(request.EmailOrPhone);
                    return Ok(new { message = "Code verified successfully." });
                }
                return BadRequest(new { message = "Invalid code." });
            }
            return BadRequest(new { message = "Code not found or expired." });
        }

        #region Reset password code 
        //[HttpPut("ResetPassword")]
        //[Authorize]
        //public IActionResult ResetPassword([FromBody] ResetPasswordDTO request)
        //{
        //    try
        //    {
        //        if (request == null || string.IsNullOrEmpty(request.newPassword))
        //        {
        //            return BadRequest(new { status = "error", message = "New password is required." });
        //        }

        //        // Retrieve the user ID from the token claims
        //        var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
        //        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId) || userId <= 0)
        //        {
        //            return BadRequest(new { status = "error", message = "Invalid or missing user ID in token." });
        //        }


        //        // Retrieve the existing user from the database
        //        var existingUser = _userService.GetById(userId, true, null);
        //        if (existingUser == null)
        //        {
        //            return NotFound(new { status = "error", message = $"User with ID: {userId} does not exist." });
        //        }

        //        var encryptedNewPassword = EncryptPassword(request.newPassword);
        //        var encryptedOldPassword = EncryptPassword(request.oldPassword);
        //        // Update the user's password
        //        if (existingUser[0].password == encryptedOldPassword)
        //        {
        //            existingUser[0].password = encryptedNewPassword; // Use hashed passwords in production
        //        }
        //        else
        //        {
        //            return BadRequest(new { status = "error", message = "Old password is wrong." });
        //        }


        //        var isUpdated = _userService.Update(existingUser[0]);

        //        if (isUpdated)
        //        {
        //            return Ok(new { status = "success", message = "Password updated successfully." });
        //        }
        //        else
        //        {
        //            return BadRequest(new { status = "error", message = "Password could not be updated." });
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, new { status = "error", message = $"An error occurred while resetting the password: {ex.Message}" });
        //    }
        //}
        #endregion

        #region forgot password code 
        [HttpPut("ForgetPassword")]
        public IActionResult ForgetPassword([FromBody] ForgetPasswordDTO request)
        {
            try
            {
                if (request == null || string.IsNullOrEmpty(request.newPassword) || string.IsNullOrEmpty(request.email))
                {
                    return BadRequest(new { status = "error", message = "New password is required." });
                }


                // Retrieve the existing user from the database
                var existingUser = _userService.GetByName(request.email);
                if (existingUser == null)
                {
                    return NotFound(new { status = "error", message = $"User with email: {request.email} does not exist." });
                }

                request.newPassword = EncryptPassword(request.newPassword);
                // Update the user's password
                existingUser.password = request.newPassword; // Use hashed passwords in production

                var isUpdated = _userService.Update(existingUser);

                if (isUpdated)
                {
                    return Ok(new { status = "success", message = "Password updated successfully." });
                }
                else
                {
                    return BadRequest(new { status = "error", message = "Password could not be updated." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = $"An error occurred while resetting the password: {ex.Message}" });
            }
        }
        #endregion

        private string EncryptPassword(string password)
        {
            // Example encryption logic; replace this with your actual encryption method
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }
    }

    public class SendCodeRequest
    {
        public string EmailOrPhone { get; set; }
    }

    public class VerifyCodeRequest
    {
        public string EmailOrPhone { get; set; }
        public string Code { get; set; }
    }
}
