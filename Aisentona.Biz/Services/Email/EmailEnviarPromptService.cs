using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using Aisentona.DataBase;
using System.Text;
using Aisentona.Entities.Request;
using Aisentona.Entities;
using Markdig;

namespace Aisentona.Biz.Services.Email
{
    public class EmailEnviarPromptService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly SmtpClient _smtpClient;

        private readonly string _promptFilePath; // Caminho para o arquivo Markdown do prompt

        public EmailEnviarPromptService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;

            // Define o caminho completo para o arquivo Markdown do prompt
            _promptFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Instrucoes_Prompt_Veritare.md");

            // Obtém credenciais de e-mail das variáveis de ambiente
            string email = Environment.GetEnvironmentVariable("Email", EnvironmentVariableTarget.User);
            string senha = Environment.GetEnvironmentVariable("Senha", EnvironmentVariableTarget.User);

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(senha))
            {
                throw new InvalidOperationException("As variáveis de ambiente 'Email' e 'Senha' não estão configuradas.");
            }

            // Configuração do cliente SMTP para envio de e-mails
            _smtpClient = new SmtpClient("smtpout.secureserver.net", 587)
            {
                UseDefaultCredentials = false,
                EnableSsl = true,
                Credentials = new NetworkCredential(email, senha),
                Timeout = 120000 // Tempo limite para o envio
            };
        }

        /// <summary>
        /// Envia um e-mail com o prompt completo, aplicando uma trava de 20 dias por e-mail e salvando o registro.
        /// </summary>
        /// <param name="emailPromptRequest">Objeto contendo o nome e o e-mail do solicitante.</param>
        /// <exception cref="InvalidOperationException">Lançada se o e-mail já tiver solicitado o prompt recentemente ou houver erro no envio.</exception>
        public void EnviarEmailComPrompt(EmailPromptRequest emailPromptRequest)
        {
            // Busca o último registro de envio para este e-mail
            var ultimoEnvio = _context.CF_HistoricoEnvioPrompt
                                     .Where(h => h.Ds_Email == emailPromptRequest.Email)
                                     .OrderByDescending(h => h.Dt_Envio)
                                     .FirstOrDefault();

            // Verifica se o último envio foi há menos de 20 dias
            if (ultimoEnvio != null && (DateTime.UtcNow - ultimoEnvio.Dt_Envio).TotalDays < 20)
            {
                throw new InvalidOperationException("Este e-mail já solicitou o prompt recentemente. Por favor, aguarde 20 dias para uma nova solicitação.");
            }

            try
            {
                // Carrega o conteúdo do prompt do arquivo Markdown
                string promptMarkdownContent = File.ReadAllText(_promptFilePath);

                // Converte o conteúdo Markdown para HTML usando Markdig
                var pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().Build();
                string promptHtmlContent = Markdown.ToHtml(promptMarkdownContent, pipeline);

                // Monta o corpo do e-mail em HTML
                string corpoEmailHtml = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;'>
                        <div style='max-width: 800px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);'>
                            <p>Prezado(a) <strong>{emailPromptRequest.Nome}</strong>,</p>

                            <p>Esperamos que este e-mail o(a) encontre bem.</p>

                            <p>Conforme sua solicitação, segue abaixo o <strong>prompt completo</strong> que você pediu:</p>

                            <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>

                            <div style='background-color: #f9f9f9; border-left: 5px solid #0056b3; padding: 15px 20px; margin-bottom: 20px; overflow-x: auto;'>
                                {promptHtmlContent}
                            </div>

                            <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>

                            <p>Por favor, utilize este prompt com sabedoria e ética. Se tiver qualquer dúvida ou precisar de mais informações, não hesite em nos contatar.</p>

                            <p style='margin-top: 30px;'>Atenciosamente,</p>
                            <p><strong>Equipe VERITARE</strong><br/>
                            <a href='mailto:do-not-reply@veritare.com.br' style='color: #0056b3; text-decoration: none;'>do-not-reply@veritare.com.br</a></p>
                        </div>
                    </body>
                    </html>";

                // Cria e configura a mensagem de e-mail
                var mensagem = new MailMessage
                {
                    From = new MailAddress("do-not-reply@veritare.com.br", "Equipe VERITARE"),
                    Subject = "VERITARE - Seu Prompt Solicitado",
                    SubjectEncoding = Encoding.UTF8,
                    IsBodyHtml = true,
                    Body = corpoEmailHtml,
                    BodyEncoding = Encoding.UTF8
                };

                mensagem.To.Add(emailPromptRequest.Email);
                _smtpClient.Send(mensagem); // Envia o e-mail

                // Registra o envio no histórico
                var historicoEnvio = new HistoricoEnvioPrompt
                {
                    Ds_Email = emailPromptRequest.Email,
                    Nm_Pessoa = emailPromptRequest.Nome,
                    Dt_Envio = DateTime.UtcNow
                };

                _context.CF_HistoricoEnvioPrompt.Add(historicoEnvio);
                _context.SaveChanges();
            }
            catch (FileNotFoundException ex)
            {
                // Tratamento específico para arquivo não encontrado
                Console.WriteLine($"Erro: Arquivo do prompt '{_promptFilePath}' não encontrado. Verifique se ele existe e está configurado para ser copiado para o diretório de saída.");
                throw new InvalidOperationException("Não foi possível encontrar o conteúdo do prompt. Por favor, contate o suporte.", ex);
            }
            catch (SmtpException sx)
            {
                // Tratamento específico para erros de SMTP
                Console.WriteLine($"Erro ao enviar e-mail (SMTP): {sx.StatusCode} - {sx.Message}");
                Console.WriteLine($"Inner Exception: {sx.InnerException?.Message}");
                throw new InvalidOperationException("Erro ao enviar o e-mail com o prompt. Verifique as configurações de SMTP ou tente novamente mais tarde.", sx);
            }
            catch (Exception ex)
            {
                // Tratamento para outras exceções inesperadas
                Console.WriteLine($"Erro inesperado ao enviar e-mail com prompt: {ex.Message} - {ex.InnerException?.Message}");
                throw new InvalidOperationException("Ocorreu um erro inesperado ao processar sua solicitação. Por favor, tente novamente mais tarde.", ex);
            }
        }
    }
}