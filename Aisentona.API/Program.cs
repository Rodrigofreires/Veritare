using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.DependencyInjection; // Adicione esta linha para o namespace correto
using Newtonsoft.Json;
using Aisentona.Biz.Validators;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Recupera a chave privada da variável de ambiente
string privateKey = "KqiSF8LwSrU36fl4GG1oLxbN5eLMuiUJpJBo2+fjR0E=";

if (string.IsNullOrEmpty(privateKey))
{
    Console.WriteLine("A variável de ambiente JWT_PRIVATE_KEY não está definida. Defina-a antes de executar o aplicativo.");
    throw new ArgumentNullException("JWT_PRIVATE_KEY", "A chave privada não pode ser nula.");
}

try
{
    // Tenta decodificar a chave Base-64 para verificar sua validade
    byte[] decodedKey = Convert.FromBase64String(privateKey);
    Console.WriteLine("Chave privada decodificada com sucesso!");

    // Adiciona serviços ao contêiner
    ConfigureServices(builder.Services, decodedKey, builder.Configuration);

    var app = builder.Build();

    // Configure the HTTP request pipeline.
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseCors(x => x.AllowAnyHeader()
          .AllowAnyMethod()
          .AllowAnyOrigin()
    );


    // Configura o pipeline de requisição HTTP
    ConfigureMiddleware(app);

    app.Run();
}
catch (FormatException ex)
{
    Console.WriteLine("Erro de formatação: A string fornecida não é uma Base-64 válida.");
    throw; // Lança a exceção para interromper a execução do aplicativo
}

void ConfigureServices(IServiceCollection services, byte[] decodedKey, ConfigurationManager configuration)
{
    services.AddControllers()
        .AddNewtonsoftJson(options =>
        {
            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            options.SerializerSettings.Formatting = Formatting.Indented;
        });
    services.AddEndpointsApiExplorer();
    services.AddSwaggerGen();

    // Adiciona o ApplicationDbContext e configura a string de conexão
    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

    // Adicione os serviços do FluentValidation
    builder.Services.AddScoped<ColaboradorValidator>();



    // Registro de serviços e repositórios
    services.AddScoped<ColaboradorService>();
    services.AddScoped<ColaboradorTelefoneService>();
    services.AddScoped<ColaboradorTipoUsuarioService>();
    services.AddScoped<PostagemService>();
    services.AddScoped<TokenService>(); // Adiciona o TokenService
    services.AddScoped<LoginService>();
    services.AddScoped<AuthService>();


    services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        var jwtSettings = configuration.GetSection("JwtSettings");
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

    services.AddAuthorization();
}

void ConfigureMiddleware(WebApplication app)
{
    // Configura o pipeline de requisição HTTP
    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI();
    }

    app.UseHttpsRedirection();
    app.UseAuthentication(); // Certifique-se de adicionar este middleware antes do UseAuthorization
    app.UseAuthorization();
    app.MapControllers();
}
