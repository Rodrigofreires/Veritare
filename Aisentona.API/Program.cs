using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Aisentona.Biz.Validators;
using Aisentona.Biz.Mappers;
using Aisentona.Biz.Services.Compartilhar;
using Microsoft.OpenApi.Models;
using Aisentona.Biz.Services.Premium;
using Aisentona.Biz.Services.Background;
using Aisentona.Biz.Services.Email;

var builder = WebApplication.CreateBuilder(args);
    var configuration = builder.Configuration; // Defina a variável configuration

    // Adiciona o ApplicationDbContext e configura a string de conexão
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

    // Adicione os serviços do FluentValidation
    builder.Services.AddScoped<ColaboradorValidator>();

    // Integrando API do Twitter/X
    builder.Services.AddScoped<TwitterService>();

    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
    });

    // Registro de serviços e repositórios
    builder.Services.AddScoped<ColaboradorService>();
    builder.Services.AddScoped<ColaboradorTelefoneService>();
    builder.Services.AddScoped<ColaboradorTipoUsuarioService>();
    builder.Services.AddScoped<PostagemService>();
    builder.Services.AddScoped<LoginService>();
    builder.Services.AddScoped<AuthService>();
    builder.Services.AddScoped<DateMapper>();
    builder.Services.AddScoped<WeatherService>();
    builder.Services.AddScoped<PremiumService>();
    builder.Services.AddScoped<EmailAtivacaoService>();
    builder.Services.AddHostedService<PremiumExpirationService>();
    builder.Services.AddScoped<EmailRedefinirSenhaService>();





builder.Services.AddScoped<TokenService>(provider =>
    {
        var configuration = provider.GetRequiredService<IConfiguration>(); // Obtém a configuração
        var jwtSettings = configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("SecretKey is missing in JwtSettings");

        return new TokenService(secretKey);
    });

    builder.Services.AddControllers()
        .AddNewtonsoftJson(options =>
        {
            options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            options.SerializerSettings.Formatting = Formatting.Indented;
        });

    builder.Services.AddEndpointsApiExplorer();

    builder.Services.AddSwaggerGen(c =>
    {
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            In = ParameterLocation.Header,
            Description = "Please enter JWT with Bearer into field",
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        });
    });


builder.Services.AddAuthentication(options =>
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
            ClockSkew = TimeSpan.Zero // Ajuste para validar a expiração exata do token
        };
    });

    builder.Services.AddAuthorization();

    var app = builder.Build();

    void ConfigureMiddleware(WebApplication app)
    {
        // Configura o pipeline de requisição HTTP
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseCors("AllowSpecificOrigin"); // 1️⃣ Primeiro CORS
        app.UseAuthentication();
        app.UseAuthorization(); // 3️⃣ Por último Autorização
        app.MapControllers();
    }

    // Configure o pipeline de requisição HTTP
    ConfigureMiddleware(app);

    app.Run();
