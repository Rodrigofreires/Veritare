using Aisentona.DataBase;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Aisentona.Biz.Services.Background
{
    public class PublicacaoAgendadaService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly ILogger<PublicacaoAgendadaService> _logger;

        private readonly TimeSpan _intervaloExecucao = TimeSpan.FromMinutes(1); // Mantido em 1 minuto para testes

        public PublicacaoAgendadaService(IServiceScopeFactory serviceScopeFactory, ILogger<PublicacaoAgendadaService> logger)
        {
            _serviceScopeFactory = serviceScopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Serviço de Publicação Agendada iniciado.");

            var timer = new PeriodicTimer(_intervaloExecucao);

            try
            {
                while (await timer.WaitForNextTickAsync(stoppingToken))
                {
                    // Loga a hora atual LOCAL do servidor para comparação
                    _logger.LogInformation($"Executando job de publicação agendada. Hora atual (LOCAL): {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}");
                    await PublicarPostagensAgendadas(stoppingToken);
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Serviço de Publicação Agendada parado por solicitação de cancelamento.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ocorreu um erro inesperado no serviço de Publicação Agendada.");
            }
        }

        private async Task PublicarPostagensAgendadas(CancellationToken stoppingToken)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            try
            {
                var agoraLocal = DateTime.Now;

                _logger.LogInformation($"Buscando postagens para publicar. Critérios: Id_Status=5, DT_PublicacaoAgendada <= {agoraLocal:yyyy-MM-dd HH:mm:ss.fff}, Fl_Ativo=false.");

                var postagensParaPublicar = await context.CF_Postagem
                    .Where(p => p.Id_Status == 5 && p.DT_PublicacaoAgendada <= agoraLocal && !p.Fl_Ativo)
                    .ToListAsync(stoppingToken);

                if (postagensParaPublicar.Any())
                {
                    _logger.LogInformation($"Encontradas {postagensParaPublicar.Count} postagens para publicar.");

                    var logList = new List<JobPublicacaoAgendadaLog>();

                    foreach (var postagem in postagensParaPublicar)
                    {
                        // Loga os detalhes da postagem encontrada para depuração
                        _logger.LogInformation($"Postagem encontrada: ID={postagem.Id_Postagem}, Título='{postagem.Titulo}', Status={postagem.Id_Status}, Ativo={postagem.Fl_Ativo}, AgendadaPara={postagem.DT_PublicacaoAgendada:yyyy-MM-dd HH:mm:ss.fff}");

                        context.CF_Postagem.Attach(postagem);

                        _logger.LogInformation($"Publicando postagem: Título='{postagem.Titulo}' (ID: {postagem.Id_Postagem})");

                        postagem.Id_Status = 1; // Supondo que 1 seja o ID para "Publicado"
                        postagem.Fl_Ativo = true;
                        postagem.DT_UltimaAlteracao = DateTime.Now; // Usar horário local aqui também
                        postagem.Ds_UltimaAlteracao = "Sistema de Publicação Agendada";

                        logList.Add(new JobPublicacaoAgendadaLog
                        {
                            IdPostagem = postagem.Id_Postagem,
                            TituloPostagem = postagem.Titulo,
                            DataExecucao = DateTime.Now, // Usar horário local aqui
                            Acao = "Postagem publicada automaticamente",
                            DataPublicacaoAgendadaOriginal = postagem.DT_PublicacaoAgendada
                        });
                    }

                    await context.Job_PublicacaoAgendada_Log.AddRangeAsync(logList, stoppingToken);

                    await context.SaveChangesAsync(stoppingToken);
                    _logger.LogInformation("Publicações agendadas processadas com sucesso.");
                }
                else
                {
                    _logger.LogInformation("Nenhuma postagem agendada para publicação no momento.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar publicações agendadas.");
                using var errorScope = _serviceScopeFactory.CreateScope();
                var errorContext = errorScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                var errorLog = new JobPublicacaoAgendadaLog
                {
                    TituloPostagem = "Erro no Job",
                    DataExecucao = DateTime.Now, // Usar horário local aqui
                    Acao = "Erro geral no processamento do job",
                    Erro = ex.ToString()
                };
                await errorContext.Job_PublicacaoAgendada_Log.AddAsync(errorLog, stoppingToken);
                await errorContext.SaveChangesAsync(stoppingToken);
            }
        }
    }
}
