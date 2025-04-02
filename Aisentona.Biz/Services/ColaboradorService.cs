using Aisentona.DataBase;
using System.Security.Principal;
using Aisentona.Entities.Request;
using Aisentona.Enumeradores;
using Aisentona.Biz.Validators;
using FluentValidation.Results;
using Aisentona.Entities.Response;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Aisentona.Biz.Services.Email;

namespace Aisentona.Biz.Services
{
    public class ColaboradorService
    {
        private readonly ApplicationDbContext _context;
        private readonly ColaboradorValidator _validator;
        private readonly AuthService _authService;
        private readonly EmailAtivacaoService _emailAtivacaoService;

        public ColaboradorService(ApplicationDbContext context, ColaboradorValidator validator, AuthService authService, EmailAtivacaoService emailAtivaçãoService)
        {
            _context = context;
            _validator = validator;
            _authService = authService;
            _emailAtivacaoService = emailAtivaçãoService;

        }

        private string GetWindowsUsername() => WindowsIdentity.GetCurrent().Name;


        public List<Colaborador>? ListarTodosOsColaboradores()
        {
            var ListaDeColaboradores = _context.CF_Colaborador.Where(x => x.Fl_Ativo).OrderByDescending(p => p.DT_Criacao).ToList();

            return ListaDeColaboradores;

        }

        public List<PerfilDeUsuarioRequest> ListarTodosPerfis()
        {
            try
            {
                var colaboradores = ListarTodosOsColaboradores(); 

                if (colaboradores == null || !colaboradores.Any())
                    return new List<PerfilDeUsuarioRequest>(); // Retorna lista vazia, se não houver colaboradores

                List<PerfilDeUsuarioRequest> perfisDeUsuario = new();

                foreach (var colaborador in colaboradores)
                {
                    var tipoDoUsuario = _context.CF_ColaboradorTipoUsuario
                        .FirstOrDefault(x => x.Id_TipoUsuario == colaborador.Id_TipoUsuario);

                    if (tipoDoUsuario == null) continue; // Se não encontrar o tipo de usuário, pula para o próximo colaborador

                    var perfilDeUsuarioRequest = new PerfilDeUsuarioRequest
                    {
                        IdUsuario = colaborador.Id_Usuario,
                        Nome = colaborador.Nm_Nome,
                        CPF = colaborador.Ds_CPF, 
                        Email = colaborador.Ds_Email,
                        Contato = colaborador.Ds_ContatoCadastro,
                        NomeTipoDeUsuario = tipoDoUsuario?.Nm_TipoUsuario,
                        DataDeNascimento = colaborador.DT_Nascimento,
                        AcessoPremium = colaborador.AcessoUsuario?.Fl_AcessoPremium
                    };


                    perfisDeUsuario.Add(perfilDeUsuarioRequest);
                }

                return perfisDeUsuario;
            }
            catch (Exception ex) // Usar Exception para capturar outros tipos de erro
            {
                // Logar e tratar o erro adequadamente
                Console.WriteLine($"Erro ao acessar dados do banco: {ex.Message}");
                // Caso haja erro, pode retornar uma lista vazia ou algum valor de fallback
                return new List<PerfilDeUsuarioRequest>();
            }
        }


        public List<Colaborador>? GetColaboradorPorId(int id)
        {
            var colaborador = _context.CF_Colaborador.FirstOrDefault(c => c.Id_Usuario == id);
            
            List<Colaborador> listaDeColaboradores = new List<Colaborador>();

            if (colaborador != null && colaborador.Fl_Ativo == true)
            {
                listaDeColaboradores.Add(colaborador);
            }
            return listaDeColaboradores;

        }

        public PerfilDeUsuarioRequest ListarPerfilDeUsuarioPorId(int idColaborador)
        {

            var colaborador = _context.CF_Colaborador
                .Include(c => c.AcessoUsuario).FirstOrDefault(c => c.Id_Usuario == idColaborador);

            if(colaborador is null) return null;

            var tipoDoUsuario = _context.CF_ColaboradorTipoUsuario.FirstOrDefault(x => x.Id_TipoUsuario == colaborador.Id_TipoUsuario);

            PerfilDeUsuarioRequest perfilDeUsuarioRequest = new();

            perfilDeUsuarioRequest.IdUsuario = colaborador.Id_Usuario;
            perfilDeUsuarioRequest.Nome = colaborador.Nm_Nome;
            perfilDeUsuarioRequest.CPF = colaborador.Ds_CPF;
            perfilDeUsuarioRequest.Email = colaborador.Ds_Email;
            perfilDeUsuarioRequest.Contato = colaborador.Ds_ContatoCadastro;
            perfilDeUsuarioRequest.NomeTipoDeUsuario = tipoDoUsuario.Nm_TipoUsuario;
            perfilDeUsuarioRequest.DataDeNascimento = colaborador.DT_Nascimento;
            perfilDeUsuarioRequest.TempoDeAcesso = colaborador.DT_Criacao;
            perfilDeUsuarioRequest.AcessoPremium = colaborador.AcessoUsuario.Fl_AcessoPremium;

            return perfilDeUsuarioRequest;

        }
        public Colaborador CriarColaborador(ColaboradorResponse colaboradorResponse)
        {

            ValidationResult validadores = _validator.Validate(colaboradorResponse);
            var a = validadores; 

            if (!validadores.IsValid)
            {
                throw new ValidationException("Dados inválidos.");
            }

            // Verificar duplicidade de e-mail
            bool emailExiste = _context.CF_Colaborador.Any(c => c.Ds_Email == colaboradorResponse.Email && c.Fl_Ativo == true);
            if (emailExiste)
            {
                throw new ValidationException("O e-mail já está em uso.");
            }

            // Verificar duplicidade de CPF
            bool cpfExiste = _context.CF_Colaborador.Any(c => c.Ds_CPF == colaboradorResponse.CPF && c.Fl_Ativo == true);
            if (cpfExiste)
            {
                throw new ValidationException("O CPF já está em uso.");
            }


            Colaborador novoColaborador = new Colaborador();
            novoColaborador.AcessoUsuario = new AcessoUsuario();

            (byte[] hash, byte[] salt) = HashingUtils.GeneratePasswordHash(colaboradorResponse.Senha);

            novoColaborador.Nm_Nome = colaboradorResponse.Nome;
            novoColaborador.Ds_CPF = colaboradorResponse.CPF;
            novoColaborador.Ds_Email = colaboradorResponse.Email;
            novoColaborador.Ds_ContatoCadastro = colaboradorResponse.Celular;
            novoColaborador.Fl_Ativo = false;
            novoColaborador.Id_TipoUsuario = (int)Autorizacao.LeitorSimples;
            novoColaborador.PasswordHash = hash;
            novoColaborador.PasswordSalt = salt;
            novoColaborador.Ds_UltimaAlteracao = GetWindowsUsername();

            novoColaborador.DT_Criacao = DateTime.Now;
            novoColaborador.DT_Nascimento = colaboradorResponse.DataNascimento;
            novoColaborador.DT_UltimaAlteracao =  DateTime.Now;

            novoColaborador.AcessoUsuario.Dt_InicioAcesso = DateTime.Now;
            novoColaborador.AcessoUsuario.Dt_FimAcesso = DateTime.Now;
            novoColaborador.AcessoUsuario.Fl_AcessoPremium = false;

            // Gerar Token de Ativação
            novoColaborador.Token_Ativacao = Guid.NewGuid().ToString();
            novoColaborador.Token_AtivacaoExpiracao = DateTime.Now.AddHours(2);

            // Enviar e-mail com o token de ativação
            _emailAtivacaoService.EnviarEmailAtivacao(novoColaborador);

            _context.CF_Colaborador.Add(novoColaborador);
                _context.SaveChanges();

                LoginRequest loginRequest = new LoginRequest
                {
                    Email = colaboradorResponse.Email,
                    Senha = colaboradorResponse.Senha
                };

                _authService.Authenticate(loginRequest);

            return novoColaborador;
        }
        public void EditarPerfilDeUsuario(PerfilDeUsuarioRequest perfilAtualizado)
        {
            var perfilNaoEditado = _context.CF_Colaborador
                .Include(c => c.AcessoUsuario)
                .FirstOrDefault(c => c.Id_Usuario == perfilAtualizado.IdUsuario);


            if (perfilNaoEditado == null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            int filtroDeTipoUsuario = 0;

            if (Enum.TryParse<Autorizacao>(perfilAtualizado.NomeTipoDeUsuario, out var tipoUsuarioEnum))
            {
                filtroDeTipoUsuario = (int)tipoUsuarioEnum; // Obtém o número correspondente
            }

            perfilNaoEditado.Nm_Nome = perfilAtualizado.Nome;
            perfilNaoEditado.Ds_CPF = perfilAtualizado.CPF;
            perfilNaoEditado.Ds_Email = perfilAtualizado.Email;
            perfilNaoEditado.Ds_ContatoCadastro = perfilAtualizado.Contato;
            perfilNaoEditado.DT_Nascimento = perfilAtualizado.DataDeNascimento;
            perfilNaoEditado.Id_TipoUsuario = filtroDeTipoUsuario;

            if (perfilNaoEditado.AcessoUsuario.Fl_AcessoPremium)
            {
                perfilNaoEditado.AcessoUsuario.Dt_InicioAcesso = perfilAtualizado.TempoDeAcesso;
                perfilNaoEditado.AcessoUsuario.Fl_AcessoPremium = (bool)perfilAtualizado.AcessoPremium;
                perfilNaoEditado.AcessoUsuario.Dt_FimAcesso = perfilAtualizado.PremiumExpiraEm;
            }

            _context.CF_Colaborador.Update(perfilNaoEditado);
            _context.SaveChanges();
        }

        public Colaborador TrocarFlagAtivaColaborador(int idColaborador)
        {
            var colaborador = _context.CF_Colaborador.Find(idColaborador);
            if (colaborador is null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            colaborador.Fl_Ativo = !colaborador.Fl_Ativo;

            _context.CF_Colaborador.Update(colaborador);
            _context.SaveChanges();

            return colaborador;
        }

        public List<PerfilDeUsuarioRequest> ListarUsuariosComFiltro(PerfilDeUsuarioResponse filtro)
        {
            var listaDePerfilUsuario = ListarTodosPerfis();

            // Aplicando os filtros de forma sequencial e convertendo para lista somente no final
            if (!string.IsNullOrEmpty(filtro.Nome))
            {
                listaDePerfilUsuario = listaDePerfilUsuario.Where(p => p.Nome.Contains(filtro.Nome)).ToList();
            }

            if (!string.IsNullOrEmpty(filtro.Email))
            {
                listaDePerfilUsuario = listaDePerfilUsuario.Where(p => p.Email.Contains(filtro.Email)).ToList();
            }

            if (!string.IsNullOrEmpty(filtro.Contato))
            {
                listaDePerfilUsuario = listaDePerfilUsuario.Where(p => p.Contato.Contains(filtro.Contato)).ToList();
            }

            if (!string.IsNullOrEmpty(filtro.NomeTipoDeUsuario))
            {
                if (Enum.TryParse<Autorizacao>(filtro.NomeTipoDeUsuario, out var tipoUsuarioEnum))
                {
                    int filtroDeTipoUsuario = (int)tipoUsuarioEnum; // Obtém o número correspondente

                    listaDePerfilUsuario = listaDePerfilUsuario
                        .Where(p => (int)Enum.Parse<Autorizacao>(p.NomeTipoDeUsuario) == filtroDeTipoUsuario)
                        .ToList();
                }
            }

            if (filtro.AcessoPremium is true)
            {
                listaDePerfilUsuario = listaDePerfilUsuario.Where(p => p.AcessoPremium == true).ToList();
            }

            if (filtro.PremiumExpiraEm != null)
            {
                listaDePerfilUsuario = listaDePerfilUsuario.Where(p => p.PremiumExpiraEm <= filtro.PremiumExpiraEm).ToList();
            }

            // Materializando a lista no final
            return listaDePerfilUsuario;
        }


    }
}


