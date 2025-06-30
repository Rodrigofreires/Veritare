using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using Aisentona.DataBase;
using System.Text;
using Aisentona.Entities.Request; // Importe o namespace do seu DTO de requisição
using Aisentona.Entities;       // Importe o namespace da sua entidade de banco de dados

namespace Aisentona.Biz.Services.Email
{
    public class EmailEnviarPromptService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly SmtpClient _smtpClient;

        // Variável para armazenar o prompt completo
        private readonly string _promptCompleto = @"
            Prezado(a) [Nome do Destinatário],

            Esperamos que este e-mail o(a) encontre bem.

            Conforme sua solicitação, segue abaixo o prompt completo que você pediu:

            [SEU PROMPT AQUI]

            Por favor, utilize este prompt com sabedoria e ética. Se tiver qualquer dúvida ou precisar de mais informações, não hesite em nos contatar.

            Atenciosamente,

            Equipe VERITARE
            do-not-reply@veritare.com.br
        ";

        public EmailEnviarPromptService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;


            string email = Environment.GetEnvironmentVariable("Email", EnvironmentVariableTarget.User);
            string senha = Environment.GetEnvironmentVariable("Senha", EnvironmentVariableTarget.User);

            // Configuração do servidor SMTP
            _smtpClient = new SmtpClient("smtpout.secureserver.net", 587)
            {
                UseDefaultCredentials = false,
                EnableSsl = true, // Certifique-se de que o SSL esteja ativado
                Credentials = new NetworkCredential(
                    email, // Seu e-mail completo
                    senha  // Sua senha de e-mail
                ),
                Timeout = 120000 // Definindo um tempo de espera para o envio
            };
        }

        /// <summary>
        /// Envia um e-mail com o prompt completo, salvando o registro no banco de dados e aplicando uma trava de 20 dias por e-mail.
        /// </summary>
        /// <param name="emailPromptRequest">Objeto contendo o nome e o e-mail do solicitante.</param>
        /// <exception cref="InvalidOperationException">Lançada se o e-mail já tiver solicitado o prompt recentemente.</exception>
        public void EnviarEmailComPrompt(EmailPromptRequest emailPromptRequest)
        {

            // Busca o último registro de envio para este e-mail
            var ultimoEnvio = _context.CF_HistoricoEnvioPrompt
                                       .Where(h => h.Ds_Email == emailPromptRequest.Email) // Use Ds_Email do DTO
                                       .OrderByDescending(h => h.Dt_Envio)
                                       .FirstOrDefault();

            // Verifica se o último envio foi há menos de 20 dias
            if (ultimoEnvio != null && (DateTime.UtcNow - ultimoEnvio.Dt_Envio).TotalDays < 20)
            {
                throw new InvalidOperationException("Este e-mail já solicitou o prompt recentemente. Por favor, aguarde 20 dias para uma nova solicitação.");
            }

            try
            {
                // Substitui o placeholder no prompt com o nome do destinatário
                // Aqui estamos usando o Nm_Pessoa do DTO
                string corpoEmail = _promptCompleto.Replace("[Nome do Destinatário]", emailPromptRequest.Nome);

                var mensagem = new MailMessage
                {
                    From = new MailAddress("do-not-reply@veritare.com.br"),
                    Subject = "VERITARE - Seu Prompt Solicitado",
                    SubjectEncoding = Encoding.UTF8,
                    IsBodyHtml = true,
                    Body = corpoEmail
                };

                mensagem.To.Add(emailPromptRequest.Email); // Usando Ds_Email do DTO para o destinatário
                _smtpClient.Send(mensagem);

                // --- MAPEAMENTO DTO PARA ENTIDADE ANTES DE SALVAR NO BANCO ---
                // Crie uma nova instância da entidade HistoricoEnvioPrompt
                var historicoEnvio = new HistoricoEnvioPrompt
                {
                    Ds_Email = emailPromptRequest.Email, // Mapeia do DTO para a entidade
                    Nm_Pessoa = emailPromptRequest.Nome, // Mapeia do DTO para a entidade
                    Dt_Envio = DateTime.UtcNow // Define a data de envio
                };

                // Adiciona a entidade ao contexto e salva
                _context.CF_HistoricoEnvioPrompt.Add(historicoEnvio);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                // É bom logar o erro completo aqui para depuração
                Console.WriteLine($"Erro ao enviar e-mail com prompt: {ex.Message} - {ex.InnerException?.Message}");
                throw new InvalidOperationException("Erro ao enviar o e-mail com o prompt. Por favor, tente novamente mais tarde.", ex);
            }
        }
    }
}