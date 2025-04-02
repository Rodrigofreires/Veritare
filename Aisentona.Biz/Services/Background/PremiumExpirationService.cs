using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Aisentona.Biz.Services.Background
{
    public class PremiumExpirationService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<PremiumExpirationService> _logger;

        public PremiumExpirationService(IServiceScopeFactory serviceScopeFactory, ILogger<PremiumExpirationService> logger)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var timer = new PeriodicTimer(TimeSpan.FromHours(1)); 

            while (await timer.WaitForNextTickAsync(stoppingToken))
            {
                
                await ProcessarExpiracao(stoppingToken);
            }
        }

        private async Task ProcessarExpiracao(CancellationToken stoppingToken)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            try
            {
                var agora = DateTime.Now;

                var usuariosExpirados = await context.CF_Colaborador
                    .Include(c => c.AcessoUsuario)
                    .Where(c => c.AcessoUsuario.Fl_AcessoPremium && c.AcessoUsuario.Dt_FimAcesso < agora)
                    .ToListAsync(stoppingToken);

                if (usuariosExpirados.Any())
                {
                    var logList = new List<JobExpiracaoPremiumLog>();
                    foreach (var colaborador in usuariosExpirados)
                    {
                        context.CF_Colaborador.Attach(colaborador);

                        _logger.LogInformation($"Removendo Premium do usuário: {colaborador.Nm_Nome} ({colaborador.Id_Usuario})");

                        colaborador.AcessoUsuario.Fl_AcessoPremium = false;
                        colaborador.AcessoUsuario.Id_Plano = null;
                        colaborador.AcessoUsuario.Dt_FimAcesso = DateTime.Now;

                        logList.Add(new JobExpiracaoPremiumLog
                        {
                            IdUsuario = colaborador.Id_Usuario,
                            NomeUsuario = colaborador.Nm_Nome,
                            DataExecucao = DateTime.Now,
                            Acao = "Premium removido automaticamente"
                        });
                    }
                    await context.Job_ExpiracaoPremium_Log.AddRangeAsync(logList, stoppingToken);

                    await context.SaveChangesAsync(stoppingToken);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao processar expiração de Premium: {ex}");

                var errorLog = new JobExpiracaoPremiumLog
                {
                    NomeUsuario = "Sistema",
                    DataExecucao = DateTime.Now,
                    Acao = "Erro ao executar job de expiração do Premium",
                    Erro = ex.ToString()
                };

                await context.Job_ExpiracaoPremium_Log.AddAsync(errorLog, stoppingToken);
                await context.SaveChangesAsync(stoppingToken);
            }
        }
    }
}
