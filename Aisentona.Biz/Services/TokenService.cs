using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Enum;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class TokenService
{
    private readonly string _privateKey;

    public TokenService()
    {
        _privateKey = "KqiSF8LwSrU36fl4GG1oLxbN5eLMuiUJpJBo2+fjR0E=";
        if (string.IsNullOrEmpty(_privateKey))
        {
            throw new ArgumentNullException(nameof(_privateKey), "Chave privada não pode ser nula.");
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
            new Claim("IdUsuario", usuario.Id_Usuario.ToString()),
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
