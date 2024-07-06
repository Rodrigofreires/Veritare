using Aisentona.Biz.Services;
using Aisentona.Biz.Services.Postagens;
using Aisentona.DataBase;
using Aisentona.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;


string generatedKey = KeyGenerator.GenerateKey();
Console.WriteLine($"Generated Key: {generatedKey}");


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Adiciona o ApplicationDbContext e configura a string de conexão
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Registro de serviços e repositórios
builder.Services.AddScoped<ColaboradorService>();
builder.Services.AddScoped<ColaboradorEmailService>();
builder.Services.AddScoped<ColaboradorTelefoneService>();
builder.Services.AddScoped<ColaboradorTipoUsuarioService>();
builder.Services.AddScoped<PostagemService>();
builder.Services.AddScoped<TokenService>(); // Adiciona o TokenService


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
