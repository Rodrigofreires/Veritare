using Aisentona.DataBase;
using System.Security.Principal;
using System.Data.SqlTypes;
using Aisentona.Entities.Request;
using Aisentona.Enumeradores;
using Aisentona.Biz.Validators;
using FluentValidation.Results;
using Aisentona.Entities.Response;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Aisentona.DataBase.Aisentona.DataBase;
using Aisentona.Biz.Mappers;

namespace Aisentona.Biz.Services
{
    public class ColaboradorService
    {
        private readonly ApplicationDbContext _context;
        private readonly ColaboradorValidator _validator;
        private readonly AuthService _authService;

        public ColaboradorService(ApplicationDbContext context, ColaboradorValidator validator, AuthService authService)
        {
             _context = context;
            _validator = validator;
            _authService = authService;

        }

        private string GetWindowsUsername() => WindowsIdentity.GetCurrent().Name;

        public List<Colaborador>? ListarColaboradorPorId(int id)
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

            ColaboradorTipoUsuario tipoDoUsuario = _context.CF_ColaboradorTipoUsuario.FirstOrDefault(x => x.Id_TipoUsuario == colaborador.Id_TipoUsuario);

            PerfilDeUsuarioRequest perfilDeUsuarioRequest = new();

            perfilDeUsuarioRequest.IdUsuario = colaborador.Id_Usuario;
            perfilDeUsuarioRequest.Nome = colaborador.Nm_Nome;
            perfilDeUsuarioRequest.CPF = colaborador.Ds_CPF;
            perfilDeUsuarioRequest.Email = colaborador.Ds_Email;
            perfilDeUsuarioRequest.Contato = colaborador.Ds_ContatoCadastro;
            perfilDeUsuarioRequest.TipoDeUsuario = tipoDoUsuario.Nm_TipoUsuario;
            perfilDeUsuarioRequest.DataDeNascimento = colaborador.DT_Nascimento;
            perfilDeUsuarioRequest.TempoDeAcesso = colaborador.DT_Criacao;
            perfilDeUsuarioRequest.AcessoPremium = colaborador.AcessoUsuario.AcessoPremium;
            perfilDeUsuarioRequest.PremiumExpiraEm = colaborador.AcessoUsuario?.Dt_ExpiracaoPremium;

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
            novoColaborador.Fl_Ativo = true;
            novoColaborador.Id_TipoUsuario = (int)Autorizacao.LeitorSimples;
            novoColaborador.PasswordHash = hash;
            novoColaborador.PasswordSalt = salt;
            novoColaborador.Ds_UltimaAlteracao = GetWindowsUsername();

            novoColaborador.DT_Criacao = DateTime.UtcNow;
            novoColaborador.DT_Nascimento = colaboradorResponse.DataNascimento;
            novoColaborador.DT_UltimaAlteracao =  DateTime.UtcNow;

            novoColaborador.AcessoUsuario.Dt_InicioAcesso = DateTime.UtcNow;
            novoColaborador.AcessoUsuario.Dt_FimAcesso = DateTime.UtcNow;
            novoColaborador.AcessoUsuario.AcessoPremium = false;

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


        public Colaborador EditarColaborador(int idColaborador, ColaboradorRequest colaboradorRequest)
        {
            Colaborador colaborador = _context.CF_Colaborador.FirstOrDefault(x => x.Id_Usuario == idColaborador);
            if (colaborador == null)
            {
                throw new KeyNotFoundException("Colaborador não encontrado");
            }

            int tipoDeUsuario = colaborador.Id_TipoUsuario;

            // Verifica permissões com base no papel
            switch (tipoDeUsuario)
            {
                case (int)Autorizacao.LeitorSimples:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                case (int)Autorizacao.LeitorPremium:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                case (int)Autorizacao.EditorBase:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                case (int)Autorizacao.EditorChefe:

                    // Usuário pode apenas editar informações básicas
                    colaborador.Nm_Nome = colaboradorRequest.Nome;
                    colaborador.DT_Nascimento = colaboradorRequest.DataNascimento;
                    break;
                default:
                    throw new UnauthorizedAccessException("Permissão insuficiente para esta ação");
            }

                colaborador.DT_UltimaAlteracao = DateTime.Now;
                colaborador.Ds_UltimaAlteracao = GetWindowsUsername();

                if (colaborador.DT_UltimaAlteracao < (DateTime)SqlDateTime.MinValue)
                {
                    colaborador.DT_UltimaAlteracao = (DateTime)SqlDateTime.MinValue;
                }

            _context.CF_Colaborador.Update(colaborador);
            _context.SaveChanges();

            return colaborador;
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

    }
}
