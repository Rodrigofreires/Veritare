using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Enumeradores;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class TokenService
{
    private readonly string _privateKey;

    public TokenService(IConfiguration configuration)
    {
        _privateKey = configuration["JwtSettings:SecretKey"]
            ?? throw new ArgumentNullException("JwtSettings:SecretKey", "Chave privada não pode ser nula.");
        try
        {
            // Verifica se a chave é Base64 válida
            byte[] decodedKey = Convert.FromBase64String(_privateKey);
            Console.WriteLine("Chave privada decodificada com sucesso!");
        }
        catch (FormatException ex)
        {
            Console.WriteLine($"Erro de formatação: A chave fornecida não é uma string Base64 válida. {ex.Message}");
            throw;  // Lança a exceção para interromper a execução do aplicativo
        }


    }
    public string Create(Colaborador usuario)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Convert.FromBase64String(_privateKey); // Decodifica a chave de base64

        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            SigningCredentials = credentials,
            Expires = DateTime.UtcNow.AddHours(6),
            Subject = GenerateClaims(usuario)
        };

        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    private static ClaimsIdentity GenerateClaims(Colaborador usuario)
    {
        var claims = new ClaimsIdentity(new[]
        {
        new Claim(ClaimTypes.Name, usuario.Nm_Nome),
        new Claim(JwtRegisteredClaimNames.Sub, usuario.Id_Usuario.ToString()), // Usando o claim "sub" para o ID do usuário
        new Claim("IdTipoUsuario", usuario.Id_TipoUsuario.ToString())
    });

        // Obtenha as permissões com base no tipo de usuário
        Autorizacao role = (Autorizacao)usuario.Id_TipoUsuario;
        var permissions = role.GetPermissions();

        foreach (var permission in permissions)
        {
            claims.AddClaim(new Claim("Permission", permission));
        }
        return claims;
    }

}
