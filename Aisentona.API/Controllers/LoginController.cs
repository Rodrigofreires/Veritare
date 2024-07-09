﻿using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Microsoft.AspNetCore.Mvc;

namespace Aisentona.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly LoginService _loginService;
        private readonly AuthService _authService;

        public LoginController(LoginService loginService, AuthService authService)
        {
            _loginService = loginService;
            _authService = authService;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (loginRequest == null)
            {
                return BadRequest("Invalid client request");
            }

            var response = _authService.Authenticate(loginRequest);

            if (response == null)
            {
                return Unauthorized();
            }

            return Ok(response);
        }
    }
}
