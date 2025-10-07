using Common.Services;
using Microsoft.AspNetCore.Authorization;
using Common.Models.UserModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace UserSideAPI.Controllers.Users
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IGenericService<Common.Models.UserModel.Users> _genericService;

        public UserController(IGenericService<Common.Models.UserModel.Users> userService)
        {
            _genericService = userService;
        }

        // GET: api/User/GetAllUsers
        [HttpGet("GetAllUsers")]
        public ActionResult<IEnumerable<Common.Models.UserModel.Users>> GetAllUsers()
        {
            try
            {
                var result = _genericService.GetAll();
                if (result == null || !result.Any())
                {
                    return NotFound(new { status = "error", message = "No users found." });
                }

                return Ok(new { status = "success", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = $"An error occurred while fetching users: {ex.Message}" });
            }
        }

        [HttpPost("GetUserById")]
        [Authorize]
        public ActionResult<Common.Models.UserModel.Users> GetUserById([FromBody] object? obj = null)
        {
            try
            {
                // Retrieve the user ID from the JWT claims
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name); // ClaimTypes.Name is typically used for 'Name' or user identification


                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId) || userId <= 0)
                {
                    return BadRequest(new { status = "error", message = "Invalid or missing user ID in token." });
                }



                // Fetch the user by ID
                var result = _genericService.GetById(userId, true, null);
                if (result == null)
                {
                    return NotFound(new { status = "error", message = $"User with ID {userId} not found." });
                }

                return Ok(new { status = "success", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = $"An error occurred: {ex.Message}" });
            }
        }


        // POST: api/User/AddUser
        [HttpPost("AddUser")]
        public ActionResult<Common.Models.UserModel.Users> AddUser(Common.Models.UserModel.Users model)
        {
            try
            {
                if (model == null || string.IsNullOrEmpty(model.userName) || string.IsNullOrEmpty(model.email) || string.IsNullOrEmpty(model.password))
                {
                    return BadRequest(new { status = "error", message = "User data is required." });
                }

                // Encrypt the password
                model.password = EncryptPassword(model.password);
                model.AdminKey = EncryptPassword(model.AdminKey);

                _genericService.Add(model);
                return CreatedAtAction(nameof(GetUserById), new { id = model.Id }, new { status = "success", data = model });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = $"An error occurred while adding the user: {ex.Message}" });
            }
        }

        // Utility method to encrypt the password
        private string EncryptPassword(string password)
        {
            // Example encryption logic; replace this with your actual encryption method
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }

        // PUT: api/User/Update/{id}
        [HttpPut("Update/{id}")]
        public ActionResult UpdateUser(int id, Common.Models.UserModel.Users model)
        {
            try
            {
                if (model == null || id <= 0)
                {
                    return BadRequest(new { status = "error", message = "Valid user data and ID are required." });
                }

                var existingUser = _genericService.GetById(id, true, null);
                if (existingUser == null)
                {
                    return NotFound(new { status = "error", message = $"User with ID {id} not found." });
                }

                // Set model's Id to match the existing user ID
                model.Id = id;

                var updateSuccess = _genericService.Update(model);
                if (updateSuccess)
                {
                    return Ok(new { status = "success", message = "User updated successfully." });
                }
                else
                {
                    return StatusCode(500, new { status = "error", message = "User could not be updated." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = "error", message = $"An error occurred while updating the user: {ex.Message}" });
            }
        }

        // DELETE: api/User/DeleteUser
        [HttpDelete("DeleteUser")]
        [Authorize]
        public IActionResult DeleteUser()
        {
            try
            {
                // Retrieve the user ID from the token claims
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId) || userId <= 0)
                {
                    return BadRequest(new { status = "error", message = "Invalid or missing user ID in token." });
                }

                // Fetch the user details from the database
                var existingUser = _genericService.GetById(userId, true, "Id");
                if (existingUser == null)
                {
                    return NotFound(new { status = "error", message = $"User with ID {userId} not found." });
                }

                // Perform the delete operation
                _genericService.Delete(userId);

                // Return a success response
                return Ok(new { status = "success", message = $"User with ID {userId} successfully deleted." });
            }
            catch (Exception ex)
            {
                // Return an internal server error with the exception message
                return StatusCode(500, new { status = "error", message = $"An error occurred while deleting the user: {ex.Message}" });
            }
        }
    }
}
