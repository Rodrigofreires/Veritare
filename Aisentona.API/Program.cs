using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Aisentona.Biz.Validators;
using Aisentona.Biz.Mappers;
using Microsoft.OpenApi.Models;
using Aisentona.Biz.Services.Premium;
using Aisentona.Biz.Services.Background;
using Aisentona.Biz.Services.Email;
using Aisentona.Biz.Services.RedesSociais;
using Aisentona.Enumeradores;
using Aisentona.Entities;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Hosting; // Adicionado para IHostApplicationLifetime, se necessário para shutdown graceful


var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// --- Configuração do Banco de Dados (DbContext) ---
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")
    // Adiciona um listener para logar comandos SQL executados (útil para depuração de DB)
    // .LogTo(Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information)
    ));

// --- Injeção de Dependência dos Services, Mappers e Validators ---
builder.Services.AddScoped<ColaboradorValidator>();
builder.Services.AddScoped<TokenService>();
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
builder.Services.AddScoped<EmailRedefinirSenhaService>();
builder.Services.AddScoped<YoutubeWidgetsService>();
builder.Services.AddScoped<EmailEnviarPromptService>();

// --- Configuração de Hosted Services (serviços em background) ---
builder.Services.AddHostedService<PremiumExpirationService>();

// --- Configuração do CORS ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policyBuilder =>
    {
        // Permite requisições do seu frontend (localmente)
        policyBuilder.WithOrigins("http://localhost:4200", "https://localhost:4200")
                     .AllowAnyMethod() // Permite todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
                     .AllowAnyHeader() // Permite todos os cabeçalhos HTTP
                     .AllowCredentials(); // Importante para cookies, cabeçalhos de autorização etc.
    });
});

// --- Configuração da Autenticação JWT Bearer ---
var jwtKey = Environment.GetEnvironmentVariable("JWT_PRIVATE_KEY");
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("Erro: A variável de ambiente 'JWT_PRIVATE_KEY' não está definida.");
}

Console.WriteLine($"🔑 JWT_PRIVATE_KEY carregada (length: {jwtKey.Length})");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwtSettings = configuration.GetSection("JwtSettings");

        // Valida se as configurações de JWT existem e não são nulas
        if (!jwtSettings.Exists())
        {
            throw new InvalidOperationException("Erro: Seção 'JwtSettings' não encontrada no arquivo de configuração.");
        }

        var issuer = jwtSettings["Issuer"];
        var audience = jwtSettings["Audience"];

        // Adicionando logs explícitos para depuração da Audiência e Issuer
        Console.WriteLine($"🔍 JwtSettings:Issuer carregado: {issuer ?? "NULL/EMPTY"}");
        Console.WriteLine($"🔍 JwtSettings:Audience carregado: {audience ?? "NULL/EMPTY"}");

        if (string.IsNullOrEmpty(issuer))
        {
            throw new InvalidOperationException("Erro: 'JwtSettings:Issuer' não definido ou vazio.");
        }
        if (string.IsNullOrEmpty(audience))
        {
            throw new InvalidOperationException("Erro: 'JwtSettings:Audience' não definido ou vazio.");
        }

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Valida o emissor do token
            ValidateAudience = true, // Valida o público-alvo do token (SEU FRONTEND!)
            ValidateLifetime = true, // Valida a data de expiração do token
            ValidateIssuerSigningKey = true, // Valida a chave de assinatura do token

            ValidIssuer = issuer, // O emissor válido é o seu backend
            ValidAudience = audience, // O público-alvo válido é o seu frontend 

            // A chave secreta usada para assinar e validar o token
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            // Tempo de tolerância para expiração do token (definido como zero para maior precisão)
            ClockSkew = TimeSpan.Zero
        };

        // --- Eventos de Diagnóstico do JWT Bearer ---
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("❌ Erro de autenticação:");
                Console.WriteLine($"  Exceção: {context.Exception.GetType().Name} - {context.Exception.Message}");
                // Loga o cabeçalho de autorização que chegou, útil para depurar tokens malformados
                Console.WriteLine($"  Token recebido no backend: {context.HttpContext.Request.Headers["Authorization"]}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("✅ Token validado com sucesso!");
                // Opcional: Loga as claims do usuário autenticado
                // foreach (var claim in context.Principal.Claims)
                // {
                //     Console.WriteLine($"  Claim: {claim.Type} = {claim.Value}");
                // }
                return Task.CompletedTask;
            },
            OnChallenge = context =>
            {
                // Este evento é disparado quando a autenticação falha e o esquema JWT Bearer emite um desafio
                Console.WriteLine("⚠️ Desafio de autenticação falhou (Resposta 401 Unauthorized):");
                Console.WriteLine($"  Erro: {context.Error}, Descrição: {context.ErrorDescription}");
                return Task.CompletedTask;
            }
        };
    });

// --- Configuração da Autorização baseada em Políticas ---
builder.Services.AddAuthorization(options =>
{
    // Coleta todas as permissões distintas definidas no enum Autorizacao
    var todasPermissoes = Enum.GetValues<Autorizacao>()
        .Cast<Autorizacao>()
        .SelectMany(papel => papel.GetPermissions()) // Assume que GetPermissions() retorna um IEnumerable<string>
        .Distinct();

    // Cria uma política de autorização para cada permissão
    foreach (var permissao in todasPermissoes)
    {
        options.AddPolicy(permissao, policy =>
            // Requer que o token JWT tenha uma claim "Permission" com o valor da permissão
            policy.RequireClaim("Permission", permissao));
    }
});

// --- Configuração dos Controladores MVC e Serialização JSON ---
builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        // Evita loops de referência ao serializar objetos relacionados
        options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
        // Formata o JSON de saída com indentação (útil para depuração)
        options.SerializerSettings.Formatting = Formatting.Indented;
    });

// --- Configuração do Swagger/OpenAPI (para documentação da API) ---
builder.Services.AddEndpointsApiExplorer(); // Necessário para o Swagger
builder.Services.AddSwaggerGen(c =>
{
    // Define o esquema de segurança Bearer para o Swagger UI
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Insira o token JWT no formato: Bearer {token}",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer" // Esquema padrão para JWT
    });
    // Adiciona o requisito de segurança para todas as operações no Swagger UI
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
            new string[] { } // Escopos vazios, pois as permissões são por políticas
        }
    });
});

var app = builder.Build();

// --- Configuração do Pipeline de Requisições HTTP ---

// Redireciona requisições HTTP para HTTPS (boa prática de segurança)
app.UseHttpsRedirection();

// Habilita o CORS com a política definida
app.UseCors("AllowSpecificOrigin");

// Habilita a autenticação (DEVE VIR ANTES de UseAuthorization)
app.UseAuthentication();

// Habilita a autorização (DEVE VIR DEPOIS de UseAuthentication)
app.UseAuthorization();

// Mapeia os endpoints dos controladores
app.MapControllers();

// Configuração para ambiente de Desenvolvimento (Swagger UI)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Aisentona API V1");
        options.RoutePrefix = "swagger"; // Acessível em /swagger
    });
}

// Inicia a aplicação
app.Run();