using Aisentona.Biz.Services.Postagens;
using Aisentona.Biz.Services;
using Aisentona.DataBase;
using Aisentona.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Recupera a chave privada da vari�vel de ambiente
string privateKey = "KqiSF8LwSrU36fl4GG1oLxbN5eLMuiUJpJBo2+fjR0E="
;
if (string.IsNullOrEmpty(privateKey))
{
    Console.WriteLine("A vari�vel de ambiente JWT_PRIVATE_KEY n�o est� definida. Defina-a antes de executar o aplicativo.");
    throw new ArgumentNullException("JWT_PRIVATE_KEY", "A chave privada n�o pode ser nula.");
}

try
{
    // Tenta decodificar a chave Base-64 para verificar sua validade
    byte[] decodedKey = Convert.FromBase64String(privateKey);
    Console.WriteLine("Chave privada decodificada com sucesso!");

    // Adiciona servi�os ao cont�iner
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen();

    // Adiciona o ApplicationDbContext e configura a string de conex�o
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

    // Registro de servi�os e reposit�rios
    builder.Services.AddScoped<ColaboradorService>();
    builder.Services.AddScoped<ColaboradorEmailService>();
    builder.Services.AddScoped<ColaboradorTelefoneService>();
    builder.Services.AddScoped<ColaboradorTipoUsuarioService>();
    builder.Services.AddScoped<PostagemService>();
    builder.Services.AddScoped<TokenService>(); // Adiciona o TokenService
    builder.Services.AddScoped<LoginService>();
    builder.Services.AddScoped<AuthService>();

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtSettings = builder.Configuration.GetSection("JwtSettings");
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(decodedKey)
        };
    });

    builder.Services.AddAuthorization();

    var app = builder.Build();

    // Configura o pipeline de requisi��o HTTP
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();

    app.UseAuthentication(); // Certifique-se de adicionar este middleware antes do UseAuthorization
    app.UseAuthorization();

    app.MapControllers();

    app.Run();
}
catch (FormatException ex)
{
    Console.WriteLine("Erro de formata��o: A string fornecida n�o � uma Base-64 v�lida.");
    throw; // Lan�a a exce��o para interromper a execu��o do aplicativo
}
