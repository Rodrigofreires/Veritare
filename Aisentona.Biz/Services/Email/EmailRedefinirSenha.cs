using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using Aisentona.DataBase;
using System.Security.Cryptography;
using Aisentona.Entities.Response;

namespace Aisentona.Biz.Services.Email
{
    public class EmailRedefinirSenhaService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly SmtpClient _smtpClient;


        public EmailRedefinirSenhaService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;

            string email = Environment.GetEnvironmentVariable("Email", EnvironmentVariableTarget.User);
            string senha = Environment.GetEnvironmentVariable("Senha", EnvironmentVariableTarget.User);

            // Configuração do servidor SMTP
            _smtpClient = new SmtpClient("smtpout.secureserver.net", 587)
            {
                UseDefaultCredentials = false,
                EnableSsl = true,
                Credentials = new NetworkCredential(email, senha),
                Timeout = 120000
            };


        }

        /// <summary>
        /// Envia o e-mail de redefinição de senha para o usuário.
        /// </summary>
        public void EnviarEmailRedefinirSenha(string email)
        {
            var colaborador = _context.CF_Colaborador.FirstOrDefault(c => c.Ds_Email == email && c.Fl_Ativo == true);

            if (colaborador == null)
            {
                throw new InvalidOperationException("E-mail não encontrado.");
            }

            // Gerar token único para redefinição de senha
            colaborador.Token_Redefinir_SenhaAtivacao = Guid.NewGuid().ToString();
            colaborador.Token_Redefinir_SenhaAtivacaoExpiracao = DateTime.UtcNow.AddHours(1);

            _context.SaveChanges();
            

            // Construir URL para redefinir senha
            string urlRedefinirSenha = $"http://localhost:4200/redefinir-senha?token={colaborador.Token_Redefinir_SenhaAtivacao}";


            try
            {
                var mensagem = new MailMessage
                {
                    From = new MailAddress("do-not-reply@veritare.com.br"),
                    Subject = "VERITARE - Redefinição de Senha",
                    SubjectEncoding = Encoding.UTF8,
                    IsBodyHtml = true,
                    Body = $@"
                        <html>
                            <head>
                                <meta charset='UTF-8'>
                            </head>
                            <body style='font-family: Arial, sans-serif; color: #333;'>
                                <h2>VERITARE - Redefinição de Senha</h2>
                                <p>Olá!</p>
                                <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para criar uma nova senha:</p>
                                <p>
                                    <a href='{urlRedefinirSenha}' style='display: inline-block; padding: 10px 20px; 
                                        font-size: 16px; color: white; background-color: #007bff; text-decoration: none; 
                                        border-radius: 5px;'>
                                        Redefinir Senha
                                    </a>
                                </p>
                                <p>Se você não solicitou essa redefinição, ignore este e-mail.</p>
                            </body>
                        </html>"
                };

                mensagem.To.Add(email);
                _smtpClient.Send(mensagem);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao enviar o e-mail de redefinição de senha", ex);
            }
        }

        /// <summary>
        /// Redefine a senha do usuário validando o token recebido.
        /// </summary>
        /// <summary>
        /// Redefine a senha do usuário, gerando um novo hash e removendo o token de redefinição.
        /// </summary>
        public string RedefinirSenha(string token, string novaSenha)
        {
            var colaborador = _context.CF_Colaborador.FirstOrDefault(c => c.Token_Redefinir_SenhaAtivacao == token && c.Fl_Ativo == true);

            if (colaborador == null || colaborador.Token_Redefinir_SenhaAtivacaoExpiracao < DateTime.UtcNow)
            {
                return "Token inválido ou expirado.";
            }

            // Gerar novo hash de senha
            (byte[] hash, byte[] salt) = HashingUtils.GeneratePasswordHash(novaSenha);
            colaborador.PasswordSalt = salt;
            colaborador.PasswordHash = hash;


            // Remover token para evitar reuso
            colaborador.Token_Redefinir_SenhaAtivacao = null;
            colaborador.Token_Redefinir_SenhaAtivacaoExpiracao = null;

            _context.SaveChanges();
            return "Senha redefinida com sucesso.";
        }
    }
}
