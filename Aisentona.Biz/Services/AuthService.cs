using Aisentona.DataBase;
using Aisentona.Entities.Request;
using Aisentona.Entities.Response;
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

        public AuthService(ApplicationDbContext context, TokenService tokenService)
        {
            _context = context;
            _tokenService = tokenService;
        }

        public LoginResponse Authenticate(LoginRequest loginRequest)
        {
            Colaborador user = _context.CF_Colaborador.FirstOrDefault(u => u.Ds_CPF == loginRequest.CPF);

            if (user == null)
            {
                Console.WriteLine("Usuário não encontrado.");
                return null; // Ou lançar uma exceção
            }

            bool isPasswordValid = HashingUtils.VerifyPassword(loginRequest.Password, user.PasswordHash, user.PasswordSalt);

            if (!isPasswordValid)
            {
                Console.WriteLine("Senha inválida.");
                return null; // Ou lançar uma exceção
            }

            var token = _tokenService.Create(user);

            return new LoginResponse { Token = token };
        }

        //private bool VerifyPassword(string password, byte[] storedHash, byte[] storedSalt)
        //{
        //    using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
        //    {
        //        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));

        //        // Logging for debugging
        //        Console.WriteLine("Stored Hash: " + BitConverter.ToString(storedHash));
        //        Console.WriteLine("Computed Hash: " + BitConverter.ToString(computedHash));

        //        return computedHash.SequenceEqual(storedHash);
        //    }
        //}


        //private string GenerateJwtToken(Colaborador user)
        //{
        //    var tokenHandler = new JwtSecurityTokenHandler();
        //    var key = Encoding.UTF8.GetBytes(_configuration[]);
        //    var tokenDescriptor = new SecurityTokenDescriptor
        //    {
        //        Subject = new ClaimsIdentity(new Claim[]
        //        {
        //        new Claim(ClaimTypes.Name, user.Ds_CPF),
        //        new Claim("IdUsuario", user.Id_Usuario.ToString())
        //            // Adicione outras claims conforme necessário
        //        }),
        //        Expires = DateTime.UtcNow.AddHours(6),
        //        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
        //        Issuer = _configuration["JwtSettings:Issuer"],
        //        Audience = _configuration["JwtSettings:Audience"]
        //    };

        //    var token = tokenHandler.CreateToken(tokenDescriptor);

        //    return tokenHandler.WriteToken(token);

        //}
    }
}
