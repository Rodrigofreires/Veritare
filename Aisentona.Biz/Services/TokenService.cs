using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Enumeradores;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class TokenService
{
    private readonly string _privateKey;

    public TokenService(string privateKey)
    {
        if (string.IsNullOrWhiteSpace(privateKey))
            throw new ArgumentNullException(nameof(privateKey), "SecretKey cannot be null or empty.");

        _privateKey = privateKey;
    }

    public string Create(Colaborador usuario)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_privateKey); // Converte a chave para bytes
        var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

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
            new Claim("IdTipoDeUsuario", usuario.Id_TipoUsuario.ToString())
        });

        claims.AddClaim(new Claim(ClaimTypes.Role, usuario.Id_TipoUsuario.ToString()));

        Autorizacao role = (Autorizacao)usuario.Id_TipoUsuario;
        var permissions = role.GetPermissions();
        foreach (var permission in permissions)
        {

            claims.AddClaim(new Claim(ClaimTypes.Role, permission));
        }

        return claims;
    }
}
