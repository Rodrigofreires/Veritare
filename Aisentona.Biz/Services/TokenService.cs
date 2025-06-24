using Aisentona.DataBase;
using Aisentona.Entities;
using Aisentona.Enumeradores;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt; // Importante para JwtRegisteredClaimNames
using System.Security.Claims;
using System.Text;

public class TokenService
{
    private readonly string _secretKey;
    private readonly string _issuer;
    private readonly string _audience; // Armazena a audiência para uso nas claims

    public TokenService(IConfiguration configuration)
    {
        _secretKey = Environment.GetEnvironmentVariable("JWT_PRIVATE_KEY")
            ?? throw new InvalidOperationException("JWT_PRIVATE_KEY não definida.");

        var jwtSection = configuration.GetSection("JwtSettings");
        _issuer = jwtSection["Issuer"] ?? throw new InvalidOperationException("JwtSettings:Issuer não definida.");
        _audience = jwtSection["Audience"] ?? throw new InvalidOperationException("JwtSettings:Audience não definida.");
    }

    public string Create(Colaborador usuario)
    {
        var keyBytes = Encoding.UTF8.GetBytes(_secretKey);
        var credentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256);

        // Gera as claims, SEM incluir a claim 'aud' aqui.
        // Ela será adicionada automaticamente pelo SecurityTokenDescriptor.Audience
        var claims = GenerateClaims(usuario); // Não precisa passar _audience aqui

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddHours(6),
            SigningCredentials = credentials,
            Issuer = _issuer,
            Audience = _audience // Esta linha já estava correta e é o suficiente para adicionar a claim 'aud'
        };

        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(tokenDescriptor);
        return handler.WriteToken(token);
    }

    // Retorna GenerateClaims ao estado original, sem o parâmetro audience e sem a linha da claim 'aud'
    private static IEnumerable<Claim> GenerateClaims(Colaborador usuario)
    {
        var claims = new List<Claim>
    {
        new(ClaimTypes.Name, usuario.Nm_Nome),
        new(ClaimTypes.Email, usuario.Ds_Email),
        new("IdUsuario", usuario.Id_Usuario.ToString()),
        new("IdTipoDeUsuario", usuario.Id_TipoUsuario.ToString()),
        new(ClaimTypes.Role, ((Autorizacao)usuario.Id_TipoUsuario).ToString())
        // Remova esta linha, pois o SecurityTokenDescriptor.Audience já cuidará disso:
        // new(JwtRegisteredClaimNames.Aud, audience)
    };

        var permissoes = ((Autorizacao)usuario.Id_TipoUsuario).GetPermissions();
        claims.AddRange(permissoes.Select(p => new Claim("Permission", p)));

        return claims;
    }
}