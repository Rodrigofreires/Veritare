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
    public string Create(Colaborador usuario)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(Configuration.PrivateKey);

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

    //Requisições do Token
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
