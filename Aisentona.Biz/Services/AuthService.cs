using Aisentona.DataBase;
using Aisentona.Entities.Interfaces;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Aisentona.Biz.Services
{
    public class AuthService
    {
        private readonly ApplicationDbContext _context;

        public readonly TokenService _tokenService;

        public readonly TokenBlacklistService _tokenBlacklistService;


        public AuthService(ApplicationDbContext context, TokenService tokenService, TokenBlacklistService tokenBlacklistService)
        {
            _context = context;
            _tokenService = tokenService;
            _tokenBlacklistService = tokenBlacklistService;
        }

        public LoginResponse Authenticate(LoginRequest loginRequest)
        {
            Colaborador user = _context.CF_Colaborador.FirstOrDefault(u => u.Ds_Email == loginRequest.Email);

            if (user == null)
            {
                Console.WriteLine("Usuário não encontrado.");
                return null; // Ou lançar uma exceção
            }

            bool isPasswordValid = HashingUtils.VerifyPassword(loginRequest.Senha, user.PasswordHash, user.PasswordSalt);

            if (!isPasswordValid)
            {
                Console.WriteLine("Senha inválida.");
                return null; // Ou lançar uma exceção
            }

            var token = _tokenService.Create(user);

            return new LoginResponse { Token = token };
        }

        public bool LogOut(string token)
        {
            if (!string.IsNullOrEmpty(token))
            {
                _tokenBlacklistService.AddToBlacklist(token);
                return true;
            }
            return false;
        }

    }
}
