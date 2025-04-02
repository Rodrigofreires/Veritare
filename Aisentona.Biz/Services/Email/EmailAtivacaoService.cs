using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using Aisentona.DataBase;
using System.Text;

namespace Aisentona.Biz.Services.Email
{
    public class EmailAtivacaoService
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;
        private readonly SmtpClient _smtpClient;

        public EmailAtivacaoService(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;

            Console.WriteLine("variavel 1 - " + Environment.GetEnvironmentVariable("Email", EnvironmentVariableTarget.User));
            Console.WriteLine("variavel 2 - " + Environment.GetEnvironmentVariable("Senha", EnvironmentVariableTarget.User));

            string email = Environment.GetEnvironmentVariable("Email", EnvironmentVariableTarget.User);
            string senha = Environment.GetEnvironmentVariable("Senha", EnvironmentVariableTarget.User);


            // Configuração do servidor SMTP
            _smtpClient = new SmtpClient("smtpout.secureserver.net", 587)
            {
                UseDefaultCredentials = false,
                EnableSsl = true, // Certifique-se de que o SSL esteja ativado
                Credentials = new NetworkCredential(
                    email, // Seu e-mail completo
                    senha // Sua senha de e-mail
                ),
                Timeout = 120000 // Definindo um tempo de espera para o envio
            };
        }

        /// <summary>
        /// Gera um token e envia o e-mail de ativação.
        /// </summary>
        public void EnviarEmailAtivacao(Colaborador colaborador)
        {
            Console.WriteLine(_smtpClient);

            // Gerar um token único para o colaborador
            colaborador.Token_Ativacao = Guid.NewGuid().ToString();
            colaborador.Token_AtivacaoExpiracao = DateTime.UtcNow.AddHours(24); // Expira em 24 horas

            _context.SaveChanges(); // Salva o token no banco de dados

            // Construir a URL de ativação
            string urlAtivacao = $"https://localhost:7086/api/emailAtivacao/ativar-conta?token={colaborador.Token_Ativacao}";
            try
            {
                // Criar o e-mail
                var mensagem = new MailMessage
                {
                    From = new MailAddress("do-not-reply@veritare.com.br"), 
                    Subject = "VERITARE - ATIVAÇÃO DE CONTA ",
                    SubjectEncoding = Encoding.UTF8,
                    IsBodyHtml = true
                };

                // Definir o corpo do e-mail com HTML formatado
                mensagem.Body = $@"
                    <html>
                        <head>
                            <meta charset='UTF-8'>
                        </head>
                        <body style='font-family: Arial, sans-serif; color: #333;'>
                            <h2>VERITARE - FINALIZE O SEU CADASTRO</h2>
                            <p>Olá!</p>
                            <p>Obrigado por se cadastrar. Para ativar sua conta, clique no botão abaixo:</p>
                            <p>
                                <a href='{urlAtivacao}' style='display: inline-block; padding: 10px 20px; 
                                    font-size: 16px; color: white; background-color: #007bff; text-decoration: none; 
                                    border-radius: 5px;'>
                                    Ativar Conta
                                </a>
                            </p>
                            <p>Se você não solicitou essa ativação, ignore este e-mail.</p>
                        </body>
                    </html>";

                mensagem.Headers.Add("Message-ID", $"<{Guid.NewGuid()}@veritare.com.br>");

                // Adicionar destinatário
                mensagem.To.Add(colaborador.Ds_Email);

                // Enviar o e-mail
                _smtpClient.Send(mensagem);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao enviar o e-mail de ativação", ex);
            }
        }


            /// <summary>
            /// Ativa a conta do usuário usando o token.
            /// </summary>
        public string AtivarConta(string token)
        {
            // Buscar o colaborador usando o token
            var colaborador = _context.CF_Colaborador.FirstOrDefault(c => c.Token_Ativacao == token);

            // Verificar se o token existe
            if (colaborador == null)
            {
                return "Token inválido ou expirado.";
            }

            // Verificar se o token expirou
            if (colaborador.Token_AtivacaoExpiracao < DateTime.UtcNow)
            {
                return "Token expirado. Solicite um novo e-mail de ativação.";
            }

            // Ativar o colaborador
            colaborador.Fl_Ativo = true;
            colaborador.Token_Ativacao = null; // Remove o token para evitar reuso
            colaborador.Token_AtivacaoExpiracao = null; // Limpar a expiração do token

            _context.SaveChanges(); // Salvar as alterações no banco de dados

            return "Conta ativada com sucesso.";
        }

        public void EnviarEmailRedefinirSenha(string email)
        {
            var colaborador = _context.CF_Colaborador.FirstOrDefault(c => c.Ds_Email == email);

            if (colaborador == null)
            {
                throw new InvalidOperationException("E-mail não encontrado.");
            }

            // Gerar token único de redefinição de senha
            colaborador.Token_Redefinir_SenhaAtivacao = Guid.NewGuid().ToString();
            colaborador.Token_Redefinir_SenhaAtivacaoExpiracao = DateTime.UtcNow.AddHours(1); // Token expira em 1 hora

            _context.SaveChanges();

            // Construir URL para redefinir senha
            string urlRedefinirSenha = $"https://localhost:7086/api/emailAtivacao/redefinir-senha?token={colaborador.Token_Redefinir_SenhaAtivacao}";

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


    }
}
